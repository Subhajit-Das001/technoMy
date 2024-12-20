                                                                                                                                                                                                                               
const express = require('express');
const router = express.Router();
const Response = require('../models/techped-score'); 
// Endpoint to fetch score based on roll number
router.get('/score/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;

        // Query the database for the score based on roll number
        const response = await Response.findOne({ rollNumber });

        if (!response) {
            return res.status(404).json({ message: 'Score not found' });
        }

        res.status(200).json({ score: response.score });
    } catch (error) {
        console.error('Error fetching score:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;