const mongoose = require('mongoose');

const merchAnalyticsSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }, // Start shopping button clicks
  lastCountDate: { type: Date,
    default: () => new Date(Date.now() + 5.5 * 60 * 60 * 1000), // Convert UTC to IST
},
  navCount: { type: Number, default: 0 }, // Header nav clicks
  navLastCountDate: { type: Date, default: null }
});

function getISTDate() {
  const now = new Date();
  // IST is UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffset);
}

module.exports = mongoose.model('MerchAnalytics', merchAnalyticsSchema);