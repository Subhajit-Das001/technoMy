                                                                                                                                                                                                                                     const express = require('express');
const router = express.Router();
const { questions, answers } = require('../technoped-question/int-question');

// Endpoint to get all questions
router.get('/questions', async (req, res) => {
    try {
        res.json(questions);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

module.exports = router;