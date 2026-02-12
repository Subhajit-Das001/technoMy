const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Check if model exists before creating
module.exports = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

