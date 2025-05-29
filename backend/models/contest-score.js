const mongoose = require('mongoose');

// Define the schema for individual contest answers
const contestAnswerSchema = new mongoose.Schema({
    questionId: { type: Number, required: true },  // Question Identifier
    answer: { type: String, required: false }, // The answer submitted by the student
    submissionTime: { type: Date, required: true }, // Store submission timestamp
    timeSpentArray: [{ type: Number }], // Array to store time spent for each visit in seconds
    totalTimeSpent: { 
        type: Number,
        default: 0,
        get: function() {
            return this.timeSpentArray.reduce((sum, time) => sum + time, 0);
        }
    },
    visitCount: { 
        type: Number,
        default: 0,
        get: function() {
            return this.timeSpentArray.length;
        }
    },
    attempted: { type: Boolean, default: true },
    isCorrect: { type: Boolean, default: false },
    score: { type: Number, default: 0 }
});

// Contest Schema to store student responses and their scores
const ContestScoreSchema = new mongoose.Schema({
    // Add teamId with a default value to avoid null values
    teamId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    
    // User identification
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    school: { type: String, required: true }, // Added school field
    student:{type: String, required: true},
    
    // Contest Details
    answers: [contestAnswerSchema],
    scores: {
        question1: { type: Number, default: 0 }, // 300 points
        question2: { type: Number, default: 0 }, // 600 points
        question3: { type: Number, default: 0 }, // 1000 points
        total: { type: Number, default: 0 }
    },
    
    // questionTimeSpent: {
    //     question1: [{ type: Number }], // Array of time spent in seconds for each visit
    //     question2: [{ type: Number }],
    //     question3: [{ type: Number }]
    // },
    
    // Contest Status
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    lastSubmissionTime: { type: Date }, // Track last submission
    totalTimeSpent: { type: Number, default: 0 }, // Total time spent in seconds
    questionsAttempted: { type: Number, default: 0 },
    isStarted: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    isNewStudent: { type: Boolean, default: false },
    
    // Session management
    sessionId: { type: String }
});

// Update the calculateScore method
ContestScoreSchema.methods.calculateScore = function() {
    const scores = {
        question1: 0,
        question2: 0,
        question3: 0
    };

    this.answers.forEach(answer => {
        const timeInMilliseconds = answer.totalTimeSpent;
        const timePenalty = timeInMilliseconds / 1000;
        
        if (!answer.attempted) {
            // Not attempted = 0 points
            switch(answer.questionId) {
                case 1: scores.question1 = 0; break;
                case 2: scores.question2 = 0; break;
                case 3: scores.question3 = 0; break;
            }
        } else if (answer.isCorrect) {
            // Correct answer = max points - time penalty
            switch(answer.questionId) {
                case 1:
                    scores.question1 = Math.max(0, 300 - timePenalty);
                    break;
                case 2:
                    scores.question2 = Math.max(0, 600 - timePenalty);
                    break;
                case 3:
                    scores.question3 = Math.max(0, 1000 - timePenalty);
                    break;
            }
        } else {
            // Wrong answer = negative time penalty
            switch(answer.questionId) {
                case 1:
                    scores.question1 = -(timePenalty);
                    break;
                case 2:
                    scores.question2 = -(timePenalty);
                    break;
                case 3:
                    scores.question3 = -(timePenalty);
                    break;
            }
        }

        // Store individual answer score
        answer.score = scores[`question${answer.questionId}`];
    });

    // Update final scores
    this.scores = {
        question1: Math.round(scores.question1),
        question2: Math.round(scores.question2),
        question3: Math.round(scores.question3),
        total: Math.round(scores.question1 + scores.question2 + scores.question3)
    };
};

// Check if contest time is valid
ContestScoreSchema.methods.isValidTime = function() {
    const now = new Date();
    if (!this.startTime) return false;
    return (now <= new Date(this.startTime.getTime() + 3600000)); // 1 hour in milliseconds
};

// Remove the index on teamId and just keep the index on phone
ContestScoreSchema.index({ phone: 1 }, { unique: true });

const ContestScore = mongoose.model('ContestScore', ContestScoreSchema);

module.exports = ContestScore;