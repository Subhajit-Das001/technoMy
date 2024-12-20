const mongoose = require('mongoose');

const resultSchema = mongoose.Schema(
  {
    Roll:{ type: String, required: true },
    Rank:{type: String}
  }
);

const results = mongoose.model("results", resultSchema);

module.exports = results;
