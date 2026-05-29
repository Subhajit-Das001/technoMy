const {Queue} = require("bullmq");
const {Redis} = require("ioredis");


const redisConnection = new Redis({
    host: '127.0.0.1',
    port: 6379,
    maxRetriesPerRequest: null // Required by BullMQ
});

redisConnection.on('connect',()=> console.log("✅ Redis Connected Successfully"));
redisConnection.on('error',(err)=> console.log('❌ Redis connection error:', err));

const testQueue = new Queue('Test-Queue',{connection : redisConnection});
const csvProcessingQueue = new Queue('CSV-Queue',{connection : redisConnection});


module.exports = {
    redisConnection,
    testQueue,
    csvProcessingQueue
};