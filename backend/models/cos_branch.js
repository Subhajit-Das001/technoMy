const mongoose = require('mongoose');

const cosBranchSchema = new mongoose.Schema({
    branch_name: { type: String, required: true },
    branch_id: { type: String, required: true, unique: true },
    school_id: { type: String, ref: 'cos_school', required: true },
    bpoc_name: { type: String, required: true },
    bpoc_mail: { type: String, required: true, unique:  true },
    bpoc_contact: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zone: { type: String, required: true },
    csv_count: { type: Number, default: 0 },
    juniors_count: { type: Number, default: 0 },
    hauts_count: { type: Number, default: 0 },
    total_students_count: { type: Number, default: 0 },
    csv_submission_time: [{ type: Date }] 
}, { timestamps: true }, { autoCreate: true });

// cosBranchSchema.pre('save', function(next) {
//     this.total_count = this.juniors_count + this.hauts_count;
//     next();
// });

module.exports = mongoose.model('cos_branch', cosBranchSchema);