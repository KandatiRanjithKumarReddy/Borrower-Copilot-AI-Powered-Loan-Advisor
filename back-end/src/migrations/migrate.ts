import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log(`Connecting to MySQL at ${env.DB_HOST}:${env.DB_PORT} as ${env.DB_USER}...`);

  // First connect without specifying database to ensure it exists
  const connection = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: env.DB_SSL ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true,
  });

  try {
    console.log(`Ensuring database '${env.DB_NAME}' exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\`;`);
    await connection.query(`USE \`${env.DB_NAME}\`;`);

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log(`Applying schema from ${schemaPath}...`);
    await connection.query(schemaSql);

    console.log('✅ Migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runMigration();
