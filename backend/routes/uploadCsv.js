const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const cors = require('cors');
// const UploadOffTeam = require('../models/offTeaminfo');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const cityToID = require('../utils/cityToID.json');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const { isAdmin } = require('../middleware/auth');
const pdf = require('html-pdf');
const fs = require('fs');
const csvParser = require('csv-parser');
const results = require('../models/result.js');
const pdfLib = require('pdf-lib');
const bodyParser = require('body-parser');
const pdfTemplate = require('./document.js');
const path = require('path');
const Teams = require('../models/teamModel.js');
const Online25 = require('../models/online25');
const Offline25 = require('../models/Offline25');
const Online26 = require('../models/online26');
const Offline26 = require('../models/offline26');
const CentreInformation = require('../models/centreInformation.js');
const { parse } = require('json2csv');
const Cityrep_portal = require('../models/cityrep_portal.js');
const CityRep_portal = require('../models/cityrep_portal.js');
const cosStudent = require('../models/cos_student.js');
const { Parser } = require('json2csv');
// const XLSX = require('xlsx');

const CityStudentCount = require('../models/cityStudentCountModel.js');

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://technothlon.techniche.org.in/api/"
    : "http://localhost:3001/api/";


const centreInfo = require('../models/centres');
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
dotenv.config();




