const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const ContestScore = require('../models/technopedia-user');
// const Contest = require('../models/technoped-question');
const Technopedia=require('../models/technoped-question')
const TechnoScore=require('../models/technopedia_user')
const crypto = require('crypto');
const Announcement = require('../models/announcement');
const Online25=require('../models/onlineReg');
const { convertToIST } = require('../utils/timeUtils');
const Offline25 = require('../models/offline25');
const newStudent = require('../models/newStudent');

// Test endpoint to check database connection
router.get('/test-db', async (req, res) => {
    try {
        // Try to create a simple document to test database connection
        const testDoc = new TechnoScore({
            teamId: new mongoose.Types.ObjectId().toString(),
            phone: 'test-phone-' + Date.now(),
            name: 'Test User',
            school: 'Test School',
            student: 'new',
            startTime: new Date(),
            isStarted: true,
            isCompleted: false,
            questionsAttempted: 0,
            answers: [],
            scores: {
                question1: 0,
                question2: 0,
                question3: 0,
                question4: 0,
                question5: 0,
                question6: 0,
                question7: 0,
                question8: 0,
                question9: 0,
                question10: 0,
                total: 0
            }
        });
        
        const savedDoc = await testDoc.save();
        console.log('Test document saved:', savedDoc._id);
        
        // Delete the test document
        await TechnoScore.findByIdAndDelete(savedDoc._id);
        
        res.json({ 
            success: true, 
            message: 'Database connection working',
            testId: savedDoc._id 
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});

router.post('/check-student', async (req, res) => {
    try {
      const { rollNumber, second } = req.body;
      console.log('Raw input:', { rollNumber, second});
  
      // Clean up the inputs
      const cleansecond = second.trim().toLowerCase(); // toLowerCase for email safety
      const cleanRollNumber = rollNumber ? rollNumber.trim().toUpperCase() : '';
      
      console.log('Cleaned input:', { cleansecond, cleanRollNumber });
  
      // Check Offline25 database first
      const offlineStudent = await Offline25.findOne({ rollNumber: cleanRollNumber });
      
      if (offlineStudent) {
        // Check if phone matches either contact
        const isContact1 = offlineStudent.contact1 === cleansecond;
        const isContact2 = offlineStudent.contact2 === cleansecond;
  
        
  
        if (isContact1 || isContact2) {
          const selectedSchool = isContact1 ? offlineStudent.school1 : offlineStudent.school2;
          
          console.log('Returning student data (offline):', {
            name: isContact1 ? offlineStudent.name1 : offlineStudent.name2,
            phone: (isContact1 || isContact2),
            school: selectedSchool,
            studentType: "offline"
          });
          
          return res.json({
            exists: true,
            name: isContact1 ? offlineStudent.name1 : offlineStudent.name2,
            email: isContact1 ? offlineStudent.email1 : offlineStudent.email2,
            phone: (isContact1 || isContact2),
            school: selectedSchool,
            studentType: "offline",
            rollNumber:cleanRollNumber
          });
        }
        if (!isContact1 && !isContact2) {
            // Check if phone matches either contact
            const isemail1 = offlineStudent.email1 === cleansecond;
            const isemail2 = offlineStudent.email2 === cleansecond;
      
            
      
            if (isemail1 || isemail2) {
              const selectedSchool = isemail1 ? offlineStudent.school1 : offlineStudent.school2;
              
              return res.json({
                exists: true,
                name: isemail1 ? offlineStudent.name1 : offlineStudent.name2,
                email: isemail1 ? offlineStudent.email1 : offlineStudent.email2,
                phone: isemail1 ? offlineStudent.contact1 : offlineStudent.contact2,
                school: selectedSchool,
                studentType: "offline",
                            rollNumber:cleanRollNumber

              });
            }
        }
      } 
  
      else{
      // If not found in Offline25, check Online25 database
      const onlineStudent = await Online25.findOne({ rollNumber: cleanRollNumber });
      
      if (onlineStudent ) {
        // Check if phone matches either contact
        const isContact1 = onlineStudent.contact1 === cleansecond;
        const isContact2 = onlineStudent.contact2 === cleansecond;
  
        
  
        if (isContact1 || isContact2) {
          const selectedSchool = isContact1 ? onlineStudent.school1 : onlineStudent.school2;
          
          console.log('Returning student data (online):', {
            name: isContact1 ? onlineStudent.name1 : onlineStudent.name2,
            phone: (isContact1 || isContact2),
            school: selectedSchool,
            studentType: "online"
          });
          
          return res.json({
            exists: true,
            name: isContact1 ? onlineStudent.name1 : onlineStudent.name2,
            email: isContact1 ? onlineStudent.email1 : onlineStudent.email2,
            phone: (isContact1 || isContact2),
            school: selectedSchool,
            studentType: "online",
            rollNumber:cleanRollNumber
          });
        }
        if (!isContact1 && !isContact2) {
            // Check if phone matches either contact
            const isemail1 = onlineStudent.email1 === cleansecond;
            const isemail2 = onlineStudent.email2 === cleansecond;
      
            
      
            if (isemail1 || isemail2) {
              const selectedSchool = isemail1 ? onlineStudent.school1 : onlineStudent.school2;
              
              return res.json({
                exists: true,
                name: isemail1 ? onlineStudent.name1 : onlineStudent.name2,
                email: isemail1 ? onlineStudent.email1 : onlineStudent.email2,
                phone: isemail1 ? onlineStudent.contact1: onlineStudent.contact2,
                school: selectedSchool,
                studentType: "online",
                            rollNumber:cleanRollNumber

              });
            }
        }
      }
      }
      
      // If not found in either database, return false
      return res.json({
        exists: false,
        message: 'Student not found in registration records'
      });
      
    }catch (error) {
        console.error('Error details:', error);
        res.status(500).json({ 
          exists: false, 
          message: 'Server error while checking student details' 
        });
      }
})

// Start contest
router.post('/techno/start', async (req, res) => {
    try {
        const { phone, name, school, studentType } = req.body;
        
        console.log('Received start request:', { phone, name, school, studentType });
        
        if (!phone || !name || !school || !studentType) {
            return res.status(400).json({ 
                message: 'Phone number, name, school and student type are required' 
            });
        }

        // Always delete any previous contest records for this phone before starting a new one
        await TechnoScore.deleteMany({ phone: phone.trim() });

        // Validate student type
        console.log('Student type received:', studentType);
        if (!studentType || !['offline', 'online', 'new'].includes(studentType)) {
            console.log('Invalid student type, defaulting to "new"');
            // Default to 'new' if invalid or missing
            studentType = 'new';
        }

        // Don't clean the phone number, use it as is
        const cleanPhone = phone.trim();
        console.log('Phone cleaning:', { original: phone, cleaned: cleanPhone });
        
        // (No need to check for existingContest anymore, since we just deleted all)

        console.log('Creating contest for student type:', studentType);

        // Create new contest with student type - No time limit
        const contest = new TechnoScore({
            teamId: new mongoose.Types.ObjectId().toString(), // Explicitly set teamId
            phone: cleanPhone,
            name: name,
            school: school,
            student: studentType,
            startTime: new Date(),
            // endTime is not set - no time limit
            isStarted: true,
            isCompleted: false,
            questionsAttempted: 0,
            answers: [],
            scores: {
                question1: 0,
                question2: 0,
                question3: 0,
                question4: 0,
                question5: 0,
                question6: 0,
                question7: 0,
                question8: 0,
                question9: 0,
                question10: 0,
                total: 0
            }
        });
        
        console.log('Contest object created:', contest);
        
        // Generate session token
        const sessionToken = crypto.randomBytes(32).toString('hex');
        contest.sessionId = sessionToken;

        console.log('About to save contest to database...');
        const savedContest = await contest.save();
        console.log('Contest saved successfully:', savedContest._id);

        res.json({ 
            success: true, 
            message: 'Contest started successfully',
            startTime: contest.startTime.toISOString(),
            endTime: null, // No time limit
            sessionToken,
            studentType
        });

    } catch (error) {
        console.error('Contest start error:', error);
        console.error('Error stack:', error.stack);
        
        // Check if it's a validation error
        if (error.name === 'ValidationError') {
            console.error('Validation errors:', error.errors);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error',
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        
        // Check if it's a duplicate key error
        if (error.code === 11000) {
            console.error('Duplicate key error:', error.keyValue);
            return res.status(400).json({ 
                success: false, 
                message: 'This phone number has already participated in the contest',
                details: 'Duplicate phone number'
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Error starting contest',
            details: error.message 
        });
    }
});

// Submit answer - Allow multiple submissions
router.post('/submit', async (req, res) => {
    try {
        const { questionId, answer, phone, timeSpentArray } = req.body;
        const submissionTime = new Date();

        console.log('Submit request data:', { questionId, answer, phone, timeSpentArray });

        let technoScore = await TechnoScore.findOne({ phone: phone.trim() });
        console.log('Found contest:', technoScore ? 'Yes' : 'No');
        
        if (!technoScore) {
            // Try to find all contests to debug
            const allContests = await TechnoScore.find({}).select('phone name _id');
            console.log('All contests in database:', allContests);
            
            // Try searching with original phone number
            console.log('Trying with original phone:', phone);
            technoScore = await TechnoScore.findOne({ phone });
            console.log('Found contest with original phone:', technoScore ? 'Yes' : 'No');
            
            if (!technoScore) {
                return res.status(404).json({ message: 'Contest not found' });
            }
        }

        // Get question from contest model
        const technopedia = await Technopedia.findOne().sort({ createdAt: -1 });
        const question = technopedia.questions.find(q => q.questionId === questionId);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check answer correctness - convert both to strings for comparison
        console.log('Answer comparison:', {
            submittedAnswer: answer,
            correctAnswer: question.answer,
            questionId: questionId
        });
        
        const submittedAnswer = String(answer).toLowerCase().trim();
        const correctAnswer = String(question.answer).toLowerCase().trim();
        const isCorrect = submittedAnswer === correctAnswer;
        
        console.log('Processed answers:', {
            submittedAnswer,
            correctAnswer,
            isCorrect
        });
        
        // Calculate total time spent and visit count
        const totalTimeSpent = timeSpentArray.reduce((sum, time) => sum + time, 0);
        const visitCount = timeSpentArray.length;
        
        // Calculate score
        let score;
        if (isCorrect) {
            switch(questionId) {
                case 1: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 2: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                break;
                case 3: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 4: 
                   score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 5: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 6: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 7: 
                     score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 8: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 9: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                case 10: 
                    score = Math.max(0, 300 - (totalTimeSpent/20000)); 
                    break;
                default: 
                    score = 0;
            }
        } else {
            // Negative score for wrong answers
            score = -(totalTimeSpent/20000);
        }

        // Create new answer
        const newAnswer = {
            questionId,
            answer,
            submissionTime,
            timeSpentArray,
            totalTimeSpent,
            visitCount,
            attempted: true,
            isCorrect,
            score: Math.round(score)
        };

        // Check if answer already exists for this question
        const existingAnswerIndex = technoScore.answers.findIndex(a => a.questionId === questionId);
        
        console.log('Submit - existing answer found:', existingAnswerIndex !== -1);
        
        if (existingAnswerIndex !== -1) {
            // Get the existing answer to preserve submission count
            const existingAnswer = technoScore.answers[existingAnswerIndex];
            console.log('Submit - previous submission count:', existingAnswer.submissionCount);
            
            // Increment submission count
            newAnswer.submissionCount = (existingAnswer.submissionCount || 1) + 1;
            console.log('Submit - new submission count:', newAnswer.submissionCount);
            
            // Remove the existing answer completely
            technoScore.answers.splice(existingAnswerIndex, 1);
        } else {
            console.log('Submit - first submission, count set to 1');
        }
        
        // Add the new answer (this replaces the previous one completely)
        technoScore.answers.push(newAnswer);

        // Update questionsAttempted count
        const attemptedQuestions = new Set(technoScore.answers.map(a => a.questionId));
        technoScore.questionsAttempted = attemptedQuestions.size;

        // Update question score in scores object
        technoScore.scores[`question${questionId}`] = Math.round(score);
        
        // Calculate total score
       technoScore.scores.total = technoScore.answers.reduce((total, ans) => total + ans.score, 0);

        // Save all changes
        await technoScore.save();

        // Get the current answer
        const currentAnswer = technoScore.answers.find(a => a.questionId === questionId);
        console.log('Submit - final submission count in response:', currentAnswer.submissionCount);
        
        // Send response with updated scores
        res.json({
            success: true,
            isCorrect,
            score: Math.round(score),
            timeSpentArray: currentAnswer.timeSpentArray,
            totalTimeSpent: currentAnswer.totalTimeSpent,
            visitCount: currentAnswer.visitCount,
            submissionCount: currentAnswer.submissionCount,
            totalScore: technoScore.scores.total,
            questionScores: {
                question1: technoScore.scores.question1,
                question2: technoScore.scores.question2,
                question3: technoScore.scores.question3,
                question4: technoScore.scores.question4,
                question5: technoScore.scores.question5,
                question6: technoScore.scores.question6,
                question7: technoScore.scores.question7,
                question8: technoScore.scores.question8,
                question9: technoScore.scores.question9,
                question10: technoScore.scores.question10
            },
            message: 'Answer submitted successfully!'
        });

    } catch (error) {
        console.error('Submit error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// Enhanced Performance Analysis with Improved Formulas
router.get('/analysis/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        
        const technoScore = await TechnoScore.findOne({ phone: phone.trim() });
        if (!technoScore) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        // Calculate basic metrics
        const totalQuestions = 10;
        const attemptedQuestions = technoScore.answers.length;
        const unattemptedQuestions = totalQuestions - attemptedQuestions;
        
        const correctAnswers = technoScore.answers.filter(a => a.isCorrect).length;
        const wrongAnswers = technoScore.answers.filter(a => !a.isCorrect && a.attempted).length;
        
        // Enhanced accuracy calculation with weighted scoring
        const accuracy = attemptedQuestions > 0 ? Math.round((correctAnswers / attemptedQuestions) * 100) : 0;
        const completionRate = Math.round((attemptedQuestions / totalQuestions) * 100);
        
        // Get questions from Technopedia
        const technopedia = await Technopedia.findOne().sort({ createdAt: -1 });
        const questions = technopedia ? technopedia.questions : [];
        
        // Enhanced question analysis with multiple performance indicators
        let totalConfidence = 0;
        let totalTIQ = 0;
        let totalEfficiency = 0;
        let totalConsistency = 0;
        
        const questionAnalysis = technoScore.answers.map(answer => {
            const timeInMinutes = Math.floor(answer.totalTimeSpent / (1000 * 60));
            const visitCount = answer.visitCount;
            const submissionCount = answer.submissionCount || 1;
            
            // Enhanced Confidence Score (0-100)
            let confidence = 0;
            if (answer.isCorrect) {
                // Base confidence from correct answer
                const baseConfidence = 100;
                
                // Reduce confidence based on submissions (more attempts = less confidence)
                const submissionPenalty = Math.min(60, (submissionCount - 1) * 15);
                
                // Reduce confidence based on excessive visits (indecision)
                const visitPenalty = Math.min(20, Math.max(0, (visitCount - 2) * 5));
                
                // Time-based confidence (optimal time: 2-6 minutes)
                let timeFactor = 1;
                if (timeInMinutes < 1) {
                    timeFactor = 0.8; // Too quick, might be guessing
                } else if (timeInMinutes > 10) {
                    timeFactor = Math.max(0.5, 1 - (timeInMinutes - 10) * 0.05);
                }
                
                confidence = Math.max(20, Math.round((baseConfidence - submissionPenalty - visitPenalty) * timeFactor));
            } else if (answer.attempted) {
                // Wrong answers get minimal confidence based on effort
                confidence = Math.max(0, 15 - submissionCount * 3);
            }
            
            // Enhanced TIQ (Technological Intelligence Quotient) - 0-150 scale
            let tiq = 0;
            if (answer.isCorrect) {
                // Base TIQ for correct answers
                let baseTIQ = 100;
                
                // Time efficiency bonus/penalty
                if (timeInMinutes <= 3) {
                    baseTIQ += 20; // Quick and correct
                } else if (timeInMinutes <= 6) {
                    baseTIQ += 10; // Optimal time
                } else if (timeInMinutes <= 10) {
                    baseTIQ -= (timeInMinutes - 6) * 3; // Slow but correct
                } else {
                    baseTIQ -= 12 + (timeInMinutes - 10) * 5; // Very slow
                }
                
                // Submission efficiency
                const submissionEfficiency = Math.max(0, (6 - submissionCount) * 5);
                baseTIQ += submissionEfficiency;
                
                // Visit pattern analysis
                const visitEfficiency = visitCount <= 3 ? 5 : Math.max(-10, -visitCount);
                baseTIQ += visitEfficiency;
                
                tiq = Math.max(60, Math.min(150, baseTIQ));
            } else if (answer.attempted) {
                // Wrong answers: base TIQ with effort consideration
                let baseTIQ = 30;
                
                // Time consideration for wrong answers
                if (timeInMinutes >= 5) {
                    baseTIQ += 10; // At least they tried
                }
                
                // Penalty for multiple wrong submissions
                baseTIQ -= Math.max(0, (submissionCount - 1) * 8);
                
                tiq = Math.max(0, Math.min(50, baseTIQ));
            }
            
            // Efficiency Score (0-100) - measures time vs outcome
            let efficiency = 0;
            if (answer.isCorrect) {
                // Optimal time: 2-5 minutes = 100% efficiency
                if (timeInMinutes >= 2 && timeInMinutes <= 5) {
                    efficiency = 100;
                } else if (timeInMinutes < 2) {
                    efficiency = 85; // Quick but maybe rushed
                } else {
                    efficiency = Math.max(20, 100 - (timeInMinutes - 5) * 8);
                }
                
                // Adjust for submission count
                efficiency = Math.max(20, efficiency - (submissionCount - 1) * 10);
            } else if (answer.attempted) {
                // Wrong answers get efficiency based on reasonable effort
                efficiency = Math.max(0, 30 - timeInMinutes * 2);
            }
            
            // Consistency Score (0-100) - measures decision-making pattern
            let consistency = 0;
            if (answer.isCorrect) {
                // High consistency for correct answers with few changes
                consistency = Math.max(40, 100 - (submissionCount - 1) * 20 - (visitCount - 1) * 5);
            } else if (answer.attempted) {
                // Lower consistency for wrong answers
                consistency = Math.max(0, 25 - submissionCount * 5);
            }
            
            // Accumulate totals
            totalConfidence += confidence;
            totalTIQ += tiq;
            totalEfficiency += efficiency;
            totalConsistency += consistency;
            
            // Find correct answer
            const question = questions.find(q => q.questionId === answer.questionId);
            const correctAnswer = question ? question.answer : 'N/A';
            
            return {
                questionId: answer.questionId,
                timeSpent: timeInMinutes,
                visitCount: answer.visitCount,
                submissionCount: submissionCount,
                status: answer.isCorrect ? 'correct' : 'wrong',
                confidence: Math.round(confidence),
                tiq: Math.round(tiq),
                efficiency: Math.round(efficiency),
                consistency: Math.round(consistency),
                correctAnswer: correctAnswer,
                // Performance grade based on combined metrics
                grade: calculateGrade(confidence, tiq, efficiency, consistency)
            };
        });
        
        // Add unattempted questions
        for (let i = 1; i <= totalQuestions; i++) {
            if (!technoScore.answers.find(a => a.questionId === i)) {
                const question = questions.find(q => q.questionId === i);
                const correctAnswer = question ? question.answer : 'N/A';
                
                questionAnalysis.push({
                    questionId: i,
                    timeSpent: 0,
                    visitCount: 0,
                    submissionCount: 0,
                    status: 'unattempted',
                    confidence: 0,
                    tiq: 0,
                    efficiency: 0,
                    consistency: 0,
                    correctAnswer: correctAnswer,
                    grade: 'F'
                });
            }
        }
        
        // Sort by question ID
        questionAnalysis.sort((a, b) => a.questionId - b.questionId);
        
        // Calculate aggregate scores
        const averageConfidence = attemptedQuestions > 0 ? Math.round(totalConfidence / attemptedQuestions) : 0;
        const averageTIQ = attemptedQuestions > 0 ? Math.round(totalTIQ / attemptedQuestions) : 0;
        const averageEfficiency = attemptedQuestions > 0 ? Math.round(totalEfficiency / attemptedQuestions) : 0;
        const averageConsistency = attemptedQuestions > 0 ? Math.round(totalConsistency / attemptedQuestions) : 0;
        
        // Enhanced Collective Performance Score (0-100)
        // Weighted combination of all metrics
        const collectiveScore = Math.round(
            (accuracy * 0.35) + 
            (averageConfidence * 0.20) + 
            (averageTIQ * 0.20 * 100/150) + // Normalize TIQ to 100 scale
            (averageEfficiency * 0.15) + 
            (averageConsistency * 0.10)
        );
        
        // Performance categorization
        const performanceCategory = categorizePerformance(collectiveScore, accuracy, averageTIQ);
        
        // Calculate total contest time
        const totalContestTime = technoScore.endTime ? 
            Math.floor((technoScore.endTime - technoScore.startTime) / (1000 * 60)) : 
            Math.floor((new Date() - technoScore.startTime) / (1000 * 60));
        
        // Time efficiency analysis
        const timeEfficiencyScore = calculateTimeEfficiency(totalContestTime, attemptedQuestions, correctAnswers);
        
        // Strengths and areas for improvement
        const insights = generateInsights(questionAnalysis, accuracy, averageTIQ, averageEfficiency, averageConsistency);

        res.json({
            success: true,
            analysis: {
                // Basic metrics
                totalQuestions,
                attemptedQuestions,
                unattemptedQuestions,
                correctAnswers,
                wrongAnswers,
                accuracy,
                completionRate,
                
                // Enhanced metrics
                averageConfidence,
                averageTIQ,
                averageEfficiency,
                averageConsistency,
                collectiveScore,
                performanceCategory,
                timeEfficiencyScore,
                
                // Time analysis
                totalContestTime,
                averageTimePerQuestion: attemptedQuestions > 0 ? Math.round(totalContestTime / attemptedQuestions) : 0,
                
                // Detailed question analysis
                questionAnalysis,
                
                // Insights and recommendations
                insights,
                
                // Original scores
                scores: technoScore.scores
            }
        });

    } catch (error) {
        console.error('Error fetching analysis:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Helper function to calculate performance grade
function calculateGrade(confidence, tiq, efficiency, consistency) {
    const avgScore = (confidence + (tiq * 100/150) + efficiency + consistency) / 4;
    
    if (avgScore >= 85) return 'A+';
    if (avgScore >= 80) return 'A';
    if (avgScore >= 75) return 'A-';
    if (avgScore >= 70) return 'B+';
    if (avgScore >= 65) return 'B';
    if (avgScore >= 60) return 'B-';
    if (avgScore >= 55) return 'C+';
    if (avgScore >= 50) return 'C';
    if (avgScore >= 45) return 'C-';
    if (avgScore >= 40) return 'D';
    return 'F';
}

// Helper function to categorize overall performance
function categorizePerformance(collectiveScore, accuracy, averageTIQ) {
    if (collectiveScore >= 85 && accuracy >= 90) return 'Exceptional';
    if (collectiveScore >= 75 && accuracy >= 80) return 'Excellent';
    if (collectiveScore >= 65 && accuracy >= 70) return 'Good';
    if (collectiveScore >= 55 && accuracy >= 60) return 'Above Average';
    if (collectiveScore >= 45 && accuracy >= 50) return 'Average';
    if (collectiveScore >= 35) return 'Below Average';
    return 'Needs Improvement';
}

// Helper function to calculate time efficiency
function calculateTimeEfficiency(totalTime, attempted, correct) {
    if (attempted === 0) return 0;
    
    const avgTimePerQuestion = totalTime / attempted;
    const optimalTime = 5; // minutes per question
    
    let efficiency = 100;
    if (avgTimePerQuestion > optimalTime) {
        efficiency = Math.max(20, 100 - (avgTimePerQuestion - optimalTime) * 10);
    } else if (avgTimePerQuestion < 2) {
        efficiency = 80; // Too fast might indicate guessing
    }
    
    // Adjust based on accuracy
    const accuracyFactor = correct / attempted;
    efficiency = Math.round(efficiency * (0.6 + 0.4 * accuracyFactor));
    
    return Math.max(0, Math.min(100, efficiency));
}

// Helper function to generate insights
function generateInsights(questionAnalysis, accuracy, averageTIQ, averageEfficiency, averageConsistency) {
    const insights = {
        strengths: [],
        improvements: [],
        recommendations: []
    };
    
    // Analyze strengths
    if (accuracy >= 80) insights.strengths.push('High accuracy rate');
    if (averageTIQ >= 100) insights.strengths.push('Strong technical intelligence');
    if (averageEfficiency >= 75) insights.strengths.push('Efficient problem-solving');
    if (averageConsistency >= 70) insights.strengths.push('Consistent decision-making');
    
    // Analyze areas for improvement
    if (accuracy < 60) insights.improvements.push('Focus on accuracy improvement');
    if (averageTIQ < 80) insights.improvements.push('Enhance technical problem-solving skills');
    if (averageEfficiency < 60) insights.improvements.push('Work on time management');
    if (averageConsistency < 50) insights.improvements.push('Improve decision confidence');
    
    // Generate recommendations
    const avgSubmissions = questionAnalysis.reduce((sum, q) => sum + q.submissionCount, 0) / questionAnalysis.length;
    const avgVisits = questionAnalysis.reduce((sum, q) => sum + q.visitCount, 0) / questionAnalysis.length;
    
    if (avgSubmissions > 2) insights.recommendations.push('Practice more to build confidence and reduce answer changes');
    if (avgVisits > 4) insights.recommendations.push('Work on decision-making skills to reduce hesitation');
    if (accuracy < 70) insights.recommendations.push('Focus on fundamental concepts and practice similar problems');
    
    return insights;
}

// End contest
router.post('/techno/end', async (req, res) => {
    try {
        const { phone } = req.body;
        
        console.log('End contest request:', { phone });
        
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        let technoScore = await TechnoScore.findOne({ 
            phone: phone.trim(),
            isStarted: true,
            isCompleted: false
        });

        console.log('Found contest to end:', technoScore ? 'Yes' : 'No');
        
        if (!technoScore) {
            // Try with trimmed phone number
            const cleanPhone = phone.trim();
            console.log('Trying with trimmed phone:', cleanPhone);
            
            const technoScoreCleaned = await TechnoScore.findOne({ 
                phone: cleanPhone,
                isStarted: true,
                isCompleted: false
            });
            
            console.log('Found contest with cleaned phone:', technoScoreCleaned ? 'Yes' : 'No');
            
            if (!technoScoreCleaned) {
                // Show all contests for debugging
                const allContests = await TechnoScore.find({}).select('phone name isStarted isCompleted _id');
                console.log('All contests in database:', allContests);
                return res.status(404).json({ message: 'No active contest found' });
            }
            
            technoScore = technoScoreCleaned;
        }

        // Update contest status
        technoScore.isCompleted = true;
        technoScore.endTime = new Date();
        technoScore.totalTimeSpent = Math.floor((technoScore.endTime - technoScore.startTime) / 1000);

        console.log('Updating contest:', {
            isCompleted: technoScore.isCompleted,
            endTime: technoScore.endTime,
            totalTimeSpent: technoScore.totalTimeSpent
        });

        // Calculate final scores (if you have a method for this)
        // technoScore.calculateScore();

        const savedContest = await technoScore.save();
        console.log('Contest ended successfully:', savedContest._id);

        res.json({ 
            message: 'Contest ended successfully',
            endTime: technoScore.endTime,
            totalTimeSpent: technoScore.totalTimeSpent,
            scores: technoScore.scores,
            shouldShowAnalysis: true
        });
    } catch (error) {
        console.error('Error ending contest:', error);
        res.status(500).json({ 
            message: 'Error ending contest',
            error: error.message 
        });
    }
});

// Get contest times - Remove time limits
router.get('/techno/times', async (req, res) => {
    try {
        const { phone, sessionId } = req.query;

        // Get global contest schedule
        const technoSchedule = await Technopedia.findOne()
            .sort({ createdAt: -1 })
            .select('startTime endTime');

        if (!technoSchedule) {
            return res.status(404).json({ message: 'No contest schedule found' });
        }

        // Convert contest schedule times to IST
        const scheduleStartIST = convertToIST(technoSchedule.startTime);
        const scheduleEndIST = convertToIST(technoSchedule.endTime);

        // No individual timer limits
        let individualTimer = null;
        if (phone && sessionId) {
            const userTechnoScore = await TechnoScore.findOne({
                phone,
                sessionId,
                isStarted: true,
                isCompleted: false
            });

            if (userTechnoScore) {
                individualTimer = {
                    startTime: convertToIST(userTechnoScore.startTime).toISOString(),
                    endTime: null, // No end time limit
                    timeLeft: null // No time limit
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
router.get('/techno/dates', async (req, res) => {
    try {
        const technoSchedule = await Technopedia.findOne()
            .sort({ createdAt: -1 })
            .select('startTime endTime');
        
        if (!technoSchedule) {
            return res.status(404).json({ message: 'No contest found' });
        }

        // Convert times to IST
        const istStartTime = convertToIST(technoSchedule.startTime);
        const istEndTime = convertToIST(technoSchedule.endTime);

        res.json({
            startTime: istStartTime.toISOString(),
            endTime: istEndTime.toISOString(),
            timezone: 'Asia/Kolkata'
        });
    } catch (error) {
        console.error('Error fetching contest dates:', error);
        res.status(500).json({ message: 'Error fetching contest dates' });
    }
});

// Get question by ID
router.get('/techno/questions/:id', async (req, res) => {
    try {
        const questionId = parseInt(req.params.id);
        
        // Find the latest contest and get the specific question
        const technopedia = await Technopedia.findOne()
            .sort({ createdAt: -1 })
            .select('questions');

        if (!technopedia) {
            return res.status(404).json({ message: 'No contest found' });
        }

        const question = technopedia.questions.find(q => q.questionId === questionId);
        
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
        const leaderboard = await TechnoScore.find({ 
            isCompleted: true
        })
        .select('name school scores answers totalTimeSpent')
        .sort({ 'scores.total': -1, totalTimeSpent: 1 })
        .limit(100);

        const formattedLeaderboard = leaderboard.map(entry => {
            const questionStatus = {
                A: { status: 'not-attempted', time: null },
                B: { status: 'not-attempted', time: null },
                C: { status: 'not-attempted', time: null },
                D: { status: 'not-attempted', time: null },
                E: { status: 'not-attempted', time: null },
                F: { status: 'not-attempted', time: null },
                G: { status: 'not-attempted', time: null },
                H: { status: 'not-attempted', time: null },
                I: { status: 'not-attempted', time: null },
                J: { status: 'not-attempted', time: null }
            };

            // Map answers to their respective questions
            entry.answers.forEach(answer => {
                const letter = String.fromCharCode(64 + answer.questionId);
                questionStatus[letter] = {
                    status: answer.isCorrect ? 'correct' : (answer.attempted ? 'incorrect' : 'not-attempted'),
                    time: answer.totalTimeSpent ? Math.floor(answer.totalTimeSpent/1000) : null,
                    score: answer.score
                };
            });

            return {
                name: entry.name,
                school: entry.school,
                totalScore: Math.round(entry.scores.total),
                totalTime: entry.totalTimeSpent,
                questionA: questionStatus.A,
                questionB: questionStatus.B,
                questionC: questionStatus.C,
                questionD: questionStatus.D,
                questionE: questionStatus.E,
                questionF: questionStatus.F,
                questionG: questionStatus.G,
                questionH: questionStatus.H,
                questionI: questionStatus.I,
                questionJ: questionStatus.J
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

// Get submission count for a specific question
router.get('/techno/submission-count/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const { phone } = req.query;
        
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const technoScore = await TechnoScore.findOne({ phone: phone.trim() });
        if (!technoScore) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        const answer = technoScore.answers.find(a => a.questionId === parseInt(questionId));
        const submissionCount = answer ? (answer.submissionCount || 1) : 0;

        res.json({
            success: true,
            questionId: parseInt(questionId),
            submissionCount,
            hasAnswered: !!answer
        });

    } catch (error) {
        console.error('Error fetching submission count:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;