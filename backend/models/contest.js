// models/contest.js
const mongoose = require('mongoose');

const contestSchema = mongoose.Schema(
    {
        contest: { type: String, required: true },
        questionA: { type: String },
        questionB: { type: String },
        answer1: { type: String, required: true },
        answer2: { type: String, required: true },
        startTime: { type: Date, required: true },  // Contest start time
        endTime: { type: Date, required: true },    // Contest end time
        createdAt: { type: Date, default: Date.now }
    }
);

const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;
