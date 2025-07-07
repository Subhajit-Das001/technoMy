const express = require('express');
const router = express.Router();
const ContestScore = require('../models/contest-score');
const Contest = require('../models/contest');
const crypto = require('crypto');
const Announcement = require('../models/announcement');
const Online25=require('../models/onlineReg');
const { convertToIST } = require('../utils/timeUtils');
const Offline25 = require('../models/offline25'); // Import Offline25 model
const newStudent = require('../models/newStudent'); // Import newStudent model

// Start contest
router.post('/contest/start', async (req, res) => {
    try {
        const { phone, name, school, studentType } = req.body;
        
        console.log('Received start request:', { phone, name, school, studentType });
        
        if (!phone || !name || !school || !studentType) {
            return res.status(400).json({ 
                message: 'Phone number, name, school and student type are required' 
            });
        }

        // Validate student type
        if (!['offline', 'online', 'new'].includes(studentType)) {
            return res.status(400).json({
                message: 'Invalid student type. Must be offline, online, or new'
            });
        }

        const cleanPhone = phone.trim().replace(/\D/g, '');
        
        // Check if already participated
        const existingContest = await ContestScore.findOne({ phone: cleanPhone });
        if (existingContest) {
            return res.status(400).json({ 
                message: 'This phone number has already participated in the contest'
            });
        }

        console.log('Creating contest for student type:', studentType);

        // Create new contest with student type
        const contest = new ContestScore({
            phone: cleanPhone,
            name: name,
            school: school,
            student: studentType,  // Store the student type
            startTime: new Date(),
            endTime: new Date(Date.now() + 60 * 60 * 1000),
            isStarted: true,
            isCompleted: false,
            questionsAttempted: 0,
            answers: [],
            scores: {
                question1: 0,
                question2: 0,
                question3: 0,
                total: 0
            }
        });
        
        // Generate session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        contest.sessionId = sessionToken;

        await contest.save();

        res.json({ 
            success: true, 
            message: 'Contest started successfully',
            startTime: contest.startTime.toISOString(),
            endTime: contest.endTime.toISOString(),
            sessionToken,
            studentType  // Return the student type in response
        });

    } catch (error) {
        console.error('Contest start error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error starting contest',
            details: error.message 
        });
    }
});

