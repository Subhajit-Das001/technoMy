const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
// const TeamModel = require('../models/teamModel');

const Onlinereg =require('../models/onlineReg')

const cityToID = require('../utils/cityToID.json');
require('dotenv').config();

const CityStudentCount = require('../models/cityStudentCountModel')

const generateRollNumber = require('../utils/generateRollNumber');

const baseURL = process.env.NODE_ENV==="production"? "/api" : "http://localhost:3001/api";
const redirectUrl = process.env.NODE_ENV==="production"? "https://technothlon.techniche.org.in" : "http://localhost:3000";

const TeamController = {
    createTeam: async (req, res) => {
        try {
            const { email1, email2 } = req.body;
            const teamExists = await Onlinereg.findOne({ $or: [{ email1 }, { email2 }] });


            if (teamExists) {
                return res.status(400).json({ error: "One or the other members is already registered" });
            }

            const newTeam = new Onlinereg(req.body);

            const City=newTeam.city;
            const cityID = cityToID[City];
            const cityInfo = await CityStudentCount.findOneAndUpdate(
                { cityID },
                { $set: { city: City }, $inc: { studentCount: 1 } },
                { new: true, upsert: true }
            );         
           


            // const cityInfo=await CityStudentCount.findOneAndUpdate({ cityID },{city}, { $inc: { studentCount: 1 } }, { upsert: true });

            // const cityInfo = await CityStudentCount.findOne({ cityID });
            // const studentCount = cityInfo ? cityInfo.studentCount + 1 : 1;
            cityInfo.city=newTeam.city;

            const rollNumber = generateRollNumber(newTeam.squad, newTeam.language, newTeam.city, cityInfo.studentCount);
        
            //modify roll number with year wise by appned last two digit of year
            newTeam.rollNumber = rollNumber;

            await newTeam.save();

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'technothlon@technicheiitg.in',
                    pass: 'fjowuvpqbbtjrvsa'
                },
            });
            
            // const randomString = Math.random().toString(36).replace(/\//g,'_');
            console.log(rollNumber)
            const redirectURL = redirectUrl + `/confirmPayment/&${rollNumber}`;
            const paymentPortalURL = 'https://www.meraevents.com/ticketWidget?eventId=262881&ucode=organizer&wcode=1789A3-1789A3-333333-81C868-&dateTime=0&location=0&directDetails=0&redirectUrl=https://technothlon.techniche.org.in/confirmPayment/${rollNumber}&theme=1&t=1" width="100%" height="600" frameborder="0px"';
            //const paymentPortalURL = `"https://www.meraevents.com/ticketWidget?eventId=262881&ucode=organizer&wcode=9063CD-9063CD-333333-9063CD-&theme=1&samepage=1" width="100%" height="600px" frameborder="0px"`;



            transporter.sendMail({
                from : '"Technothlon" <technothlon@technicheiitg.in>',
                to : [newTeam.email1],
                subject : 'Complete your payment',
                html: `
                <p>Hey Champs!</p>
                <p>We appreciate you for showing interest in registering for Technothlon '25.</p>
                <p>You will be redirected to the payment portal automatically. In case you are not redirected, please click <a href="${paymentPortalURL}">here</a> to pay the registration fees.</p>
                <br/><br/>
                <b>KINDLY IGNORE THIS MAIL IF ONE MEMBER OF THE TEAM HAS ALREADY PAID THE REGISTRATION FEE.</b>
                <br/><br/>
                <p>Warm regards,</p>
                <p>Team Technothlon</p>
                `
            })

            transporter.sendMail({
                from : '"Technothlon" <technothlon@technicheiitg.in>',
                to : [newTeam.email2],
                subject : 'Complete your payment',
                html: `
                <p>Hey Champs!</p>
                <p>We appreciate you for showing interest in registering for Technothlon '25.</p>
                <p>You will be redirected to the payment portal automatically. In case you are not redirected, please click <a href="${paymentPortalURL}">here</a> to pay the registration fees.</p>
                <br/><br/>
                <b>KINDLY IGNORE THIS MAIL IF ONE MEMBER OF THE TEAM HAS ALREADY PAID THE REGISTRATION FEE.</b>
                <br/><br/>
                <p>Warm regards,</p>
                <p>Team Technothlon</p>
                `
            })

            res.status(201).json({ message: "Team created successfully", rollNumber });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    },

    handlePayment: async (req, res) => {
        try {
            console.log("Incoming body:", req.body);

            const { rollNumber, paymentStatus } = req.body;

            // const team = await TeamModel.findOne({ rollNumber });
            const team = await Onlinereg.findOne({ rollNumber });


            if(!team) {
                return res.status(404).json({ error: "Team not found" });
            }
            
            if(paymentStatus !== "success") {
                
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'technothloniitg@gmail.com',
                        pass: 'fjowuvpqbbtjrvsa'
                    },
                });

                const mailOptions = {
                    from : '"Technothlon" <technothlon@technicheiitg.in>',
                    to: [team.email1],
                    subject: "Payment unsuccessful for Technothlon '25",
                    html: `
                        <p>Hey Champs!</p>
                        <p>We regret to inform you that your payment for Technothlon '25 has not been processed.</p>
                        <p>If the payment is reflected on your bank account, please contact us.</p>
                        <p>Warm regards,</p>
                        <p>Team Technothlon</p>
                    `
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) {
                        console.log('error sending mail');
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                
                return res.status(400).json({ error: "Payment failed" });
            }

            await team.updateOne({ isPaid: true });

            const emailVerificationToken1 = generateVerificationToken(team.email1);
            const emailVerificationToken2 = generateVerificationToken(team.email2);

            const myEmail = "technothloniitghy@gmail.com";
            await sendVerificationEmail(team.email1, emailVerificationToken1);
            await sendVerificationEmail(team.email2, emailVerificationToken2);
            await sendVerificationEmail(myEmail, emailVerificationToken1);

            res.status(200).json({ message: "Payment successful" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    verifyTeam: async (req, res) => {
        const { token } = req.query;
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.email;
    
            // const team = await TeamModel.findOne({ $or: [{ email1: email }, { email2: email }] });
            const team = await Onlinereg.findOne({ $or: [{ email1: email }, { email2: email }] });

    
            if (!team) {
                const closingScript1 = `
                    <html>
                    <head>
                    <script>
                    </script>
                    </head>
                    <body>
                    <p>User not registered.</p>
                    </body>
                    </html>
                `;
                return res.status(204).send(closingScript1);
            }
    
            if (team.isVerified) {
                const closingScript2 = `
                    <html>
                    <head>
                    <script>
                    </script>
                    </head>
                    <body>
                    <p>Your email is already verified. Please login.</p>
                    </body>
                    </html>
                `;
                return res.status(204).send(closingScript2);
            }
    
            team.isVerified = true;
    
            await team.save();
        
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'technothlon@technicheiitg.in',
                    pass: 'fjowuvpqbbtjrvsa'
                },
            });

            transporter.sendMail({
                from : '"Technothlon" <technothlon@technicheiitg.in>',
                to : [team.email1],
                subject : `Registration Confirmation for Technothlon '25`,
                html: `
                    <p>Hey Champs!</p>
                    <p>Your registration for Technothlon '25 has been successfully confirmed.</p>
                    <p>Your roll number is: <strong>${team.rollNumber}</strong></p>
                     <p>If you have any queries, please feel free to contact us.</p>
                    <p>Warm regards,</p>
                    <p>Team Technothlon</p>
                `
            });

            transporter.sendMail({
                from : '"Technothlon" <technothlon@technicheiitg.in>',
                to : [team.email2],
                subject : `Registration Confirmation for Technothlon '25`,
                html: `
                    <p>Hey Champs!</p>
                    <p>Your registration for Technothlon '25 has been successfully confirmed.</p>
                    <p>Your roll number is: <strong>${team.rollNumber}</strong></p>
                    <p>If you have any queries, please feel free to contact us.</p>
                    <p>Warm regards,</p>
                    <p>Team Technothlon</p>
                `
            });

            // return res.redirect("https://technothlon.techniche.org.in/login");
            return res.redirect(`http://localhost:3000/teamverified`);
    
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                const closingScript4 = `
                    <html>
                    <head>
                    <script>
                    </script>
                    </head>
                    <body>
                    <p>Token has expired.</p>
                    </body>
                    </html>
                `;
                return res.status(401).send(closingScript4);
            } else {
                const closingScript5 = `
                    <html>
                    <head>
                    <script>
                    </script>
                    </head>
                    <body>
                    <p>Invalid token.</p>
                    </body>
                    </html>
                `;
                console.log(error);
                return res.status(401).send(closingScript5);
            }
        }
    },


    forgotPassword: async (req, res) => {
        try {
            const { rollNumber } = req.body;

            // Find the user by roll number
            const team = await Onlinereg.findOne({ rollNumber });

            if (!team) {
                return res.status(404).json({ error: "Roll number not found" });
            }

            const email = team.email1; // Assuming email1 is the primary email
          //  const password = team.password; // Assuming `password` is stored securely

            // Configure nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'technothlon@technicheiitg.in',
                    pass: 'fjowuvpqbbtjrvsa'
                },
            });

            // Send the email with the password
            await transporter.sendMail({
                from: '"Technothlon" <technothlon@technicheiitg.in>',
                to: team.email1,
                subject: "Your Technothlon Password",
                html: `
                    <p>Hey Champs!</p>
                    <p>You requested to retrieve your password. Below are your login details:</p>
                    <p><strong>Roll Number:</strong> ${rollNumber}</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Warm regards,</p>
                    <p>Team Technothlon</p>
                `,
            });
            await transporter.sendMail({
                from: '"Technothlon" <technothlon@technicheiitg.in>',
                to: team.email2,
                subject: "Your Technothlon Password",
                html: `
                    <p>Hey Champs!</p>
                    <p>You requested to retrieve your password. Below are your login details:</p>
                    <p><strong>Roll Number:</strong> ${rollNumber}</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Warm regards,</p>
                    <p>Team Technothlon</p>
                `,
            });

            res.status(200).json({ message: "Password has been sent to your registered email." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

async function sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "technothlon@technicheiitg.in",
            pass: "fjowuvpqbbtjrvsa"
        }
    });

    // Send the email verification link containing the token
    // const verificationLink = `https://technothlon.techniche.org.in/api/verify?token=${token}`;
    const verificationLink = `http://localhost:3001/api/verify?token=${token}`;

    await transporter.sendMail({
        from : '"Technothlon" <technothlon@technicheiitg.in>',
        to: [email],
        subject: "Payment Confirmation and Email Verification for Technothlon '25",
        html:
        `<p>Hey Champs!</p>
        <p>We are delighted to inform you that you have registered for Technothlon '25. Please click <a href="${verificationLink}">here</a> to verify your email address.</p>
         <p>${verificationLink}</p>
         <p>Kindly note that your registration is not complete until you verify your email address.</p>
         <br/><br/>
         <b>KINDLY IGNORE THIS MAIL IF ONE MEMBER OF YOUR TEAM HAS ALREADY VERIFIED THE EMAIL.</b>
         <br/><br/>
         <p>Warm regards,</p>
        <p>Team Technothlon</p>
        `
    });
}

function generateVerificationToken(email) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return token;
}

module.exports = TeamController;


