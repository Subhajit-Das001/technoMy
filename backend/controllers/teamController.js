const nodemailer = require('nodemailer');
const Onlinereg = require('../models/onlineReg');
const NewStudent = require('../models/newStudent');
const cityToID = require('../utils/cityToID.json');
require('dotenv').config();
const CityStudentCount = require('../models/cityStudentCountModel');
const generateRollNumber = require('../utils/generateRollNumber');
const getZone = require('../utils/getZone');

const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";
const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3000";
const whatsapp = "https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'technothloniitg@gmail.com',
        pass: process.env.SENDER_PASSWORD
    },
});

const TeamController = {
    createTeam: async (req, res) => {
        try {
            const { email1, email2, contact1, contact2, state } = req.body;

            // Check if either student exists in NewStudent collection
            const matchingStudent1 = await NewStudent.findOne({
                $or: [
                    { email: email1 },
                    { contact: contact1 }
                ]
            });

            const matchingStudent2 = await NewStudent.findOne({
                $or: [
                    { email: email2 },
                    { contact: contact2 }
                ]
            });

            // Update registration status for matching students
            if (matchingStudent1) {
                await NewStudent.findByIdAndUpdate(
                    matchingStudent1._id,
                    { registered: true },
                    { new: true }
                );
                console.log(`Updated NewStudent registration status for student 1: ${matchingStudent1.email}`);
            }

            if (matchingStudent2) {
                await NewStudent.findByIdAndUpdate(
                    matchingStudent2._id,
                    { registered: true },
                    { new: true }
                );
                console.log(`Updated NewStudent registration status for student 2: ${matchingStudent2.email}`);
            }

            // Add zone based on state
            const zone = getZone(state);
            
            // Create a new team document with zone
            const newTeam = new Onlinereg({
                ...req.body,
                zone
            });
            const City = newTeam.city;
            const cityID = cityToID[City];

             // If found, update their registered status
            
            // Update city info with student count
            const cityInfo = await CityStudentCount.findOneAndUpdate(
                { cityID },
                { $set: { city: City }, $inc: { studentCount: 1 } },
                { new: true, upsert: true }
            );

           


            // Generate roll number
            const rollNumber = generateRollNumber(newTeam.squad, newTeam.language, newTeam.city, cityInfo.studentCount);
            newTeam.rollNumber = rollNumber;

            // Save the team to the database
            await newTeam.save();

            // Send an email to the team members with the payment portal link
            const paymentPortalURL = `https://www.meraevents.com/ticketWidget?eventId=262881&ucode=organizer&wcode=9063CD-9063CD-333333-9063CD-&dateTime=1&location=1&directDetails=0&redirectUrl=${redirectUrl}/confirmPayment/${rollNumber}&theme=1&t=1`;

            // await transporter.sendMail({
            //     from: '"Technothlon" <technothloniitg@gmail.com>',
            //     to: [email1, email2],
            //     subject: 'Complete your payment',
            //     html: `
            //         <p>Hey Champs!</p>
            //         <p>We appreciate your interest in registering for Technothlon '25.</p>
            //         <p>You will be redirected to the payment portal automatically. If not, click <a href="${paymentPortalURL}">here</a> to complete the payment.</p>
            //         <p><strong>Warm regards,</strong></p>
            //         <p>Team Technothlon</p>
            //     `
            // });

            res.status(201).json({ message: "Team created successfully", rollNumber });
        } catch (error) {
            console.error("Error creating team:", error);
            res.status(500).json({ error: error.message });
        }
    },

    handlePayment: async (req, res) => {
        try {
            const { rollNumber, paymentStatus } = req.body;

            // Find the team by roll number
            const team = await Onlinereg.findOne({ rollNumber });

            if (!team) {
                return res.status(404).json({ error: "Team not found" });
            }

            // Handle payment failure
            if (paymentStatus !== "success") {
                await transporter.sendMail({
                    from: '"Technothlon" <technothloniitg@gmail.com>',
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

            // Update the team to set isPaid to true
            const updatedTeam = await Onlinereg.findOneAndUpdate(
                { rollNumber },
                { isPaid: true },
                { new: true }
            );

            if (!updatedTeam) {
                return res.status(500).json({ error: "Failed to update payment status" });
            }

            // Send a confirmation email
            await transporter.sendMail({
                from: '"Technothlon" <technothloniitg@gmail.com>',
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
            console.error("Error handling payment:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = TeamController;