const allowedOrigins = [
  'http://localhost:3000', // Local development URL
  'https://technothlon.techniche.org.in' // Production URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

router.use(cors(corsOptions));

const EXPECTED_COLUMNS = [
  'name1', 'email1', 'contact1', 'school1',
  'name2', 'email2', 'contact2', 'school2',
  'squad', 'language', 'city', 'state', 'centre'
];

// Update the upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and XLSX files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const cityFilePath = path.join(__dirname, '../utils/cityToID.json');

// cityToID is presumably imported from this file or required at the top
// const cityToID = require('../utils/cityToID.json');

const getCityID = (city) => {
  // If city exists, return its ID
  if (cityToID[city]) {
    return cityToID[city];
  }

  // Find the highest city ID and assign the next one
  let lastCityId = Math.max(...Object.values(cityToID).map(Number), 0);
  const newCityId = String(lastCityId + 1); // "45" or "679" etc.

  // Add the new city to the JSON object
  cityToID[city] = newCityId;

  // Write the updated city list back to cityToID.json
  fs.writeFileSync(cityFilePath, JSON.stringify(cityToID, null, 2));

  console.log(`New city '${city}' added with CityID: ${newCityId}`);
  return newCityId;
};


//Login page router
router.post('/login', async (req, res) => {
  const { roll, password } = req.body;

  try {
    let user = null;
    let userType = ""
    user = await Offline26.findOne({ rollNumber: roll });
    if (user) userType = "Offline26";
    // if (!user) {
    //   user = await Online25.findOne({ rollNumber: roll });
    // }
    if (!user) {
      user = await Online26.findOne({ rollNumber: roll });
      if (user) userType = "Online26";
    }
    if (!user) {
      user = await cosStudent.findOne({ rollNumber: roll });
      if (user) userType = "cosStudent";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const User = (user.roll || user.rollNumber);

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (userType === "cosStudent" && !user.isPaid) {
      return res.status(403).json({
        message: "Credentials will be active after few days"
      });
    }

    const token = jwt.sign({ roll: User, source: user.source || 'Online25' }, process.env.KEY, { expiresIn: '7h' });
    res.cookie('token', token, { maxAge: 3600000 });
    return res.json({ status: true, message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.roll = decoded.roll;
    next();
  });
};




router.get('/user', verifyToken, async (req, res) => {
  const { roll } = req;

  try {
    let user = await Online26.findOne({ rollNumber: roll }).lean();
    let type = user ? 'online' : null;

    if (!user) {
      user = await Offline26.findOne({ rollNumber: roll }).lean();
      if (user) type = 'offline';
    }

    if (!user) {
      user = await cosStudent.findOne({ rollNumber: roll }).lean();
      if (user) type = 'cos';
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let centreInfo = null;
    
    // Safely check centreId (prevents crash if it's a Number)
    const safeCentreId = user.centreId ? String(user.centreId).trim() : '';
    const hasValidCentreId = safeCentreId !== '' && safeCentreId !== 'NA' && safeCentreId !== 'null';

    if (hasValidCentreId) {
      centreInfo = await CentreInformation.findOne({ centreId: user.centreId }).lean();
      
      if (centreInfo) {
        // 👉 THE FIX: Catch alternative schema spellings and map them to 'centreName'
        centreInfo.centreName = centreInfo.centreName || centreInfo.centerName || centreInfo.name || 'Centre Name Missing in DB';
        // (Optional) Do the same for address if needed
        centreInfo.centreAddress = centreInfo.centreAddress || centreInfo.centerAddress || '';
      } else {
        centreInfo = { centreName: 'Centre details unavailable' };
      }
    } else {
      centreInfo = {
        centreName: type === 'cos' 
          ? (user.school1 || 'Your Institution through which you registered.')
          : 'To be announced'
      };
    }

    return res.json({ user, type, centreInfo });
    
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ status: true });
});




// router.post('/change-password', verifyToken, async (req, res) => {
//   const { oldPassword, newPassword } = req.body;
//   const { roll } = req;

//   try {
//     let user = await Online25.findOne({ rollNumber: roll });

//     if (!user) {
//       user = await Offline25.findOne({ rollNumber: roll });
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Ensure the new password is unique
//     if (oldPassword === newPassword) {
//       return res.status(400).json({ message: "New password must be different from the old password" });
//     }

//     // Direct comparison for both models
//     if (oldPassword !== user.password) {
//       return res.status(401).json({ message: "Incorrect old password" });
//     }
//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({ message: "Password changed successfully" });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post('/update-details', verifyToken, async (req, res) => {
  const { email1, contact1, email2, contact2 } = req.body;
  const { roll } = req;

  try {
    let user = await cosStudent.findOne({ rollNumber: roll });
    // if (!user) {
    //   user = await Offline25.findOne({ rollNumber: roll });
    // }

    // if (!user) {
    //   user = await Teams.findOne({ roll });
    // }
    if (!user) {
      user = await Online26.findOne({ rollNumber: roll });
    }
    if (!user) {
      user = await Offline26.findOne({ rollNumber: roll });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email1 = email1;
    user.contact1 = contact1;
    user.email2 = email2;
    user.contact2 = contact2;

    await user.save();

    res.status(200).json({ message: "Details updated successfully" });
  } catch (error) {
    console.error('Error updating details:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/results', async (req, res) => {
  const roll = req.query.rollNumber;
  console.log('Searching for rollNumber:', roll);

  if (!roll) {
    return res.status(400).json({ message: 'rollNumber is required' });
  }

  try {
    // First try to find in Offline25 database
    let user = await Offline26.findOne({ rollNumber: roll });
    console.log('Offline25 search result:', user ? 'Found' : 'Not found');

    // If not found in Offline25, try Online25 database
    if (!user) {
      user = await Offline26.findOne({ rollNumber: roll });
      console.log('Offline26 search result:', user ? 'Found' : 'Not found');
    }
    if (!user) {
      user = await Online26.findOne({ rollNumber: roll });
      console.log('Online26 search result:', user ? 'Found' : 'Not found');
    }
    if (!user) {
      user = await cosStudent.findOne({ rollNumber: roll });
      console.log('cosStudent search result:', user ? 'Found' : 'Not found');
    }
    if (user) {
      console.log('User found with Rank:', user.Rank);
      console.log('Full user object:', JSON.stringify(user, null, 2));
      res.status(200).json({ user: user });
    } else {
      console.log('No user found for rollNumber:', roll);
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error in /results route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Debug route to check if any users have ranks
router.get('/debug-ranks', async (req, res) => {
  try {
    const offlineUsersWithRanks = await Offline25.find({ Rank: { $exists: true, $ne: null } }).limit(5);
    const onlineUsersWithRanks = await Online25.find({ Rank: { $exists: true, $ne: null } }).limit(5);

    res.json({
      offlineUsersWithRanks: offlineUsersWithRanks.length,
      onlineUsersWithRanks: onlineUsersWithRanks.length,
      sampleOffline: offlineUsersWithRanks,
      sampleOnline: onlineUsersWithRanks
    });
  } catch (err) {
    console.error('Error in debug-ranks route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route to set a rank for a specific roll number (Protected by Shared Secret)
router.post('/set-test-rank', isAdmin, async (req, res) => {
  try {
    const { rollNumber, rank } = req.body;

    if (!rollNumber || !rank) {
      return res.status(400).json({ message: 'rollNumber and rank are required' });
    }

    // Try to update in Offline25 first
    let user = await Offline25.findOneAndUpdate(
      { rollNumber: rollNumber },
      { Rank: rank },
      { new: true }
    );

    // If not found in Offline25, try Online25
    if (!user) {
      user = await Online25.findOneAndUpdate(
        { rollNumber: rollNumber },
        { Rank: rank },
        { new: true }
      );
    }

    if (user) {
      res.json({ message: 'Rank updated successfully', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error setting test rank:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get results table data
// router.get('/results-table', async (req, res) => {
//   try {
//     // Get Top 25 Juniors (squad: 'Juniors')
//     const top25Juniors = await Offline26.find({
//       squad: 'Juniors',
//       Rank: { $exists: true, $ne: null}
//     })
//       .sort({ Rank: 1 })
//       .limit(25)
//       .select('name1 name2 rollNumber Rank city squad')
//       .lean();

//     // Get Top 25 Hauts (squad: 'Hauts')
//     const top25Hauts = await Offline26.find({
//       squad: 'Hauts',
//       Rank: { $exists: true, $ne: null }
//     })
//       .sort({ Rank: 1 })
//       .limit(25)
//       .select('name1 name2 rollNumber Rank city squad')
//       .lean();

//     // Also check online registrations for both squads
//     const onlineTop25Juniors = await Online26.find({
//       squad: 'Juniors',
//       Rank: { $exists: true, $ne: null }
//     })
//       .sort({ Rank: 1 })
//       .limit(25)
//       .select('name1 name2 rollNumber Rank city squad')
//       .lean();

//     const onlineTop25Hauts = await Online26.find({
//       squad: 'Hauts',
//       Rank: { $exists: true, $ne: null }
//     })
//       .sort({ Rank: 1 })
//       .limit(25)
//       .select('name1 name2 rollNumber Rank city squad')
//       .lean();
//       const cosTop25Juniors = await cosStudent.find({
//       squad: 'Juniors',
//       Rank: { $exists: true, $ne: null }
//     })
//       .sort({ Rank: 1 })
//       .limit(25)
//       .select('name1 name2 rollNumber Rank city squad')
//       .lean();

//     const cosTop25Hauts = await cosStudent.find({
//       squad: 'Hauts',
//       Rank: { $exists: true, $ne: null }
//     })
//       .sort({ Rank: 1 })
//       .limit(25)
//       .select('name1 name2 rollNumber Rank city squad')
//       .lean();

//     // Combine offline and online results and get top 25 for each squad
//     const allJuniors = [...top25Juniors, ...onlineTop25Juniors, ...cosTop25Juniors]
//       .sort((a, b) => parseInt(a.Rank) - parseInt(b.Rank))
//       .slice(0, 25);

//     const allHauts = [...top25Hauts, ...onlineTop25Hauts,...cosTop25Hauts]
//       .sort((a, b) => parseInt(a.Rank) - parseInt(b.Rank))
//       .slice(0, 25);

//     // Get City Toppers for Juniors (top rank from each city)
//     const cityToppersJuniors = await Offline26.aggregate([
//       {
//         $match: {
//           squad: 'Juniors',
//           Rank: { $exists: true, $ne: null }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       {
//         $group: {
//           _id: '$state',
//           name1: { $first: '$name1' },
//           name2: { $first: '$name2' },
//           rollNumber: { $first: '$rollNumber' },
//           Rank: { $first: '$Rank' },
//           city: { $first: '$state' }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       { $limit: 50 }
//     ]);

//     // Get City Toppers for Hauts (top rank from each city)
//     const cityToppersHauts = await Offline26.aggregate([
//       {
//         $match: {
//           squad: 'Hauts',
//           Rank: { $exists: true, $ne: null}
//         }
//       },
//       { $sort: { Rank: 1 } },
//       {
//         $group: {
//           _id: '$state',
//           name1: { $first: '$name1' },
//           name2: { $first: '$name2' },
//           rollNumber: { $first: '$rollNumber' },
//           Rank: { $first: '$Rank' },
//           city: { $first: '$state' }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       { $limit: 50 }
//     ]);

//     // Also get city toppers from online registrations
//     const onlineCityToppersJuniors = await Online26.aggregate([
//       {
//         $match: {
//           squad: 'Juniors',
//           Rank: { $exists: true, $ne: null }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       {
//         $group: {
//           _id: '$state',
//           name1: { $first: '$name1' },
//           name2: { $first: '$name2' },
//           rollNumber: { $first: '$rollNumber' },
//           Rank: { $first: '$Rank' },
//           city: { $first: '$state' }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       { $limit: 50 }
//     ]);

//     const onlineCityToppersHauts = await Online26.aggregate([
//       {
//         $match: {
//           squad: 'Hauts',
//           Rank: { $exists: true, $ne: null }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       {
//         $group: {
//           _id: '$state',
//           name1: { $first: '$name1' },
//           name2: { $first: '$name2' },
//           rollNumber: { $first: '$rollNumber' },
//           Rank: { $first: '$Rank' },
//           city: { $first: '$state' }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       { $limit: 50 }
//     ]);

//     const cosCityToppersJuniors = await cosStudent.aggregate([
//       {
//         $match: {
//           squad: 'Juniors',
//           Rank: { $exists: true, $ne: null}
//         }
//       },
//       { $sort: { Rank: 1 } },
//       {
//         $group: {
//           _id: '$state',
//           name1: { $first: '$name1' },
//           name2: { $first: '$name2' },
//           rollNumber: { $first: '$rollNumber' },
//           Rank: { $first: '$Rank' },
//           city: { $first: '$state' }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       { $limit: 50 }
//     ]);

//     const cosCityToppersHauts = await cosStudent.aggregate([
//       {
//         $match: {
//           squad: 'Hauts',
//           Rank: { $exists: true, $ne: null }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       {
//         $group: {
//           _id: '$state',
//           name1: { $first: '$name1' },
//           name2: { $first: '$name2' },
//           rollNumber: { $first: '$rollNumber' },
//           Rank: { $first: '$Rank' },
//           city: { $first: '$state' }
//         }
//       },
//       { $sort: { Rank: 1 } },
//       { $limit: 50 }
//     ]);

//     // Combine offline and online city toppers and get the best from each city
//     const allCityToppersJuniors = [...cityToppersJuniors, ...onlineCityToppersJuniors,...cosCityToppersJuniors]
//       .sort((a, b) => parseInt(a.Rank) - parseInt(b.Rank))
//       .filter((item, index, self) =>
//         index === self.findIndex(t => t.city === item.city)
//       )
//       .slice(0, 50);

//     const allCityToppersHauts = [...cityToppersHauts, ...onlineCityToppersHauts,...cosCityToppersHauts]
//       .sort((a, b) => parseInt(a.Rank) - parseInt(b.Rank))
//       .filter((item, index, self) =>
//         index === self.findIndex(t => t.city === item.city)
//       )
//       .slice(0, 50);

//     res.json({
//       success: true,
//       top25Juniors: allJuniors,
//       top25Hauts: allHauts,
//       cityToppersJuniors: allCityToppersJuniors,
//       cityToppersHauts: allCityToppersHauts
//     });

//   } catch (err) {
//     console.error('Error fetching results table:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: err.message
//     });
//   }
// });
router.get('/results-table', async (req, res) => {
  try {
    // ---------- GLOBAL TOP 25 (UNIQUE AIR RANKS ACROSS ALL COLLECTIONS) ----------

const top25Pipeline = (squad) => [
  {
    $match: {
      squad,
      Rank: { $exists: true, $ne: null }
    }
  },
  {
    $project: {
      name1: 1,
      name2: 1,
      rollNumber: 1,
      Rank: 1,
      state: 1,
      squad: 1
    }
  },

  // Merge online26
  {
    $unionWith: {
      coll: 'online26',
      pipeline: [
        {
          $match: {
            squad,
            Rank: { $exists: true, $ne: null }
          }
        },
        {
          $project: {
            name1: 1,
            name2: 1,
            rollNumber: 1,
            Rank: 1,
            state: 1,
            squad: 1
          }
        }
      ]
    }
  },

  // Merge cos_students
  {
    $unionWith: {
      coll: 'cos_students',
      pipeline: [
        {
          $match: {
            squad,
            Rank: { $exists: true, $ne: null }
          }
        },
        {
          $project: {
            name1: 1,
            name2: 1,
            rollNumber: 1,
            Rank: 1,
            state: 1,
            squad: 1
          }
        }
      ]
    }
  },

  // Sort globally by AIR
  { $sort: { Rank: 1 } },

  // Keep only one record per AIR
  {
    $group: {
      _id: '$Rank',
      name1: { $first: '$name1' },
      name2: { $first: '$name2' },
      rollNumber: { $first: '$rollNumber' },
      Rank: { $first: '$Rank' },
      state: { $first: '$state' },
      squad: { $first: '$squad' }
    }
  },

  { $sort: { Rank: 1 } },
  { $limit: 25 }
];

const [allJuniors, allHauts] = await Promise.all([
  Offline26.aggregate(top25Pipeline('Juniors')),
  Offline26.aggregate(top25Pipeline('Hauts'))
]);

console.log('Junior AIRs:', allJuniors.map(x => x.Rank));
console.log('Hauts AIRs:', allHauts.map(x => x.Rank));
    // ---------- STATE TOPPERS PIPELINE ----------

    const statePipeline = (squad) => [
      {
        $match: {
          squad,
          state: { $exists: true, $ne: null, $ne: '' },
          Rank: { $exists: true, $ne: null }
        }
      },
      { $sort: { Rank: 1 } },
      {
        $group: {
          _id: '$state',
          name1: { $first: '$name1' },
          name2: { $first: '$name2' },
          rollNumber: { $first: '$rollNumber' },
          Rank: { $first: '$Rank' },
          state: { $first: '$state' }
        }
      },
      { $sort: { Rank: 1 } }
    ];

    const [
      offlineStateJuniors,
      offlineStateHauts,
      onlineStateJuniors,
      onlineStateHauts,
      cosStateJuniors,
      cosStateHauts
    ] = await Promise.all([
      Offline26.aggregate(statePipeline('Juniors')),
      Offline26.aggregate(statePipeline('Hauts')),
      Online26.aggregate(statePipeline('Juniors')),
      Online26.aggregate(statePipeline('Hauts')),
      cosStudent.aggregate(statePipeline('Juniors')),
      cosStudent.aggregate(statePipeline('Hauts'))
    ]);

    // ---------- COMBINE STATE TOPPERS ----------

    const allStateToppersJuniors = [
      ...offlineStateJuniors,
      ...onlineStateJuniors,
      ...cosStateJuniors
    ]
      .sort((a, b) => a.Rank - b.Rank)
      .filter((item, index, self) => {
        const current = item.state?.trim().toLowerCase();
        return (
          index ===
          self.findIndex(
            t => t.state?.trim().toLowerCase() === current
          )
        );
      })
      .slice(0, 28);

    const allStateToppersHauts = [
      ...offlineStateHauts,
      ...onlineStateHauts,
      ...cosStateHauts
    ]
      .sort((a, b) => a.Rank - b.Rank)
      .filter((item, index, self) => {
        const current = item.state?.trim().toLowerCase();
        return (
          index ===
          self.findIndex(
            t => t.state?.trim().toLowerCase() === current
          )
        );
      })
      .slice(0, 28);

    // ---------- RESPONSE ----------

    return res.json({
      success: true,
      top25Juniors: allJuniors,
      top25Hauts: allHauts,
      stateToppersJuniors: allStateToppersJuniors,
      stateToppersHauts: allStateToppersHauts
    });

  } catch (err) {
    console.error('Error fetching results table:', err);

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});
const XLSX = require('xlsx'); 
const getZone = require('../utils/getZone');

// 🚀 Upload CSV and process data (Protected by Shared Secret)
router.post('/uploadcsv', isAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let jsonArray;

    // Parse file based on extension
    if (req.file.originalname.endsWith('.xlsx')) {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonArray = XLSX.utils.sheet_to_json(worksheet);
    } else {
      jsonArray = await csv().fromFile(req.file.path);
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Validate columns
    const fileColumns = Object.keys(jsonArray[0] || {});
    const missingColumns = EXPECTED_COLUMNS.filter(col => !fileColumns.includes(col));
    const extraColumns = fileColumns.filter(col => !EXPECTED_COLUMNS.includes(col));

    if (missingColumns.length > 0 || extraColumns.length > 0) {
      return res.status(400).json({
        error: 'Column validation failed',
        details: {
          missingColumns: missingColumns.length > 0 ? { missing: missingColumns } : null,
          incorrectColumns: extraColumns.length > 0 ? {
            incorrect: extraColumns.map(col => ({
              found: col,
              shouldBe: null
            }))
          } : null
        }
      });
    }

    // Check only first entry for duplicate
    const firstEntry = jsonArray[0];
    const existingEntry = await Offline25.findOne({ name1: firstEntry.name1 });

    if (existingEntry) {
      return res.status(400).json({
        error: 'Duplicate entry found',
        message: `An entry with name1: "${firstEntry.name1}" already exists in the database.`
      });
    }

    // If no duplicate found, process all entries including the first one
    const uniqueEntries = [...new Set(jsonArray.map(JSON.stringify))].map(JSON.parse);
    const batchId = uuidv4();
    let processedData = [];

    // Process all entries
    for (let entry of uniqueEntries) {
      const { squad, language, city, state, email1, email2, centre } = entry;

      // 1) Get cityID
      const cityID = cityToID[city] || getCityID(city);

      // 2) Increment city student count
      const cityInfo = await CityStudentCount.findOneAndUpdate(
        { cityID },
        { $set: { city }, $inc: { studentCount: 1 } },
        { new: true, upsert: true }
      );
 
      // 3) Generate rollNumber & password
      const rollNumber = generateRollNumber(squad, language, city, cityInfo.studentCount);
      const password = uuidv4();

      // 4) Send emails without stopping on failure
      let mail_sent = 'No';
      try {
        const emailPromises = [];
        if (email1) {
          emailPromises.push(sendEmail(email1, rollNumber, password));
          console.log("hi");
        }
        if (email2) {
          emailPromises.push(sendEmail(email2, rollNumber, password));
          console.log("hi");

        }

        // Send emails concurrently and wait for all to complete
        const results = await Promise.allSettled(emailPromises);
        const anySuccess = results.some(r => r.status === 'fulfilled' && r.value === true);
        mail_sent = anySuccess ? 'Yes' : 'No';
      } catch (err) {
        console.error(`Email process error for ${rollNumber}:`, err);
        // Continue processing even if emails fail
      }

      // 5) Construct doc for DB
      const doc = {
        ...entry,

        rollNumber,
        password,
        mail_sent,
        view: 'school',
        mode: 'offline',
        center: centre,
        isPaid: true,
        batchId,
      };

      // 6) Insert in DB
      await Offline25.create(doc);
      processedData.push(doc);
    }

    return res.json({
      message: 'Data processed successfully',
      data: processedData,
      batchId
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});


function generateRollNumber(squad, language, city, studentcount) {
  const medium = language === 'English' ? 'E' : 'H';
  const squadCode = squad === 'Hauts' ? 'HE' : 'JR';
  const mode = 'F';
  const year = '25';

  // ✅ Correctly call getCityID(city) as a function
  const cityID = getCityID(city);

  // ✅ Zero-pad the cityID to 3 digits
  const paddedCityID = String(cityID).padStart(3, '0');

  // Zero-pad studentCount to 5 digits
  const paddedStudentCount = String(studentcount).padStart(5, '0');

  // Example: "HE25FE04500032"
  return `${squadCode}${year}${mode}${medium}${paddedCityID}${paddedStudentCount}`;
}



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  },
});




router.get("/downloadcsv", async (req, res) => {
  try {
    const { batchId } = req.query;
    if (!batchId) {
      return res.status(400).json({ error: "batchId is required" });
    }

    // Fetch teams with batchId
    const teams = await Offline25.find(
      { batchId },
      "-_id name1 email1 contact1 school1 name2 email2 contact2 school2 squad language city state rollNumber password"
    );

    if (!teams.length) {
      return res.status(404).json({ error: "No data available for this batchId" });
    }

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Determine filename format: school1(city).xlsx
    const schoolName = teams[0].school1 ? teams[0].school1.replace(/\s+/g, "_") : "Unknown_School";
    const cityZone = teams[0].city ? teams[0].city.replace(/\s+/g, "_") : "Unknown_City";
    const filename = `${schoolName}(${cityZone}).xlsx`;

    // Convert data to Excel
    const excelData = teams.map((team) => ({
      name1: team.name1,
      email1: team.email1,
      contact1: team.contact1,
      school1: team.school1 || "Unknown School",
      name2: team.name2,
      email2: team.email2,
      contact2: team.contact2,
      school2: team.school2 || "Unknown School",
      squad: team.squad,
      language: team.language,
      city: team.city,
      state: team.state,
      rollNumber: team.rollNumber,
      password: team.password,
      centre: team.centre
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teams");

    // Save file in temp folder
    const filePath = path.join(tempDir, filename);

    XLSX.writeFile(wb, filePath);

    // Get cityrep details
    const token = req.cookies.token;
    let cityrepDetails = { name: "Unknown", zone: "Unknown", city: "Unknown" };

    try {
      // Get the city from the teams data
      const teamCity = teams[0].city;

      // Find cityrep by matching city
      const cityrep = await CityRep_portal.findOne({
        city: teamCity
      }).select("name zone city");

      if (cityrep) {
        cityrepDetails = {
          name: cityrep.name || "Unknown",
          zone: cityrep.zone || "Unknown",
          city: cityrep.city || "Unknown"
        };
      } else {
        console.log(`No cityrep found for city: ${teamCity}`);
      }
    } catch (err) {
      console.error("Error fetching cityrep details:", err);
    }

    const mailOptions = {
      from: "technothlon.iitg@gmail.com",
      to: ["shubhamkumar99399006@gmail.com", "heads.techno@gmail.com"],
      subject: `Generated Roll Numbers - ${filename}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2c5282;">New Roll Numbers Generated</h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 8px;">
            <h3 style="color: #2d3748;">City Representative Details:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Name:</strong> ${cityrepDetails.name}</li>
              <li><strong>Zone:</strong> ${cityrepDetails.zone}</li>
              <li><strong>City:</strong> ${cityrepDetails.city}</li>
            </ul>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #f7fafc; border-radius: 8px;">
            <h3 style="color: #2d3748;">School Details:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>School Name:</strong> ${teams[0].school1 || "Unknown School"}</li>
              <li><strong>City:</strong> ${teams[0].city}</li>
              <li><strong>State:</strong> ${teams[0].state}</li>
                            <li><strong>Total Registration Count:</strong> ${teams.length}</li>
            </ul>
          </div>


          <p>Please find the attached roll number Excel file.</p>
          <p>Best regards,<br>Technothlon Team</p>
        </div>
      `,
      attachments: [
        {
          filename: filename,
          path: filePath,
          contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    // ✅ Send JSON response with file details
    res.json({
      schoolName: teams[0].school1 || "Unknown School",
      fileName: filename,
      fileUrl: `uploadcsv/downloadcsv/file/${filename}`, // Separate route for file download
    });

  } catch (error) {
    console.error("❌ Error generating Excel file:", error);
    return res.status(500).json({ error: "Failed to generate Excel file" });
  }
});

// ✅ Separate route to handle file download
router.get("/downloadcsv/file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../../temp", filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("❌ Error sending file:", err);
        res.status(500).json({ error: "Failed to download file" });
      } else {
        fs.unlinkSync(filePath); // ✅ Delete file after download
      }
    });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});



// Add this helper function to add delay between operations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simplify the sendEmail function - remove retry logic
async function sendEmail(email, roll, password) {
  try {
    await transporter.sendMail({
      from: 'Technothlon <technothlon.iitg@gmail.com>',
      to: email,
      subject: 'Technothlon 2025 Registration',
      html: `<p>Hey champs!</p>
      <p>Greetings from Technothlon!</p>
  <p>We're excited to inform you that your details have been updated. Below are your credentials to access the Technothlon portal:</p>
  <ul>
    <li><strong>Roll Number:</strong> ${roll}</li>
    <li><strong>Password:</strong> ${password}</li>
  </ul>
  <p>For security reasons, we strongly recommend changing your password upon first login. The preliminary round is scheduled for July 13th, 2025. Admit cards will be available shortly before the event.</p>
  <p>Should you have any questions or encounter any issues, please don't hesitate to reach out to us. We're here to help!</p>
                    <p>For receiving   further communications and updates, please join/follow:</p>
  
              <ul>
                    <li><a href="https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S">Whatsapp</a></li>
                    <li><a href="https://www.instagram.com/technothlon.iitg?igsh=MWU1NmU3ZG8zcnFpbg==">Instagram</a></li>                    <li><a href="http://technothlon.techniche.org.in">Website</a></li>
              </ul>
  <p>Best regards,<br>Technothlon IITG</p>`
    });
    return true;
  } catch (error) {
    console.error(`Email send failed for ${email}:`, error);
    return false;
  }
}
const mongoose = require('mongoose');
const { Long } = require('mongodb');

router.post('/fetch-data', async (req, res) => {
  try {
    const { criteria } = req.body;

    if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Search criteria is required'
      });
    }

    // Helper function to convert contact numbers to MongoDB Long
    const convertToLong = (value) => {
      const cleanValue = value.toString().replace(/\D/g, '');
      return Long.fromString(cleanValue);
    };

    // Build query with proper Long conversion for contact fields
    const buildQuery = (criteria, isOnlineDb = false) => {
      const query = {};

      criteria.forEach(({ column, value }) => {
        if (column && value) {
          if ((column === 'contact1' || column === 'contact2') && isOnlineDb) {
            // Convert to MongoDB Long for online database
            try {
              query[column] = convertToLong(value);
            } catch (error) {
              console.error(`Error converting ${value} to Long:`, error);
              // Fallback to original value
              query[column] = value;
            }
          } else {
            query[column] = value;
          }
        }
      });

      return query;
    };

    // Build separate queries for each database
    const offlineQuery = buildQuery(criteria, false);
    const onlineQuery = buildQuery(criteria, true);

    console.log('Offline Query:', JSON.stringify(offlineQuery, null, 2));
    console.log('Online Query:', JSON.stringify(onlineQuery, null, 2));

    // Alternative: Use aggregation pipeline for more flexible matching
    const onlineAggregation = [
      {
        $addFields: {
          contact1_str: { $toString: "$contact1" },
          contact2_str: { $toString: "$contact2" }
        }
      }
    ];

    // Add match stage based on criteria
    const matchConditions = {};
    criteria.forEach(({ column, value }) => {
      if (column && value) {
        if (column === 'contact1' || column === 'contact2') {
          const cleanValue = value.toString().replace(/\D/g, '');
          matchConditions[`${column}_str`] = cleanValue;
        } else {
          matchConditions[column] = value;
        }
      }
    });

    if (Object.keys(matchConditions).length > 0) {
      onlineAggregation.push({ $match: matchConditions });
    }

    // Fetch matching documents
    const [offlineDocuments, onlineDocuments] = await Promise.all([
      Offline25.find(offlineQuery).lean(),
      Object.keys(matchConditions).some(key => key.includes('contact'))
        ? Online25.aggregate(onlineAggregation)
        : Online25.find(onlineQuery).lean()
    ]);

    console.log(`Found ${offlineDocuments.length} offline documents`);
    console.log(`Found ${onlineDocuments.length} online documents`);

    // Combine results
    const documents = [...offlineDocuments, ...onlineDocuments];

    if (documents.length === 0) {
      return res.status(404).json({
        error: 'No records found',
        message: 'No records found matching your criteria',
        debug: {
          offlineQuery: JSON.stringify(offlineQuery),
          onlineQuery: JSON.stringify(onlineQuery),
          onlineAggregation: JSON.stringify(onlineAggregation)
        }
      });
    }

    // Add source field and normalize contact fields
    const documentsWithSource = documents.map(doc => ({
      ...doc,
      source: doc.mode === 'offline' ? 'Offline Registration' : 'Online Registration',
      contact1: doc.contact1 ? (typeof doc.contact1 === 'object' ? doc.contact1.toString() : doc.contact1) : '',
      contact2: doc.contact2 ? (typeof doc.contact2 === 'object' ? doc.contact2.toString() : doc.contact2) : ''
    }));

    // Prepare CSV fields
    const fields = [
      'name1', 'email1', 'contact1', 'school1','dob1','class1',
      'name2', 'email2', 'contact2', 'school2','dob2','class2',
      'squad', 'language', 'city', 'state',
      'rollNumber', 'password', 'createdAt', 'source'
    ];

    // Create CSV parser
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(documentsWithSource);

    // Generate filename using criteria
    const searchTerms = criteria
      .filter(c => c.column && c.value)
      .map(c => `${c.column}-${c.value}`)
      .join('_');
    const filename = `search-${searchTerms}-${Date.now()}.csv`;

    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, csv);

    // Send response
    res.json({
      message: 'Data fetched successfully',
      count: documents.length,
      fileName: filename,
      fileUrl: `uploadcsv/download-fetch/${filename}`,
      summary: {
        total: documents.length,
        offline: offlineDocuments.length,
        online: onlineDocuments.length
      }
    });

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});
// Add download route for fetched files
router.get('/download-fetch/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../../temp', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download file' });
      } else {
        fs.unlinkSync(filePath); // Delete file after download
      }
    });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

//Route for resending mails 
// router.post("/match", async (req, res) => {
//   try {
//     const inputJson = req.body;

//     if (!Array.isArray(inputJson)) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body must be an array of JSON objects",
//       });
//     }

//     const output = [];

//     for (const row of inputJson) {
//       const phone = String(row["Phone Number"] || "").trim();
//       const city = String(row["City"] || "").trim();

//       let matchedRecord = null;
//       let recordName = "";
//       let recordEmail = "";

//       if (phone && city) {
//         matchedRecord = await Offline26.findOne({
//           city: new RegExp(`^${city}$`, "i"),
//           $or: [
//             { contact1: phone },
//             { contact2: phone },
//           ],
//         });

//         // identify whether matched with contact1 or contact2
//         if (matchedRecord) {
//           if (matchedRecord.contact1 === phone) {
//             recordName = matchedRecord.name1 || "";
//             recordEmail = matchedRecord.email1 || "";
//           } else if (matchedRecord.contact2 === phone) {
//             recordName = matchedRecord.name2 || "";
//             recordEmail = matchedRecord.email2 || "";
//           }
//         }
//       }

//       output.push({
//         ...row,

//         rollNumber: matchedRecord?.rollNumber || "",
//         password: matchedRecord?.password || "",

//         Record_Name: recordName,
//         Record_Email: recordEmail,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       count: output.length,
//       data: output,
//     });

//   } catch (error) {
//     console.error("Error matching records:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// });

//Credential Finder
// router.post("/finder", async (req, res) => {

//     try {

//         const data = req.body;

//         // Validate input
//         if (!Array.isArray(data)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Input must be an array of JSON objects"
//             });
//         }

//         const updatedData = [];

//         // =====================================
//         // PROCESS EACH RECORD
//         // =====================================

//         for (let i = 0; i < data.length; i++) {

//             const item = data[i];

//             // Find matching record
//             const student = await Offline26.findOne({
//                 rollNumber: item.rollNumber
//             });

//             updatedData.push({
//                 "Sr_no.": i + 1,
//                 ...item,
//                 password: student?.password || ""
//             });

//             console.log(
//                 `Row ${i + 1} -> ${item.rollNumber} -> ${
//                     student?.password || "NOT FOUND"
//                 }`
//             );
//         }

//         // =====================================
//         // RESPONSE
//         // =====================================

//         return res.status(200).json({
//             success: true,
//             total: updatedData.length,
//             data: updatedData
//         });

//     } catch (error) {

//         console.error(error);

//         return res.status(500).json({
//             success: false,
//             message: "Server Error",
//             error: error.message
//         });
//     }
// });



module.exports = router;