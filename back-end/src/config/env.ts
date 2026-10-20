import dotenv from 'dotenv';
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET;

if (isProd && (!jwtSecret || jwtSecret === 'fallback-dev-secret')) {
  throw new Error('FATAL: JWT_SECRET environment variable must be set to a secure, unique secret in production.');
}

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://borrower-copilot-pi.vercel.app',

  // MySQL
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'borrower_copilot',
  DB_SSL: process.env.DB_SSL === 'true',

  // Auth
  JWT_SECRET: jwtSecret || 'fallback-dev-secret',

  // Gemini AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
} as const;
