const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedBack'); 
const nodemailer = require('nodemailer');
require('dotenv').config();
// 1. Setup Nodemailer Transporter (Same as your payment code)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL_Feedback,    // Your email (technothlon.iitg@gmail.com)
        pass: process.env.SENDER_PASSWORD_Feedback  // Your 16-digit App Password
    }
});

router.post('/feedback', async (req, res) => {
    try {
        const { name, email, feedbackType, feedbackContent } = req.body;

        // 2. Save to Database
        const feedback = new Feedback({
            name: name,
            email: email,
            feedbackType: feedbackType,
            feedbackContent: feedbackContent
        });
        
        await feedback.save();

        // 3. Send Notification Email to Technothlon Team
        const mailOptions = {
            from: `"Techno Feedback Bot" <${process.env.SENDER_EMAIL}>`, // Sender
            to: 'technothlon.iitg@gmail.com', // Receiver (You)
            subject: `New Feedback: ${feedbackType.toUpperCase()} from ${name}`, // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                    <h2 style="color: #ff8c3a;">New Feedback Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Type:</strong> <span style="background-color: #eee; padding: 5px; border-radius: 4px;">${feedbackType}</span></p>
                    <hr>
                    <h3>Message:</h3>
                    <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ff8c3a;">
                        ${feedbackContent}
                    </p>
                    <hr>
                    <p style="font-size: 12px; color: #888;">
                        This email was sent automatically from the Technothlon Website Feedback Form.
                    </p>
                </div>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Feedback submitted and team notified successfully' });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

module.exports = router;