const mongoose = require('mongoose');

const OnlineteamModel = new mongoose.Schema(
    {
        // --- Student 1 ---
        name1: { type: String, required: true },
        contact1: { type: String, required: true },
        email1: { type: String, required: true },
        school1: { type: String, required: true },
        class1: { type: String, required: true }, // Added
        dob1: { type: Date, required: true },     // Added

        // --- Student 2 ---
        name2: { type: String, required: true },
        contact2: { type: String, required: true },
        email2: { type: String, required: true },
        school2: { type: String, required: true },
        class2: { type: String, required: true }, // Added
        dob2: { type: Date, required: true },     // Added

        // --- Team Details ---
        squad: { type: String, required: true },
        language: { type: String, required: true },
        mode: { type: String, required: true }, // e.g., 'online'

        // --- Location ---
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        zone: {
            type: String,
            required: true
        },
        // center: { 
        //     type: String, 
        //     default: "Indian Institute of Technology Guwahati, Guwahati 781039, Assam, India" 
        // },

        // --- Marketing ---
        view: { type: String, required: true },
        // cityrepID: { type: String },

        // --- Auth & Identification (Generated AFTER Payment) ---
        // CRITICAL: These must NOT be required, or the first save will fail.
        rollNumber: { type: String },
        password: { type: String },

        // --- Payment Security ---
        orderId: {
            type: String,
            unique: true,
            sparse: true // Allows multiple documents to have no orderId (null/undefined)
        },

        // --- Status ---
        Rank: { type: String, default: 'NA' },
        isPaid: { type: Boolean, default: false },

        createdAt: {
            type: Date,
            // Sets time to IST (UTC + 5.5)
            default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
    },
    {
        timestamps: true // Fixed typo: was 'timestaps'
    }
);

const Onlinereg = mongoose.model("Online26", OnlineteamModel);

module.exports = Onlinereg;