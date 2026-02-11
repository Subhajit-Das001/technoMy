const mongoose = require('mongoose');

const cosKvSchema = new mongoose.Schema(
    {
        // --- Student 1 ---
        name1: { type: String, required: true },
        contact1: { type: String, required: true },
        email1: { type: String, required: true },
        school1: { type: String, required: true },
        class1: { type: String, required: true },
        dob1: { type: Date, required: true },

        // --- Student 2 ---
        name2: { type: String, required: true },
        contact2: { type: String, required: true },
        email2: { type: String, required: true },
        school2: { type: String, required: true },
        class2: { type: String, required: true },
        dob2: { type: Date, required: true },

        // --- Team Details ---
        squad: { type: String, required: true },
        language: { type: String, required: true },
        mode: { type: String, required: true, default: 'online' },
        
        // --- Location ---
        country: { type: String, required: true, default: 'India' },
        state: { type: String, required: true },
        city: { type: String, required: true },
        zone: { 
            type: String, 
            required: true 
        },

        // --- Marketing ---
        view: { type: String, required: true, default: 'School' },

        // --- Auth & Identification ---
        rollNumber: { type: String, required: true }, 
        password: { type: String, required: true }, 

        // --- School Information ---
        schoolCode: { type: String, required: true },
        principal_id: { type: String, required: true },
        
        // --- Status ---
        isPaid: { type: Boolean, default: false },
        
        createdAt: {
            type: Date,
            default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000), 
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.models.COS_KV || mongoose.model('COS_KV', cosKvSchema);
