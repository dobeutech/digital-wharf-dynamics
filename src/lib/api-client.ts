/**
 * API client with retry logic and error handling
 */

import { handleApiError, logError, ErrorSeverity, ErrorCategory } from './error-handler';

interface RequestOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Enhanced fetch with retry logic, timeout, and error handling
 */
export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 30000,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await handleApiError(
      async () => {
        const res = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => 'Unknown error');
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        return res;
      },
      { retries, retryDelay }
    );

    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        logError(new Error('Request timeout'), {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.NETWORK,
          context: { url, timeout },
        });
        throw new Error('Request timed out');
      }

      logError(error, {
        severity: ErrorSeverity.MEDIUM,
        category: ErrorCategory.NETWORK,
        context: { url, method: fetchOptions.method || 'GET' },
      });
    }

    throw error;
  }
}

/**
 * GET request helper
 */
export function get<T>(url: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export function post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request helper
 */
export function put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request helper
 */
export function del<T>(url: string, options?: RequestOptions): Promise<T> {
  return apiRequest<T>(url, { ...options, method: 'DELETE' });
}

