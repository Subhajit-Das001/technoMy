                                                                                                                                                                                                                               const express = require('express');
 const Response = require('../models/techped-score');
 const router = express.Router();


// Endpoint to submit scores
router.post('/submit-score', async (req, res) => {
    const { rollNumber, score } = req.body;
    try {
        const newScore = new Response({ rollNumber, score });
        await newScore.save();
        res.status(201).json({ message: 'Score submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting score', error });
    }
});

// Endpoint to retrieve leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const scores = await Response.find().sort({ score: -1 }).limit(10); // Top 10 scores
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving leaderboard', error });
    }
});

// Endpoint to get rank of a specific student
router.get('/rank/:rollNumber', async (req, res) => {
    const { rollNumber } = req.params;
    try {
        const scores = await Response.find().sort({ score: -1 });
        const rank = scores.findIndex(score => score.rollNumber === rollNumber) + 1;
        res.status(200).json({ rank });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving rank', error });
    }
});

module.exports = router;