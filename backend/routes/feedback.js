const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedBack'); 
router.post('/feedback', async (req, res) => {
    try {
        
        const { name, email, feedbackType, feedbackContent } = req.body;

        
        const feedback = new Feedback({
            name: name,
            email: email,
            feedbackType: feedbackType,
            feedbackContent: feedbackContent
        });

        
        await feedback.save();

        
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});
module.exports = router;