import type { AssessmentInput, AssessmentResult, Recommendation } from '../engine/types';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');

const TOKEN_KEY = 'borrower_copilot_token';

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AssessmentListItem {
  id: number;
  recommendation: Recommendation;
  requestedAmount: number;
  loanPurpose: string;
  createdAt: string;
  hasAiSummary: boolean;
}

export interface AssessmentListResponse {
  assessments: AssessmentListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AssessmentDetailResponse {
  id: number;
  userId: number;
  input: AssessmentInput;
  result: AssessmentResult;
  recommendation: Recommendation;
  requestedAmount: number;
  loanPurpose: string;
  createdAt: string;
  aiSummary: {
    text: string;
    createdAt?: string;
  } | null;
}

export interface AiSummaryResponse {
  summary: string;
  cached: boolean;
  unavailable?: boolean;
  modelUsed?: string;
}

export interface ContactResponse {
  success: boolean;
  inquiryId?: number;
  message: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutMs = 15000; // 15-second network timeout
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Connection timed out. Please check your internet connection and try again.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ── Auth APIs ────────────────────────────────────────────────────────────────
export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(res.token);
  return res;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(res.token);
  return res;
}

export async function getMe(): Promise<User> {
  return request<User>('/api/auth/me', {
    method: 'GET',
  });
}

export async function updateProfile(name: string): Promise<User> {
  return request<User>('/api/auth/me', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
}

export async function googleLogin(payload: {
  credential?: string;
  email?: string;
  name?: string;
  googleId?: string;
}): Promise<AuthResponse> {
  const res = await request<AuthResponse>('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setToken(res.token);
  return res;
}

export function logout(): void {
  setToken(null);
}

// ── Assessment APIs ──────────────────────────────────────────────────────────
export async function createAssessment(input: AssessmentInput): Promise<{
  id: number;
  result: AssessmentResult;
  createdAt: string;
}> {
  return request<{ id: number; result: AssessmentResult; createdAt: string }>('/api/assessments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function listAssessments(page = 1, limit = 20): Promise<AssessmentListResponse> {
  return request<AssessmentListResponse>(`/api/assessments?page=${page}&limit=${limit}`, {
    method: 'GET',
  });
}

export async function getAssessment(id: number): Promise<AssessmentDetailResponse> {
  return request<AssessmentDetailResponse>(`/api/assessments/${id}`, {
    method: 'GET',
  });
}

export async function generateAiSummary(id: number, force = false): Promise<AiSummaryResponse> {
  const url = force ? `/api/assessments/${id}/ai-summary?force=true` : `/api/assessments/${id}/ai-summary`;
  return request<AiSummaryResponse>(url, {
    method: 'POST',
  });
}

export async function generatePreviewAiSummary(
  input: AssessmentInput,
  result: AssessmentResult
): Promise<AiSummaryResponse> {
  return request<AiSummaryResponse>('/api/assessments/preview-summary', {
    method: 'POST',
    body: JSON.stringify({ input, result }),
  });
}

// ── Contact API ──────────────────────────────────────────────────────────────
export async function submitContact(
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<ContactResponse> {
  return request<ContactResponse>('/api/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, subject, message }),
  });
}

// ── Feedback API ─────────────────────────────────────────────────────────────
export interface FeedbackResponse {
  success: boolean;
  feedbackId?: number;
  message: string;
}

export async function submitFeedback(
  category: 'Idea' | 'Problem' | 'Other',
  message: string
): Promise<FeedbackResponse> {
  return request<FeedbackResponse>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({ category, message }),
  });
}
