const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// ===== MongoDB Connection =====
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in ../.env');
  process.exit(1);
}




const Offline26 = require("../models/offline26");               // Update path
const Online26 = require("../models/online26");                 // Update path
const cos_students = require("../models/cos_student");            // Update path

// ===== Read JSON File =====
const jsonPath = path.join(__dirname, 'he_ranks.json');

if (!fs.existsSync(jsonPath)) {
  console.error('❌ rank_updates.json not found');
  process.exit(1);
}

const updates = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected\\n');

    let total = 0;
    let success = 0;
    let failed = 0;

    const failedRecords = [];

    for (const rec of updates) {
      total++;

      let roll = rec.rollNumber;
      const rankValue =
  rec.Rank === null || rec.Rank === undefined
    ? ''
    : String(rec.Rank).trim();

      // Handle invalid roll numbers
      if (
        roll === null ||
        roll === undefined ||
        String(roll).trim() === '' ||
        String(roll).toLowerCase() === 'nan'
      ) {
        failed++;
        failedRecords.push({
          rollNumber: roll,
          Rank: rankValue,
        });

        console.log(
          `[${total}] ❌ FAILED  | rollNumber: ${roll} | Reason: Invalid rollNumber`
        );
        continue;
      }

      roll = String(roll).trim();

      let updated = false;

      // 1. cos_students -> rank
      const cosRes = await cos_students.updateOne(
        { rollNumber: roll },
        { $set: { Rank: rankValue } }
      );

      if (cosRes.matchedCount > 0) updated = true;

      // 2. offline26 -> rank
      const offRes = await Offline26.updateOne(
        { rollNumber: roll },
        { $set: { Rank: rankValue } }
      );

      if (offRes.matchedCount > 0) updated = true;

      // 3. online26 -> rank
      const onRes = await Online26.updateOne(
        { rollNumber: roll },
        { $set: { Rank: rankValue } }
      );

      if (onRes.matchedCount > 0) updated = true;

      if (updated) {
        success++;
        console.log(
          `[${total}] ✅ SUCCESS | rollNumber: ${roll} | Rank: ${rankValue}`
        );
      } else {
        failed++;
        failedRecords.push({
          rollNumber: roll,
          Rank: rankValue,
        });

        console.log(
          `[${total}] ❌ FAILED  | rollNumber: ${roll} | Reason: Not found`
        );
      }
    }

    // ===== Summary =====
    console.log('\\n================ SUMMARY ================');
    console.log(`Total records : ${total}`);
    console.log(`Success       : ${success}`);
    console.log(`Failed        : ${failed}`);
    console.log('=========================================\\n');

    // Save failed records
    const failedPath = path.join(__dirname, 'failed_records.json');
    fs.writeFileSync(failedPath, JSON.stringify(failedRecords, null, 2));

    console.log(`📄 Failed records saved to: ${failedPath}`);

    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();