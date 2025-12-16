import { TYPEFORM_EMBED_ID } from "@/config/typeform";
import { useEffect, useRef } from "react";

/**
 * Typeform Embed Component
 * Uses the Typeform embed script loaded in index.html
 * The script automatically initializes all elements with data-tf-live attribute
 */
export const TypeformEmbed = () => {
  const embedRef = useRef<HTMLDivElement>(null);

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

  return <div ref={embedRef} data-tf-live={TYPEFORM_EMBED_ID}></div>;
};
