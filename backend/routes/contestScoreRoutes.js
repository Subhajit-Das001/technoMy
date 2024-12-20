// const express = require('express');
// const router = express.Router();
// const ContestScore = require('../models/contestScore');  // Import the ContestScore model

// // Endpoint to submit answers and calculate score
// router.post('/contest/:id/submit', async (req, res) => {
//     const { rollNumber, answers } = req.body;  // Roll number and answers submitted by the student
//     try {
//         // Find the student's contest score entry by roll number
//         let contestEntry = await ContestScore.findOne({ rollNumber });

//         // If no entry found, create a new one
//         if (!contestEntry) {
//             contestEntry = new ContestScore({ rollNumber, answers });
//         } else {
//             // Otherwise, update the student's answers
//             contestEntry.answers = answers;
//         }

//         // Example scoring logic: Calculate the score based on answers
//         let score = 0;
//         // Replace this with your actual answer checking logic
//         contestEntry.answers.forEach(answer => {
//             if (answer.answer === 'correct_answer') {  // Example logic, replace with actual answer matching
//                 score++;
//             }
//         });

//         // Save the updated entry with the score
//         contestEntry.score = score;
//         contestEntry.hasAttemptedQuiz = true;
//         contestEntry.quizSubmitted = true;

//         await contestEntry.save();

//         // Return the score to the frontend
//         res.json({ score });
//     } catch (error) {
//         console.error('Error submitting answers:', error);
//         res.status(500).json({ message: 'Error submitting answers' });
//     }
// });

// // Endpoint to get a student's score by roll number
// router.get('/contest/:rollNumber', async (req, res) => {
//     const { rollNumber } = req.params;  // Roll number of the student
//     try {
//         const contestEntry = await ContestScore.findOne({ rollNumber });
//         if (!contestEntry) {
//             return res.status(404).json({ message: 'Contest score not found' });
//         }
//         res.json(contestEntry);  // Send the contest data back to the client
//     } catch (error) {
//         console.error('Error fetching contest score:', error);
//         res.status(500).json({ message: 'Error fetching contest score' });
//     }
// });

// module.exports = router;
