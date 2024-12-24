const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const cors = require('cors');
const UploadOffTeam = require('../models/offTeaminfo');
const { v4: uuidv4 } = require('uuid'); 
const bcrypt = require('bcrypt'); 
const cityToID = require('../utils/cityToID.json');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const pdf = require('html-pdf');
const fs = require('fs');
const csvParser = require('csv-parser');
const results =require('../models/result.js');
const pdfLib = require('pdf-lib');
const bodyParser = require('body-parser');
const pdfTemplate = require('./document.js');
const path = require('path');
const Teams = require('../models/teamModel.js');
const Onlinereg =require("../models/onlineReg.js")

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });
router.post('/login', async (req, res) => {
  const { roll, password } = req.body;
  
  try {
      let user = null;

     
      user = await UploadOffTeam.findOne({ roll });
  
      if (!user) {
        user = await Teams.findOne({ rollNumber: roll });    
      }
      if (!user) {
        user = await Onlinereg.findOne({ rollNumber: roll });    
      }
      

      if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      const User = (user.roll || user.rollNumber);

      if(user.password !== password) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ roll: User, source: user.source || 'Onlinereg' }, process.env.KEY, { expiresIn: '7h' });
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
  let user =null;
  user= await Onlinereg.findOne({ rollNumber: roll });

  if (!user) {
    user = await Teams.findOne({ roll });
  }

  if (!user) {
    user = await UploadOffTeam.findOne({ roll });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
} catch (err) {
  console.error("Error fetching user:", err);
  return res.status(500).json({ message: "Internal server error" });
}
});

router.get('/logout', (req, res) => {
res.clearCookie('token');
return res.json({ status: true });
});




