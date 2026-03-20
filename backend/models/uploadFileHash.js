const mongoose = require("mongoose");

const uploadedFileHashSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("UploadedFileHash", uploadedFileHashSchema);