const express = require('express');
const router = express.Router(); // If using standard express, or const router = express.Router();
const { resendMailingQueue } = require('../config/queue');
// Standard JSON body parser (make sure app.use(express.json({ limit: '50mb' })) is in your server.js to handle large arrays)
router.post('/dispatch-json', async (req, res) => {
  try {
    // 1. Destructure the dynamic payload
    const { 
      campaignName, 
      subject, 
      title, 
      replyTo,
      recipients 
    } = req.body;

    // 2. Validate inputs
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients array is missing or empty.' });
    }
    if (!subject || !title || !replyTo ) {
      return res.status(400).json({ error: 'Missing subject, title.' });
    }

    const BATCH_SIZE = 90; // Resend's batch limit
    let queuedJobsCount = 0;

    // 3. Chunk the array into batches of 100
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const splitBatch = recipients.slice(i, i + BATCH_SIZE);
      
      // 4. Push to Redis
      await resendMailingQueue.add(
        `${campaignName}_batch_${Date.now()}_${i}`,
        {
          batch: splitBatch,
          subject: subject,
          title: title,
          replyTo: replyTo,
        },
        {
          attempts: 3,
          backoff: { type: 'exponential', delay: 3000 },
          removeOnComplete: true,   
        }
      );
      queuedJobsCount++;
    }

    return res.status(202).json({
      message: `Successfully queued ${recipients.length} participants across ${queuedJobsCount} batches.`,
      campaign: campaignName
    });

  } catch (err) {
    console.error('JSON Route Exception:', err);
    return res.status(500).json({ error: 'Internal system pipeline allocation failure.' });
  }
});
router.get('/health', async (req,res)=> {
    res.send("Hello from Resend Mailing Route");
})

module.exports = router;