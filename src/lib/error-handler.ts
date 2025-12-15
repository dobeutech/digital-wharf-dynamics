/**
 * Centralized error handling and reporting
 */

export interface ErrorContext {
  userId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  [key: string]: unknown;
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Error categories
 */
export enum ErrorCategory {
  NETWORK = "network",
  VALIDATION = "validation",
  AUTH = "auth",
  DATABASE = "database",
  UI = "ui",
  UNKNOWN = "unknown",
}

interface ErrorReport {
  error: Error;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: ErrorContext;
  timestamp: string;
}

/**
 * Logs an error with context
 */
export function logError(
  error: Error | unknown,
  options: {
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    context?: ErrorContext;
  } = {},
): void {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  const report: ErrorReport = {
    error: errorObj,
    severity: options.severity || ErrorSeverity.MEDIUM,
    category: options.category || ErrorCategory.UNKNOWN,
    context: {
      ...options.context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("Error logged:", report);
  }

  // In production, send to error tracking service
  // Example: Sentry.captureException(errorObj, {
  //   level: report.severity,
  //   tags: { category: report.category },
  //   extra: report.context
  // });

  // Track error in analytics (non-blocking)
  if (typeof window !== "undefined" && window.mixpanel) {
    try {
      window.mixpanel.track("Error Occurred", {
        error_message: errorObj.message,
        error_name: errorObj.name,
        severity: report.severity,
        category: report.category,
        ...report.context,
      });
    } catch (e) {
      // Silently fail analytics tracking
      console.warn("Failed to track error in analytics:", e);
    }
  }
}

/**
 * Creates a user-friendly error message from an error
 */
export function getUserFriendlyMessage(error: Error | unknown): string {
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return "Network error. Please check your connection and try again.";
    }
    if (
      error.message.includes("auth") ||
      error.message.includes("unauthorized")
    ) {
      return "Authentication error. Please sign in again.";
    }
    if (error.message.includes("validation")) {
      return "Invalid input. Please check your data and try again.";
    }
    if (error.message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }
  }

  return "An unexpected error occurred. Please try again or contact support if the problem persists.";
}

/**
 * Handles API errors with retry logic
 */
export async function handleApiError<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    onRetry?: (attempt: number) => void;
  } = {},
): Promise<T> {
  const { retries = 3, retryDelay = 1000, onRetry } = options;

  let lastError: Error | unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (error instanceof Error) {
        if (error.message.includes("401") || error.message.includes("403")) {
          throw error; // Auth errors shouldn't be retried
        }
        if (error.message.includes("400") || error.message.includes("422")) {
          throw error; // Validation errors shouldn't be retried
        }
      }

      if (attempt < retries) {
        onRetry?.(attempt + 1);
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1)),
        );
      }
    }
  }

  throw lastError;
}

/**
 * Wraps async functions with error handling
 */
export function withErrorHandling<
  T extends (...args: unknown[]) => Promise<unknown>,
>(
  fn: T,
  options: {
    severity?: ErrorSeverity;
    category?: ErrorCategory;
    context?: ErrorContext;
  } = {},
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, options);
      throw error;
    }
  }) as T;
}
