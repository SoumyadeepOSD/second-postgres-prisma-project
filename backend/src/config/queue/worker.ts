import { Worker, Job } from "bullmq";
import { RedisOptions } from "ioredis";
import sendEmail from "../email/send-mail";

const redisConfig: RedisOptions = {
    host: process.env.REDIS_HOST || 'localhost',  
    port: parseInt(process.env.REDIS_PORT || '6379', 10),  
};

// Worker to execute jobs from the "email-queue" queue
const emailWorker = new Worker('email-queue', async (job: Job) => {
    const { email, sub, token } = job.data;
    console.log(`Processing job: ${job.id}`);
    try {
        await sendEmail({ to: email, sub, token });
        console.log(`Email sent successfully for job ID: ${job.id}`);
    } catch (error) {
        console.error(`Failed to send email for job ID: ${job.id}`, error);
        throw error; 
    }
},{
    connection: redisConfig 
});

module.exports = emailWorker;