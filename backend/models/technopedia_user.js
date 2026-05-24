const mongoose = require('mongoose');

// Define the schema for individual contest answers
const TechnopediaAnswerSchema = new mongoose.Schema({
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
    score: { type: Number, default: 0 },
    submissionCount: { type: Number, default: 1 } // Track number of submissions for this question
});

// Contest Schema to store student responses and their scores
const TechnopediaScoreSchema = new mongoose.Schema({
    // Add teamId with a default value to avoid null values
    teamId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    
    // User identification
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    school: { type: String, required: true }, // Added school field
    student:{type: String, required: true},
    
    // Contest Details
    answers: [TechnopediaAnswerSchema],
    scores: {
        question1: { type: Number, default: 0 },
        question2: { type: Number, default: 0 },
        question3: { type: Number, default: 0 },
        question4: { type: Number, default: 0 },
        question5: { type: Number, default: 0 },
        question6: { type: Number, default: 0 },
        question7: { type: Number, default: 0 },
        question8: { type: Number, default: 0 },
        question9: { type: Number, default: 0 },
        question10: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },
    
    // questionTimeSpent: {
    //     question1: [{ type: Number }], // Array of time spent in seconds for each visit
    //     question2: [{ type: Number }],
    //     question3: [{ type: Number }]
    // },
    
    // Contest Status
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: false }, // Made optional to support no time limit contests
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
TechnopediaScoreSchema.methods.calculateScore = function() {
    const scores = {
        question1: 0,
        question2: 0,
        question3: 0
    };

    this.answers.forEach(answer => {
        let score;
        if (answer.isCorrect) {
            switch(answer.questionId) {
                case 1: 
                    score = Math.max(0, 300 - (answer.totalTimeSpent/20000)); 
                    break;
                case 2: 
                    score = Math.max(0, 600 - (answer.totalTimeSpent/15000)); 
                    break;
                case 3: 
                    score = Math.max(0, 1000 - (answer.totalTimeSpent/10000)); 
                    break;
                default: 
                    score = 0;
            }
        } else if (answer.attempted) {
            score = -(answer.totalTimeSpent/20000);
        } else {
            score = 0;
        }
        
        scores[`question${answer.questionId}`] = Math.round(score);
    });

    this.scores = {
        question1: scores.question1,
        question2: scores.question2,
        question3: scores.question3,
        total: scores.question1 + scores.question2 + scores.question3
    };
};

// Check if contest time is valid
TechnopediaScoreSchema.methods.isValidTime = function() {
    const now = new Date();
    if (!this.startTime) return false;
    
    // If no endTime is set, contest has no time limit
    if (!this.endTime) return true;
    
    // Otherwise check if current time is within the contest window
    return (now >= this.startTime && now <= this.endTime);
};

// Remove the index on teamId and just keep the index on phone
TechnopediaScoreSchema.index({ phone: 1 }, { unique: true });

const TechnopediaScore = mongoose.model('TechnopediaScore', TechnopediaScoreSchema);

module.exports = TechnopediaScore;