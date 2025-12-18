const mongoose = require('mongoose');

const offlineTeamSchema = new mongoose.Schema(
  {
    name1: { type: String, required: true },
    contact1: { type: String, required: true },
    email1: { type: String, required: true },
    school1: { type: String, required: true },

    name2: { type: String, required: true },
    contact2: { type: String, required: true },
    email2: { type: String, required: true },
    school2: { type: String, required: true },

    squad: { type: String, required: true },
    language: { type: String, required: true },
    mode: { type: String, default: 'offline' },

    state: { type: String, required: true },
    zone: { type: String, required: true }, // ✅ fixed `.` → `,`
    city: { type: String, required: true },

    view: { type: String, default: 'school' },
    center: { type: String },

    rollNumber: { type: String },
    password: { type: String, required: true },

    Rank: { type: String, default: 'NA' },
    isPaid: { type: Boolean, default: false },
    batchId: { type: String },

    createdAt: {
      type: Date,
      default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000), // IST
    },
  },
  {
    timestamps: true,
  }
);

// Check if model exists before creating
module.exports =
  mongoose.models.Offline25 ||
  mongoose.model('Offline25', offlineTeamSchema);
