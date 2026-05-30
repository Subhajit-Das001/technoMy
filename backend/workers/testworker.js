const {Worker} = require("bullmq");
const {redisConnection}= require('../config/queue');

const testWorker = new Worker("Test-Queue", 
    async (job)=> {
        console.log(` Worker picked up job ${job.id}`);
        console.log(`📦 Payload received:`, job.data);

        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`✅ Job ${job.id} completed successfully!\n`);

        return { status: 'success', message: `Processed ${job.data.testMessage}` };
    },{connection  :redisConnection})


    testWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed with error: ${err.message}`);
});

console.log('🎧 Test Worker is listening for jobs...');