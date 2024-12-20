const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema(
  {
    isDownload: { type: Boolean, default: false },
    roll: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String,required: true },
    contact: { type: Number },
    squad: { type: String},
    Rank:{type: String},
    schoolName: { type: String, require: true }
  },
  {
    timestamps: true  // Corrected option name
  }
);

const download = mongoose.model("download", downloadSchema);

module.exports = download;
