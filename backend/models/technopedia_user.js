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
    teamId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    
    // User identification
    // CRITICAL FIX 1: Removed `unique: true` from the phone field
    phone: { type: String, required: true },
    name: { type: String, required: true },
    school: { type: String, required: true },
    student: { type: String, required: true },
    
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
    
    // Contest Status
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: false },
    lastSubmissionTime: { type: Date },
    totalTimeSpent: { type: Number, default: 0 },
    questionsAttempted: { type: Number, default: 0 },
    isStarted: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    isNewStudent: { type: Boolean, default: false },
    year: { type: String, required: true },
    language: { type: String, enum: ['en', 'hi'], default: 'en', required: true },
    
    // Session management
    sessionId: { type: String }
});

// Update the calculateScore method
TechnopediaScoreSchema.methods.calculateScore = function() {
    // Dynamically initialize all 10 questions
    const scores = {};
    for (let i = 1; i <= 10; i++) {
        scores[`question${i}`] = 0;
    }
    
    let totalScore = 0;

    this.answers.forEach(answer => {
        let score;
        if (answer.isCorrect) {
            // Using a dynamic score calculation to cover all 10 questions
            // (You can adjust the formulas per question if they vary)
            score = Math.max(0, 300 - (answer.totalTimeSpent / 20000)); 
        } else if (answer.attempted) {
            score = -(answer.totalTimeSpent / 20000);
        } else {
            score = 0;
        }
        
        const roundedScore = Math.round(score);
        scores[`question${answer.questionId}`] = roundedScore;
        totalScore += roundedScore;
    });

    this.scores = {
        ...scores,
        total: totalScore
    };
};

// Check if contest time is valid
TechnopediaScoreSchema.methods.isValidTime = function() {
    const now = new Date();
    if (!this.startTime) return false;
    
    if (!this.endTime) return true;
    
    return (now >= this.startTime && now <= this.endTime);
};

// CRITICAL FIX 2: Added the compound index to allow multiple years per phone
TechnopediaScoreSchema.index({ phone: 1, year: 1,language: 1 }, { unique: true });

const TechnopediaScore = mongoose.model('TechnopediaScore', TechnopediaScoreSchema);

module.exports = TechnopediaScore;