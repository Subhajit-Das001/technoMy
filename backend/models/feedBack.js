const mongoose = require('mongoose');

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
        required: true 
        // REMOVED 'enum' so that all dropdown options are accepted
    },
    feedbackContent: {
        type: String,
        required: true
    },
    resolve:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;