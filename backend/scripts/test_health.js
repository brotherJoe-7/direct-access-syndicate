const axios = require('axios');

async function testHealth() {
  const url = 'https://direct-access-syndicate.vercel.app/api/';
  console.log(`Testing health at: ${url}`);
  try {
    const response = await axios.get(url);
    console.log('API is ALIVE!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('API is DEAD.');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testHealth();
