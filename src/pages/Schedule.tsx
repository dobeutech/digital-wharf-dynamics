import { useEffect } from "react";
import { PageMeta } from "@/components/seo/PageMeta";

const TYPEFORM_ID = "01KCBVEXYD88HBQQB22XQA49ZR";
const TYPEFORM_SCRIPT_SRC = "https://embed.typeform.com/next/embed.js";

function ensureTypeformScriptLoaded() {
  if (typeof document === "undefined") return;
  const existing = document.querySelector(
    `script[src="${TYPEFORM_SCRIPT_SRC}"]`,
  );
  if (existing) return;
  const script = document.createElement("script");
  script.src = TYPEFORM_SCRIPT_SRC;
  script.async = true;
  document.body.appendChild(script);
}

export default function Schedule() {
  useEffect(() => {
    ensureTypeformScriptLoaded();
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
            Pick a time that works for you. We’ll meet and walk through your
            goals and the best next steps.
          </p>
          <div className="rounded-xl overflow-hidden border shadow-material">
            <div data-tf-live={TYPEFORM_ID} />
          </div>
        </div>
      </div>
    </>
  );
}
