import { PageMeta } from "@/components/seo/PageMeta";
import { TYPEFORM_EMBED_ID } from "@/config/typeform";
import { useEffect, useRef } from "react";

export default function Schedule() {
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

  return (
    <>
      <PageMeta
        title="Schedule a Consultation"
        description="Schedule time to meet with DOBEU and learn about our products and services."
        keywords="schedule consultation, book meeting, DOBEU"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-4">Schedule a Consultation</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Pick a time that works for you. We'll meet and walk through your
            goals and the best next steps.
          </p>
          <div
            className="rounded-xl overflow-hidden border shadow-material"
            style={{ minHeight: "600px" }}
          >
            <div
              ref={embedRef}
              data-tf-live={TYPEFORM_EMBED_ID}
              style={{ height: "600px", width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
