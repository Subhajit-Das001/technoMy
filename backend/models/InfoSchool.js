const mongoose = require('mongoose');

const infoSchool = mongoose.Schema(
    {
        cityCode: { type: Number, require: true },
        schoolCode: { type: Number, require: true },
        schoolName: { type: String, require: true },
        cityName: { type: String, require: true },
        teams: [
            {
                type: mongoose.Schema.Types.Array,
                ref: "TeamInfo",
            },
        ],
    },
    {
        timestaps: true
    }
);

const InfoSchool = mongoose.model("InfoSchool", infoSchool);

module.exports = InfoSchool;