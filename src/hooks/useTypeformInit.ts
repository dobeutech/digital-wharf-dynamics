import { useEffect } from "react";

/** Timeout for waiting for Typeform script to load (milliseconds) */
const TYPEFORM_LOAD_TIMEOUT_MS = 10000;

/** Polling interval for checking script availability (milliseconds) */
const TYPEFORM_CHECK_INTERVAL_MS = 100;

/**
 * Custom hook to initialize Typeform embed script
 * Handles async loading of the Typeform SDK and calls load() when ready
 */
export function useTypeformInit() {
  useEffect(() => {
    // Ensure Typeform script is loaded and initialized
    const initTypeform = () => {
      if (window.tf?.load) {
        try {
          window.tf.load();
        } catch (error) {
          console.error("Error loading Typeform:", error);
        }
      }
    };

    // If script already loaded, initialize immediately
    if (window.tf) {
      initTypeform();
      return;
    }

    // Otherwise wait for script to load with polling
    // Note: We use polling because the script is loaded in index.html
    // and we don't have direct access to its load event
    const checkTypeform = setInterval(() => {
      if (window.tf) {
        initTypeform();
        clearInterval(checkTypeform);
      }
    }, TYPEFORM_CHECK_INTERVAL_MS);

    // Clean up interval after timeout to prevent infinite polling
    const timeout = setTimeout(() => {
      clearInterval(checkTypeform);
      console.warn("Typeform script failed to load within timeout period");
    }, TYPEFORM_LOAD_TIMEOUT_MS);

    return () => {
      clearInterval(checkTypeform);
      clearTimeout(timeout);
    };
  }, []);
}
