const path = require('path');
const mongoose = require('mongoose');
const ContestScore = require('../models/contest-score'); // Adjust path as needed
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
// Configuration Thresholds (in milliseconds)
const MIN_HUMAN_TIMES = {
    1: 120000, // 2 minutes
    2: 180000, // 3 minutes
    3: 180000  // 3 minutes
};
const IMPOSSIBLE_SPEED_MS = 14000; // 14 seconds

async function consolidateResults() {
    try {
        // 1. Connect to your database
        console.log(process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to Database');

        // 2. Fetch all completed scores
        const completedContests = await ContestScore.find({ isCompleted: true });
        console.log(`📊 Processing ${completedContests.length} records...`);

        let updatedCount = 0;

        for (let contest of completedContests) {
            let adjustedScoreTotal = 0;

            // 3. Deduplication: Keep only the first answer for each questionId
            const uniqueAnswers = new Map();
            
            // Sort by submission time to ensure we grab their first attempt
            const sortedAnswers = contest.answers.sort((a, b) => a.submissionTime - b.submissionTime);
            
            for (let ans of sortedAnswers) {
                if (!uniqueAnswers.has(ans.questionId)) {
                    uniqueAnswers.set(ans.questionId, ans);
                }
            }

            // 4. Time-Scaling Logic per Question
            uniqueAnswers.forEach(ans => {
                let questionScore = 0;

                if (ans.isCorrect) {
                    const timeSpentMs = ans.totalTimeSpent; 
                    const minHumanTime = MIN_HUMAN_TIMES[ans.questionId] || 180000;

                    if (timeSpentMs <= IMPOSSIBLE_SPEED_MS) {
                        // Instant 0 for impossibly fast answers (Copy/Paste AI)
                        questionScore = 0;
                    } else if (timeSpentMs < minHumanTime) {
                        // Scale down proportionately: (Time Taken / Expected Time)
                        const scalingFactor = timeSpentMs / minHumanTime;
                        questionScore = Math.floor(ans.score * scalingFactor);
                    } else {
                        // Full human effort, keep their original calculated score
                        questionScore = ans.score;
                    }
                }
                adjustedScoreTotal += questionScore;
            });


            const lastSubmissionTime = Math.max(
                ...sortedAnswers.map(a => new Date(a.submissionTime).getTime())
            );
            let validPenalties = 0;
            if (contest.penaltyReasons && contest.penaltyReasons.length > 0) {
                contest.penaltyReasons.forEach(reason => {
                    // Extract the ISO date string from the beginning of the reason
                    const penaltyDateStr = reason.split(': ')[0]; 
                    const penaltyTime = new Date(penaltyDateStr).getTime();
                    
                    // Add a 5-second buffer just in case of race conditions
                    if (penaltyTime < (lastSubmissionTime + 5000)) {
                        validPenalties++;
                    }
                });
            }

            // 5. The Penalty Tax
            const rawTotalScore = contest.scores.total;
            let penaltyDeduction = 0;

            if (validPenalties === 1) {
                penaltyDeduction = Math.floor(rawTotalScore * 0.08); // 8% of raw score
            } else if (validPenalties >= 2) {
                penaltyDeduction = Math.floor(rawTotalScore * 0.20); // 20% of raw score
            }
            adjustedScoreTotal = adjustedScoreTotal - penaltyDeduction;
            contest.adjustedTotalScore = adjustedScoreTotal;

            // 6. Prize Eligibility Check
            // Disqualify if they hit max penalties AND finished the whole exam in under 5 minutes (300 seconds)
            if (contest.penalties >= 2 && contest.totalTimeSpent < 300) {
                contest.isPrizeEligible = false;
            } else {
                contest.isPrizeEligible = true;
            }

            await contest.save();
            updatedCount++;
        }

        console.log(`🎉 Consolidation Complete! Successfully updated ${updatedCount} records.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error during consolidation:', error);
        process.exit(1);
    }
}

consolidateResults();