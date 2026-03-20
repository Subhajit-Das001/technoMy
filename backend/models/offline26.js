const mongoose = require('mongoose');

const offlineTeamSchema = new mongoose.Schema(
    {
        name1: { type: String, required: true },
        contact1: { type: String, required: true },
        email1: { type: String, required: true },
        school1: { type: String, required: true },
        class1: { type: String, required: true }, // Added
        dob1: { type: Date, required: true },
        
        name2: { type: String, required: true },
        contact2: { type: String, required: true },
        email2: { type: String, required: true },
        school2: { type: String, required: true },
        class2: { type: String, required: true }, // Added
        dob2: { type: Date, required: true },
        
        squad: { type: String, required: true },
        language: { type: String, required: true },
        mode: { type: String, required: true, default: 'offline' },
        state: { type: String, required: true },
        zone: { type: String, required: true },
        city: { type: String, required: true },
        view: { type: String, required: true, default: 'school' },
        center: { type: String ,default: 'NA' },
        
        rollNumber: { type: String,default: 'NA' },
        password: { type: String, default: 'NA'},
        Rank: { type: String, default: 'NA' },
        mailSent: { type: Boolean, default: false },
        batchId: { type: String },
        uploadId:{type : String, required : true},
        createdAt: {
            type: Date,
            default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000), 
        }
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.models.Offline26 || mongoose.model('Offline26', offlineTeamSchema);