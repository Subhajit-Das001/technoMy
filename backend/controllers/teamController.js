const nodemailer = require('nodemailer');
const Onlinereg = require('../models/online26');
const NewStudent = require('../models/newStudent');
const cityToID = require('../utils/cityToID.json');
require('dotenv').config();
const CityStudentCount = require('../models/cityStudentCountModel');
const generateRollNumber = require('../utils/generateRollNumber');
const getZone = require('../utils/getZone');

const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";
const redirectUrl = process.env.NODE_ENV === "production" ? "https://technothlon.techniche.org.in" : "http://localhost:3000";
const whatsapp = "https://whatsapp.com/channel/0029VaM9jc072WTqZJIaKL1S"; // i have to change this 

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'technothlon.iitg@gmail.com',
        pass: process.env.SENDER_PASSWORD
    },
});

// Helper function to format Date to DDMMYYYY
const formatDateForPassword = (dateInput) => {
    const d = new Date(dateInput);
    // Add 5.5 hours to shift UTC back to Indian Time
    d.setTime(d.getTime() + (5.5 * 60 * 60 * 1000));

    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();

    return `${day}${month}${year}`;
};

const TeamController = {
    createTeam: async (req, res) => {
        try {
            const { email1, email2, contact1, contact2, state } = req.body;

            // 1. Check NewStudent registration (same as before)
            const matchingStudent1 = await NewStudent.findOne({ $or: [{ email: email1 }, { contact: contact1 }] });
            const matchingStudent2 = await NewStudent.findOne({ $or: [{ email: email2 }, { contact: contact2 }] });

            if (matchingStudent1) await NewStudent.findByIdAndUpdate(matchingStudent1._id, { registered: true });
            if (matchingStudent2) await NewStudent.findByIdAndUpdate(matchingStudent2._id, { registered: true });

            // 2. Prepare Data
            const zone = getZone(state);

            // 3. Create Team WITHOUT Roll Number or Password
            // Ensure your Mongoose Schema allows rollNumber and password to be optional/null initially
            const newTeam = new Onlinereg({
                ...req.body,
                zone,
                isPaid: false,
                rollNumber: null, // Placeholder
                password: null    // Placeholder
            });

            // 4. Save the "Draft" Team
            const savedTeam = await newTeam.save();

            // 5. Generate Payment URL using the Database ID (_id) instead of RollNumber
            // We pass the unique _id so we can find them later in handlePayment
             const paymentPortalURL = `https://www.meraevents.com/ticketWidget?eventId=269334&ucode=organizer&wcode=9063CD-9063CD-333333-9063CD-&theme=1&redirectUrl=${redirectUrl}/confirmPayment/${savedTeam._id}&theme=1&t=1`;

            // Return the _id (registrationId) to frontend so it can handle the redirect
            res.status(201).json({
                message: "Team registered successfully. Proceed to payment.",
                registrationId: savedTeam._id,
                paymentUrl: paymentPortalURL
            });

        } catch (error) {
            console.error("Error creating team:", error);
            res.status(500).json({ error: error.message });
        }
    },

    handlePayment: async (req, res) => {
        try {
            const { registrationId, paymentStatus, orderId } = req.body;

            // 0. Basic Validation
            if (!orderId) {
                return res.status(400).json({ error: "Please Complete Payment or If already done please contact technothlon.iitg@gmail.com" });
            }

            // Check for exactly 7 digits
            if (!/^\d{7}$/.test(orderId)) {
                return res.status(400).json({ error: "Please Complete Payment or If already done please contact technothlon.iitg@gmail.com" });
            }

            const team = await Onlinereg.findById(registrationId);

            if (!team) {
                return res.status(404).json({ error: "Team not found" });
            }

            // Idempotency check
            if (team.isPaid) {
                return res.status(200).json({
                    message: "Already paid",
                    rollNumber: team.rollNumber,
                    password: team.password
                });
            }

            // Check if this Order ID is already used by ANOTHER team (Replay Attack Prevention)
            const existingOrder = await Onlinereg.findOne({ orderId });
            if (existingOrder && existingOrder._id.toString() !== registrationId) {
                return res.status(409).json({ error: "This Ticket ID has already been used." });
            }

            if (paymentStatus !== "success") {
                // ... (Keep your payment failure logic here)
                return res.status(400).json({ error: "Payment failed" });
            }

            // --- PAYMENT SUCCESSFUL ---

            // 1. Increment Student Count
            const cityID = cityToID[team.city];
            const cityInfo = await CityStudentCount.findOneAndUpdate(
                { cityID },
                { $set: { city: team.city }, $inc: { studentCount: 1 } },
                { new: true, upsert: true }
            );

            // 2. Generate Credentials
            const rollNumber = generateRollNumber(team.squad, team.language, team.city, cityInfo.studentCount);

            const pass1 = formatDateForPassword(team.dob1);
            const pass2 = formatDateForPassword(team.dob2);
            const generatedPassword = `${pass1}${pass2}`;

            // 3. Update Database (CRITICAL STEP)
            const updatedTeam = await Onlinereg.findByIdAndUpdate(
                registrationId,
                {
                    isPaid: true,
                    rollNumber: rollNumber,
                    password: generatedPassword,
                    orderId: orderId
                },
                { new: true }
            );

            // 4. Send Response to Frontend IMMEDIATELY
            // We prepare the response here so the user gets their data no matter what happens next.
            res.status(200).json({
                success: true,
                rollNumber: updatedTeam.rollNumber,
                password: updatedTeam.password
            });

            // 5. Send Email in the BACKGROUND (Independent Step)
            // We use a separate try-catch so email errors don't crash the server or stop the response
            try {
                await transporter.sendMail({
                    from: '"Technothlon" <technothlon.iitg@gmail.com>',
                    to: [team.email1, team.email2],
                    subject: "Registration Confirmation for Technothlon '26",
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2 style="color: #4CAF50;">Registration Successful!</h2>
                            <p>Hey Champs!</p>
                            <p>Your registration for Technothlon '26 has been confirmed.</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p><strong>Roll Number:</strong> ${updatedTeam.rollNumber}</p>
                                <p><strong>Password:</strong> ${updatedTeam.password}</p>
                            </div>
<p><em>(Your password is a fixed combination of your birth dates in DDMMYYYY format and cannot be changed later.)</em></p>                            <p>Follow us on WhatsApp: <a href="${whatsapp}">Join Channel</a></p>
                            <p>Warm regards,<br>Team Technothlon</p>
                        </div>
                    `
                });
                console.log(`Email sent successfully to ${team.email1}`);
            } catch (emailError) {
                // Log the error for you to fix later, but DO NOT stop the process
                console.error("⚠️ Email Failed to Send (But Registration is Complete):", emailError.message);
            }

        } catch (error) {
            console.error("Critical Error handling payment:", error);
            // This only catches database errors now, not email errors
            if (!res.headersSent) {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }
};

module.exports = TeamController;