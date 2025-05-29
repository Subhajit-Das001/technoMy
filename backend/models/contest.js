// models/contest.js
const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    questionId: { type: Number, required: true },
    letter: { type: String, required: true }, // Added letter field
    title: { type: String, required: true },
    content: { type: String, required: true },
    answer: { type: String, required: true },
    points: { type: Number, required: true }
});

const contestSchema = mongoose.Schema({
    contest: { type: String, required: true },
    questions: [questionSchema],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;
