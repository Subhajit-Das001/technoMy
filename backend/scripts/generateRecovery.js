const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const fs = require('fs');
require('dotenv').config();

const redisConnection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
const emailQueue = new Queue('Resend-Queue', { connection: redisConnection });

const isValidEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

async function generateRecoveryPayload() {
  console.log('🔍 Fetching failed batches from Redis...');
  const failedJobs = await emailQueue.getFailed();
  
  if (failedJobs.length === 0) {
    console.log('⚠️ No failed jobs found in the queue.');
    process.exit(0);
  }

  const allCleanRecipients = [];
  
  // Grab the metadata from the first failed job to use as the template
  const referenceData = failedJobs[0].data;

  // Flatten all 14 batches into a single array of valid recipients
  for (const job of failedJobs) {
    const { batch } = job.data;
    
    for (const recipient of batch) {
      if (isValidEmail(recipient.email)) {
        allCleanRecipients.push({
          name: recipient.name ? recipient.name.trim() : 'Participant',
          email: recipient.email.trim().toLowerCase()
        });
      }
    }
  }

  // Structure the final object exactly for the /dispatch-json Postman route
  const recoveryPayload = {
    campaignName: "Recovery_Campaign_Blast",
    subject: referenceData.subject || "Details for Sunday's contest",
    title: referenceData.title || "Technothlon 2026 is Calling You Back!",
    replyTo: referenceData.replyTo || "abc@technicheiitg.in",
    unsubscribeUrl: referenceData.unsubscribeUrl || "https://forms.gle/YOUR_FORM",
    recipients: allCleanRecipients
  };

  // Write it to a file you can copy-paste into Postman
  fs.writeFileSync('recovery_postman_body.json', JSON.stringify(recoveryPayload, null, 2));

  console.log(`✅ Recovery JSON generated!`);
  console.log(`Saved ${allCleanRecipients.length} clean emails into 'recovery_postman_body.json'`);
  process.exit(0);
}

generateRecoveryPayload();