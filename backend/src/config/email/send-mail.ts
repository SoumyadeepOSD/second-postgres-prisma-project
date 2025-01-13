import nodemailer from "nodemailer";
import { Job } from "bullmq";
const emailWorker = require("../queue/worker");
require("dotenv").config();

interface emailType {
    to: string;
    sub: string;
    token: string;
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

// Function to send email
const sendEmail = async ({ to, sub, token }: emailType) => {
    await transporter.sendMail({
        to: to,
        subject: sub,
        html: `
            <h1>Your Verification Link</h1>
            <div>
                <button style="background: blue; border: none; padding: 10px; border-radius: 5px;">
                    <a href="http://localhost:5173/verify-token?token=${token}" style="text-decoration: none; color: white;">
                        Verify
                    </a>
                </button>
            </div>
        `
    });
    console.log("Email sent");
};

emailWorker.on('completed', (job: Job) => {
    console.log(`Job ${job.id} completed successfully.`);
});

emailWorker.on('failed', (job: any, failedReason: any) => {
    console.log(`Job ${job.id} failed due to ${failedReason}`);
});

// Optionally, handle worker's error
emailWorker.on('error', (error: Error) => {
    console.error('Worker encountered an error:', error);
});


export default sendEmail;
