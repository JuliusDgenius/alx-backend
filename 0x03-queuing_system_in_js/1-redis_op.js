import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err}`);
});

const setNewSchool = (schoolName, value) => {
  return client.SET(schoolName, value, (err, reply) => {
    if (err) {
      console.error(`Error setting value: ${err}`);
    } else {
      redis.print(`Reply: Okay`);
    }
  });
};

const getAsync = promisify(client.GET);

const displaySchoolValue = async (schoolName) => {
  try {
    const value = await getAsync(schoolName);
    console.log(`${schoolName}: ${value}`);
    redis.print(`Reply: ${value}`);
  } catch (err) {
    console.error(`Error getting value: ${err}`);
  }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
