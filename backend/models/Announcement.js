const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({

    id:{
    type: Number,
    unique: true},
  title: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
