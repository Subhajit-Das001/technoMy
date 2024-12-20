                                                                                                                                                                                                                           const express = require('express');
const Response = require('../models/techped-score');
const router = express.Router();

// GET endpoint to check if the quiz has been attempted and fetch score
router.get('/check-quiz-attempt/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;
        const response = await Response.findOne({ rollNumber });

        if (!response) {
            return res.status(404).json({ isAttempted: false, message: 'User not found' });
        }

        if (response.quizSubmitted) {
            return res.status(200).json({ isAttempted: true, score: response.score });
        } else {
            return res.status(200).json({ isAttempted: false, score: null });
        }
    } catch (error) {
        console.log('Error checking quiz attempt status:', error);
        res.status(500).json({ message: 'Error checking quiz attempt status', error });
    }
});

// GET endpoint to fetch score and rank
router.get('/get-score-and-rank/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;
        const user = await Response.findOne({ rollNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate rank
        const rank = await Response.countDocuments({ score: { $gt: user.score } }) + 1;

        res.status(200).json({ score: user.score, rank });
    } catch (error) {
        console.log('Error fetching score and rank:', error);
        res.status(500).json({ message: 'Error fetching score and rank', error });
    }
});

module.exports = router;