const axios = require('axios');

async function testLiveLogin() {
  const url = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const credentials = {
    username: 'admin',
    password: 'admin123'
  };

  console.log(`Testing login at ${url}...`);
  try {
    const response = await axios.post(url, credentials);
    console.log('Login Result:', response.status, response.data);
  } catch (error) {
    console.error('Login Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLiveLogin();
