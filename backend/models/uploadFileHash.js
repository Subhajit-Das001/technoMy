const mongoose = require("mongoose");

const uploadedFileHashSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  fileName: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UploadedFileHash", uploadedFileHashSchema);