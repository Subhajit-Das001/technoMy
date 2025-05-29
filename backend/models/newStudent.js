const mongoose = require('mongoose');

const newStudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  school:{type: String, required: true },
  city: { type: String, required: true },
  registered: { type: Boolean, default: false },
  attempted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Create compound index on email and phone for uniqueness checks
newStudentSchema.index({ email: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model('NewStudent', newStudentSchema);