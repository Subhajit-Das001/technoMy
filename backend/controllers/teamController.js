const nodemailer = require('nodemailer');
const Onlinereg = require('../models/onlineReg');
const cityToID = require('../utils/cityToID.json');
require('dotenv').config();
const CityStudentCount = require('../models/cityStudentCountModel');
const generateRollNumber = require('../utils/generateRollNumber');

const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";
const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3000";
const whatsapp = "https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S";

const TeamController = {
    createTeam: async (req, res) => {
        try {
            const { email1, email2 } = req.body;
            
            const newTeam = new Onlinereg(req.body);

            const City = newTeam.city;
            const cityID = cityToID[City];
            const cityInfo = await CityStudentCount.findOneAndUpdate(
                { cityID },
                { $set: { city: City }, $inc: { studentCount: 1 } },
                { new: true, upsert: true }
            );

            const rollNumber = generateRollNumber(newTeam.squad, newTeam.language, newTeam.city, cityInfo.studentCount);
            newTeam.rollNumber = rollNumber;

            await newTeam.save();

            res.status(201).json({ message: "Team created successfully", rollNumber });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    handlePayment: async (req, res) => {
        try {
            const { rollNumber, paymentStatus } = req.body;

            const team = await Onlinereg.findOne({ rollNumber });

            if (!team) {
                return res.status(404).json({ error: "Team not found" });
            }

            if (paymentStatus !== "success") {
                return res.status(400).json({ error: "Payment failed" });
            }

            await team.updateOne({ isPaid: true });

            // Send only the registration confirmation email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_PASSWORD
                },
            });

            transporter.sendMail({
                from: '"Technothlon" <technothlon.iitg@gmail.com>',
                to: [team.email1], // Send separately for better deliverability
                subject: "Your Technothlon 2025 Registration is Confirmed!",
                replyTo: "technothlon.iitg@gmail.com",
                text: `Hey Champs!
            Your registration for Technothlon '25 has been successfully confirmed.
            
            Your roll number is: ${team.rollNumber}
            
            Follow the Technothlon - IIT Guwahati channel on WhatsApp to stay updated: ${whatsapp}
            
            Warm regards,
            Team Technothlon`,
                html: `
                <p>Hey Champs!</p>
                <p>Your registration for Technothlon '25 has been successfully confirmed.</p>
                <p><strong>Your roll number is: ${team.rollNumber}</strong></p>
                <p>Follow the Technothlon - IIT Guwahati channel on WhatsApp to stay updated: <a href="${whatsapp}">${whatsapp}</a></p>
                <p>Warm regards,</p>
                <p>Team Technothlon</p>
                `
            });



            transporter.sendMail({
                from: '"Technothlon" <technothlon.iitg@gmail.com>',
                to: [team.email2], // Send separately for better deliverability
                subject: "Your Technothlon 2025 Registration is Confirmed!",
                replyTo: "technothlon.iitg@gmail.com",
                text: `Hey Champs!
            Your registration for Technothlon '25 has been successfully confirmed.
            
            Your roll number is: ${team.rollNumber}
            
            Follow the Technothlon - IIT Guwahati channel on WhatsApp to stay updated: ${whatsapp}
            
            Warm regards,
            Team Technothlon`,
                html: `
                <p>Hey Champs!</p>
                <p>Your registration for Technothlon '25 has been successfully confirmed.</p>
                <p><strong>Your roll number is: ${team.rollNumber}</strong></p>
                <p>Follow the Technothlon - IIT Guwahati channel on WhatsApp to stay updated: <a href="${whatsapp}">${whatsapp}</a></p>
                <p>Warm regards,</p>
                <p>Team Technothlon</p>
                `
            });

            // Redirect the user to the confirmation page
            res.redirect(`${redirectUrl}/confirmPayment/${rollNumber}`);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = TeamController;
