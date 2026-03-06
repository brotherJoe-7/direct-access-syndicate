require('dotenv').config();
const mysql = require('mysql2/promise');

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'das_receipts',
    });

    console.log('Connected to MySQL...');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS student_feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        teacher_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        feedback_text TEXT NOT NULL,
        credibility_score INT NOT NULL DEFAULT 5, /* out of 10 */
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES admins(id) ON DELETE CASCADE
      )
    `);

    console.log('Created student_feedbacks table successfully.');
    await connection.end();
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();
