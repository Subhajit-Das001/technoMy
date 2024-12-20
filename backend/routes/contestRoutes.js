// // routes/contestRoutes.js
// const express = require('express');
// const router = express.Router();
// const Contest = require('../models/contest');
// const ContestScore = require('../models/contestScore');

// // Get the contest and check timing
// router.get('/contest/:id', async (req, res) => {
//     try {
//         const contest = await Contest.findById(req.params.id);
//         if (!contest) {
//             return res.status(404).json({ message: 'Contest not found' });
//         }

//         const currentTime = new Date();

//         if (currentTime < contest.startTime) {
//             return res.status(400).json({ message: 'Contest has not started yet' });
//         }

//         if (currentTime > contest.endTime) {
//             return res.status(400).json({ message: 'Contest has ended' });
//         }

//         res.json(contest); // Send the contest data back to the client
//     } catch (error) {
//         console.error('Error fetching contest:', error);
//         res.status(500).json({ message: 'Error fetching contest' });
//     }
// });

// // Submit answers and calculate score
// router.post('/contest/:id/submit', async (req, res) => {
//     const { rollNumber, answers } = req.body;  // Roll number and answers submitted by the student
//     try {
//         const contest = await Contest.findById(req.params.id);
//         if (!contest) {
//             return res.status(404).json({ message: 'Contest not found' });
//         }

//         const currentTime = new Date();

//         if (currentTime < contest.startTime) {
//             return res.status(400).json({ message: 'Contest has not started yet' });
//         }

//         if (currentTime > contest.endTime) {
//             return res.status(400).json({ message: 'Contest has ended' });
//         }

//         let contestEntry = await ContestScore.findOne({ rollNumber });
//         if (!contestEntry) {
//             contestEntry = new ContestScore({ rollNumber, answers });
//         } else {
//             contestEntry.answers = answers;
//         }

//         let score = 0;
//         contestEntry.answers.forEach(answer => {
//             const correctAnswer = contest[`answer${answer.questionId}`]; // Assuming answers are stored like answer1, answer2, etc.
//             if (answer.answer === correctAnswer) {
//                 score++;
//             }
//         });

//         contestEntry.score = score;
//         contestEntry.hasAttemptedQuiz = true;
//         contestEntry.quizSubmitted = true;
//         await contestEntry.save();

//         res.json({ score });
//     } catch (error) {
//         console.error('Error submitting answers:', error);
//         res.status(500).json({ message: 'Error submitting answers' });
//     }
// });

// module.exports = router;
