import kue from 'kue';

const queue = kue.createQueue();

function sendNotification(phoneNumber, message) {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Process jobs from the queue
queue.process('push_notification_code', (job, done) => {
    // Extract data from the job
    const { phoneNumber, message } = job.data;
    
    // Call sendNotification with job data
    sendNotification(phoneNumber, message);
    
    // Mark the job as completed
    done();
}); 