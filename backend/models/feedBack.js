const mongoose = require('mongoose');

// Define a schema for the feedback data
const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    feedbackType: {
        type: String,
        enum: ['complain', 'suggestion'], 
        required: true
    },
    feedbackContent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
