const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv'); // Assumes you have your DB URI in a .env file

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
// ==========================================
// 1. IMPORT YOUR MODELS
// Adjust the paths below to point to your actual model files
// ==========================================
const CentreInformation = require("../models/centreInformation"); // Update path
const Offline26 = require("../models/offline26");               // Update path
const Online26 = require("../models/online26");                 // Update path
const CosStudent = require("../models/cos_student");            // Update path

// Helper function to safely name files (removes illegal characters like / \ : * ? " < > |)
const sanitizeFilename = (name) => {
  if (!name) return "Unknown";
  return String(name).replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
};

async function generateAttendanceSheets() {
  try {
    // Connect to MongoDB
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || process.env.DB_URL);
    console.log("✅ MongoDB Connected!");

    // Create an output directory for the CSVs
    const outputDir = path.join(__dirname, "Attendance_Sheets_2026");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Fetch all centers
    console.log("⏳ Fetching Center Information...");
    const centers = await CentreInformation.find({}).lean();
    console.log(`📌 Found ${centers.length} centers. Beginning generation...\n`);

    let totalGenerated = 0;

    // Loop through each center sequentially (prevents memory overload)
    for (const center of centers) {
      const centreId = center.centreId;
      if (!centreId) continue;

      // Ensure fallback names for the file
      const safeCentreName = sanitizeFilename(center.centreName || "Unnamed_Center");
      const safeCity = sanitizeFilename(center.city || "Unknown_City");
      const safeCentreId = sanitizeFilename(centreId);

      // Define standard file name: centreName_city_centreId.csv
      const fileName = `${safeCentreName}_${safeCity}_${safeCentreId}.csv`;
      const filePath = path.join(outputDir, fileName);

      // Fetch students for this center across all 3 collections
      // (Assuming the field mapping them to the center is named 'centreId')
      const [offlineStudents, onlineStudents] = await Promise.all([
        Offline26.find({ centreId: centreId }).lean(),
        Online26.find({ centreId: centreId }).lean(),
        // CosStudent.find({ centreId: centreId }).lean() // Change to branch_id if COS uses that instead
      ]);

      // Merge all students into one array
      const allStudents = [...offlineStudents, ...onlineStudents];

      // Skip generating a CSV if this center has no students allocated yet
      if (allStudents.length === 0) {
        console.log(`⏩ Skipped Center: ${centreId} (0 students)`);
        continue;
      }

      // Calculate Counts
      const totalTeams = allStudents.length;
      const juniorsCount = allStudents.filter(s => s.squad === 'Juniors').length;
      const hautsCount = totalTeams - juniorsCount;

      // Construct the CSV Header layout
      let csvString = 
        `"Technothlon 2026 Prelims - Center Attendance Sheet",,,,,,\n` +
        `,,,,,,\n` +
        `"Center Name: ${center.centreName || 'N/A'}",,,,,,\n` +
        `"City: ${center.city || 'N/A'}",,,,,,\n` +
        `"Total Teams: ${totalTeams}",,,,,,\n` +
        `"Total Hauts: ${hautsCount}",,,,,,\n` +
        `"Total Juniors: ${juniorsCount}",,,,,,\n` +
        `,,,,,,\n` +
        `"Reporting Time: 10:30 AM",,,,,,,\n` +  `"Exam Timing: 11:00 AM to 1:00 PM",,,,,,\n` +`"Students Present: _______",,,,,\n` +
       `"Hauts Present: _______",,,,,\n` +
        `,"Juniors Present: _______",,,,,\n` +
        `,,,,,,\n` +
        // Added "School Name" to the data table
        `"Name 1","Name 2","Squad","Roll Number","Student Signature 1","Student Signature 2"\n`;

      // Map over all students to create the rows
      const csvRows = allStudents.map(row => {
        // Fallback logic for school name depending on how it's stored in different collections

        const rowData = [
          row.name1 || '',
          row.name2 || '',
          row.squad ||  '',
          row.rollNumber || '',
         // Keeps Excel from stripping leading zeros
          "", // Signature 1
          ""  // Signature 2
        ];

        // Escape quotes and format as CSV row
        return rowData.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
      });

      // Append data rows to the main CSV string
      csvString += csvRows.join('\n');

      // Write the file to the disk
      fs.writeFileSync(filePath, csvString, "utf8");
      
      console.log(`✅ Generated: ${fileName} (${totalTeams} teams)`);
      totalGenerated++;
    }

    console.log(`\n🎉 SUCCESS! Generated ${totalGenerated} attendance sheets.`);
    console.log(`📁 Files are located in: ${outputDir}`);

  } catch (error) {
    console.error("❌ Error generating attendance sheets:", error);
  } finally {
    // Close the database connection and exit
    mongoose.connection.close();
    process.exit(0);
  }
}

// Execute the function
generateAttendanceSheets();