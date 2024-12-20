const mongoose = require('mongoose');

const teamModel = mongoose.Schema(
    {
        name1: { type: String, require: true },
        email1: { type: String, require: true },
        contact1: { type: Number, require: true, unique: true },
        name2: { type: String, require: true },
        email2: { type: String, require: true },
        contact2: { type: Number, require: true, unique: true },
        squad: { type: String, require: true },
        language: { type: String, require: true }
    },
    {
        timestaps: true
    }
);

const TeamInfo = mongoose.model("TeamInfo", teamModel);

module.exports = TeamInfo;