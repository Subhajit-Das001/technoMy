const express = require('express');
const router = express.Router();
const ContestScore = require('../models/contest-score');
const Contest = require('../models/contest');
const crypto = require('crypto');
const Announcement = require('../models/announcement');
const Online26=require('../models/online26');
const { convertToIST } = require('../utils/timeUtils');
const offline26 = require('../models/offline26'); // Import Offline25 model
const newStudent = require('../models/newStudent'); // Import newStudent model
const cosStudent = require('../models/cos_student'); //COS Students
const moment = require('moment-timezone');

const forceISTtoUTC = (dbDate) => {
    if (!dbDate) return null;
    // 1. Convert DB date to a raw string (e.g., "2026-06-21 11:00:00")
    const rawString = moment.utc(dbDate).format('YYYY-MM-DD HH:mm:ss');
    // 2. Tell moment this raw time is specifically in Kolkata, then export as universal ISO
    return moment.tz(rawString, "Asia/Kolkata").toISOString();
};
// Start contest
router.post('/start', async (req, res) => {
    try {
        const { phone, name, school, studentType } = req.body;
        
        console.log('Received start request:', { phone, name, school, studentType });
        
        if (!phone || !name || !school || !studentType) {
            return res.status(400).json({ 
                message: 'Phone number, name, school and student type are required' 
            });
        }

        // Validate student type
        if (!['offline', 'online','cos', 'new'].includes(studentType)) {
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
router.post('/submit', async (req, res) => {
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
router.post('/end', async (req, res) => {
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
router.get('/times', async (req, res) => {
    try {
        const { phone, sessionId } = req.query;

        const contestSchedule = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('startTime endTime');

        if (!contestSchedule) return res.status(404).json({ message: 'No schedule found' });

        const globalStart = forceISTtoUTC(contestSchedule.startTime);
        const globalEnd = forceISTtoUTC(contestSchedule.endTime);

        let individualTimer = null;
        if (phone && sessionId) {
            const userContest = await ContestScore.findOne({
                phone, sessionId, isStarted: true, isCompleted: false
            });

            if (userContest) {
                const userStart = forceISTtoUTC(userContest.startTime);
                const userEnd = forceISTtoUTC(userContest.endTime);
                
                // Calculate time left safely using absolute timestamps
                const nowTS = Date.now();
                const endTS = new Date(userEnd).getTime();
                
                individualTimer = {
                    startTime: userStart,
                    endTime: userEnd,
                    timeLeft: Math.max(0, endTS - nowTS)
                };
            }
        }

        res.json({
            schedule: { startTime: globalStart, endTime: globalEnd },
            individualTimer,
            timezone: 'Asia/Kolkata'
        });

    } catch (error) {
        console.error('Error fetching times:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get contest dates
router.get('/dates', async (req, res) => {
    try {
        const contest = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('startTime endTime');
        
        if (!contest) return res.status(404).json({ message: 'No contest found' });

        res.json({
            startTime: forceISTtoUTC(contest.startTime), 
            endTime: forceISTtoUTC(contest.endTime),
            timezone: 'Asia/Kolkata'
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contest dates' });
    }
});
// Get ALL questions (Safe version without answers)
// Get ALL questions METADATA (Strictly NO content or answers)
router.get('/questions', async (req, res) => {
    try {
        const contest = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('questions');

        if (!contest) {
            return res.status(404).json({ message: 'No contest found' });
        }

        // Map through to ensure NO content and NO answer leak before start
        const safeQuestions = contest.questions.map(q => ({
            id: q.questionId,
            title: q.title,
            points: q.points,
            letter: q.letter
        }));

        res.json(safeQuestions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions' });
    }
});
// Get question by ID
// Get specific question CONTENT (Locked behind active session)
router.get('/questions/:id', async (req, res) => {
    try {
        // 1. Check for Authorization Header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized. You must start the contest first.' });
        }

        const sessionToken = authHeader.split(' ')[1];

        // 2. Verify the session actually belongs to an ACTIVE contest
        const activeContest = await ContestScore.findOne({
            sessionId: sessionToken,
            isStarted: true,
            isCompleted: false
        });

        if (!activeContest) {
            return res.status(403).json({ message: 'Active contest session not found. Contest may have ended.' });
        }

        const questionId = parseInt(req.params.id);
        const contest = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('questions');

        if (!contest) return res.status(404).json({ message: 'No contest found' });

        const question = contest.questions.find(q => q.questionId === questionId);
        if (!question) return res.status(404).json({ message: 'Question not found' });

        // 3. Return question content (STILL omitting the answer)
        res.json({
            title: question.title,
            content: question.content,
            points: question.points,
            letter: question.letter
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Error fetching question content' });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        // First check if leaderboard should be shown
        const announcement = await Announcement.findOne({ id: 4});
        if (!announcement) {
            return res.status(403).json({ 
                message: 'Leaderboard is not yet available',
                showLeaderboard: false
            });
        }

        // Get all completed contests with scores
        const leaderboard = await ContestScore.find({ 
            isCompleted: true,
            isPrizeEligible: true // Removes highly penalized students from public view
        })
        .select('name school adjustedTotalScore answers totalTimeSpent')
        .sort({ 'adjustedTotalScore': -1, totalTimeSpent: 1 }) // Sort by total score (desc) and time (asc)
        .limit(100); // Limit to top 100

        // Update the leaderboard route's formatting logic:

        const formattedLeaderboard = leaderboard.map(entry => {
            const questionStatus = {
                A: { status: 'not-attempted', time: null,score: 0 },
                B: { status: 'not-attempted', time: null ,score: 0},
                C: { status: 'not-attempted', time: null, score: 0}
            };
            const processedQuestions = new Set();
            // Map answers to their respective questions
            entry.answers.forEach(answer => {
                if (processedQuestions.has(answer.questionId)) return; // Skip duplicates
                processedQuestions.add(answer.questionId);
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
                totalScore: Math.round(entry.adjustedTotalScore), // Ensure total score is rounded
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
router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await newStudent.countDocuments();

    res.status(200).json({
      success: true,
      totalStudents,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
});
// Get contest status (Checks if contest is currently active)
// Get contest status (Checks if contest is currently active)
router.get('/status', async (req, res) => {
    try {
        const contest = await Contest.findOne()
            .sort({ createdAt: -1 })
            .select('startTime endTime');
            
        if (!contest) {
            return res.json({ isContestActive: false });
        }

        const now = Date.now(); // Universal ms
        // Use the helper to force the DB time into proper universal time
        const start = new Date(forceISTtoUTC(contest.startTime)).getTime();
        const end = new Date(forceISTtoUTC(contest.endTime)).getTime();

        const isActive = now >= start && now <= end;

        res.json({ isContestActive: isActive });
    } catch (error) {
        console.error('Error fetching contest status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user attempt status (Checks if they started/completed the contest)
router.get('/score', async (req, res) => {
    try {
        const { phone } = req.query;
        
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const attempt = await ContestScore.findOne({ phone: phone.trim() });

        if (!attempt) {
            return res.json({ isStarted: false, isCompleted: false });
        }

        res.json({
            isStarted: attempt.isStarted,
            isCompleted: attempt.isCompleted
        });
    } catch (error) {
        console.error('Error fetching score status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// GET /api/contest/my-results
// GET /api/contest/my-results
router.get('/my-results', async (req, res) => {
    try {
        // 1. Check if results are published (Announcement ID: 4)
        const resultsAnnouncement = await Announcement.findOne({ id: 4 });
        if (!resultsAnnouncement) {
            return res.json({ showResults: false });
        }

        const userPhone = req.query.phone; // Or from req.user
        
        // --- THE FIX: If no phone is provided, still tell the frontend results are live ---
        if (!userPhone) {
            return res.json({ showResults: true, hasAttempted: false });
        }

        // 2. Fetch User's Score
        const userScore = await ContestScore.findOne({ phone: userPhone });
        if (!userScore || !userScore.isCompleted) {
            return res.json({ showResults: true, hasAttempted: false });
        }

        // 3. Calculate Telemetry
        let attempted = 0;
        let correct = 0;
        let incorrect = 0;
        let calculatedTimeMs = 0;
        const processedQuestions = new Set();
        userScore.answers.forEach(ans => {
            if (processedQuestions.has(ans.questionId)) return; // Skip duplicates
            processedQuestions.add(ans.questionId);
            if (ans.attempted) attempted++;
            if (ans.isCorrect) correct++;
            if (ans.attempted && !ans.isCorrect) incorrect++;
            calculatedTimeMs += (ans.totalTimeSpent || 0);
        });

        const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
        const totalScore = Math.round(userScore.adjustedTotalScore);

        const finalTotalTime = userScore.totalTimeSpent > 0 
            ? userScore.totalTimeSpent 
            : Math.floor(calculatedTimeMs / 1000);
        // 4. Calculate Rank
       const higherRankCount = await ContestScore.countDocuments({
            isCompleted: true,
            // REMOVED isPrizeEligible check here
            $or: [
                { adjustedTotalScore: { $gt: userScore.adjustedTotalScore } },
                { 
                    adjustedTotalScore: userScore.adjustedTotalScore, 
                    totalTimeSpent: { $lt: userScore.totalTimeSpent } 
                }
            ]
        });

        res.json({
            showResults: true,
            hasAttempted: true,
            data: {
                totalScore,
                attempted,
                correct,
                incorrect,
                accuracy,
                rank: higherRankCount + 1,
                totalTime: finalTotalTime,
                penalties: userScore.penalties
            }
        });

    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// GET /api/contest/results-status (Public Route)
// GET /api/contest/results-status (PUBLIC ROUTE - No auth required)
router.get('/results-status', async (req, res) => {
    try {
        const resultsAnnouncement = await Announcement.findOne({ id: 4 });
        res.json({ 
            showResults: !!resultsAnnouncement,
            hasAttempted: false 
        });
    } catch (error) {
        console.error('Error fetching results status:', error);
        res.status(500).json({ showResults: false });
    }
});

//Anti-cheating Route
// Post a penalty strike
router.post('/penalty', async (req, res) => {
    try {
        const { phone, reason } = req.body;

        const contest = await ContestScore.findOne({ 
            phone: phone.trim(),
            isStarted: true,
            isCompleted: false
        });
        if (!contest) {
            return res.status(404).json({ message: 'No active contest found' });
        }
        // Increment penalty and log the reason
        contest.penalties += 1;
        contest.penaltyReasons.push(`${new Date().toISOString()}: ${reason}`);

        let isDisqualified = false;

        // Two-strike rule
        if (contest.penalties >= 2) {
            contest.isCompleted = true;
            contest.endTime = new Date();
            contest.totalTimeSpent = Math.floor((contest.endTime - contest.startTime) / 1000);
            contest.calculateScore(); // Or zero their score if you prefer
            isDisqualified = true;
        }

        await contest.save();

        res.json({ 
            success: true, 
            penalties: contest.penalties,
            isDisqualified
        });

    } catch (error) {
        console.error('Penalty error:', error);
        res.status(500).json({ message: 'Error recording penalty' });
    }
});
module.exports = router;