const axios = require('axios');

async function testAllLogins() {
  const url = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const testCases = [
    { label: 'Admin', username: 'admin', password: 'admin123' },
    { label: 'Teacher', username: 'teacherjoe', password: 'joe123' },
    { label: 'Parent', username: 'parent@test.com', password: 'parent123' }
  ];

  console.log('--- LIVE MULTI-ROLE VERIFICATION ---');
  for (const test of testCases) {
    console.log(`Testing ${test.label}...`);
    try {
      const response = await axios.post(url, {
        username: test.username,
        password: test.password
      });
      console.log(`[PASS] ${test.label}: Status ${response.status} - Role: ${response.data.role}`);
    } catch (error) {
      console.log(`[FAIL] ${test.label}: ${error.response ? error.response.status : error.message}`);
      if (error.response && error.response.data) {
          console.log('Error Details:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

testAllLogins();
