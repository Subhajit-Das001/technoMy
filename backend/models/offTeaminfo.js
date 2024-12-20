const mongoose = require('mongoose');
const joi =require('joi');
const passwordComplexity=require("joi-password-complexity");
const offTeamModel = mongoose.Schema(
    {
        name1: { type: String, required: true },
        email1: { type: String,required: true },
        contact1: { type: Number},
        name2: { type: String, required: true },
        email2: { type: String,required: true },
        contact2: { type: Number},
        squad: { type: String, required: true },
        language: { type: String, required: true },
        roll: { type: String, required: true, unique: true },
        password: { type: String, required: true, unique: true },
        school: { type: String, required: true },
    },
    {
        timestamps: true
    }
);
const offTeamInfo = mongoose.model("offTeamInfo", offTeamModel);

module.exports =offTeamInfo;

