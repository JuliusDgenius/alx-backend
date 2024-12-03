import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

// Create Redis client
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Create Kue queue
const queue = kue.createQueue();

let reservationEnabled = true;

// Redis functions
async function reserveSeat(number) {
    await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
    const seats = await getAsync('available_seats');
    return parseInt(seats) || 0;
}

// Initialize seats
reserveSeat(50);

// Create express app
const app = express();

app.get('/available_seats', async (req, res) => {
    const numberOfAvailableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: 'Reservation are blocked' });
    }

    const job = queue.create('reserve_seat', {})
        .save((err) => {
            if (err) {
                return res.json({ status: 'Reservation failed' });
            }
            res.json({ status: 'Reservation in process' });
        });

    job.on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    });
});

app.get('/process', async (req, res) => {
    res.json({ status: 'Queue processing' });

    queue.process('reserve_seat', async (job, done) => {
        const currentSeats = await getCurrentAvailableSeats();
        const newSeats = currentSeats - 1;

        if (newSeats >= 0) {
            await reserveSeat(newSeats);
            if (newSeats === 0) {
                reservationEnabled = false;
            }
            done();
        } else {
            done(new Error('Not enough seats available'));
        }
    });
});

const port = 1245;
app.listen(port, () => {
    console.log(`API available on localhost port ${port}`);
});
