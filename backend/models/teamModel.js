const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CityStudentCount = require('./cityStudentCountModel')
const generateRollNumber = require('../utils/generateRollNumber');
const cityToID = require('../utils/cityToID.json');

const teamModel = mongoose.Schema(
    {
        name1: { type: String, require: true },
        email1: { type: String, require: true },
        contact1: { type: String, require: true },
        name2: { type: String, require: true },
        email2: { type: String, require: true },
        contact2: { type: String, require: true },
        squad: { type: String, require: true },
        language: { type: String, require: true },
        mode: { type: String, require: true },
        country: { type: String, require: true },
        state: { type: String, require: true },
        city: { type: String, require: true },
        school: { type: String, require: true },
        cityrepID: { type: String },
        rollNumber: { type: String },
        password: { type: String, require: true },
        isVerified: { type: Boolean, default: false },
        isPaid: { type: Boolean, default: false },
    },
    {
        timestaps: true
    }
);

teamModel.pre('save', async function (next) {
    try {
        // const salt = await bcrypt.genSalt(10);
        // this.password = await bcrypt.hash(this.password, salt);
        this.password = this.password;
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }

});

const TeamModel = mongoose.model("team", teamModel);

module.exports = TeamModel;