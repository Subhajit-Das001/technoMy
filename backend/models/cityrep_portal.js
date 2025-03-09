const mongoose = require('mongoose');

const cityRep_portalSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true, // Ensure a zone is always provided
    // enum:['North', 'South', 'East', 'West'], // Restrict to specific zones
  },
  city: {
    type: String,
    required: true,
  },
  link:{
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
    password:{
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('CityRep_portal', cityRep_portalSchema);