const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const { redisConnection} = require('../config/queue');
require('dotenv').config();

const unsubscribeUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfP9botmSTj_Vly-nVpzhuRX3462p8e2NISnVq_6_wL9r6zcg/viewform?usp=dialog";

// 1. Configure Accounts & Weights

////////////////////////////////////////////////////////////////////////////////////////
//////// Make Sure to delete these credentials before pushing to PROD /////////////////
//////////////////////////////////////////////////////////////////////////////////////
const smtpCredentials = [
 
  // ... Add all 13 accounts here
];

const transporterPool = [];

// 2. Build the Weighted Concurrent Pool
smtpCredentials.forEach(cred => {
  const transporter = nodemailer.createTransport({
    pool: true, 
    maxConnections: 1, // Restrict to 1 connection per transporter to protect Server IP
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: cred.user,
      pass: cred.pass,
    }
  });

  // Workspace gets 4 slots in the array, standard gets 1
  const weight = cred.isWorkspace ? 4 : 1;
  for (let i = 0; i < weight; i++) {
    transporterPool.push({
      user: cred.user,
      transporter: transporter
    });
  }
});

async function isDomainValid(email) {
  const domain = email.split('@')[1];
  try {
    const addresses = await dns.resolveMx(domain);
    return addresses && addresses.length > 0;
  } catch (err) {
    return false; 
  }
}

