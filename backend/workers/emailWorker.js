const { Worker } = require('bullmq');
const { Resend } = require('resend');
const { redisConnection, resendMailingQueue } = require('../config/queue');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);
const unsubscribeUrl =  "https://docs.google.com/forms/d/e/1FAIpQLSfP9botmSTj_Vly-nVpzhuRX3462p8e2NISnVq_6_wL9r6zcg/viewform?usp=dialog"
const emailWorker = new Worker(
  'Resend-Queue',
  async (job) => {
    // Extract the dynamic data passed from the JSON route
    const { batch, subject, title,replyTo } = job.data;
    // console.log(`📦 Processing Job ${job.id}: Sending ${batch.length} emails.`);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // 2. FILTER OUT BAD EMAILS BEFORE SENDING TO RESEND
    const validBatch = batch.filter(recipient => {
      const emailStr = recipient.email ? recipient.email.trim() : '';
      return emailRegex.test(emailStr);
    });

    if (validBatch.length === 0) {
      console.log(`⚠️ Job ${job.id} skipped: No valid emails found in this batch.`);
      return { skipped: true };
    }

    console.log(`📦 Processing Job ${job.id}: Sending ${validBatch.length} valid emails (dropped ${batch.length - validBatch.length} bad ones).`);
    // Map the JSON array into Resend's payload structure
    const preparedPayloads = validBatch.map(recipient => ({
      from: '"Kabya from Technothlon" <contest@updates.technicheiitg.in>',
      to: [recipient.email.trim()],
      reply_to: replyTo,
      subject: `Details for Sunday's contest, ${recipient.name}`,
//       html: `
//         <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="utf-8">
//   <style>
//     /* Email clients require inline styles or simple embedded CSS */
//     body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #111827; margin: 0; padding: 0; background-color: #f9fafb; }
//     .container { max-width: 600px; margin: 20px auto; background: #ffffff; padding: 40px 30px; border-radius: 8px; border: 1px solid #e5e7eb; }
//     .main-title { font-size: 24px; font-weight: 800; text-align: center; margin-bottom: 30px; color: #111827; letter-spacing: -0.5px; }
//     .section-title { font-size: 20px; font-weight: 700; color: #111827; margin-top: 30px; margin-bottom: 15px; display: flex; align-items: center; }
//     p { margin-bottom: 16px; font-size: 15px; color: #374151; }
//     ul { margin-bottom: 24px; padding-left: 20px; color: #374151; }
//     li { margin-bottom: 8px; font-size: 14px; }
//     strong { color: #111827; }
//     .btn-container { text-align: center; margin: 30px 0; }
//     .btn { display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
//     .divider { border-top: 1px solid #e5e7eb; margin: 35px 0; }
//     .footer { margin-top: 40px; padding-top: 25px; border-top: 4px solid #f3f4f6; font-size: 12px; color: #6b7280; text-align: center; line-height: 1.8; }
//     .footer a { color: #6b7280; text-decoration: underline; }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="main-title">Technothlon 2026 is Calling You Back!</div>
    
//     <p>Dear ${recipient.name},</p>
//     <p>Greetings from Team Technothlon!</p>
//     <p>Ready to challenge your mind and have fun solving exciting logic problems? Join the Technothlon Mega Contest and get a taste of what Technothlon has to offer!</p>
    
//     <div class="section-title">🌟 Free Mega Contest!</div>
//     <p>Conducted by IIT Guwahati, the Mega Contest is your chance to put your wits to the ultimate test! Solve thrilling, brain-twisting puzzles crafted to challenge your logic, spark your creativity, and push your problem-solving skills to new heights.</p>
    
//     <ul>
//       <li><strong>Date:</strong> 21st June (Sunday)</li>
//       <li><strong>Time:</strong> 11:00 AM – 11:59 AM</li>
//       <li><strong>Entry:</strong> Free for all participants!</li>
//       <li><strong>Prizes:</strong> Exciting prizes await the top performers on the leaderboard.</li>
//       <li><strong>Discount Vouchers:</strong> Top 100 students will get scholarships on Team Registrations.</li>
//     </ul>
    
//     <div class="btn-container">
//       <a href="#" class="btn">Join the Mega Contest</a>
//     </div>
    
//     <div class="divider"></div>
    
//     <div class="section-title">📝 Register for Technothlon 2026</div>
//     <p>Loved what you saw? Take the next step and lock in your spot for the main examination. Team registrations are now open — grab your partner, secure your seat, and get ready to make this edition your best one yet.</p>
    
//     <ul>
//       <li>Form a team of 2 and register together.</li>
//       <li>Top 100 Mega Contest performers unlock exclusive registration scholarships.</li>
//       <li>Compete with the brightest young minds across the country.</li>
//     </ul>
    
//     <div class="btn-container">
//       <a href="#" class="btn">Register Now</a>
//     </div>
    
//     <div class="divider"></div>
    
//     <p>We would love to see some familiar names topping the leaderboards again this year. Gear up, trust your logic, and let the games begin!</p>
//     <div class="query-text">
//               💡 <strong>Have any questions?</strong> If you have any queries or require structural assistance, simply reply directly to this email.
//             </div>
    
//     <p>Best regards,<br>
//     <strong>Team Technothlon</strong></p>
    
//     <div class="footer">
//       Technothlon, Techniche, IIT Guwahati<br>
//       © 2026 Team Technothlon. All rights reserved.<br><br>
//       If you no longer wish to receive these emails, you can <a href="${unsubscribeUrl}">unsubscribe here</a>.
//     </div>
//   </div>
// </body>
// </html>
//       `,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #111; line-height: 1.5;">
          <p>Hi ${recipient.name},</p>
          
          <p>I'm reaching out from the Technothlon team at IIT Guwahati. I wanted to make sure you had the schedule for the upcoming Mega Contest on Sunday, June 21st at 11:00 AM.</p>
          
          <p>The top 100 performers will get fee waivers for the main team registrations later this year.</p>
          
          <p>You can register for the contest here: <a href="https://technothlon.techniche.org.in/mega-contest">https://technothlon.techniche.org.in/mega-contest</a></p>
          
          <p>Are you pairing up for this edition too? If yes, you can check the details on the website and register your team.<br>
          <p>Let me know if you have any questions. I'm happy to help.</p>
          <p>Best Regards,<br>Team Technothlon</p>

          <span style="color: #f9fafb; font-size: 10px; display: none;">Ref: ${Date.now()}-${Math.random().toString(36).substring(7)}</span>
        </div>
      `,
headers: {
        // Crucial: Spam filters read this header, so pass the Google Form link here too
        'List-Unsubscribe': `<${unsubscribeUrl}>`
      }
    }));

    const { data, error } = await resend.batch.send(preparedPayloads);

    if (error) {
      console.error(`❌ Dispatch Exception in Job ${job.id}:`, error.message);
      throw new Error(error.message);
    }

   // This will safely print the number of IDs returned by Resend
console.log(`✅ Job ${job.id} dispatched successfully. Processed ${data?.data?.length || data?.length || 'all'} records.`);
    return data;
  },
  {
    connection: redisConnection,
    // STRICT RATE LIMITING: 2 requests per second
    limiter: {
      max: 2, 
      duration: 1000, 
    },
    // Set concurrency to 1 to ensure batches process sequentially without bursting
    concurrency: 1 
  }
);

emailWorker.on('failed', (job, err) => {
  console.error(`💥 Sequence failure on Job ${job?.id}: ${err.message}`);
});

module.exports = emailWorker;