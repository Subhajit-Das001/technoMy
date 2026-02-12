const mongoose = require('mongoose');

const cityRepSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    get: function(value) {
      // Convert to string when retrieved
      return String(value);
    }
  },
  city: {
    type: String,
    required: true,
  },
   state: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true, // Ensure a zone is always provided
    enum:['North', 'South', 'East', 'West'], // Restrict to specific zones
  },
  cityRepID: {
    type: String,
    unique: true, // This makes `cityRepID` unique across the collection
    default: function () {
      return new mongoose.Types.ObjectId().toString(); // Auto-generate a unique ID
    },
  },
});

module.exports = mongoose.model('CityRep', cityRepSchema);
