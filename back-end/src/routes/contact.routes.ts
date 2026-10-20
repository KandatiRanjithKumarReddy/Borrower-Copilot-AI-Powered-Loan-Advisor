import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitContactInquiry } from '../controllers/contact.controller.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 contact submissions per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many contact inquiries sent from your device. Please try again in 15 minutes.',
  },
});

router.post('/', contactLimiter, submitContactInquiry);

export default router;
