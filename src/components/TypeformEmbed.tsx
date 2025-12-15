import { useEffect } from "react";

// Type definition for Typeform embed library
interface TypeformAPI {
  load: () => void;
  createPopup: (
    formId: string,
    options: Record<string, unknown>,
  ) => { open: () => void };
}

declare global {
  interface Window {
    tf?: TypeformAPI;
  }
}

export const TypeformEmbed = () => {
  useEffect(() => {
    // Typeform script is loaded in index.html
    // This ensures the live embed is initialized when the component mounts
    if (typeof window !== "undefined" && window.tf) {
      window.tf.load();
    }
  }, []);

  return (
    <div data-tf-live="01KCBVEXYD88HBQQB22XQA49ZR" className="typeform-embed" />
  );
};
