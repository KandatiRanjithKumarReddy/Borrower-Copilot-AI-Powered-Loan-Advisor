import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import {
  create,
  list,
  getOne,
  generateSummary,
  previewSummary,
} from '../controllers/assessment.controller.js';

const router = Router();

const isDev = process.env.NODE_ENV !== 'production';

// Per-user rate limiter for AI summary generation: 30/hr in dev, 5/hr in prod
const aiSummaryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 30 : 5,
  keyGenerator: (req) => String((req as AuthRequest).user?.id || req.ip),
  message: {
    error: 'Too many AI summary requests. Limit is 5 requests per hour per user. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for unauthenticated preview AI summaries: 30/hr in dev, 10/hr in prod
const previewSummaryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 30 : 10,
  message: {
    error: 'Too many preview AI summary requests. Please sign in or try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for creating assessments: 30 requests per user/IP per hour
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  keyGenerator: (req) => String((req as AuthRequest).user?.id || req.ip),
  message: {
    error: 'Assessment creation limit reached. Please try again in a little while.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', authMiddleware, createLimiter, create);
router.post('/preview-summary', previewSummaryLimiter, previewSummary);
router.get('/', authMiddleware, list);
router.get('/:id', authMiddleware, getOne);
router.post('/:id/ai-summary', authMiddleware, aiSummaryLimiter, generateSummary);

export default router;
