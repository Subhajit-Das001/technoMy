const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');
const { isAdmin, schemas } = require('../middleware/auth');

// Get all announcements
router.get('/', async (req, res) => {
  try {
    console.log('Fetching announcements...');
    const announcements = await Announcement.find().sort({ createdAt: -1 }).allowDiskUse(true);
    //console.log('Announcements fetched:', announcements);
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});


// Add a new announcement (Protected by Shared Secret)
router.post('/', isAdmin, async (req, res) => {
  // Validate input
  const { error, value } = schemas.announcement.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const { id, title, content, link } = value;
  const announcement = new Announcement({ id, title, content, link });

  try {
    const savedAnnouncement = await announcement.save();
    res.status(201).json({ success: true, data: savedAnnouncement });
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(400).json({ success: false, message: 'Error creating announcement. Ensure ID is unique.' });
  }
});

// async function insertAnnouncement() {

// const announcements = [
//     {
//         id:1,
//       title: "Wait is Over",
//       content: "Technothlon registration portal is open for 2024.",
//       link: "https://technothlon.techniche.org.in/teamregister"
//     },
//     {
//         id:2,
//       title: "Certificates Available",
//       content: "The certificates for 2024 are available. Please download as soon as possible.",
//       link: "https://technothlon.techniche.org.in"
//     }
//   ];

//   await Announcement.insertMany(announcements);
//   console.log('Announcements reps inserted!');
// }
// insertAnnouncement().catch(err => console.log(err));


module.exports = router;
