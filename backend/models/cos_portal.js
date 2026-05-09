const mongoose = require('mongoose');

const cosPortalSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
    
  },
  principal_id: {
    type: String,
    required: true,
    unique: true
  },
  principal_name: {
    type: String,
    required: true
  },
  poc_id: {
    type: String,
    required: true
  },
  poc_contact: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    required: true,
    enum: ['North', 'South', 'East', 'West']
  },
  total_number_of_student: {
    type: Number,
    default: 0
  },
  junior_team: {
    type: Number,
    default: 0
  },
  hauts_team: {
    type: Number,
    default: 0
  },
  submission_date: {
    type: [Date],
    default: []
  },
  count_of_submission: {
    type: Number,
    default: 0
  },
  isvisit: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.COS_portal || mongoose.model('COS_portal', cosPortalSchema);
