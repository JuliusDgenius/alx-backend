import kue from 'kue';

const blacklistedNumbers = ['4153518780', '4153518781']; 

function sendNotification(phoneNumber, message, job, done) {
    job.progress(0, 100);
    // Check if number is blacklisted
    if (blacklistedNumbers.includes(phoneNumber)) {
        return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    }
    // If not blacklisted, track 50% progress
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    // Mark job as completed
    done();
}

// Create the queue
const queue = kue.createQueue();

// Process 2 jobs at a time
queue.process('push_notification_code_2', 2, (job, done) => {
    // Extract job data
    const { phoneNumber, message } = job.data;
    
    // Process the notification
    sendNotification(phoneNumber, message, job, done);
});