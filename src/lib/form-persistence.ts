/**
 * Form state persistence utilities
 * Saves form data to localStorage to prevent data loss
 */

const STORAGE_PREFIX = "form_";

/**
 * Save form data to localStorage
 */
export function saveFormData(
  formId: string,
  data: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_PREFIX}${formId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
  } catch (error) {
    console.warn("Failed to save form data:", error);
  }
}

/**
 * Load form data from localStorage
 */
export function loadFormData(formId: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;

  try {
    const key = `${STORAGE_PREFIX}${formId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    // Check if data is older than 24 hours
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - parsed.timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.warn("Failed to load form data:", error);
    return null;
  }
}

/**
 * Clear form data from localStorage
 */
export function clearFormData(formId: string): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_PREFIX}${formId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to clear form data:", error);
  }
}

/**
 * Clear all form data
 */
export function clearAllFormData(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Failed to clear all form data:", error);
  }
}
