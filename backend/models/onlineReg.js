const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CityStudentCount = require('./cityStudentCountModel')
const generateRollNumber = require('../utils/generateRollNumber');
const cityToID = require('../utils/cityToID.json');

const OnlineteamModel = mongoose.Schema(
    {
        name1: { type: String, require: true },
        contact1: { type: String, require: true },
        email1: { type: String, require: true },
        school1:{type:String, require: true},
        name2: { type: String, require: true },
        contact2: { type: String, require: true },
        email2: { type: String, require: true },
        school2:{type:String, require: true},
        squad: { type: String, require: true },
        language: { type: String, require: true },
        mode: { type: String, require: true },
        country: { type: String, require: true },
        state: { type: String, require: true },
        city: { type: String, require: true },
        zone: { 
            type: String, 
            enum: ['North', 'South', 'East', 'West', 'Unknown'],
            required: true 
        },
        center: { 
        type: String, 
        default: "Indian Institute of Technology Guwahati, Guwahati 781039, Assam, India" 
    },
        view:{type: String, require: true},
        cityrepID: { type: String },
        rollNumber: { type: String },
        password: { type: String, require: true },
        // isVerified: { type: Boolean, default: false },
        isPaid: { type: Boolean, default: false },
        createdAt: {
            type: Date,
            default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000), // Convert UTC to IST
        },
        
    },
    {
        timestaps: true
    }
);

// OnlineteamModel.pre('save', async function (next) {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         this.password = this.password;
//         next();
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }

// });


// OnlineteamModel.pre('save', async function (next) {
//     try {
//         if (this.isModified('password')) { // Only hash if the password is modified
//             const salt = await bcrypt.genSalt(10);
//             this.password = await bcrypt.hash(this.password, salt); // Directly assign the hashed password
//         }
//         next(); // Proceed to the next middleware or save operation
//     } catch (error) {
//         console.log(error);
//         next(error); // Pass the error to the next middleware or error handler
//     }
// });


const Onlinereg = mongoose.model("OnlineRegistration", OnlineteamModel);

module.exports = Onlinereg;