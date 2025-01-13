const { Queue } = require("bullmq");
const emailQueue = new Queue("email-queue");

async function addEmailToQueue(to: string, sub: string, token: string) {
    const res = await emailQueue.add("email-to-person", {
        email: to,
        sub: sub,
        token: token,  
    });
    console.log(`Job added to queue with ID: ${res.id}`);
}

module.exports = {emailQueue, addEmailToQueue}; 
