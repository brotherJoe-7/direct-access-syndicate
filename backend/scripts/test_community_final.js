const axios = require('axios');

async function testCommunityMultiRole() {
  const loginUrl = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const postUrl = 'https://direct-access-syndicate.vercel.app/api/community';
  
  const testUsers = [
    { label: 'Admin', username: 'admin', password: 'admin123' },
    { label: 'Parent', username: 'parent@test.com', password: 'parent123' }
  ];

  console.log('--- LIVE MULTI-ROLE COMMUNITY VERIFICATION ---');
  
  for (const user of testUsers) {
    try {
      console.log(`Testing ${user.label}...`);
      const { data: auth } = await axios.post(loginUrl, {
        username: user.username,
        password: user.password
      });
      
      const response = await axios.post(postUrl, 
        { message: `Verification post from ${user.label} role.` },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      
      console.log(`[PASS] ${user.label} created post. Response:`, {
          id: response.data.id,
          role: response.data.author_role,
          admin_id: response.data.admin_id,
          parent_id: response.data.parent_id
      });
    } catch (error) {
      console.log(`[FAIL] ${user.label} test failed.`);
      if (error.response) {
          console.log('Status:', error.response.status, 'Data:', error.response.data);
      } else {
          console.log('Error:', error.message);
      }
    }
  }
}

testCommunityMultiRole();
