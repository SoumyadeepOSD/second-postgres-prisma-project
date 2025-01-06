const Queue = require("bull");

const notificationQueue = new Queue("first-queue");

async function init() {
    const res = await notificationQueue.add("email to Soumyadeep", {
        email: "four@gmail.com",
        subject: "Welcome message",
        body: "Hey Soumyadeep, welcome",
    });
    console.log(`Job added to Queue, ${res.id}`);
}

init();
