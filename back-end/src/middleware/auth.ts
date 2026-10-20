import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service.js';

export interface AuthenticatedUser {
  id: number;
  email: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.userId,
      email: payload.email,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
