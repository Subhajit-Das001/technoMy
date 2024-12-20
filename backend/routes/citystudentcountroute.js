const express = require('express');
const router = express.Router();
const CityStudentCount = require('../models/cityStudentCountModel'); // Import model
const cityToId = require('../utils/cityToID.json'); // Import cityToId.json

// Route to populate the database with cities and default studentCount = 0
router.post('/populate', async (req, res) => {
    try {
        const cityData = Object.entries(cityToId); // Convert JSON object to array of [city, cityID]

        const citiesToInsert = cityData.map(([city, cityID]) => ({
            city,
            cityID,
            studentCount: 0
        }));
        console.log(`Attempting to insert ${citiesToInsert.length} cities...`);


        // Insert or ignore duplicates based on cityID
        await CityStudentCount.insertMany(citiesToInsert, { ordered: false });

        res.status(200).json({ 
            message: 'Cities populated successfully', 
            insertedCount: result.length 
        });


    } catch (error) {
        // Handle duplicates or other errors
        if (error.code === 11000) {
            return res.status(200).json({ message: 'Cities already exist', error: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Route to fetch all cities
router.get('/citystudentcount', async (req, res) => {
    try {
        const cities = await CityStudentCount.find();
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
