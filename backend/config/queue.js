const {Queue} = require("bullmq");
const {Redis} = require("ioredis");


const redisConfig = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};
const redisConnection = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null, tls: process.env.REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined })
  : new Redis(redisConfig);

redisConnection.on('connect',()=> console.log("✅ Redis Connected Successfully"));
redisConnection.on('error',(err)=> console.log('❌ Redis connection error:', err));

const testQueue = new Queue('Test-Queue',{connection : redisConnection});
const csvProcessingQueue = new Queue('CSV-Queue',{connection : redisConnection});


module.exports = {
    redisConnection,
    testQueue,
    csvProcessingQueue
};