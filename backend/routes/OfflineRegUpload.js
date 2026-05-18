const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csvtojson");
const XLSX = require("xlsx");
const fs = require("fs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const whatsapp = "https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S"
const Offline26 = require("../models/offline26");
const crypto = require("crypto");
const UploadedFileHash = require("../models/uploadFileHash");
const CityStudentCount = require("../models/cityStudentCountModel");
const getZone = require("../utils/getZone");
const { isAdmin } = require("../middleware/auth");
const cityToID = require("../utils/cityToID.json");
const generateRollNumber = require("../utils/generateRollNumber");


//Contact details of Zonal Heads
const ZONAL_HEADS = {
  South: { name: "Zonal_Head_South", phone: "7233951978" },
  // South: { name: "Zonal_Head_South_2", phone: "+918978909914" },
  East: { name: "Zonal_Head_East", phone: "9954704388" },
  West: { name: "Zonal_Head_West", phone: "85111107997" },
  North: { name: "Zonal_Head_North", phone: "6200716689" },
  Online: { name: "Online_Head",phone: "6307043498"}
};

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

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


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
// Protected by Shared Secret
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
      const zone = getZone(row.state);

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
// Protected by Shared Secret
router.post("/retry-mails", isAdmin, async (req, res) => {
  try {
    const { hashId } = req.body;

    if (!hashId) {
      return res.status(400).json({
        error: "hashId is required"
      });
    }

    // 🔍 Find users of this file whose mail failed
    const pendingUsers = await Offline26.find({
      uploadId: hashId,
      mailSent: false
    });

    if (pendingUsers.length === 0) {
      return res.json({
        message: "No pending emails for this file 🎉"
      });
    }

    console.log(`📧 Retrying ${pendingUsers.length} emails for file: ${hashId}`);

    let successCount = 0;
    let total = pendingUsers.length;
    let counter = 0;

    for (let doc of pendingUsers) {
      counter++;

      console.log(`🔁 [${counter}/${total}] Retrying ${doc.rollNumber}`);

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

      if (success) {
        successCount++;
        console.log(`✅ [${counter}/${total}] Sent: ${doc.rollNumber}`);
      } else {
        console.log(`❌ [${counter}/${total}] Failed: ${doc.rollNumber}`);
      }

      await Offline26.updateOne(
        { _id: doc._id },
        { $set: { mailSent: success } }
      );

      // optional delay (prevents Gmail throttling)
      await new Promise(r => setTimeout(r, 200));
    }

    return res.json({
      message: "Retry completed",
      success: successCount,
      failed: total - successCount,
      total
    });

  } catch (err) {
    console.error("Retry error:", err);

    res.status(500).json({
      error: "Retry failed",
      message: err.message
    });
  }
});


//Generating A .vcf file 
router.post("/generate-vcf", async (req, res) => {
  try {
    const { hashId } = req.body;

    if (!hashId) {
      return res.status(400).json({
        error: "hashId is required"
      });
    }

    // 🔍 Get all records for this upload
    const records = await Offline26.find({ uploadId: hashId });

    if (!records.length) {
      return res.status(404).json({
        error: "No records found for this hashId"
      });
    }

    // 🔍 Get file info
    const fileInfo = await UploadedFileHash.findOne({hash : hashId});

    const fileNameBase = fileInfo?.fileName || "contacts";

    // 📍 Extract city, zone, squad
    const city = records[0].city || "City";
    const zone = records[0].zone || "Zone";
    // const squad = records[0].squad || "Team";

    let vcfContent = "";

    const seen = new Set();

    // ================= FIXED CONTACTS =================

    // 🔥 Online_Head (always first)
    vcfContent += `BEGIN:VCARD
VERSION:3.0
FN:Online_Head
TEL;TYPE=CELL:+916307043498
ORG:Technothlon 2026
END:VCARD
`;
    seen.add("6307043498"); // Kabya number (without +91)

    // 🔥 Zonal Head
    if (ZONAL_HEADS[zone]) {
      const head = ZONAL_HEADS[zone];

      vcfContent += `BEGIN:VCARD
VERSION:3.0
FN:${head.name}
TEL;TYPE=CELL:${head.phone}
ORG:Technothlon 2026
END:VCARD
`;
      seen.add(head.phone.replace("91", ""));
    }

    // ================= STUDENT CONTACTS =================

    for (let doc of records) {
      const num1 = doc.contact1?.replace(/\D/g, "");
      const num2 = doc.contact2?.replace(/\D/g, "");
      const squadCode = doc.squad === "Juniors" ? "JR" : "HT";
      
      // Student 1
      if (num1 && !seen.has(num1)) {
        seen.add(num1);

        const name1 = `${city}_${doc.name1}_${squadCode}_Techno26`;

        vcfContent += `BEGIN:VCARD
VERSION:3.0
FN:${name1}
TEL;TYPE=CELL:${num1}
ORG:Technothlon 2026
NOTE:Zone=${zone}
END:VCARD
`;
      }

      // Student 2
      if (num2 && !seen.has(num2)) {
        seen.add(num2);

        const name2 = `${city}_${doc.name2}_${squadCode}_Techno26`;

        vcfContent += `BEGIN:VCARD
VERSION:3.0
FN:${name2}
TEL;TYPE=CELL:${num2}
ORG:Technothlon 2026
NOTE:Zone=${zone}
END:VCARD
`;
      }
    }

    // ================= FILE NAME =================
    const finalFileName = `${city}_${fileNameBase}_${zone}.vcf`;

    // ================= SEND FILE =================
    res.setHeader("Content-Type", "text/vcard");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${finalFileName}`
    );

    return res.send(vcfContent);

  } catch (err) {
    console.error("VCF generation error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
});
module.exports = router;