const mongoose = require('mongoose');

// Define the schema for individual contest answers
const contestAnswerSchema = new mongoose.Schema({
    questionId: { type: Number, required: true },  // Question Identifier
    answer: { type: String, required: false } // The answer submitted by the student
});

// Contest Schema to store student responses and their scores
const ContestScoreSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // Name of the student
    rollNumber: { type: String, required: true, unique: true },  // Roll number
    answers: [contestAnswerSchema], // Array of answers submitted by the student
    score: { type: Number, default: 0 }, // Score calculated based on answers
    hasAttemptedQuiz: { type: Boolean, default: false }, // Whether the student attempted the quiz
    quizSubmitted: { type: Boolean, default: false }, // Whether the quiz was submitted
});

const Response = mongoose.model('ContestScore', ContestScoreSchema);

module.exports = Response;
