const axios = require('axios');

async function testCommunityPost() {
  const loginUrl = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const postUrl = 'https://direct-access-syndicate.vercel.app/api/community';
  
  try {
    console.log('Logging in as admin...');
    const { data: auth } = await axios.post(loginUrl, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Creating a community post...');
    const response = await axios.post(postUrl, 
      { message: 'Testing community forum stabilization.' },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    
    console.log('Post Created Successfully:', response.data);
    
    console.log('Fetching posts...');
    const getResponse = await axios.get(postUrl, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    console.log('Posts fetched:', getResponse.data.length);
  } catch (error) {
    console.log('Community Test Failed.');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCommunityPost();
