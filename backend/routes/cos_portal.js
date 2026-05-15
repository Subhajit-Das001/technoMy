const express = require("express");
const path = require('path');
const router = express.Router();
const COS_portal = require("../models/cos_portal");
const COS_KV = require("../models/cos_kv");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const csv = require("csvtojson");
const XLSX = require("xlsx");
const fs = require("fs");
const getZone = require("../utils/getZone");
const generateRollNumber = require("../utils/generateRollNumber");
const cityToID = require("../utils/cityToID.json");
const CityStudentCount = require("../models/cityStudentCountModel");
const crypto = require("crypto");
const UploadedFileHash = require("../models/uploadFileHash");
const CosSchool = require("../models/cos_school");
const CosBranch = require("../models/cos_branch");
const CosStudent = require("../models/cos_student");
const CosReport = require("../models/cos_report");
// Helper function to format Date to DDMMYYYY (for password)
// ================= DATE =================
const parseDate = (value) => {
  if (!value) return null;

  if (!isNaN(value)) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));

  excelEpoch.setUTCDate(
    excelEpoch.getUTCDate() + Number(value)
  );

  return excelEpoch;
}

  const str = value.toString().trim();

  // DD/MM/YYYY OR DD-MM-YYYY
  const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
     const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    return new Date(Date.UTC(year, month - 1, day));
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const formatDateForPassword = (date) => {
  return `${String(date.getUTCDate()).padStart(2, '0')}${String(date.getUTCMonth()+1).padStart(2,'0')}${date.getUTCFullYear()}`;
};

dotenv.config();

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://technothlon.techniche.org.in'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
router.use(cors(corsOptions));

// Required columns for CSV/XLSX upload
const REQUIRED_COLUMNS = [
  'name1', 'dob1', 'email1', 'contact1', 'class1',
  'name2', 'dob2', 'email2', 'contact2', 'class2',
  'squad', 'language'
];

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/cos/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || 
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and XLSX files are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Token Verification Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Please logout and then login again!!" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Please logout and then login again!!" });
    }
    req.user = decoded;
    next();
  });
}; 

//COS-REPORTS
router.post('/report', verifyToken, async (req, res) => {
  try {

    // 1. Extract frontend payload
    const { branch_id, branch_name, fileName, errorDetails, message, fileHash } = req.body;
    const normalizedFileHash =  fileHash;

    // 2. Securely extract BPOC details from the authenticated user object 
    // (Ensure your authMiddleware attaches 'user' to the 'req' object)
    // const { bpoc_id, bpoc_name, bpoc_mail } = req.user;
    // const {branch_id}= req.user;
    const branch = await CosBranch.findOne({ branch_id });
    if(!branch) {
  return res.status(404).json({
    message: "Branch not found"
  });
} 

    // 3. Save the report to the database
    const newReport = new CosReport({
      branch_id,
      branch_name,
      bpoc_name: branch.bpoc_name,
      bpoc_mail: branch.bpoc_mail,
      fileName,
      errorDetails,
      filehash: normalizedFileHash,
      sender_message: message
    });


    await newReport.save();

    // 4. Format the Error Details for the Email
    let formattedError = "No specific error captured.";
    if (errorDetails) {
      formattedError = `<strong>${errorDetails.title || 'Error'}</strong><br/>`;
      if (errorDetails.messages && Array.isArray(errorDetails.messages)) {
        formattedError += `<ul>${errorDetails.messages.map(msg => `<li>${msg}</li>`).join('')}</ul>`;
      }
    }
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
  service: 'gmail', // or your specific email provider
  auth: {
    user: process.env.SENDER_EMAIL_Feedback,
    pass: process.env.SENDER_PASSWORD_Feedback
  }
});

    // 5. Construct the professional HTML Email
    const mailOptions = {
      from: `"${branch.bpoc_name} via COS Portal" <${process.env.SENDER_EMAIL_Feedback}>`,
      replyTo: branch.bpoc_mail, // So admins can hit "Reply" and email the BPOC directly
      to: process.env.SENDER_EMAIL_Personal, // E.g., feedback@technothlon.org
      subject: `Urgent: CSV Upload Issue - ${branch_name} (${branch_id})`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #e53e3e; padding: 20px; color: white;">
            <h2 style="margin: 0;">Portal Upload Issue Reported</h2>
          </div>
          
          <div style="padding: 20px;">
            <h3 style="color: #2b6cb0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Sender Information</h3>
            <p><strong>BPOC Name:</strong> ${branch.bpoc_name}</p>
            <p><strong>BPOC Email:</strong> <a href="mailto:${branch.bpoc_mail}">${branch.bpoc_mail}</a></p>
            <p><strong>BPOC ID:</strong> ${branch_id}</p>
            <p><strong>Branch/School:</strong> ${branch.branch_name}</p>
            
            <h3 style="color: #2b6cb0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 25px;">Issue Context</h3>
            <p><strong>Attempted File:</strong> ${fileName}</p>
            
            <div style="background-color: #fffaf0; border-left: 4px solid #dd6b20; padding: 15px; margin: 15px 0; border-radius: 4px;">
              <h4 style="margin-top: 0; color: #c05621;">Sender's Message:</h4>
              <p style="margin-bottom: 0;">"${message}"</p>
            </div>

            <h3 style="color: #2b6cb0; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 25px;">System Error Log</h3>
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px;">
              ${formattedError}
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #718096; text-align: center;">
              Report ID: ${newReport._id} | Time: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    // 6. Send the Email
    await transporter.sendMail(mailOptions);

    // 7. Return success response to frontend
    res.status(200).json({ 
      success: true, 
      message: 'Report saved and email sent to admin successfully.' 
    });

  } catch (error) {
    console.error("Error processing feedback report:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while processing the report.' 
    });
  }
});


