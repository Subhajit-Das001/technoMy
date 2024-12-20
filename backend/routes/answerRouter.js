const express=require('express');
const router = express.Router();
const { questions, answers } = require('../technoped-question/int-question');
const Response = require('../models/techped-score');

// POST endpoint to handle submitted answers
router.post('/submit-answers', async (req, res) => {
    try {
        const { rollNumber, answers: userAnswers } = req.body;

        // Validate request data
        if (!rollNumber || !Array.isArray(userAnswers) || userAnswers.length !== questions.length) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Check if the user has already attempted the quiz
        const existingResponse = await Response.findOne({ rollNumber });
        if (existingResponse && existingResponse.quizSubmitted) {
            return res.status(400).json({ message: 'You have already attempted the quiz' });
        }

        // Initialize score
        let score = 0;
        const answerDocs = [];

        // Check each answer
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const userAnswer = userAnswers[i];

            if (question.id !== userAnswer.questionId) {
                return res.status(400).json({ message: `Question ID mismatch for question ${question.id}` });
            }

            if (userAnswer.answer.trim() === '') {
                continue; 
            }

            if (userAnswer.answer.trim() === answers[i].toString()) {
                score += 4;
            } else {
                score--; 
            }

            answerDocs.push({
                questionId: question.id,
                answer: userAnswer.answer.trim(),
            });
        }

        // Save to database
        const response = await Response.findOneAndUpdate(
            { rollNumber },
            { $set: { answers: answerDocs, score, quizSubmitted: true } }, 
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Answers submitted successfully', score });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting answers', error });
    }
});

// GET endpoint to check if the quiz has been attempted
router.get('/check-quiz-attempt/:rollNumber', async (req, res) => {
    try {
        const { rollNumber } = req.params;

        const response = await Response.findOne({ rollNumber });

        if (response && response.quizSubmitted) {
            return res.status(200).json({ isAttempted: true });
        } else {
            return res.status(200).json({ isAttempted: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error checking quiz attempt status', error });
    }
});

module.exports = router;