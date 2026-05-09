const mongoose = require('mongoose');

const cosSchoolSchema = new mongoose.Schema({
    school_name: { type: String, required: true },
    school_id: { type: String, required: true, unique: true },
    spoc_name: { type: String, required: true },
    spoc_phone: { type: String, required: true },
    spoc_mail: { type: String, required: true },
    csv_count: { type: Number, default: 0 },
    juniors_count: { type: Number, default: 0 },
    hauts_count: { type: Number, default: 0 },
    total_students_count: { type: Number, default: 0 }
}, { timestamps: true });

// Auto-calculate total_count before saving
// cosSchoolSchema.pre('save', function(next) {
//     this.total_count = this.juniors_count + this.hauts_count;
//     next();
// });

module.exports = mongoose.model('cos_school', cosSchoolSchema, 'cos_school');