const {Queue} = require("bullmq");
const {Redis} = require("ioredis");
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
const envResult = dotenv.config({ path: envPath });
if (envResult && envResult.error) {
  dotenv.config();
}

const redisPassword = (process.env.REDIS_PASSWORD || '').trim();
const redisConfig = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: redisPassword || undefined,
};
const redisConnection = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null, tls: process.env.REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined })
  : new Redis(redisConfig);

redisConnection.on('connect',()=> console.log("✅ Redis Connected Successfully"));
redisConnection.on('error',(err)=> console.log('❌ Redis connection error:', err));

const testQueue = new Queue('Test-Queue',{connection : redisConnection});
const csvProcessingQueue = new Queue('CSV-Queue',{connection : redisConnection});
//For RESEND API MAILING
const resendMailingQueue = new Queue('Resend-Queue', {connection : redisConnection});
// for 13-Mails Mailing
const smtpMailingQueue = new Queue('SMTP-Queue', {connection : redisConnection});


module.exports = {
    redisConnection,
    testQueue,
    csvProcessingQueue,
    resendMailingQueue,
    smtpMailingQueue
};