/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 */

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Store CSRF token in session storage
 */
export function setCsrfToken(token: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("csrf_token", token);
  }
}

/**
 * Get CSRF token from session storage
 */
export function getCsrfToken(): string | null {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("csrf_token");
  }
  return null;
}

/**
 * Initialize CSRF token if not present
 */
export function initCsrfToken(): string {
  let token = getCsrfToken();
  if (!token) {
    token = generateCsrfToken();
    setCsrfToken(token);
  }
  return token;
}

/**
 * Add CSRF token to request headers
 */
export function addCsrfHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getCsrfToken() || initCsrfToken();
  const headersObj =
    headers instanceof Headers
      ? Object.fromEntries(headers.entries())
      : headers;
  return {
    ...headersObj,
    "X-CSRF-Token": token,
  };
}

/**
 * Validate CSRF token (for use in edge functions)
 */
export function validateCsrfToken(
  requestToken: string | null,
  storedToken: string | null,
): boolean {
  if (!requestToken || !storedToken) {
    return false;
  }
  return requestToken === storedToken;
}
