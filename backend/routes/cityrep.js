const express = require('express');
const router = express.Router();
const CityRep = require('../models/cityRep');

// Get city representatives sorted by cityRepID in ascending order within a specific zone
router.get('/:zone', async (req, res) => {
    const { zone } = req.params;
    try {
        const cityReps = await CityRep.find({ zone })
            .sort({ cityRepID: 1 }) // Sorting by cityRepID in ascending order
            .select('cityRepID name contact zone'); // Select specific fields
        
        if (cityReps.length === 0) {
            return res.status(404).json({ message: `No representatives found for ${zone} zone.` });
        }
        
        res.status(200).json(cityReps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching city representatives.' });
    }
});

// Add a new city representative
router.post('/', async (req, res) => {
    const { cityRepID, name, contact, zone } = req.body;

    if (!cityRepID || !name || !contact || !zone) {
        return res.status(400).json({ message: 'Please provide cityRepID, name, contact, and zone.' });
    }

    try {
        const newCityRep = new CityRep({ cityRepID, name, contact, zone });
        await newCityRep.save();
        res.status(201).json({ message: 'City representative added successfully.', cityRep: newCityRep });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the city representative.' });
    }
});

module.exports = router;