const smtpWorker = new Worker(
  'SMTP-Queue',
  async (job) => {
    if (transporterPool.length === 0) {
      console.error(`🚨 FATAL: All SMTP accounts have reached their daily limits!`);
      // Throwing an error stops the job and throws it into the "failed" tab in Redis,
      // protecting the 100 emails so you can retry them tomorrow.
      throw new Error('SYSTEM_HALTED_QUOTAS_EXHAUSTED');
    }
    const { batch, subject, replyTo } = job.data;
    
    // Validate Emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validBatch = batch.filter(recipient => {
      const emailStr = recipient.email ? recipient.email.trim() : '';
      return emailRegex.test(emailStr);
    });

    if (validBatch.length === 0) return { skipped: true };

    console.log(`\n🚀 STARTING CONCURRENT BATCH ${job.id}: Processing ${validBatch.length} emails...`);

    const teamNames = ['Kabya', 'Poulomi', 'Deep', 'Uday', 'Ritik'];
    let successCount = 0;

    // 3. Slice the batch into Micro-Chunks matching our exact pool size
    const chunkSize = transporterPool.length; 

    for (let i = 0; i < validBatch.length; i += chunkSize) {
      const chunk = validBatch.slice(i, i + chunkSize);
      
      // Map the chunk to the available transporters for concurrent firing
      const dispatchPromises = chunk.map(async (recipient, index) => {
        const targetEmail = recipient.email.trim().toLowerCase();
        
        // Deep Domain Check
        const domainAcceptsMail = await isDomainValid(targetEmail);
        if (!domainAcceptsMail) {
          console.log(`  ❌ Dropped ${targetEmail} (Invalid Domain)`);
          return false; // Skip
        }

        // Lock in the specific account for this specific email in the chunk
        const activeAccount = transporterPool[index];
        const randomSenderName = teamNames[Math.floor(Math.random() * teamNames.length)];
        const uniqueRef = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const mailOptions = {
          from: `"${randomSenderName} from Technothlon" <${activeAccount.user}>`,
          to: targetEmail,
          replyTo: replyTo || 'technothlon.iitg@gmail.com',
          subject: `Details for Sunday's contest, ${recipient.name}`,
          
          // 1. ADD THIS: The raw text fallback (Crucial for Primary Tab placement)
          text: `Hi ${recipient.name},\n\nI'm reaching out from the Technothlon team at IIT Guwahati. I wanted to make sure you had the schedule for the upcoming Mega Contest on Sunday, June 21st at 11:00 AM.\n\nThe top 100 performers will get fee waivers for the main team registrations later this year.\n\nYou can register for the contest here: https://technothlon.techniche.org.in/mega-contest\n\nAre you pairing up for this edition too? If yes, you can check the details on the website and register your team.\n\nIf you have any questions, mail me at: technothlon.iitg@gmail.com\n\nBest Regards,\n${randomSenderName}\nChief-Organiser\nTeam Technothlon\n\nRef: ${uniqueRef}`,
          
          // 2. STRIPPED HTML: Removed the wrapper styling and made the Ref visible but subtle
          html: `
            <p>Hi ${recipient.name},</p>
            
            <p>I'm reaching out from the Technothlon team at IIT Guwahati. I wanted to make sure you had the schedule for the upcoming Mega Contest on Sunday, June 21st at 11:00 AM.</p>
            
            <p>The top 100 performers will get fee waivers for the main team registrations later this year.</p>
            
            <p>You can register for the contest here:<br>
            <a href="https://technothlon.techniche.org.in/mega-contest">https://technothlon.techniche.org.in/mega-contest</a></p>
            
            <p>Are you pairing up for this edition too? If yes, you can check the details on the website and register your team.</p>
            
            <p>If you have any questions, mail me at: <strong>technothlon.iitg@gmail.com</strong></p>
            
            <p>Best Regards,<br>
            ${randomSenderName}<br>
            Chief-Organiser<br>
            Team Technothlon</p>

            <p style="font-size: 11px; color: #a3a3a3; margin-top: 40px;">Ref: ${uniqueRef}</p>
          `
        };

        try {
          await activeAccount.transporter.sendMail(mailOptions);
          successCount++;
          return true;
        } catch (error) {
            const errMsg = error.message.toLowerCase();
          
          // ==========================================
          // 🚨 QUOTA EXHAUSTION DETECTOR
          // ==========================================
          if (errMsg.includes('limit exceeded') || errMsg.includes('quota') || errMsg.includes('5.4.5') || errMsg.includes('421 4.7.0')) {
            console.error(`\n🔥 QUOTA HIT: ${activeAccount.user} is maxed out for the day! Removing from rotation...`);
            
            // Remove EVERY instance of this account from the transporterPool array
            for (let k = transporterPool.length - 1; k >= 0; k--) {
              if (transporterPool[k].user === activeAccount.user) {
                transporterPool.splice(k, 1);
              }
            }
            
            console.log(`📊 Active slots remaining in pool: ${transporterPool.length}\n`);
          } else {
            // Standard error (e.g., bad address, temporary network glitch)
            console.error(`  ⚠️ Failed ${targetEmail} via ${activeAccount.user}:`, error.message);
          }
        //   console.error(`  ⚠️ Failed ${targetEmail} via ${activeAccount.user}:`, error.message);
          return false;
        }
      });

      // FIRE THE CONCURRENT BURST
      await Promise.allSettled(dispatchPromises);
      
      // Micro-Pause: Wait 2.5 seconds before firing the next 16 accounts
      await new Promise(resolve => setTimeout(resolve, 2500));
    }

    console.log(`✅ BATCH ${job.id} COMPLETED: ${successCount} emails delivered.`);
    console.log(`⏳ Entering 90-second global cooldown period before next batch...`);
    
    // GLOBAL COOLDOWN: 1.5 minutes rest to reset Gmail velocity flags
    await new Promise(resolve => setTimeout(resolve, 100000));
    
    return { delivered: successCount };
  },
  {
    connection: redisConnection,
    concurrency: 1 // Crucial: Keep at 1. The concurrency is now handled INSIDE the job.
  }
);

smtpWorker.on('failed', (job, err) => {
  console.error(`💥 Fatal error on Job ${job?.id}: ${err.message}`);
});

module.exports = smtpWorker;
console.log('🎧 SMTP Mailing Worker is listening for jobs...');