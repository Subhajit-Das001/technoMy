const { Worker } = require('bullmq');
const fs = require('fs').promises; // Use async fs to avoid blocking the thread
const crypto = require("crypto");
const csv = require("csvtojson");
const XLSX = require("xlsx");
const { redisConnection, emailQueue } = require('../config/queue');

// Import your Models & Utils
const CosBranch = require("../models/cos_branch");
const CosSchool = require("../models/cos_school");
const CosStudent = require("../models/cos_student");
const UploadedFileHash = require("../models/uploadFileHash");
const CityStudentCount = require("../models/cityStudentCountModel");
const cityToID = require("../utils/cityToID.json");
const generateRollNumber = require("../utils/generateRollNumber");

const REQUIRED_COLUMNS = [
  'name1', 'dob1', 'email1', 'contact1', 'class1',
  'name2', 'dob2', 'email2', 'contact2', 'class2',
  'squad', 'language'
];

// Helper functions (Moved from original file)
const parseDate = (value) => {
  if (!value) return null;
  if (!isNaN(value)) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    excelEpoch.setUTCDate(excelEpoch.getUTCDate() + Number(value));
    return excelEpoch;
  }
  const str = value.toString().trim();
  const match = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (match) {
    return new Date(Date.UTC(parseInt(match[3], 10), parseInt(match[2], 10) - 1, parseInt(match[1], 10)));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
};

const formatDateForPassword = (date) => {
  return `${String(date.getUTCDate()).padStart(2, '0')}${String(date.getUTCMonth()+1).padStart(2,'0')}${date.getUTCFullYear()}`;
};

