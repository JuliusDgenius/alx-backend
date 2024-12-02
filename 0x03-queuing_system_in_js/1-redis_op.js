import redis from 'redis';

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

const displaySchoolValue = (schoolName) => {
  client.GET(schoolName, (err, value) => {
    if (err) {
      console.error(`Error getting value: ${err}`);
    } else {
      console.log(`${value}`);
    }
  });
};


displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
