const mongoose = require('mongoose');

const cityStudentCountSchema = new mongoose.Schema({
    city:{type:String,required:true},
    cityID: { type: String, required: true, unique: true },
    studentCount: { type: Number, default: 0 },
});

const CityStudentCount1 = mongoose.model('CityStudentCount1', cityStudentCountSchema);

module.exports = CityStudentCount1;