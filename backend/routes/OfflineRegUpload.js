const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csvtojson");
const XLSX = require("xlsx");
const fs = require("fs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const crypto = require("crypto");
const whatsapp = "https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S"
const Offline26 = require("../models/offline26");
const UploadedFileHash = require("../models/uploadFileHash");
const CityStudentCount = require("../models/cityStudentCountModel");
const getZone = require("../utils/getZone");
const cityToID = require("../utils/cityToID.json");
const generateRollNumber = require("../utils/generateRollNumber");

dotenv.config();


// ================= FILE UPLOAD =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offline/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  }
});

async function sendEmail(email, roll, password) {
  try {
    await transporter.sendMail({
      from: "Technothlon <technothlon.iitg@gmail.com>",
      to: email,
      subject: "Technothlon 2026 Registration",
      html: ` <div style="font-family: Arial, sans-serif; padding: 20px;"> <h2 style="color: #4CAF50;">Registration Successful!</h2> <p>Hey Champs!</p> <p>Your registration for Technothlon '26 has been confirmed.</p> <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;"> <p><strong>Roll Number:</strong> ${roll}</p> <p><strong>Password:</strong> ${password}</p> </div> <p><em>(Your password is a fixed combination of your birth dates in DDMMYYYY format and cannot be changed later.)</em></p>                            <p>Follow us on WhatsApp: <a href="${whatsapp}">Join Channel</a></p> <p>Warm regards,<br>Team Technothlon</p> </div> `
    });
    console.log(`✅ Email sent to: ${email} | Roll: ${roll}`);

    return true;
  } catch (err) {
    console.error(`❌ Email failed for ${email}:`, err.message);
    return false;
  }
}


// ================= DATE =================
const parseDate = (value) => {
  if (!value) return null;

  // Excel serial
  if (!isNaN(value)) {
    const date = new Date((value - 25569) * 86400000);
    return isNaN(date.getTime()) ? null : date;
  }

  const str = value.toString().trim();

  // DD/MM/YYYY OR DD-MM-YYYY
  const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    return new Date(Date.UTC(match[3], match[2] - 1, match[1]));
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const formatDateForPassword = (date) => {
  return `${String(date.getUTCDate()).padStart(2, '0')}${String(date.getUTCMonth()+1).padStart(2,'0')}${date.getUTCFullYear()}`;
};


// ================= REQUIRED COLUMNS =================
const REQUIRED_COLUMNS = [
  'name1','dob1','email1','contact1','school1','class1',
  'name2','dob2','email2','contact2','school2','class2',
  'squad','language','city','state'
];


// ================= ROUTE =================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ===== FILE HASH =====
    const fileBuffer = fs.readFileSync(req.file.path);

    const fileHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    const existingFile = await UploadedFileHash.findOne({ hash: fileHash });

    if (existingFile) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Duplicate file upload"
      });
    }

    // ===== PARSE FILE =====
    let jsonArray;

    if (req.file.originalname.endsWith(".xlsx")) {
      const wb = XLSX.readFile(req.file.path);
      const ws = wb.Sheets[wb.SheetNames[0]];
      jsonArray = XLSX.utils.sheet_to_json(ws);
    } else {
      jsonArray = await csv().fromFile(req.file.path);
    }

    // ===== COLUMN VALIDATION =====
    const fileColumns = Object.keys(jsonArray[0] || {});
    const missingColumns = REQUIRED_COLUMNS.filter(
      c => !fileColumns.includes(c)
    );

    if (missingColumns.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Missing columns",
        missingColumns
      });
    }

    // =========================================================
    // ✅ PHASE 1 → VALIDATION ONLY
    // =========================================================
    const errors = [];

    for (let i = 0; i < jsonArray.length; i++) {
      const row = jsonArray[i];
      const rowNum = i + 2;

      const missingFields = REQUIRED_COLUMNS.filter(
        f => !row[f] || row[f].toString().trim() === ""
      );

      if (missingFields.length > 0) {
        errors.push(`Row ${rowNum}: Missing ${missingFields.join(", ")}`);
        continue;
      }

      const dob1 = parseDate(row.dob1);
      const dob2 = parseDate(row.dob2);

      if (!dob1 || !dob2) {
        errors.push(`Row ${rowNum}: Invalid DOB`);
        continue;
      }

      if (!cityToID[row.city]) {
        errors.push(`Row ${rowNum}: Invalid city`);
        continue;
      }
    }

    // ❌ STOP if ANY error
    if (errors.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        error: "Validation failed",
        errors
      });
    }

    // =========================================================
    // ✅ PHASE 2 → INSERT
    // =========================================================
    const validDocs = [];

    for (let row of jsonArray) {
      const dob1 = parseDate(row.dob1);
      const dob2 = parseDate(row.dob2);

      const cityID = cityToID[row.city];
      const zone = getZone(row.city);

      const cityInfo = await CityStudentCount.findOneAndUpdate(
        { cityID },
        { $inc: { studentCount: 1 }, $set: { city: row.city } },
        { new: true, upsert: true }
      );

      const rollNumber = generateRollNumber(
        row.squad,
        row.language,
        row.city,
        cityInfo.studentCount
      );

      const password =
        formatDateForPassword(dob1) +
        formatDateForPassword(dob2);

      validDocs.push({
        ...row,
        dob1,
        dob2,
        email1: row.email1.toLowerCase(),
        email2: row.email2.toLowerCase(),
        contact1: row.contact1.toString().replace(/\D/g, ""),
        contact2: row.contact2.toString().replace(/\D/g, ""),
        rollNumber,
        password,
        mode: "offline",
        zone,
        mailSent: false,
        uploadId: fileHash
      });
    }

    await Offline26.insertMany(validDocs);

    // store file hash AFTER success
    await UploadedFileHash.create({
      hash: fileHash,
      fileName: req.file.originalname,
      uploadedBy: req.body?.UploadedBy || "unknown"
    });

    // =========================================================
    // ✅ PHASE 3 → EMAILS
    // =========================================================
    const total = validDocs.length;
let counter = 0;

    for (let doc of validDocs) {
      counter++;

  console.log(`📤 [${counter}/${total}] Processing ${doc.rollNumber}`);
      const results = await Promise.allSettled([
        doc.email1
          ? sendEmail(doc.email1, doc.rollNumber, doc.password)
          : null,
        doc.email2
          ? sendEmail(doc.email2, doc.rollNumber, doc.password)
          : null
      ]);

      const success = results.some(
        r => r?.status === "fulfilled" && r.value === true
      );

      await Offline26.updateOne(
        { rollNumber: doc.rollNumber },
        { $set: { mailSent: success } }
      );
    }

    fs.unlinkSync(req.file.path);

    return res.json({
      success: true,
      processed: validDocs.length
    });

  } catch (err) {
    console.error(err);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;