//POC Register Route 
router.post('/register-poc',async (req, res) => {
    try {
        // 1. Extract data from the frontend request
        const { school_id,bpoc_name, bpoc_mail, state, ...otherData } = req.body;
        // 2. Check if the school_id exists in cos_school
        const schoolExists = await CosSchool.findOne({ school_id: school_id });
        if (!schoolExists) {
            // Pass an error to show on the frontend screen
            return res.status(400).json({ 
                success: false, 
                message: `School ID not found. Please contact Administration.`
            });
        }

        // 3. Generate branch_id (school_id + 4 random numbers)
        // Math.random() * 9000 + 1000 ensures it is always exactly 4 digits
        const randomFourDigits = Math.floor(1000 + Math.random() * 9000);
        const branch_id = `${school_id}${randomFourDigits}`;
        const zone = getZone(state);
        // 4. Push data into cos_branch
        const newBranch = new CosBranch({
            ...otherData,
            school_id: school_id,
            bpoc_name: bpoc_name,
            state: state,
            branch_id: branch_id,
            bpoc_mail: bpoc_mail,
            zone :  zone
        });

        await newBranch.save();

        // 5. Setup Nodemailer Transporter
        // Note: It's best practice to keep credentials in a .env file
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
          }
        });

        // 6. Define Mail Options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: bpoc_mail,
            subject: 'Successful POC Registration Details',
            html: `
                <h3>Registration Successful</h3>
                <p>Hello ${bpoc_name},</p>
                <p>Your POC registration has been successfully processed. Please find your assigned credentials below:</p>
                <ul>
                    <li><b>School ID:</b> ${school_id}</li>
                    <li><b>Branch ID:</b> ${branch_id}</li>
                </ul>
                <p>Thank you!</p>
            `
        };

        // 7. Send the email
        await transporter.sendMail(mailOptions);

        // 8. Return success response to the frontend
        return res.status(200).json({
            success: true,
            message: "Registration complete. Confirmation email sent!",
            data: {
                school_id,
                branch_id
            }
        });

    } catch (error) {
        console.error("Error during POC Registration:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error. Please try again later." 
        });
    }
});
// Login Route
router.post("/login", async (req, res) => {
  const { school_id, branch_id, bpoc_mail} = req.body; // password is actually poc_id from frontend

  try {
    const school = await CosSchool.findOne({ school_id });
    const branch = await CosBranch.findOne({ branch_id });

    if (!school || !branch) {       
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update isvisit to false after first login
    // if (school.isvisit) {
    //   await COS_portal.findByIdAndUpdate(school._id, { isvisit: false });
    // }

    const token = jwt.sign(
      { school_id : school.school_id, branch_id: branch.branch_id, source: "COS" },
      process.env.KEY,
      { expiresIn: "7h" }
    );

    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

    return res.json({ 
      status: true, 
      message: "Login successful", 
      token,
      school_id: school.school_id,
      branch_id: branch.branch_id
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Dashboard Data
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const { branch_id } = req.user;
    const branch = await CosBranch.findOne({ branch_id });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Use counts from cos_portal model (not counting from cos_kv documents)
    return res.json({
      branch_name: branch.branch_name,
      branch_id: branch.branch_id,
      poc_name: branch.poc_name,
      city: branch.city,
      state: branch.state,
      zone: branch.zone,
      total_registered_students: branch.total_students_count || 0,
      junior_team: branch.juniors_count || 0,
      hauts_team: branch.hauts_count || 0,
      count_of_submission: branch.csv_count || 0,
      submission_dates: branch.csv_submission_time || []
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// SCHOOL REGISTER 
router.post('/school-register', async (req, res) => {
    try {
        const { school_name, school_id, spoc_name, spoc_mail, spoc_phone } = req.body;
        let errors = [];

        // 1. Validation
        if (!school_id) errors.push("School ID is required.");
        
        // Check if school_id already exists to prevent duplicates
        const existingSchool = await CosSchool.findOne({ school_id });
        if (existingSchool) {
            errors.push("A school with this ID is already registered.");
        }

        if (errors.length > 0) {
            return res.status(400).json({ status: false, errors });
        }

        // 2. Create and Save
        const newSchool = new CosSchool({
            school_name,
            school_id,
            spoc_name,
            spoc_mail,
            spoc_phone
        });

        await newSchool.save();

        res.status(201).json({
            status: true,
            message: "School registered successfully!"
        });

    } catch (err) {
        res.status(500).json({ status: false, message: "Server Error", error: err.message });
    }
});
//COS- Payment 
router.post('/cos-payment', async (req, res) => {
    try {
        const { school_id, branch_id } = req.body;
        let query = {};

        // 1. Determine the search criteria
        if (branch_id) {
            query = { branch_id: branch_id };
        } else if (school_id) {
            query = { school_id: school_id };
        } else {
            return res.status(400).json({ 
                status: false, 
                message: "Please provide either a School ID or a Branch ID." 
            });
        }

        // 2. Update all matching students: set isPaid to true
        // updateMany returns an object with modifiedCount
        const updateResult = await CosStudent.updateMany(
            query, 
            { $set: { isPaid: true } }
        );

        // 3. Return the total count of updated students
        res.status(200).json({
            status: true,
            message: `Payment status updated for all students in ${branch_id || school_id}`,
            updatedCount: updateResult.modifiedCount,
            totalFound: updateResult.matchedCount
        });

    } catch (err) {
        res.status(500).json({ status: false, message: "Internal Server Error", error: err.message });
    }
});

// File Upload Route
router.post("/upload", verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileBuffer = fs.readFileSync(req.file.path);

const fileHash = crypto
  .createHash("sha256")
  .update(fileBuffer)
  .digest("hex");

// Check duplicate upload
const existingFile = await UploadedFileHash.findOne({ hash: fileHash });

if (existingFile) {
  fs.unlinkSync(req.file.path);

  return res.status(400).json({
    error: "Duplicate file upload",
    message: "This file has already been processed."
  });
}
    // ===============================================
    const { school_id, branch_id } = req.user;
    const branch = await CosBranch.findOne({ branch_id });

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    
    let jsonArray;
    
    // Parse file based on extension
    if (req.file.originalname.endsWith('.xlsx')) {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonArray = XLSX.utils.sheet_to_json(worksheet);
    } else {
      jsonArray = await csv().fromFile(req.file.path);
    }

    // Validate columns - check only for required columns
    const fileColumns = Object.keys(jsonArray[0] || {});
    const missingColumns = REQUIRED_COLUMNS.filter(col => !fileColumns.includes(col));

    if (missingColumns.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Column validation failed',
        message: `Missing required columns: ${missingColumns.join(', ')}`,
        details: {
          missingColumns: missingColumns,
          foundColumns: fileColumns,
          requiredColumns: REQUIRED_COLUMNS
        }
      });
    }
 
    // Extra columns are ignored - we only care that required columns exist
    // This allows schools to add serial numbers, notes, or leave blank columns

    // Process and validate data
    const processedData = [];
    const errors = [];
    const teamsToInsert = [];

    for (let i = 0; i < jsonArray.length; i++) {
      const row = jsonArray[i];
      const rowNum = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

      // Check for line breaks in any field
      let hasLineBreak = false;
      for (const key in row) {
        if (row[key] && typeof row[key] === 'string' && (row[key].includes('\n') || row[key].includes('\r'))) {
          errors.push(`Row ${rowNum}: Line breaks are not allowed in field '${key}'`);
          hasLineBreak = true;
          break;
        }
      }
      if (hasLineBreak) continue;

      // Fill missing email/contact from partner
      if (!row.email1 && row.email2) row.email1 = row.email2;
      if (!row.email2 && row.email1) row.email2 = row.email1;
      if (!row.contact1 && row.contact2) row.contact1 = row.contact2;
      if (!row.contact2 && row.contact1) row.contact2 = row.contact1;

      // Validate required fields
      const requiredFields = ['name1', 'dob1', 'email1', 'contact1', 'class1', 
                              'name2', 'dob2', 'email2', 'contact2', 'class2', 
                              'squad', 'language'];
      const missingFields = requiredFields.filter(field => !row[field] || row[field].toString().trim() === '');

      if (missingFields.length > 0) {
        errors.push(`Row ${rowNum}: Missing required fields: ${missingFields.join(', ')}`);
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email1)) {
        errors.push(`Row ${rowNum}: Invalid email format for email1: ${row.email1}`);
        continue;
      }
      if (!emailRegex.test(row.email2)) {
        errors.push(`Row ${rowNum}: Invalid email format for email2: ${row.email2}`);
        continue;
      }
 
      // Validate contact (should be 10 digits)
      if (row.contact1 && !/^\d{10}$/.test(row.contact1.toString().replace(/\D/g, ''))) {
        errors.push(`Row ${rowNum}: Invalid contact1 format (must be 10 digits): ${row.contact1}`);
        continue;
      }
      if (row.contact2 && !/^\d{10}$/.test(row.contact2.toString().replace(/\D/g, ''))) {
        errors.push(`Row ${rowNum}: Invalid contact2 format (must be 10 digits): ${row.contact2}`);
        continue;
      }

      // Validate squad
      if (!['Juniors', 'Hauts'].includes(row.squad)) {
        errors.push(`Row ${rowNum}: Invalid squad value. Must be 'Juniors' or 'Hauts'`);
        continue;
      }

      // Validate language
      if (!['English', 'Hindi'].includes(row.language)) {
        errors.push(`Row ${rowNum}: Invalid language value. Must be 'English' or 'Hindi'`);
        continue;
      }

      // Validate city exists in cityToID
      if (!cityToID[branch.city]) {
        errors.push(`Row ${rowNum}: City '${branch.city}' not found in system. Please contact administrator.`);
        continue;
      }

      // Parse dates - handle DD/MM/YY or DD/MM/YYYY format
      let dob1, dob2;
      try {
        dob1 = parseDate(row.dob1);
        if (!dob1 || isNaN(dob1.getTime())) {
          errors.push(`Row ${rowNum}: Invalid date format for dob1: ${row.dob1}. Expected format: DD/MM/YYYY or Excel date`);
          continue;
        }
      } catch (e) {
        errors.push(`Row ${rowNum}: Invalid date format for dob1: ${row.dob1}. Expected format: DD/MM/YYYY or Excel date`);
        continue;
      }

      try {
        dob2 = parseDate(row.dob2);
        if (!dob2 || isNaN(dob2.getTime())) {
          errors.push(`Row ${rowNum}: Invalid date format for dob2: ${row.dob2}. Expected format: DD/MM/YYYY or Excel date`);
          continue;
        }
      } catch (e) {
        errors.push(`Row ${rowNum}: Invalid date format for dob2: ${row.dob2}. Expected format: DD/MM/YYYY or Excel date`);
        continue;
      }

      // Increment Student Count for the city (for roll number generation)
      const cityID = cityToID[branch.city];
      const cityInfo = await CityStudentCount.findOneAndUpdate(
        { cityID },
        { $set: { city: branch.city }, $inc: { studentCount: 1 } },
        { new: true, upsert: true }
      );

      // Generate roll number and password
      const rollNumber = generateRollNumber(row.squad, row.language, branch.city, cityInfo.studentCount);
      
      // Generate password as dob1dob2 (DDMMYY format for each)
      const pass1 = formatDateForPassword(dob1);
      const pass2 = formatDateForPassword(dob2);
      const generatedPassword = `${pass1}${pass2}`;

      // Prepare data for database
      const teamData = {
        name1: row.name1.toString().trim(),
        dob1: dob1,
        email1: row.email1.toString().trim().toLowerCase(),
        contact1: row.contact1.toString().replace(/\D/g, ''),
        school1: branch.branch_name,
        class1: row.class1.toString().trim(),
        name2: row.name2.toString().trim(),
        dob2: dob2,
        email2: row.email2.toString().trim().toLowerCase(),
        contact2: row.contact2.toString().replace(/\D/g, ''),
        school2:branch.branch_name,
        class2: row.class2.toString().trim(),
        squad: row.squad,
        language: row.language,
        mode: 'online',
        country: 'India',
        state: branch.state,
        city: branch.city,
        zone: branch.zone,
        view: 'School',
        rollNumber: rollNumber,
        password: generatedPassword,
        school_id: branch.school_id,
        branch_id: branch.branch_id,
        csv_hash_id: fileHash,
        isPaid: false
      };

      // Save to database
      teamsToInsert.push(teamData);

  processedData.push({
  ...row,
  rollNumber: rollNumber,
  password: generatedPassword
});
    }

    // If there are errors, return them
    if (errors.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: 'Validation errors found',
        errors: errors,
        processedCount: processedData.length
      });
    }
    // Generate hash only after validation succeeds


    try {
  await CosStudent.insertMany(teamsToInsert, {
    ordered: true
  });
} catch (dbError) {
  fs.unlinkSync(req.file.path);

  return res.status(500).json({
    error: "Database insertion failed",
    message: dbError.message
  });
}



    await UploadedFileHash.create({
      hash: fileHash,
      fileName: req.file.originalname,
      uploadedBy: branch_id || "cos_portal"
    });



    // Update school statistics
    const juniorCount = processedData.filter(d => d.squad === 'Juniors').length;
    const hautsCount = processedData.filter(d => d.squad === 'Hauts').length;

    await CosBranch.findByIdAndUpdate(branch._id, {
      $inc: { 
        total_students_count: processedData.length * 2,
        juniors_count: juniorCount,
        hauts_count: hautsCount,
        csv_count: 1
      },
      $push: { csv_submission_time: new Date() }
    });
    await CosSchool.findOneAndUpdate({ school_id: school_id }, {
      $inc: { 
        total_students_count: processedData.length * 2,
        juniors_count: juniorCount,
        hauts_count: hautsCount,
        csv_count: 1
      }
    });


    // Create output CSV with roll numbers and passwords
    const outputData = processedData.map(row => {
      // Format dates for CSV output as DD/MM/YYYY
      const formatDate = (dateValue) => {
        if (!dateValue) return '';
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        if (isNaN(date.getTime())) return dateValue;
        
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = String(date.getUTCFullYear());
        
        return `${day}/${month}/${year}`; // DD/MM/YYYY format
      };

      return {
        name1: row.name1 || '',
        dob1: formatDate(row.dob1),
        email1: row.email1 || '',
        contact1: row.contact1 || '',
        class1: row.class1 || '',
        name2: row.name2 || '',
        dob2: formatDate(row.dob2),
        email2: row.email2 || '',
        contact2: row.contact2 || '',
        class2: row.class2 || '',
        squad: row.squad || '',
        language: row.language || '',
        rollNumber: row.rollNumber || '',
        password: `="${row.password || ''}"`
      };
    });

    // Generate output file name: school_submission_date
    const submissionDate = new Date();
    // Format date as YYYYMMDD
    const dateStr = submissionDate.toISOString().split('T')[0].replace(/-/g, '');
    // Sanitize school name for filename (remove special characters, spaces, etc.)
    const sanitizedSchoolName = branch.branch_name
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase()
      .substring(0, 50); // Limit length
    const timestamp = Date.now();
    const outputFileName = `${sanitizedSchoolName}_${dateStr}_${timestamp}.csv`;
    const outputPath = `uploads/cos/${outputFileName}`;
    
    // Convert to CSV
    const csvHeader = Object.keys(outputData[0]).join(',');
    const csvRows = outputData.map(row =>
  Object.values(row)
    .map(val => `"${String(val).replace(/"/g, '""')}"`)
    .join(',')
);
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    fs.writeFileSync(outputPath, csvContent);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Return success with file download URL
    return res.json({
      success: true,
      message: `Successfully processed ${processedData.length} teams`,
      processedCount: processedData.length,
      fileUrl: `/api/cos_portal/download/${outputFileName}`,
      fileName: outputFileName,
      fileHash: fileHash,
      filehash: fileHash
    });

  } catch (err) {
    console.error("Upload error:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

// Download File Route
router.get("/download/:fileName", verifyToken, (req, res) => {
  try {
    const fileName = path.basename(req.params.fileName);
   const filePath = path.join('uploads', 'cos', fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Download error:", err);
        if (!res.headersSent) {
  res.status(500).json({
    error: 'Error downloading file'
  });
}
      }
    });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ status: true, message: "Logged out successfully" });
});

module.exports = router;
