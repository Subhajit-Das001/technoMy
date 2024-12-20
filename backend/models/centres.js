const mongoose = require('mongoose');

const centreSchema = mongoose.Schema(
  {
    name1: { type: String, required: true },
    email1: { type: String },
    contact1: { type: Number },
    name2: { type: String, required: true },
    email2: { type: String },
    contact2: { type: Number },
    squad: { type: String},
    language: { type: String },
    rollno: { type: String, required: true },
    centre: { type: String, required: true }
  },
  {
    timestamps: true  // Corrected option name
  }
);

const centreInfo = mongoose.model("CentreInfo", centreSchema);

module.exports = centreInfo;
