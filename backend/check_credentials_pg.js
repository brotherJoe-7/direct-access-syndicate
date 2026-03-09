const pool = require('./config/db');

async function getCredentials() {
  try {
    const { rows: admins } = await pool.query('SELECT username, password FROM admins');
    const { rows: parents } = await pool.query('SELECT email, password FROM parents');
    
    console.log('\x1b[32m%s\x1b[0m', '--- SYSTEM CREDENTIALS ---');
    console.log('Admins:');
    admins.forEach(a => console.log(`  - Username: ${a.username}`));
    
    console.log('Parents:');
    parents.forEach(p => console.log(`  - Email: ${p.email}`));
    console.log('\x1b[32m%s\x1b[0m', '-------------------------');
    
    console.log('\nNote: Passwords are encrypted. Use the default ones from the setup (admin123 / parent123) if you haven\'t changed them.');
  } catch (err) {
    console.error('Error retrieving credentials:', err.message);
  } finally {
    await pool.end();
  }
}

getCredentials();
