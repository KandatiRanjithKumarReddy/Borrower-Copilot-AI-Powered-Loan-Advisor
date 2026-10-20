import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitFeedback } from '../controllers/feedback.controller.js';

const router = Router();

const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 feedback submissions per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many feedback submissions. Please try again after 15 minutes.',
  },
});

router.post('/', feedbackLimiter, submitFeedback);

export default router;