// Submit answer
router.post('/contest/submit', async (req, res) => {
    try {
        const { questionId, answer, phone, timeSpentArray } = req.body;
        const submissionTime = new Date();

        let contestScore = await ContestScore.findOne({ phone });
        if (!contestScore) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Get question from contest model
        const contest = await Contest.findOne().sort({ createdAt: -1 });
        const question = contest.questions.find(q => q.questionId === questionId);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check answer correctness
        const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();
        
        // Calculate total time spent and visit count
        const totalTimeSpent = timeSpentArray.reduce((sum, time) => sum + time, 0);
        const visitCount = timeSpentArray.length; // Calculate visit count from array length
        
        // Calculate score
        let score;
        if (isCorrect) {
            switch(questionId) {
                case 1: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;  // Add break statement here
                case 2: 
                    score = Math.max(0, 600 - (totalTimeSpent/15000)); 
                    break;
                case 3: 
                    score = Math.max(0, 1000 - (totalTimeSpent/10000)); 
                    break;
                default: 
                    score = 0;
            }
        } else {
            // Negative score for wrong answers
            score = -(totalTimeSpent/20000);
        }

        // Create new answer with visit count
        const newAnswer = {
            questionId,
            answer,
            submissionTime,
            timeSpentArray, // Store the full array
            totalTimeSpent,
            visitCount,    // Include visit count
            attempted: true,
            isCorrect,
            score: Math.round(score)
        };

        // Add or update answer
        const existingAnswerIndex = contestScore.answers.findIndex(a => a.questionId === questionId);
        if (existingAnswerIndex !== -1) {
            // Merge existing timeSpentArray with new times
            const existingAnswer = contestScore.answers[existingAnswerIndex];
            newAnswer.timeSpentArray = [...new Set([...existingAnswer.timeSpentArray, ...timeSpentArray])];
            newAnswer.visitCount = newAnswer.timeSpentArray.length;
            contestScore.answers[existingAnswerIndex] = newAnswer;
        } else {
            contestScore.answers.push(newAnswer);
        }

        // After updating the answer:

        // Update questionsAttempted if this is a new question
        if (existingAnswerIndex === -1) {
            contestScore.questionsAttempted += 1;
        }

        // Update question score in scores object
        contestScore.scores[`question${questionId}`] = Math.round(score);
        
        // Calculate total score
        contestScore.scores.total = contestScore.answers.reduce((total, ans) => total + ans.score, 0);

        // Save all changes
        await contestScore.save();

        // Send response with updated scores
        res.json({
            success: true,
            isCorrect,
            score: Math.round(score),
            timeSpentArray: newAnswer.timeSpentArray,
            totalTimeSpent: newAnswer.totalTimeSpent,
            visitCount: newAnswer.visitCount, // Send the actual visit count
            totalScore: contestScore.scores.total,
            questionScores: {
                question1: contestScore.scores.question1,
                question2: contestScore.scores.question2,
                question3: contestScore.scores.question3
            }
        });

    } catch (error) {
        console.error('Submit error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// End contest
router.post('/contest/end', async (req, res) => {
    try {
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const contest = await ContestScore.findOne({ 
            phone: phone.trim(),
            isStarted: true,
            isCompleted: false
        });

        if (!contest) {
            return res.status(404).json({ message: 'No active contest found' });
        }

        // Update contest status
        contest.isCompleted = true;
        contest.endTime = new Date();
        contest.totalTimeSpent = Math.floor((contest.endTime - contest.startTime) / 1000);

        // Calculate final scores
        contest.calculateScore();

        await contest.save();

        res.json({ 
            message: 'Contest ended successfully',
            endTime: contest.endTime,
            totalTimeSpent: contest.totalTimeSpent,
            scores: contest.scores,
            shouldClearStorage: true
        });
    } catch (error) {
        console.error('Error ending contest:', error);
        res.status(500).json({ 
            message: 'Error ending contest',
            error: error.message 
        });
    }
});

// Get contest times
router.get('/contest/times', async (req, res) => {
    try {
        const { phone, sessionId } = req.query;

        // Get global contest schedule
        const contestSchedule = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('startTime endTime');

        if (!contestSchedule) {
            return res.status(404).json({ message: 'No contest schedule found' });
        }

        // Convert contest schedule times to IST
        const scheduleStartIST = convertToIST(contestSchedule.startTime);
        const scheduleEndIST = convertToIST(contestSchedule.endTime);

        // If phone and sessionId provided, get individual timer
        let individualTimer = null;
        if (phone && sessionId) {
            const userContest = await ContestScore.findOne({
                phone,
                sessionId,
                isStarted: true,
                isCompleted: false
            });

            if (userContest) {
                const contestStartIST = convertToIST(userContest.startTime);
                const contestEndIST = convertToIST(userContest.endTime);
                const nowIST = convertToIST(new Date());

                individualTimer = {
                    startTime: contestStartIST.toISOString(),
                    endTime: contestEndIST.toISOString(),
                    timeLeft: Math.max(0, contestEndIST - nowIST)
                };
            }
        }

        res.json({
            schedule: {
                startTime: scheduleStartIST.toISOString(),
                endTime: scheduleEndIST.toISOString(),
            },
            individualTimer,
            timezone: 'Asia/Kolkata'
        });

    } catch (error) {
        console.error('Error fetching times:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get contest dates
router.get('/contest/dates', async (req, res) => {
    try {
        const contest = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('startTime endTime');
        
        if (!contest) {
            return res.status(404).json({ message: 'No contest found' });
        }

        // Convert times to IST
        const istStartTime = convertToIST(contest.startTime);
        const istEndTime = convertToIST(contest.endTime);

        res.json({
            startTime: istStartTime.toISOString(),
            endTime: istEndTime.toISOString(),
            timezone: 'Asia/Kolkata'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contest dates' });
    }
});

// Get question by ID
router.get('/contest/questions/:id', async (req, res) => {
    try {
        const questionId = parseInt(req.params.id);
        
        // Find the latest contest and get the specific question
        const contest = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('questions');

        if (!contest) {
            return res.status(404).json({ message: 'No contest found' });
        }

        const question = contest.questions.find(q => q.questionId === questionId);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Return question without the answer
        res.json({
            title: question.title,
            content: question.content,
            points: question.points,
            letter: question.letter
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Error fetching question' });
    }
});

// Get leaderboard
router.get('/contest/leaderboard', async (req, res) => {
    try {
        // First check if leaderboard should be shown
        const announcement = await Announcement.findOne({ id: 1 });
        if (!announcement) {
            return res.status(403).json({ 
                message: 'Leaderboard is not yet available',
                showLeaderboard: false
            });
        }

        // Get all completed contests with scores
        const leaderboard = await ContestScore.find({ 
            isCompleted: true
        })
        .select('name school scores answers totalTimeSpent')
        .sort({ 'scores.total': -1, totalTimeSpent: 1 }) // Sort by total score (desc) and time (asc)
        .limit(100); // Limit to top 100

        // Update the leaderboard route's formatting logic:

        const formattedLeaderboard = leaderboard.map(entry => {
            const questionStatus = {
                A: { status: 'not-attempted', time: null },
                B: { status: 'not-attempted', time: null },
                C: { status: 'not-attempted', time: null }
            };

            // Map answers to their respective questions
            entry.answers.forEach(answer => {
                const letter = String.fromCharCode(64 + answer.questionId); // Convert 1,2,3 to A,B,C
                questionStatus[letter] = {
                    status: answer.isCorrect ? 'correct' : (answer.attempted ? 'incorrect' : 'not-attempted'),
                    time: answer.totalTimeSpent ? Math.floor(answer.totalTimeSpent/1000) : null, // Convert to seconds
                    score: answer.score // Include the score
                };
            });

            return {
                name: entry.name,
                school: entry.school,
                totalScore: Math.round(entry.scores.total), // Ensure total score is rounded
                totalTime: entry.totalTimeSpent,
                questionA: questionStatus.A,
                questionB: questionStatus.B,
                questionC: questionStatus.C
            };
        });

        res.json({
            showLeaderboard: true,
            data: formattedLeaderboard
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

module.exports = router;