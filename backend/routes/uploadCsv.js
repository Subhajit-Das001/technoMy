const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const cors = require('cors');
const UploadOffTeam = require('../models/offTeaminfo');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const cityToID = require('../utils/cityToID.json');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const pdf = require('html-pdf');
const fs = require('fs');
const csvParser = require('csv-parser');
const results = require('../models/result.js');
const pdfLib = require('pdf-lib');
const bodyParser = require('body-parser');
const pdfTemplate = require('./document.js');
const path = require('path');
const Teams = require('../models/teamModel.js');
const Onlinereg = require("../models/onlineReg.js")
const Offline25 = require("../models/Offline25.js")
const { parse } = require('json2csv');
const Cityrep_portal = require('../models/cityrep_portal.js');
const CityRep_portal = require('../models/cityrep_portal.js');
const { Parser } = require('json2csv');
// const XLSX = require('xlsx');

const CityStudentCount = require('../models/cityStudentCountModel.js');

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";


const centreInfo = require('../models/centres');
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
dotenv.config();




const allowedOrigins = [
  'http://localhost:3000', // Local development URL
  'https://technothlon.techniche.org.in' // Production URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

router.use(cors(corsOptions));

const EXPECTED_COLUMNS = [
  'name1', 'email1', 'contact1', 'school1',
  'name2', 'email2', 'contact2', 'school2',
  'squad', 'language', 'city','state'
];

// Update the upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
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
  fileFilter: fileFilter
});

const cityFilePath = path.join(__dirname, '../utils/cityToID.json');

// cityToID is presumably imported from this file or required at the top
// const cityToID = require('../utils/cityToID.json');

const getCityID = (city) => {
  // If city exists, return its ID
  if (cityToID[city]) {
    return cityToID[city];
  }

  // Find the highest city ID and assign the next one
  let lastCityId = Math.max(...Object.values(cityToID).map(Number), 0);
  const newCityId = String(lastCityId + 1); // "45" or "679" etc.

  // Add the new city to the JSON object
  cityToID[city] = newCityId;

  // Write the updated city list back to cityToID.json
  fs.writeFileSync(cityFilePath, JSON.stringify(cityToID, null, 2));

  console.log(`New city '${city}' added with CityID: ${newCityId}`);
  return newCityId;
};


//Login page router
router.post('/login', async (req, res) => {
  const { roll, password } = req.body;

  try {
    let user = null;


    user = await Offline25.findOne({ rollNumber: roll });

    if (!user) {
      user = await Onlinereg.findOne({ rollNumber: roll });
    }


    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const User = (user.roll || user.rollNumber);

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ roll: User, source: user.source || 'Onlinereg' }, process.env.KEY, { expiresIn: '7h' });
    res.cookie('token', token, { maxAge: 3600000 });
    return res.json({ status: true, message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.roll = decoded.roll;
    next();
  });
};





