const express = require('express');
const router = express.Router();
const Cl= require('../models/center_list');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  },
});

async function sendProposalNotification(proposalData) {
  const mailOptions = {
    from: "technothlon.iitg@gmail.com",
    to: ["heads.techno@gmail.com"],
    subject: `New School Proposal - ${proposalData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #2c5282;">New School Proposal Received</h2>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 8px;">
          <h3 style="color: #2d3748;">School Details:</h3>
          <ul style="list-style: none; padding-left: 0;">
            <li><strong>School Name:</strong> ${proposalData.name}</li>
            <li><strong>City:</strong> ${proposalData.city}</li>
            <li><strong>State:</strong> ${proposalData.state}</li>
            <li><strong>Website:</strong> <a href="${proposalData.link}">${proposalData.link}</a></li>
            <li><strong>Contact:</strong> ${proposalData.contact}</li>
            <li><strong>Email:</strong> ${proposalData.email}</li>
          </ul>
        </div>

        <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 8px;">
          <h3 style="color: #2d3748;">Requirements:</h3>
          <ul style="list-style: none; padding-left: 0;">
            <li><strong>Is Registered:</strong> ${proposalData.isregistered ? 'Yes' : 'No'}</li>
            <li><strong>Center Required:</strong> ${proposalData.center_req ? 'Yes' : 'No'}</li>
            <li><strong>Registration Required:</strong> ${proposalData.regsiter_req ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ School proposal notification email sent successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error sending proposal notification:", error);
    return false;
  }
}

// Get centers sorted by centerId in ascending order
router.get('/center-list', async (req, res) => {
    try {
        const centers = await Cl.find()
            .sort({ centerId: 1 }) // Sorting by centerId in ascending order
            .select('centerId name city state link zone schools location'); // Select specific fields
        
        if (centers.length === 0) {
            return res.status(404).json({ message: 'No centers found.' });
        }
        
        res.status(200).json(centers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching centers.' });
    }
});

// Add a new center
router.post('/center-list', async (req, res) => {
    const { centerId, name, city, state, link, zone, schools,location } = req.body;

    if (!centerId || !name || !city || !state || !link || !zone || !location) {
        return res.status(400).json({ 
            message: 'Please provide centerId, name, city, state, link, and zone.' 
        });
    }

    try {
        const newCenter = new CentreList({ 
            centerId, 
            name, 
            city, 
            state, 
            link, 
            location,
            zone, 
            schools: schools || [] 
        });
        await newCenter.save();
        res.status(201).json({ 
            message: 'Center added successfully.', 
            center: newCenter 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'An error occurred while adding the center.' 
        });
    }
});

module.exports = router;
