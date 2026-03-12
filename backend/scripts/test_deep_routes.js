const axios = require('axios');

async function testDeepRoutes() {
  const loginUrl = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const roles = [
    { label: 'Admin', username: 'admin', password: 'admin123', route: '/api/dashboard/stats' },
    { label: 'Teacher', username: 'teacherjoe', password: 'joe123', route: '/api/staff/me' }, // Assuming this exists or pick another
    { label: 'Parent', username: 'parent@test.com', password: 'parent123', route: '/api/parents/profile' }
  ];

  console.log('--- DEEP ROUTE VERIFICATION ---');
  for (const role of roles) {
    try {
      console.log(`Testing ${role.label} access to ${role.route}...`);
      const { data: auth } = await axios.post(loginUrl, {
        username: role.username,
        password: role.password
      });
      
      const response = await axios.get(`https://direct-access-syndicate.vercel.app${role.route}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
      });
      console.log(`[PASS] ${role.label} successfully accessed ${role.route}`);
    } catch (error) {
      console.log(`[FAIL] ${role.label} failed: ${error.response ? error.response.status : error.message}`);
    }
  }
}

testDeepRoutes();
