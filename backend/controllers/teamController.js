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

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'technothlon@technicheiitg.in',
                    pass: 'fjowuvpqbbtjrvsa'
                },
            });

            const paymentPortalURL = `https://www.meraevents.com/ticketWidget?eventId=262881&ucode=organizer&wcode=1789A3-1789A3-333333-81C868-&dateTime=1&location=1&directDetails=0&redirectUrl=${redirectUrl}/confirmPayment/${rollNumber}&theme=1&t=1`;

            transporter.sendMail({
                from: '"Technothlon" <technothlon@technicheiitg.in>',
                to: [email1, email2],
                subject: 'Complete your payment',
                html: `
                <p>Hey Champs!</p>
                <p>We appreciate your interest in registering for Technothlon '25.</p>
                <p>You will be redirected to the payment portal automatically. If not, click <a href="${paymentPortalURL}">here</a> to complete the payment.</p>
                <p><strong>Warm regards,</strong></p>
                <p>Team Technothlon</p>
                `
            });

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
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: 'technothlon@technicheiitg.in',
                        pass: 'fjowuvpqbbtjrvsa'
                    },
                });

                transporter.sendMail({
                    from: '"Technothlon" <technothlon@technicheiitg.in>',
                    to: [team.email1],
                    subject: "Payment Unsuccessful",
                    html: `
                    <p>Hey Champs!</p>
                    <p>Your payment for Technothlon '25 was not processed successfully. Please retry or contact us if the payment is reflected on your bank account.</p>
                    <p>Warm regards,</p>
                    <p>Team Technothlon</p>
                    `
                });

                return res.status(400).json({ error: "Payment failed" });
            }

            await team.updateOne({ isPaid: true });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: 'technothlon@technicheiitg.in',
                    pass: 'fjowuvpqbbtjrvsa'
                },
            });

            transporter.sendMail({
                from: '"Technothlon" <technothlon@technicheiitg.in>',
                to: [team.email1, team.email2],
                subject: "Registration Confirmation for Technothlon '25",
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
