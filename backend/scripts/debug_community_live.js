const axios = require('axios');

async function debugCommunity() {
  const loginUrl = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const postUrl = 'https://direct-access-syndicate.vercel.app/api/community';
  const healthUrl = 'https://direct-access-syndicate.vercel.app/api/health';
  
  try {
    console.log('Checking Health...');
    const health = await axios.get(healthUrl);
    console.log('Health Status:', health.data);

    console.log('Logging in...');
    const { data: auth } = await axios.post(loginUrl, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Fetching Community Posts...');
    const response = await axios.get(postUrl, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    console.log('Fetch Success. Post Count:', response.data.length);
    
  } catch (error) {
    console.log('--- DEBUG FAILED ---');
    if (error.response) {
      console.log('Status:', error.response.status, 'Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

debugCommunity();
