import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { testDbConnection } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import contactRoutes from './routes/contact.routes.js';
import feedbackRoutes from './routes/feedback.routes.js';

const app = express();

// Allowed origins for CORS (production frontend + local dev + vercel previews)
const allowedOrigins = [
  'https://borrower-copilot-pi.vercel.app',
  'https://borrower-copilot.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
];

if (env.CORS_ORIGIN) {
  env.CORS_ORIGIN.split(',').forEach((origin) => {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

// Security & utility middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. server-to-server, curl, mobile)
    if (!origin) return callback(null, true);

    // Explicitly allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel deployment preview / branch URLs (*.vercel.app)
    try {
      const parsedUrl = new URL(origin);
      if (parsedUrl.hostname === 'vercel.app' || parsedUrl.hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch {
      // Ignore invalid URL parse
    }

    // Allow localhost/127.0.0.1 on any port during local development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root status endpoint (shows active status for Vercel preview)
app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'Borrower Copilot API',
    status: 'online',
    version: '1.0.0',
    endpoints: ['/api/health', '/api/auth', '/api/assessments', '/api/contact', '/api/feedback'],
  });
});

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  const dbOk = await testDbConnection();
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'error',
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(env.PORT, () => {
    console.log(`🚀 Borrower Copilot backend running on port ${env.PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

export default app;
export { app };
