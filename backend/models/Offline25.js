const mongoose = require('mongoose');


const OfflineteamModel = mongoose.Schema(
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
        mode: { type: String, require: true, default:'offline' },
        country: { type: String, require: true },
        state: { type: String, require: true },
        city: { type: String, require: true },
        view:{type: String, require: true, default: 'school'},
        cityrepID: { type: String },
        rollNumber: { type: String },
        password: { type: String, require: true },
        isPaid: { type: Boolean, default: false },
        batchId: { type: String },
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


const Offline25 = mongoose.model("Offline25", OfflineteamModel);

module.exports = Offline25;