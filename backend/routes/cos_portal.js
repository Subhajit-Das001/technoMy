const express = require("express");
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

// Helper function to format Date to DDMMYYYY (for password)
const formatDateForPassword = (dateInput) => {
    const d = new Date(dateInput);
    
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = String(d.getUTCFullYear()); // Full 4-digit year
    
    return `${day}${month}${year}`;
};

// Helper function to parse DD/MM/YYYY format or Excel serial date
const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Convert to string to handle both string and number inputs
    const dateStr = dateString.toString().trim();
    
    // Check if it's an Excel serial date (numeric)
    const excelSerialNum = parseInt(dateStr, 10);
    if (!isNaN(excelSerialNum) && excelSerialNum > 0 && excelSerialNum < 100000) {
        // Excel serial to date conversion
        // Excel serial 1 = January 1, 1900, but accounting for the leap year bug
        // 25569 = number of days from Dec 30, 1899 to Jan 1, 1970
        try {
            // Convert Excel serial to milliseconds from Unix epoch
            const excelDate = new Date((excelSerialNum - 25569) * 86400000);
            
            // Read the date values
            const year = excelDate.getUTCFullYear();
            const month = excelDate.getUTCMonth();
            const day = excelDate.getUTCDate();
            
            // Create a proper UTC date
            const date = new Date(Date.UTC(year, month, day));
            
            if (!isNaN(date.getTime())) {
                return date;
            }
        } catch (e) {
            // Fall through to text format parsing
        }
    }
    
    // Handle DD/MM/YYYY text format
    const dateMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
        const day = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10) - 1; // Month is 0-indexed
        const year = parseInt(dateMatch[3], 10);
        
        // Create UTC date
        const date = new Date(Date.UTC(year, month, day));
        
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    
    // Return null for invalid format
    return null;
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
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// Login Route
router.post("/login", async (req, res) => {
  const { principal_id, password } = req.body; // password is actually poc_id from frontend

  try {
    const school = await COS_portal.findOne({ principal_id });

    if (!school || school.poc_id !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update isvisit to false after first login
    if (school.isvisit) {
      await COS_portal.findByIdAndUpdate(school._id, { isvisit: false });
    }

    const token = jwt.sign(
      { principal_id: school.principal_id, schoolCode: school.code, source: "COS_portal" },
      process.env.KEY,
      { expiresIn: "7h" }
    );

    res.cookie("token", token, { maxAge: 3600000, httpOnly: true });

    return res.json({ 
      status: true, 
      message: "Login successful", 
      token,
      school: school.school,
      code: school.code
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Dashboard Data
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const { principal_id } = req.user;
    const school = await COS_portal.findOne({ principal_id }).select("-password");

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Use counts from cos_portal model (not counting from cos_kv documents)
    return res.json({
      school: school.school,
      code: school.code,
      principal_name: school.principal_name,
      city: school.city,
      state: school.state,
      zone: school.zone,
      total_registered_students: school.total_number_of_student || 0,
      junior_team: school.junior_team || 0,
      hauts_team: school.hauts_team || 0,
      count_of_submission: school.count_of_submission || 0,
      submission_dates: school.submission_date || []
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// File Upload Route
router.post("/upload", verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { principal_id, schoolCode } = req.user;
    const school = await COS_portal.findOne({ principal_id });

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
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
      if (!cityToID[school.city]) {
        errors.push(`Row ${rowNum}: City '${school.city}' not found in system. Please contact administrator.`);
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
      const cityID = cityToID[school.city];
      const cityInfo = await CityStudentCount.findOneAndUpdate(
        { cityID },
        { $set: { city: school.city }, $inc: { studentCount: 1 } },
        { new: true, upsert: true }
      );

      // Generate roll number and password
      const rollNumber = generateRollNumber(row.squad, row.language, school.city, cityInfo.studentCount);
      
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
        school1: school.school,
        class1: row.class1.toString().trim(),
        name2: row.name2.toString().trim(),
        dob2: dob2,
        email2: row.email2.toString().trim().toLowerCase(),
        contact2: row.contact2.toString().replace(/\D/g, ''),
        school2: school.school,
        class2: row.class2.toString().trim(),
        squad: row.squad,
        language: row.language,
        mode: 'online',
        country: 'India',
        state: school.state,
        city: school.city,
        zone: school.zone,
        view: 'School',
        rollNumber: rollNumber,
        password: generatedPassword,
        schoolCode: school.code,
        principal_id: school.principal_id,
        isPaid: false
      };

      // Save to database
      try {
        const newTeam = new COS_KV(teamData);
        await newTeam.save();
        
        // Add roll number and password to processed data for CSV output
        processedData.push({
          ...row,
          rollNumber: rollNumber,
          password: generatedPassword
        });
      } catch (dbError) {
        errors.push(`Row ${rowNum}: Database error - ${dbError.message}`);
      }
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

    // Update school statistics
    const juniorCount = processedData.filter(d => d.squad === 'Juniors').length;
    const hautsCount = processedData.filter(d => d.squad === 'Hauts').length;

    await COS_portal.findByIdAndUpdate(school._id, {
      $inc: { 
        total_number_of_student: processedData.length * 2,
        junior_team: juniorCount,
        hauts_team: hautsCount,
        count_of_submission: 1
      },
      $push: { submission_date: new Date() }
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
        password: row.password || ''
      };
    });

    // Generate output file name: school_submission_date
    const submissionDate = new Date();
    // Format date as YYYYMMDD
    const dateStr = submissionDate.toISOString().split('T')[0].replace(/-/g, '');
    // Sanitize school name for filename (remove special characters, spaces, etc.)
    const sanitizedSchoolName = school.school
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_+/g, '_')
      .toLowerCase()
      .substring(0, 50); // Limit length
    
    const outputFileName = `${sanitizedSchoolName}_${dateStr}.csv`;
    const outputPath = `uploads/cos/${outputFileName}`;
    
    // Convert to CSV
    const csvHeader = Object.keys(outputData[0]).join(',');
    const csvRows = outputData.map(row => 
      Object.values(row).map(val => `"${val}"`).join(',')
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
      fileName: outputFileName
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
    const fileName = req.params.fileName;
    const filePath = `uploads/cos/${fileName}`;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ error: 'Error downloading file' });
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
