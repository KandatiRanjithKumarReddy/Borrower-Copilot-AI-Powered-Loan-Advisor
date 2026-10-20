import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { pool } from '../config/db.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactInquiry(req: Request, res: Response): Promise<void> {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  if (name.trim().length > 100) {
    res.status(400).json({ error: 'Name must be 100 characters or fewer' });
    return;
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 255) {
    res.status(400).json({ error: 'Valid email address is required (under 255 characters)' });
    return;
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    res.status(400).json({ error: 'Subject is required' });
    return;
  }

  if (subject.trim().length > 200) {
    res.status(400).json({ error: 'Subject must be 200 characters or fewer' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  if (message.trim().length > 5000) {
    res.status(400).json({ error: 'Message must be 5000 characters or fewer' });
    return;
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO contact_inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), subject.trim(), message.trim()]
    );

    res.status(201).json({
      success: true,
      inquiryId: result.insertId,
      message: 'Thank you for reaching out. Your message has been received.',
    });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit contact inquiry' });
  }
}
