import { useEffect } from "react";

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
    } else {
      // Otherwise wait for script to load
      const checkTypeform = setInterval(() => {
        if (window.tf) {
          initTypeform();
          clearInterval(checkTypeform);
        }
      }, 100);

      // Clean up interval after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkTypeform);
      }, 10000);

      return () => {
        clearInterval(checkTypeform);
        clearTimeout(timeout);
      };
    }
  }, []);
}
