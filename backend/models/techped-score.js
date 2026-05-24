const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: { type: Number, required: true },
    answer: { type: String, required: false }
});                                                                          //changed here required to false afer getting data to mongodb

const techpedScoreSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    answers: [answerSchema],
    score: { type: Number, required: false }   ,      
    hasAttemptedQuiz: { type: Boolean, default: false },                   //changed here required to false afer getting data to mongodb
    quizSubmitted: { type: Boolean, default: false }, // Track quiz submission status
});

const Response = mongoose.model('TechpedScore', techpedScoreSchema);

module.exports = Response; 