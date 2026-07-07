const mongoose = require('mongoose');

const centreInformationSchema = new mongoose.Schema({
  centreId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  centreName: { type: String },
  centreLink: { type: String },
  mapsLink: { type: String },
  city: { type: String },
  state: { type: String },
  cityrepName: { type: String },
  cityrepPhone: { type: String }
});

module.exports = mongoose.model('CentreInformation', centreInformationSchema);