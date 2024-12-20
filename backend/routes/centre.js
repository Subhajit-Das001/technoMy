const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const fs = require('fs');
const CentreInfo = require('../models/centres'); // Adjust the path to your model

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'centrefiles/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST route for uploading CSV
router.post('/centre', upload.single('file'), async (req, res) => {
  try {
    // Convert CSV file to JSON array
    const jsonArray = await csv().fromFile(req.file.path);

    // Process each row from the CSV
    const results = await Promise.all(jsonArray.map(async (row, index) => {
      const { name1, email1, contact1, name2, email2, contact2, squad, language, rollno, centre } = row;

      

      // Check if 'centre' field is present
      if (!centre) {
        console.error(`Error: Missing 'centre' field in row ${index}:`, row);
        throw new Error(`Missing 'centre' field in row ${index}`);
      }

      // Create a new Centres document
      const newCentre = new CentreInfo({
        name1,
        email1,
        contact1,
        name2,
        email2,
        contact2,
        squad,
        language,
        rollno,
        centre 
      });

      // Save to database
      await newCentre.save();
      console.log('Saved row to database:');

      return newCentre; // Return the saved document if needed
    }));

    // Remove the uploaded file after processing
    // fs.unlinkSync(req.file.path);
    // console.log('Deleted uploaded file:', req.file.path);

    res.status(200).send({ success: true, message: 'CSV data uploaded and saved to database successfully', data: results });
  } catch (error) {
    console.error('Error saving data to database:', error);
    res.status(500).send({ success: false, message: `Error saving data to database: ${error.message}` });
  }
});

module.exports = router;
