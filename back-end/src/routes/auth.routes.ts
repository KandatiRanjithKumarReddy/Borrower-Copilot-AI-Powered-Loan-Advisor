import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, me, updateProfile, googleAuth } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Protect authentication routes against brute-force and credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 auth attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/google', authLimiter, googleAuth);
router.get('/me', authMiddleware, me);
router.put('/me', authMiddleware, updateProfile);

export default router;
