// reset_credentials.js — Reset admin and parent credentials in production DB
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function resetCredentials() {
  try {
    console.log('Connecting to database...');
    console.log('Using POSTGRES_URL:', process.env.POSTGRES_URL ? 'YES (production)' : 'NO (local)');

    // Force reset admin password to admin123
    const adminHash = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    const adminCheck = await pool.query("SELECT * FROM admins WHERE username = 'admin'");
    if (adminCheck.rows.length > 0) {
      await pool.query("UPDATE admins SET password = $1 WHERE username = 'admin'", [adminHash]);
      console.log('✅ Admin password reset to admin123');
    } else {
      await pool.query(
        "INSERT INTO admins (username, password) VALUES ('admin', $1)",
        [adminHash]
      );
      console.log('✅ Admin account created with admin123');
    }

    // Force reset parent password
    const parentHash = await bcrypt.hash('parent123', 10);
    
    const parentCheck = await pool.query("SELECT * FROM parents WHERE email = 'parent@test.com'");
    if (parentCheck.rows.length > 0) {
      await pool.query("UPDATE parents SET password = $1 WHERE email = 'parent@test.com'", [parentHash]);
      console.log('✅ Parent password reset to parent123');
    } else {
      await pool.query(
        "INSERT INTO parents (parent_name, email, password) VALUES ('Test Parent', 'parent@test.com', $1)",
        [parentHash]
      );
      console.log('✅ Parent account created with parent123');
    }

    // Print current admins
    const admins = await pool.query("SELECT id, username FROM admins");
    console.log('\n📋 Current Admins:', admins.rows);

    // Print current parents
    const parents = await pool.query("SELECT id, parent_name, email FROM parents LIMIT 5");
    console.log('📋 Current Parents:', parents.rows);

    console.log('\n✅ Credentials reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetCredentials();