router.get('/user', verifyToken, async (req, res) => {
  const { roll } = req;

  try {
    let user = null;
    user = await Onlinereg.findOne({ rollNumber: roll });

    if (!user) {
      user = await Offline25.findOne({ rollNumber: roll });
    }

    // if (!user) {
    //   user = await Teams.findOne({ roll });
    // }

    // if (!user) {
    //   user = await UploadOffTeam.findOne({ roll });
    // }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ status: true });
});




router.post('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { roll } = req;

  try {
    let user = await Onlinereg.findOne({ rollNumber: roll });

    if (!user) {
      user = await Offline25.findOne({ rollNumber: roll });
    }
    if (!user) {
      user = await Teams.findOne({ roll });
    }
    if (!user) {
      user = await UploadOffTeam.findOne({ roll });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the new password is unique
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }

    // Direct comparison for both models
    if (oldPassword !== user.password) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/update-details', verifyToken, async (req, res) => {
  const { email1, contact1, email2, contact2 } = req.body;
  const { roll } = req;

  try {
    let user = await Onlinereg.findOne({ rollNumber: roll });
    if (!user) {
      user = await Offline25.findOne({ rollNumber: roll });
    }

    if (!user) {
      user = await Teams.findOne({ roll });
    }
    if (!user) {
      user = await UploadOffTeam.findOne({ roll });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email1 = email1;
    user.contact1 = contact1;
    user.email2 = email2;
    user.contact2 = contact2;

    await user.save();

    res.status(200).json({ message: "Details updated successfully" });
  } catch (error) {
    console.error('Error updating details:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/results', async (req, res) => {
  const roll = req.query.Roll;
  console.log(roll);
  try {
    const result = await results.findOne({ Roll: roll });
    if (result) {
      res.status(200).json({ user: result });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const XLSX = require('xlsx');
const getZone = require('../utils/getZone');

// 🚀 Upload CSV and process data
router.post('/uploadcsv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
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

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Validate columns
    const fileColumns = Object.keys(jsonArray[0] || {});
    const missingColumns = EXPECTED_COLUMNS.filter(col => !fileColumns.includes(col));
    const extraColumns = fileColumns.filter(col => !EXPECTED_COLUMNS.includes(col));

    if (missingColumns.length > 0 || extraColumns.length > 0) {
      return res.status(400).json({
        error: 'Column validation failed',
        details: {
          missingColumns: missingColumns.length > 0 ? { missing: missingColumns } : null,
          incorrectColumns: extraColumns.length > 0 ? { 
            incorrect: extraColumns.map(col => ({
              found: col,
              shouldBe: null
            }))
          } : null
        }
      });
    }

    // Check only first entry for duplicate
    const firstEntry = jsonArray[0];
    const existingEntry = await Offline25.findOne({ name1: firstEntry.name1 });
    
    if (existingEntry) {
      return res.status(400).json({
        error: 'Duplicate entry found',
        message: `An entry with name1: "${firstEntry.name1}" already exists in the database.`
      });
    }

    // If no duplicate found, process all entries including the first one
    const uniqueEntries = [...new Set(jsonArray.map(JSON.stringify))].map(JSON.parse);
    const batchId = uuidv4();
    let processedData = [];

    // Process all entries
    for (let entry of uniqueEntries) {
      const { squad, language, city, state, email1, email2 } = entry;

      // 1) Get cityID
      const cityID = cityToID[city] || getCityID(city);

      // 2) Increment city student count
      const cityInfo = await CityStudentCount.findOneAndUpdate(
        { cityID },
        { $set: { city }, $inc: { studentCount: 1 } },
        { new: true, upsert: true }
      );

      // 3) Generate rollNumber & password
      const rollNumber = generateRollNumber(squad, language, city, cityInfo.studentCount);
      const password = uuidv4();

      // 4) Send emails without stopping on failure
      let mail_sent = 'No';
      try {
        const emailPromises = [];
        if (email1) {
          emailPromises.push(sendEmail(email1, rollNumber, password));
        }
        if (email2) {
          emailPromises.push(sendEmail(email2, rollNumber, password));
        }

        // Send emails concurrently and wait for all to complete
        const results = await Promise.allSettled(emailPromises);
        const anySuccess = results.some(r => r.status === 'fulfilled' && r.value === true);
        mail_sent = anySuccess ? 'Yes' : 'No';
      } catch (err) {
        console.error(`Email process error for ${rollNumber}:`, err);
        // Continue processing even if emails fail
      }

      // 5) Construct doc for DB
      const doc = {
        ...entry,
      
        rollNumber,
        password,
        mail_sent,
        view: 'school',
        mode: 'offline',
        isPaid: true,
        batchId,
      };

      // 6) Insert in DB
      await Offline25.create(doc);
      processedData.push(doc);
    }

    return res.json({
      message: 'Data processed successfully',
      data: processedData,
      batchId
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});


function generateRollNumber(squad, language, city, studentcount) {
  const medium = language === 'English' ? 'E' : 'H';
  const squadCode = squad === 'Hauts' ? 'HE' : 'JR';
  const mode = 'F';
  const year = '25';

  // ✅ Correctly call getCityID(city) as a function
  const cityID = getCityID(city);

  // ✅ Zero-pad the cityID to 3 digits
  const paddedCityID = String(cityID).padStart(3, '0');

  // Zero-pad studentCount to 5 digits
  const paddedStudentCount = String(studentcount).padStart(5, '0');

  // Example: "HE25FE04500032"
  return `${squadCode}${year}${mode}${medium}${paddedCityID}${paddedStudentCount}`;
}



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
   user: process.env.SENDER_EMAIL,
   pass: process.env.SENDER_PASSWORD
  },
});




router.get("/downloadcsv", async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) {
      return res.status(400).json({ error: "batchId is required" });
    }

    // Fetch teams with batchId
    const teams = await Offline25.find(
      { batchId },
      "-_id name1 email1 contact1 school1 name2 email2 contact2 school2 squad language city state rollNumber password"
    );

    if (!teams.length) {
      return res.status(404).json({ error: "No data available for this batchId" });
    }

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Determine filename format: school1(city).xlsx
    const schoolName = teams[0].school1 ? teams[0].school1.replace(/\s+/g, "_") : "Unknown_School";
    const cityZone = teams[0].city ? teams[0].city.replace(/\s+/g, "_") : "Unknown_City";
    const filename = `${schoolName}(${cityZone}).xlsx`;

    // Convert data to Excel
    const excelData = teams.map((team) => ({
      name1: team.name1,
      email1: team.email1,
      contact1: team.contact1,
      school1: team.school1 || "Unknown School",
      name2: team.name2,
      email2: team.email2,
      contact2: team.contact2,
      school2: team.school2 || "Unknown School",
      squad: team.squad,
      language: team.language,
      city: team.city,
      state: team.state,
      rollNumber: team.rollNumber,
      password: team.password,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teams");

    // Save file in temp folder
    const filePath = path.join(tempDir, filename);

    XLSX.writeFile(wb, filePath);

    // Get cityrep details
    const token = req.cookies.token;
    let cityrepDetails = { name: "Unknown", zone: "Unknown", city: "Unknown" };

    try {
      // Get the city from the teams data
      const teamCity = teams[0].city;

      // Find cityrep by matching city
      const cityrep = await CityRep_portal.findOne({
        city: teamCity
      }).select("name zone city");

      if (cityrep) {
        cityrepDetails = {
          name: cityrep.name || "Unknown",
          zone: cityrep.zone || "Unknown",
          city: cityrep.city || "Unknown"
        };
      } else {
        console.log(`No cityrep found for city: ${teamCity}`);
      }
    } catch (err) {
      console.error("Error fetching cityrep details:", err);
    }

    const mailOptions = {
      from: "technothlon.iitg@gmail.com",
      to: ["shubhamkumar99399006@gmail.com", "heads.techno@gmail.com"],
      subject: `Generated Roll Numbers - ${filename}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2c5282;">New Roll Numbers Generated</h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 8px;">
            <h3 style="color: #2d3748;">City Representative Details:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Name:</strong> ${cityrepDetails.name}</li>
              <li><strong>Zone:</strong> ${cityrepDetails.zone}</li>
              <li><strong>City:</strong> ${cityrepDetails.city}</li>
            </ul>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 8px;">
            <h3 style="color: #2d3748;">School Details:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>School Name:</strong> ${teams[0].school1 || "Unknown School"}</li>
              <li><strong>City:</strong> ${teams[0].city}</li>
              <li><strong>State:</strong> ${teams[0].state}</li>
                            <li><strong>Total Registration Count:</strong> ${teams.length}</li>
            </ul>
          </div>


          <p>Please find the attached roll number Excel file.</p>
          <p>Best regards,<br>Technothlon Team</p>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          path: filePath,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    // ✅ Send JSON response with file details
    res.json({
      schoolName: teams[0].school1 || "Unknown School",
      fileName: filename,
      fileUrl: `uploadcsv/downloadcsv/file/${filename}`, // Separate route for file download
    });

  } catch (error) {
    console.error("❌ Error generating Excel file:", error);
    return res.status(500).json({ error: "Failed to generate Excel file" });
  }
});


// ✅ Separate route to handle file download
router.get("/downloadcsv/file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../../temp", filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("❌ Error sending file:", err);
        res.status(500).json({ error: "Failed to download file" });
      } else {
        fs.unlinkSync(filePath); // ✅ Delete file after download
      }
    });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});



// Add this helper function to add delay between operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simplify the sendEmail function - remove retry logic
async function sendEmail(email, roll, password) {
  try {
    await transporter.sendMail({
      from: 'Technothlon <technothlon.iitg@gmail.com>',
      to: email,
      subject: 'Technothlon 2025 Registration',
      html: `<p>Hey champs!</p>
      <p>Greetings from Technothlon!</p>
  <p>We're excited to inform you that your details have been updated. Below are your credentials to access the Technothlon portal:</p>
  <ul>
    <li><strong>Roll Number:</strong> ${roll}</li>
    <li><strong>Password:</strong> ${password}</li>
  </ul>
  <p>For security reasons, we strongly recommend changing your password upon first login. The preliminary round is scheduled for July 13th, 2025. Admit cards will be available shortly before the event.</p>
  <p>Should you have any questions or encounter any issues, please don't hesitate to reach out to us. We're here to help!</p>
                    <p>For receiving   further communications and updates, please join/follow:</p>
  
              <ul>
                    <li><a href="https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S">Whatsapp</a></li>
                    <li><a href="https://www.instagram.com/technothlon.iitg?igsh=MWU1NmU3ZG8zcnFpbg==">Instagram</a></li>                    <li><a href="http://technothlon.techniche.org.in">Website</a></li>
              </ul>
  <p>Best regards,<br>Technothlon IITG</p>`
    });
    return true;
  } catch (error) {
    console.error(`Email send failed for ${email}:`, error);
    return false;
  }
}
const mongoose = require('mongoose');
const { Long } = require('mongodb');

router.post('/fetch-data', async (req, res) => {
  try {
    const { criteria } = req.body;
        
    if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Search criteria is required'
      });
    }

    // Helper function to convert contact numbers to MongoDB Long
    const convertToLong = (value) => {
      const cleanValue = value.toString().replace(/\D/g, '');
      return Long.fromString(cleanValue);
    };

    // Build query with proper Long conversion for contact fields
    const buildQuery = (criteria, isOnlineDb = false) => {
      const query = {};
      
      criteria.forEach(({ column, value }) => {
        if (column && value) {
          if ((column === 'contact1' || column === 'contact2') && isOnlineDb) {
            // Convert to MongoDB Long for online database
            try {
              query[column] = convertToLong(value);
            } catch (error) {
              console.error(`Error converting ${value} to Long:`, error);
              // Fallback to original value
              query[column] = value;
            }
          } else {
            query[column] = value;
          }
        }
      });
      
      return query;
    };

    // Build separate queries for each database
    const offlineQuery = buildQuery(criteria, false);
    const onlineQuery = buildQuery(criteria, true);

    console.log('Offline Query:', JSON.stringify(offlineQuery, null, 2));
    console.log('Online Query:', JSON.stringify(onlineQuery, null, 2));

    // Alternative: Use aggregation pipeline for more flexible matching
    const onlineAggregation = [
      {
        $addFields: {
          contact1_str: { $toString: "$contact1" },
          contact2_str: { $toString: "$contact2" }
        }
      }
    ];

    // Add match stage based on criteria
    const matchConditions = {};
    criteria.forEach(({ column, value }) => {
      if (column && value) {
        if (column === 'contact1' || column === 'contact2') {
          const cleanValue = value.toString().replace(/\D/g, '');
          matchConditions[`${column}_str`] = cleanValue;
        } else {
          matchConditions[column] = value;
        }
      }
    });

    if (Object.keys(matchConditions).length > 0) {
      onlineAggregation.push({ $match: matchConditions });
    }

    // Fetch matching documents
    const [offlineDocuments, onlineDocuments] = await Promise.all([
      Offline25.find(offlineQuery).lean(),
      Object.keys(matchConditions).some(key => key.includes('contact')) 
        ? Onlinereg.aggregate(onlineAggregation)
        : Onlinereg.find(onlineQuery).lean()
    ]);

    console.log(`Found ${offlineDocuments.length} offline documents`);
    console.log(`Found ${onlineDocuments.length} online documents`);

    // Combine results
    const documents = [...offlineDocuments, ...onlineDocuments];

    if (documents.length === 0) {
      return res.status(404).json({
        error: 'No records found',
        message: 'No records found matching your criteria',
        debug: {
          offlineQuery: JSON.stringify(offlineQuery),
          onlineQuery: JSON.stringify(onlineQuery),
          onlineAggregation: JSON.stringify(onlineAggregation)
        }
      });
    }

    // Add source field and normalize contact fields
    const documentsWithSource = documents.map(doc => ({
      ...doc,
      source: doc.mode === 'offline' ? 'Offline Registration' : 'Online Registration',
      contact1: doc.contact1 ? (typeof doc.contact1 === 'object' ? doc.contact1.toString() : doc.contact1) : '',
      contact2: doc.contact2 ? (typeof doc.contact2 === 'object' ? doc.contact2.toString() : doc.contact2) : ''
    }));

    // Prepare CSV fields
    const fields = [
      'name1', 'email1', 'contact1', 'school1',
      'name2', 'email2', 'contact2', 'school2',
      'squad', 'language', 'city', 'state',
      'rollNumber', 'password', 'createdAt', 'source'
    ];

    // Create CSV parser
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(documentsWithSource);

    // Generate filename using criteria
    const searchTerms = criteria
      .filter(c => c.column && c.value)
      .map(c => `${c.column}-${c.value}`)
      .join('_');
    const filename = `search-${searchTerms}-${Date.now()}.csv`;
        
    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, csv);

    // Send response
    res.json({
      message: 'Data fetched successfully',
      count: documents.length,
      fileName: filename,
      fileUrl: `uploadcsv/download-fetch/${filename}`,
      summary: {
        total: documents.length,
        offline: offlineDocuments.length,
        online: onlineDocuments.length
      }
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});
// Add download route for fetched files
router.get('/download-fetch/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../temp', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download file' });
      } else {
        fs.unlinkSync(filePath); // Delete file after download
      }
    });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;