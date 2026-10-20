import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../config/db.js';
import { hashPassword, comparePassword, signToken } from '../services/auth.service.js';
import { AuthRequest } from '../middleware/auth.js';
import { env } from '../config/env.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID || undefined);

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string | null;
  name: string;
  google_id?: string | null;
  created_at: Date;
}

export async function register(req: AuthRequest, res: Response): Promise<void> {
  const { email, password, name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  if (name.trim().length > 100) {
    res.status(400).json({ error: 'Name must be 100 characters or fewer' });
    return;
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 255) {
    res.status(400).json({ error: 'Valid email address is required (maximum 255 characters)' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
    res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  try {
    const [existing] = await pool.query<UserRow[]>(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existing.length > 0) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [normalizedEmail, passwordHash, trimmedName]
    );

    const userId = result.insertId;
    const token = signToken({ userId, email: normalizedEmail });

    res.status(201).json({
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        name: trimmedName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const normalizedEmail = (email as string).trim().toLowerCase();

  try {
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, email, password_hash, name FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (users.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = users[0];

    if (!user.password_hash) {
      res.status(401).json({
        error: 'This account was created via Google Sign-In. Please sign in with Google.',
      });
      return;
    }

    const isMatch = await comparePassword(password as string, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = users[0];
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { name } = req.body;

  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    res.status(400).json({ error: 'Name cannot be empty' });
    return;
  }

  if (name.trim().length > 100) {
    res.status(400).json({ error: 'Name must be 100 characters or fewer' });
    return;
  }

  try {
    await pool.query('UPDATE users SET name = ? WHERE id = ?', [name.trim(), userId]);
    const [users] = await pool.query<UserRow[]>(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      id: users[0].id,
      email: users[0].email,
      name: users[0].name,
      createdAt: users[0].created_at,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
  const { credential } = req.body;

  if (!credential || typeof credential !== 'string' || credential.trim().length === 0) {
    res.status(400).json({ error: 'Google ID token credential is required' });
    return;
  }

  let email: string;
  let name: string;
  let googleId: string;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential.trim(),
      audience: env.GOOGLE_CLIENT_ID || undefined,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(401).json({ error: 'Invalid Google token: email missing from credential' });
      return;
    }

    email = payload.email;
    name = (payload.name || payload.email.split('@')[0] || 'Google User').trim().slice(0, 100);
    googleId = payload.sub;
  } catch (verifyErr) {
    console.error('Google token verification failed:', verifyErr);
    res.status(401).json({ error: 'Invalid or expired Google authentication credential' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const [existing] = await pool.query<UserRow[]>(
      'SELECT id, email, name, google_id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    let userId: number;
    let userName: string;

    if (existing.length > 0) {
      userId = existing[0].id;
      userName = existing[0].name;
      if (!existing[0].google_id && googleId) {
        await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, userId]);
      }
    } else {
      const [insertRes] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (email, name, google_id) VALUES (?, ?, ?)',
        [normalizedEmail, name, googleId]
      );
      userId = insertRes.insertId;
      userName = name;
    }

    const token = signToken({ userId, email: normalizedEmail });
    res.status(200).json({
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        name: userName,
      },
    });
  } catch (error) {
    console.error('Google auth database error:', error);
    res.status(500).json({ error: 'Failed to process Google account' });
  }
}
