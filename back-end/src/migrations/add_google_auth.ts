import { pool } from '../config/db.js';

async function run() {
  try {
    console.log('Modifying users table to allow Google authentication...');
    await pool.query('ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL');
    console.log('✅ password_hash is now NULLABLE');

    try {
      await pool.query('ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL UNIQUE AFTER password_hash');
      console.log('✅ google_id column added');
    } catch (e: any) {
      if (e.message.includes('Duplicate column')) {
        console.log('ℹ️ google_id column already exists');
      } else {
        throw e;
      }
    }

    console.log('✅ Database migration for Google auth completed!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

run();
