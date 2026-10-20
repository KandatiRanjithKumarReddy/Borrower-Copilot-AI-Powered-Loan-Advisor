import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { createAssessment, listByUser, getById } from '../services/assessment.service.js';
import { generateAiSummary } from '../services/gemini.service.js';
import type { AssessmentInput } from '../engine/types.js';

interface AiSummaryRow extends RowDataPacket {
  id: number;
  assessment_id: number;
  summary_text: string;
  model_used: string;
  created_at: Date;
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const input = req.body as AssessmentInput;

  // Validation of AssessmentInput shape and bounds
  if (
    !input ||
    !input.borrower ||
    typeof input.borrower.monthlyIncome !== 'number' ||
    isNaN(input.borrower.monthlyIncome) ||
    input.borrower.monthlyIncome <= 0 ||
    !input.loan ||
    typeof input.loan.requestedAmount !== 'number' ||
    isNaN(input.loan.requestedAmount) ||
    input.loan.requestedAmount <= 0 ||
    !input.financial ||
    typeof input.financial.householdExpenses !== 'number' ||
    isNaN(input.financial.householdExpenses) ||
    input.financial.householdExpenses < 0
  ) {
    res.status(400).json({
      error: 'Invalid assessment input: monthly income and requested amount must be valid positive numbers.',
    });
    return;
  }

  if (input.loan.requestedAmount > 100000000) {
    res.status(400).json({ error: 'Requested amount exceeds maximum calculation limit (₹10 crore).' });
    return;
  }

  try {
    const created = await createAssessment(userId, input);
    res.status(201).json({
      id: created.id,
      result: created.result,
      createdAt: created.createdAt,
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ error: 'Failed to compute assessment' });
  }
}

export async function list(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '20', 10);

  try {
    const data = await listByUser(userId, page, limit);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error listing assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
}

export async function getOne(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const assessmentId = parseInt(rawId, 10);
  if (isNaN(assessmentId)) {
    res.status(400).json({ error: 'Invalid assessment ID' });
    return;
  }

  try {
    const assessment = await getById(assessmentId, userId);
    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error('Error getting assessment:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
}

export async function generateSummary(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const assessmentId = parseInt(rawId, 10);
  if (isNaN(assessmentId)) {
    res.status(400).json({ error: 'Invalid assessment ID' });
    return;
  }

  try {
    const assessment = await getById(assessmentId, userId);
    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    // Check if assessment is older than 90 days
    const ageDays = (Date.now() - new Date(assessment.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 90) {
      res.status(400).json({ error: 'Assessment is older than 90 days. Please run a new assessment.' });
      return;
    }

    const force = req.query.force === 'true' || (req.body && req.body.force === true);

    // Check cache in ai_summaries table unless force regeneration is requested
    if (!force) {
      const [cached] = await pool.query<AiSummaryRow[]>(
        'SELECT summary_text, model_used, created_at FROM ai_summaries WHERE assessment_id = ?',
        [assessmentId]
      );

      if (cached.length > 0) {
        res.status(200).json({
          summary: cached[0].summary_text,
          cached: true,
          modelUsed: cached[0].model_used,
          createdAt: cached[0].created_at,
        });
        return;
      }
    }

    // Generate new summary via Gemini / synthesized advisor
    const result = await generateAiSummary(assessment.input, assessment.result);

    // If successfully generated, save or update in cache
    if (!result.unavailable) {
      await pool.query<ResultSetHeader>(
        `INSERT INTO ai_summaries (assessment_id, summary_text, model_used, prompt_tokens, response_tokens)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           summary_text = VALUES(summary_text),
           model_used = VALUES(model_used),
           prompt_tokens = VALUES(prompt_tokens),
           response_tokens = VALUES(response_tokens),
           created_at = CURRENT_TIMESTAMP`,
        [
          assessmentId,
          result.summary,
          result.modelUsed,
          result.promptTokens || null,
          result.responseTokens || null,
        ]
      );
    }

    res.status(200).json({
      summary: result.summary,
      cached: false,
      unavailable: result.unavailable,
      modelUsed: result.modelUsed,
    });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    // Sanitize error — never expose model names or raw API errors to the user
    const rawMsg = error instanceof Error ? error.message : '';
    let userMsg = 'BorrowerIQ insights are temporarily unavailable. Please try again in a few moments.';
    if (rawMsg.includes('GEMINI_API_KEY')) {
      userMsg = 'AI insights are not configured. Please contact the administrator.';
    } else if (rawMsg.includes('older than 90 days') || rawMsg.includes('Assessment not found')) {
      userMsg = rawMsg; // These are safe user-facing messages
    }
    res.status(500).json({ error: userMsg });
  }
}

export async function previewSummary(req: Request, res: Response): Promise<void> {
  const { input, result } = req.body;
  if (!input || !result || !input.borrower || !input.loan) {
    res.status(400).json({ error: 'Missing or invalid assessment input or result data' });
    return;
  }
  try {
    const aiResult = await generateAiSummary(input, result);
    res.status(200).json(aiResult);
  } catch (error) {
    console.error('Error generating preview AI summary:', error);
    res.status(500).json({ error: 'BorrowerIQ insights are temporarily unavailable. Please try again in a few moments.' });
  }
}

