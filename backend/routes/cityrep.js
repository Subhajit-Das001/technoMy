const express = require('express');
const router = express.Router();
const CityRep = require('../models/cityRep');

// Get city representatives sorted by cityRepID in ascending order within a specific zone
router.get('/:zone', async (req, res) => {
    const { zone } = req.params;
    try {
        const cityReps = await CityRep.find({ zone })
            .sort({ cityRepID: 1 }) // Sorting by cityRepID in ascending order
            .select('cityRepID name contact zone city state'); // Select specific fields
        
        // Return empty array instead of 404 - empty result set is not an error
        res.status(200).json(cityReps);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching city representatives.' });
    }
});

// Add a new city representative
router.post('/', async (req, res) => {
    const { cityRepID, name, contact, zone, state, city } = req.body;

    if (!cityRepID || !name || !contact || !zone || !state || !city) {
        return res.status(400).json({ message: 'Please provide cityRepID, name, contact, zone, state and city.' });
    }

    try {
        const newCityRep = new CityRep({ 
            cityRepID, 
            name, 
            contact: String(contact),
            zone,
            state,
            city
        });
        await newCityRep.save();
        res.status(201).json({ message: 'City representative added successfully.', cityRep: newCityRep });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding the city representative.' });
    }
});

// Fix contact field type for existing data (convert all contacts to string)
router.post('/admin/fix-contacts', async (req, res) => {
    try {
        const cityReps = await CityRep.find({});
        let updated = 0;
        
        for (let rep of cityReps) {
            if (typeof rep.contact !== 'string') {
                rep.contact = String(rep.contact);
                await rep.save();
                updated++;
            }
        }
        
        res.status(200).json({ 
            message: `Fixed ${updated} records with non-string contact fields`,
            updated: updated
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fixing contact fields.' });
    }
});

module.exports = router;
