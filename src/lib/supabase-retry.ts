/**
 * Retry logic wrapper for Supabase operations
 */

import { PostgrestError } from "@supabase/supabase-js";
import { logError, ErrorSeverity, ErrorCategory } from "./error-handler";

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  retryableErrors?: string[];
}

const DEFAULT_RETRYABLE_ERRORS = [
  "network",
  "timeout",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "503",
  "502",
  "504",
];

/**
 * Check if an error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    return DEFAULT_RETRYABLE_ERRORS.some((retryable) =>
      errorMessage.includes(retryable.toLowerCase()),
    );
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String((error as { code: unknown }).code);
    return ["503", "502", "504", "ECONNRESET", "ETIMEDOUT"].includes(code);
  }

  return false;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a Supabase operation with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options: RetryOptions = {},
): Promise<{ data: T | null; error: PostgrestError | null }> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryableErrors = DEFAULT_RETRYABLE_ERRORS,
  } = options;

  let lastError: PostgrestError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();

      // If successful, return immediately
      if (!result.error) {
        return result;
      }

      // Check if error is retryable
      if (!isRetryableError(result.error)) {
        return result; // Non-retryable error, return immediately
      }

      lastError = result.error;

      // If this was the last attempt, return the error
      if (attempt === maxRetries) {
        logError(result.error, {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context: { attempt: attempt + 1, maxRetries },
        });
        return result;
      }

      // Wait before retrying with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt);
      await sleep(delay);
    } catch (error) {
      lastError = error as PostgrestError;

      if (!isRetryableError(error) || attempt === maxRetries) {
        logError(error, {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context: { attempt: attempt + 1, maxRetries },
        });
        return { data: null, error: lastError };
      }

      const delay = retryDelay * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  return { data: null, error: lastError };
}

/**
 * Create a retryable Supabase query
 */
export function createRetryableQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options?: RetryOptions,
) {
  return () => withRetry(queryFn, options);
}
