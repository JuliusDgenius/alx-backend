import kue from 'kue';

const queue = kue.createQueue();

// Create job data
const jobData = {
  phoneNumber: '4153518780',
  message: 'This is the code to verify your account'
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (!err) {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Add job event listeners
job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', () => {
  console.log('Notification job failed');
});
