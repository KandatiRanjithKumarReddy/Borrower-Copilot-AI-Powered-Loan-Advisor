import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Error]', err);

  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  // In production, never expose internal database errors or stack details for 500 errors
  const message =
    statusCode >= 500 && isProd
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(!isProd && err.details ? { details: err.details } : {}),
  });
}
