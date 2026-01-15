import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  details?: any;
}

export class CustomError extends Error implements AppError {
  status: number;
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, status: number = 500, code: string = "INTERNAL_ERROR", details?: any) {
    super(message);
    this.name = "CustomError";
    this.status = status;
    this.statusCode = status;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Detailed error handler that returns JSON instead of redirecting
export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  // Log error for debugging
  console.error("Error occurred:", {
    message: err.message,
    status: err.status || err.statusCode || 500,
    code: err.code,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    details: err.details
  });

  // Don't send response if headers already sent
  if (res.headersSent) {
    return;
  }

  // Determine status code
  const status = err.status || err.statusCode || 500;

  // Determine error code
  const code = err.code || getErrorCode(status);

  // Build error response
  const errorResponse: any = {
    success: false,
    error: {
      message: err.message || "An unexpected error occurred",
      code,
      status
    }
  };

  // Add details in development
  if (process.env.NODE_ENV === "development" && err.details) {
    errorResponse.error.details = err.details;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === "development" && err.stack) {
    errorResponse.error.stack = err.stack.split("\n").slice(0, 5);
  }

  res.status(status).json(errorResponse);
}

// Helper to get error code from status
function getErrorCode(status: number): string {
  const codes: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_ERROR",
    429: "TOO_MANY_REQUESTS",
    500: "INTERNAL_SERVER_ERROR",
    503: "SERVICE_UNAVAILABLE"
  };
  return codes[status] || "INTERNAL_SERVER_ERROR";
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Validation error helper
export function validationError(message: string, details?: any): CustomError {
  return new CustomError(message, 400, "VALIDATION_ERROR", details);
}

// Not found error helper
export function notFoundError(resource: string = "Resource"): CustomError {
  return new CustomError(`${resource} not found`, 404, "NOT_FOUND");
}

// Unauthorized error helper
export function unauthorizedError(message: string = "Unauthorized"): CustomError {
  return new CustomError(message, 401, "UNAUTHORIZED");
}

// Forbidden error helper
export function forbiddenError(message: string = "Forbidden"): CustomError {
  return new CustomError(message, 403, "FORBIDDEN");
}
