const axios = require('axios');

async function testLiveLogin() {
  const url = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const credentials = {
    username: 'admin',
    password: 'admin123'
  };

  console.log(`Testing login at: ${url}`);
  try {
    const response = await axios.post(url, credentials);
    console.log('Login Successful!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Login Failed.');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLiveLogin();
