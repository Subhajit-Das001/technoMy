const express = require('express');
const router = express.Router();
const MerchAnalytics = require('../models/MerchAnalytics');

// Ensure a single analytics doc exists
async function getOrCreateAnalytics() {
  let doc = await MerchAnalytics.findOne();
  if (!doc) doc = await MerchAnalytics.create({});
  return doc;
}

// Increment Start Shopping button count
router.post('/click', async (req, res) => {
  try {
    const doc = await getOrCreateAnalytics();
    doc.count += 1;
    doc.lastCountDate = new Date();
    await doc.save();
    res.json({ count: doc.count, lastCountDate: doc.lastCountDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Increment Merch nav count
router.post('/navclick', async (req, res) => {
  try {
    const doc = await getOrCreateAnalytics();
    doc.navCount += 1;
    doc.navLastCountDate = new Date();
    await doc.save();
    res.json({ navCount: doc.navCount, navLastCountDate: doc.navLastCountDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics (for display)
router.get('/analytics', async (req, res) => {
  try {
    const doc = await getOrCreateAnalytics();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;