const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Connected to database');

    // Check if column exists
    const [rows] = await connection.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'is_locked'`
    );

    if (rows.length > 0) {
      console.log('✅ Column is_locked already exists');
    } else {
      // Add column if it doesn't exist
      await connection.query(
        'ALTER TABLE users ADD COLUMN is_locked TINYINT DEFAULT 0'
      );
      console.log('✅ Column is_locked added successfully');
    }

    await connection.end();
    console.log('✅ Migration completed');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  }
}

runMigration();
