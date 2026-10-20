import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { pool } from '../config/db.js';

const VALID_CATEGORIES = ['Idea', 'Problem', 'Other'] as const;
type FeedbackCategory = (typeof VALID_CATEGORIES)[number];

/**
 * POST /api/feedback
 * Accepts { category: 'Idea' | 'Problem' | 'Other', message: string }
 * Optional Authorization header — if present, associates user_id.
 */
export async function submitFeedback(req: Request, res: Response): Promise<void> {
  const { category, message } = req.body;

  // Validate category
  if (!category || !VALID_CATEGORIES.includes(category as FeedbackCategory)) {
    res.status(400).json({ error: 'Category must be one of: Idea, Problem, Other' });
    return;
  }

  // Validate message
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'Feedback message is required' });
    return;
  }

  if (message.trim().length > 2000) {
    res.status(400).json({ error: 'Feedback message must be 2000 characters or fewer' });
    return;
  }

  // Extract optional user_id from JWT (if auth header present)
  let userId: number | null = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const { verifyToken } = await import('../services/auth.service.js');
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      userId = payload.userId;
    }
  } catch {
    // Token invalid or expired — proceed as anonymous feedback
    userId = null;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO feedback (user_id, category, message) VALUES (?, ?, ?)',
      [userId, category, message.trim()]
    );

    res.status(201).json({
      success: true,
      feedbackId: result.insertId,
      message: 'Thank you for your feedback! We appreciate you helping us improve.',
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to submit feedback. Please try again.' });
  }
}
