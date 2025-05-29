const mongoose = require('mongoose');

const centre_listSchema = mongoose.Schema(
  {
    centerId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    link: { type: String, required: true },
    location: { 
      type: String,
      required: false, // Make it optional
      default: function() { // Use link as default if no location provided
        return this.link;
      }
    },
    zone: { type: String, required: true },
    cityrep: { type: String, required: true, default: "Null" },
    schools: [{ type: String }]
  },
  {
    timestamps: true
  }
);

// Add pre-save middleware to ensure location is set
centre_listSchema.pre('save', function(next) {
  if (!this.location) {
    this.location = this.link;
  }
  next();
});

const centre_list = mongoose.model("Centre_List", centre_listSchema);

module.exports = centre_list;