// ----------------------------------------------------
// THE WORKER
// ----------------------------------------------------
const csvWorker = new Worker('CSV-Queue', async job => {
  const { school_id, branch_id, originalName, filePath } = job.data;
  const lockKey = `upload_lock:${branch_id}`;
console.log(`\n[WORKER] Picked up Job ID: ${job.id} | Branch: ${branch_id}`);
  try {
    await job.updateProgress(10);

    // 1. Fetch Branch & Validate File
    const branch = await CosBranch.findOne({ branch_id });
    if (!branch) throw new Error(JSON.stringify({ message: 'Branch not found' }));

    const fileBuffer = await fs.readFile(filePath);
    const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

    const existingFile = await UploadedFileHash.findOne({ hash: fileHash });
    if (existingFile) {
      throw new Error(JSON.stringify({ 
        error: "Duplicate file upload", 
        message: "This file has already been processed." 
      }));
    }

    await job.updateProgress(20);

    // 2. Parse CSV/XLSX
    let jsonArray;
    if (originalName.endsWith('.xlsx')) {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    } else {
      jsonArray = await csv().fromString(fileBuffer.toString('utf-8'));
    }
    jsonArray = jsonArray.filter(row => Object.values(row).some(val => val !== undefined && val !== null && val.toString().trim() !== ''));
    if (jsonArray.length > 200) {
      throw new Error(JSON.stringify({ error: "Limit Exceeded", message: "Maximum 200 rows allowed per file." }));
    }

    // 3. Validate Columns
    const fileColumns = Object.keys(jsonArray[0] || {});
    const missingColumns = REQUIRED_COLUMNS.filter(col => !fileColumns.includes(col));
    if (missingColumns.length > 0) {
      throw new Error(JSON.stringify({ 
        error: 'Column validation failed', 
        message: `Missing required columns: ${missingColumns.join(', ')}` 
      }));
    }

    await job.updateProgress(40);

    // 4. Pre-Allocate Database Roll Numbers (The O(1) Optimization)
    const cityID = cityToID[branch.city];
    if (!cityID) throw new Error(JSON.stringify({ message: `City '${branch.city}' not found in system. Please contact administrator.` }));

    // Increment MongoDB by the total number of rows in ONE trip, not row-by-row
    const validRecordsCount = jsonArray.length;
    const cityInfo = await CityStudentCount.findOneAndUpdate(
      { cityID },
      { $set: { city: branch.city }, $inc: { studentCount: validRecordsCount } },
      { new: true, upsert: true }
    );
    let currentCountIndex = cityInfo.studentCount - validRecordsCount;

    // 5. Data Processing Loop
    const processedData = [];
    const errors = [];
    const teamsToInsert = [];

    for (let i = 0; i < jsonArray.length; i++) {
      const row = jsonArray[i];
      const rowNum = i + 2;

      // Fill missing email/contact
      if (!row.email1 && row.email2) row.email1 = row.email2;
      if (!row.email2 && row.email1) row.email2 = row.email1;
      if (!row.contact1 && row.contact2) row.contact1 = row.contact2;
      if (!row.contact2 && row.contact1) row.contact2 = row.contact1;

      // Essential Validations
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
      if (!['Juniors', 'Hauts'].includes(row.squad)) {
        errors.push(`Row ${rowNum}: Invalid squad. Must be 'Juniors' or 'Hauts'`);
        continue;
      }
            // Validate language
      if (!['English', 'Hindi'].includes(row.language)) {
        errors.push(`Row ${rowNum}: Invalid language value. Must be 'English' or 'Hindi'`);
        continue;
      }
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

      // Generate localized roll number & password using pre-allocated index
      currentCountIndex++;
      const rollNumber = generateRollNumber(row.squad, row.language, branch.city, currentCountIndex);
      const generatedPassword = `${formatDateForPassword(dob1)}${formatDateForPassword(dob2)}`;

      teamsToInsert.push({
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
        school2: branch.branch_name,
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
        isPaid: false,
        mailSent: false
      });

      processedData.push({ ...row, rollNumber, password: generatedPassword, dob1, dob2 });
    }

    // Catch accumulated errors
    if (errors.length > 0) {
    throw new Error(JSON.stringify({ 
        error: 'Validation errors found', 
        errors: errors,
        fileHash: fileHash
    }));
}

    await job.updateProgress(70);

    // 6. Execute Bulk DB Transactions
    await CosStudent.insertMany(teamsToInsert, { ordered: true });
    
    await UploadedFileHash.create({
      hash: fileHash, fileName: originalName, uploadedBy: branch_id
    });

    const juniorCount = teamsToInsert.filter(d => d.squad === 'Juniors').length;
    const hautsCount = teamsToInsert.filter(d => d.squad === 'Hauts').length;

    await CosBranch.findByIdAndUpdate(branch._id, {
      $inc: { total_students_count: processedData.length * 2, juniors_count: juniorCount, hauts_count: hautsCount, csv_count: 1 },
      $push: { csv_submission_time: new Date() }
    });
    await CosSchool.findOneAndUpdate({ school_id: school_id }, {
      $inc: { total_students_count: processedData.length * 2, juniors_count: juniorCount, hauts_count: hautsCount, csv_count: 1 }
    });

    await job.updateProgress(90);

    // 7. Generate Output Data
    const outputData = processedData.map(row => {
      const formatOutDate = (d) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCFullYear())}`;
      return {
        name1: row.name1 || '', dob1: formatOutDate(row.dob1), email1: row.email1 || '', contact1: row.contact1 || '', class1: row.class1 || '',
        name2: row.name2 || '', dob2: formatOutDate(row.dob2), email2: row.email2 || '', contact2: row.contact2 || '', class2: row.class2 || '',
        squad: row.squad || '', language: row.language || '', rollNumber: row.rollNumber || '', password: `="${row.password || ''}"`
      };
    });

    const sanitizedSchoolName = branch.branch_name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 50);
    const outputFileName = `${sanitizedSchoolName}_credentials_${Date.now()}.csv`;
    
    // Create the raw CSV string
    const csvHeader = Object.keys(outputData[0]).join(',');
    const csvRows = outputData.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
    const rawCsvString = [csvHeader, ...csvRows].join('\n');

    await job.updateProgress(100);

    // RETURN THE RAW STRING directly to BullMQ
    return {
      processedCount: processedData.length,
      fileName: outputFileName,
      fileHash: fileHash,
      csvData: rawCsvString // <--- NEW: Passing the data directly
    };
    // // 8. Queue the Emails into the Mail Worker!
    // for (const team of teamsToInsert) {
    //   await emailQueue.add('Send-Credentials', {
    //     email: team.email1, name: team.name1, rollNumber: team.rollNumber, password: team.password, csv_hash_id: fileHash
    //   });
    // }

    await job.updateProgress(100);

    return {
      processedCount: processedData.length,
      fileName: outputFileName,
      fileHash: fileHash
    };

  } catch (error) {
    console.log(`⚠️ [WORKER] Catch block triggered. Attempting to unlock ${lockKey}...`);
    // 👇 ADD THIS LINE TO REVEAL THE MYSTERY 👇
    console.error("🚨 CRASH REASON:", error.message);
    try {
      await redisConnection.del(lockKey);
      console.log(`🔓 [WORKER] SUCCESS: Lock deleted for ${branch_id}! User can upload again.`);
    } catch (redisErr) {
      console.error(`💥 [WORKER] FAILED to delete lock:`, redisErr);
    }
    throw error; 
  } finally {
    const fsSync = require('fs');
    // Guaranteed Cleanup: Delete temp file and release branch lock
    try {
      if (filePath && fsSync.existsSync(filePath)) {
        fsSync.unlinkSync(filePath);
      }
    } catch (e) { /* File already gone */ }
    try {
      await redisConnection.del(lockKey);
    } catch (e) {}
  }
}, { connection: redisConnection, concurrency: 5 });

console.log("🎧 CSV Processing Worker is active and listening...");