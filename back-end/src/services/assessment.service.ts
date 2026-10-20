import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pool } from '../config/db.js';
import { assessBorrower } from '../engine/index.js';
import type { AssessmentInput, AssessmentResult, Recommendation } from '../engine/types.js';

interface AssessmentRow extends RowDataPacket {
  id: number;
  user_id: number;
  input_json: string | AssessmentInput;
  result_json: string | AssessmentResult;
  recommendation: Recommendation;
  requested_amount: number;
  loan_purpose: string;
  created_at: Date;
  summary_text?: string | null;
  summary_created_at?: Date | null;
}

export async function createAssessment(userId: number, input: AssessmentInput): Promise<{
  id: number;
  result: AssessmentResult;
  input: AssessmentInput;
  createdAt: Date;
}> {
  // Compute financial recommendation using the deterministic calculation engine
  const result = assessBorrower(input);

  const recommendation = result.recommendation;
  const requestedAmount = input.loan.requestedAmount;
  const loanPurpose = input.loan.purpose || 'other';

  const [dbResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO assessments 
      (user_id, input_json, result_json, recommendation, requested_amount, loan_purpose) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      JSON.stringify(input),
      JSON.stringify(result),
      recommendation,
      requestedAmount,
      loanPurpose,
    ]
  );

  return {
    id: dbResult.insertId,
    result,
    input,
    createdAt: new Date(),
  };
}

export async function listByUser(userId: number, page = 1, limit = 20) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(1, limit));
  const offset = (safePage - 1) * safeLimit;

  const [countRows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM assessments WHERE user_id = ?',
    [userId]
  );
  const total = Number(countRows[0]?.total || 0);

  const [rows] = await pool.query<AssessmentRow[]>(
    `SELECT a.id, a.recommendation, a.requested_amount, a.loan_purpose, a.created_at,
            s.summary_text IS NOT NULL as has_ai_summary
     FROM assessments a
     LEFT JOIN ai_summaries s ON a.id = s.assessment_id
     WHERE a.user_id = ?
     ORDER BY a.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, safeLimit, offset]
  );

  const assessments = rows.map((r) => ({
    id: r.id,
    recommendation: r.recommendation,
    requestedAmount: Number(r.requested_amount),
    loanPurpose: r.loan_purpose,
    createdAt: r.created_at,
    hasAiSummary: Boolean(r.has_ai_summary),
  }));

  return {
    assessments,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

export async function getById(id: number, userId: number) {
  const [rows] = await pool.query<AssessmentRow[]>(
    `SELECT a.id, a.user_id, a.input_json, a.result_json, a.recommendation, 
            a.requested_amount, a.loan_purpose, a.created_at,
            s.summary_text, s.created_at as summary_created_at
     FROM assessments a
     LEFT JOIN ai_summaries s ON a.id = s.assessment_id
     WHERE a.id = ? AND a.user_id = ?`,
    [id, userId]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  const input = typeof row.input_json === 'string' ? JSON.parse(row.input_json) : row.input_json;
  const result = typeof row.result_json === 'string' ? JSON.parse(row.result_json) : row.result_json;

  return {
    id: row.id,
    userId: row.user_id,
    input,
    result,
    recommendation: row.recommendation,
    requestedAmount: Number(row.requested_amount),
    loanPurpose: row.loan_purpose,
    createdAt: row.created_at,
    aiSummary: row.summary_text
      ? {
          text: row.summary_text,
          createdAt: row.summary_created_at,
        }
      : null,
  };
}