router.post('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { roll } = req;

  try {
    let user = await Onlinereg.findOne({ rollNumber: roll });

    if (!user) {
      user = await Teams.findOne({ roll });
    }
    if (!user) {
      user = await UploadOffTeam.findOne({ roll });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the new password is unique
    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from the old password" });
    }

    // Direct comparison for both models
    if (oldPassword !== user.password) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/update-details', verifyToken, async (req, res) => {
const { email1, contact1, email2, contact2 } = req.body;
const { roll } = req;

try {
  let user = await Onlinereg.findOne({ rollNumber: roll });

  if (!user) {
    user = await Teams.findOne({ roll });
  }
  if (!user) {
    user = await UploadOffTeam.findOne({ roll });
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
  const roll = req.query.Roll;
  console.log(roll);
  try {
    const result = await results.findOne({ Roll: roll });
    if (result) {
      res.status(200).json({ user: result });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.route("/uploadcsv").post(upload.single("file"), async (req, res) => {
  try {
    const jsonArray = await csv().fromFile(req.file.path);
    const { school, studentcount } = req.body;
    console.log(school);
    const dataWithCredentials = await Promise.all(jsonArray.map(async (entry, index) => {
      const { squad, language, city} = entry; // Extract squad, language, cityid, and studentcount from the entry
      
      if (index < studentcount) {
        const roll = generateRollNumber(squad, language, city, index);
        const password = generatePassword();

        // Send email to email1 and email2
        await new Promise(resolve => setTimeout(resolve, 1000 * index)); // One-second delay
        await Promise.all([
          sendEmail(entry.email1,entry.name1,entry.name2, roll, password),
          sendEmail(entry.email2,entry.name1,entry.name2, roll, password)
        ]);
        
        

     
    const uploadOffTeamEntry = {
      roll,
      password,
      school,
      ...entry // Assuming entry contains necessary fields
  };

  // Create entry for Onlinereg if necessary
  const teamEntry = {
      rollNumber: roll,
      password,
      school1,
      ...entry // Assuming entry contains necessary fields and structure
  };

  return { uploadOffTeamEntry, teamEntry }; // Return both entries
} else {
  return null;
}
})).then(results => results.filter(Boolean)); // Filter out null entries

    
    const result = await UploadOffTeam.insertMany(dataWithCredentials);
    const teamResults = await Onlinereg.insertMany(dataWithCredentials.map(item => item.teamEntry));


    res.json("Added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json("Error inserting data to MongoDb " + error);
  }
});

let studentCount=1;
function generateRollNumber(squad, language, city, studentcount) {
    const medium = (language === "EN") ? "0" : "1";
    const squadCode = (squad === "HE") ? "HE" : "JR";
    const mode = "F";
    const year="25";
    const cityID = cityToID[city];
    const paddedStudentCount = String(studentCount +1000).padStart(5, '0');
    const paddedCityID = String(cityID).padStart(3, '0');
    

    // studentCount++;
    studentcount++;
    const rollNumber = `${squadCode}${year}${mode}${medium}${paddedCityID}${paddedStudentCount}`;
    return rollNumber;
}

function generatePassword() {
    return uuidv4();
}

router.route("/upload-final").post(upload.single("file"), async (req, res) => {
  if (!req.file) {
      return res.status(400).json("No file uploaded");
  }

  const rollnumbers = [];
  const filePath = req.file.path;

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
      return res.status(400).json("File not found");
  }

  fs.createReadStream(filePath)
  .on('error', (error) => {
      res.status(500).json("Error reading file " + error);
  })
  .pipe(csvParser())
  .on('data', (data) => {
      if (data.roll) {
          rollnumbers.push(data.roll);
      }
  })
  .on('end', async () => {
      if (rollnumbers.length === 0) {
          return res.status(400).json("No valid roll numbers found in the uploaded file");
      }
      try {
          // await Onlinereg.updateMany(
          //     { rollNumber: { $in: rollnumbers } },
          //     { $set: { isPaid: true, isVerified: true } }
          // );
          const result = await Onlinereg.updateMany(
            { rollNumber: { $in: rollnumbers } },
            { $set: { isPaid: true, isVerified: true } }
          );
          console.log(result);

          // Fetch the updated team details
          const Onlinereg = await Onlinereg.find({ rollNumber: { $in: rollnumbers } });

          // Create the email transporter
          const transporter = nodemailer.createTransport({
              service: 'gmail',
              host: 'smtp.gmail.com',
              auth: {
                user: 'technothlon@technicheiitg.in',
                pass: 'fjowuvpqbbtjrvsa'
              },
          });

          for (const team of Onlinereg) {
              const mailOptions1 = {
                  from: '"Technothlon" <technothlon@technicheiitg.in>',
                  to: `${team.email1}`,
                  subject: 'Important update regarding Technothlon 2025',
                  html: `
                  <p>Hey champs!</p>
<p>Greetings from Technothlon!</p>
<p>We're excited to inform you that your details have been updated. Below are your credentials to access the Technothlon portal:</p>
<ul>
    <li><strong>Roll Number:</strong> ${team.rollNumber}</li>
    <li><strong>Password:</strong> ${team.password}</li>
</ul>
<p>For security reasons, we strongly recommend changing your password upon first login. The preliminary round is scheduled for July 14th, 2025. Admit cards will be available shortly before the event.</p>
<p>Should you have any questions or encounter any issues, please don't hesitate to reach out to us. We're here to help!</p>
<p>Best regards,<br>Technothlon IITG</p>
              `
              };

              await transporter.sendMail(mailOptions1);

              const mailOptions2 = {
                from: '"Technothlon" <technothlon@technicheiitg.in>',
                  to: `${team.email2}`,
                  subject: 'Important update regarding Technothlon 2025',
                  html: `
                  <p>Hey champs!</p>
<p>Greetings from Technothlon!</p>
<p>We're excited to inform you that your details have been updated. Below are your credentials to access the Technothlon portal:</p>
<ul>
    <li><strong>Roll Number:</strong> ${team.rollNumber}</li>
    <li><strong>Password:</strong> ${team.password}</li>
</ul>
<p>For security reasons, we strongly recommend changing your password upon first login. The preliminary round is scheduled for July 14th, 2025. Admit cards will be available shortly before the event.</p>
<p>Should you have any questions or encounter any issues, please don't hesitate to reach out to us. We're here to help!</p>
<p>Best regards,<br>Technothlon IITG</p>
              `
            };

            await transporter.sendMail(mailOptions2);
          }

          res.send("Updated successfully and emails sent");
      } catch (error) {
          res.status(500).json("Error inserting data to MongoDb or sending emails " + error);
      } finally {
          fs.unlinkSync(filePath);
      }
  });
});

async function sendEmail(email, name1, name2, roll, password) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'technothlon@technicheiitg.in',
                pass: 'fjowuvpqbbtjrvsa'
            },
        });

        await transporter.sendMail({
            from: '"Technothlon" <technothlon@technicheiitg.in>',
            to: email,
            subject: 'Updated Technothlon 2025 Roll Number and Password',
            html: `<p>Team Technothlon is delighted to inform you that you have successfully registered for Technothlon'25!</p>
                   <p>Please note your Roll No. and Password:</p>
                   <p>Participant 1: ${name1}</p>
                   <p>Participant 2: ${name2}</p>
                   <p><strong>Roll No.:</strong> ${roll}</p>
                   <p><strong>Password:</strong> ${password}</p>
                   <p>The date for prelims is 13th July 2025.</p>
                   <p>For receiving   further communications and updates, please join/follow:</p>
                   <ul>
                       <li><a href="https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S">Whatsapp</a></li>
                       <li><a href="https://www.instagram.com/technothlon.iitg?igsh=MWU1NmU3ZG8zcnFpbg==">Instagram</a></li>
                       <li><a href="http://technothlon.techniche.org.in">Website</a></li>
                   </ul>
                   <p>With regards,<br>Team Technothlon</p>`
        });

        console.log("Mail sent");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
module.exports = router;
