import { PageMeta } from "@/components/seo/PageMeta";
import { TYPEFORM_EMBED_ID } from "@/config/typeform";
import { useTypeformInit } from "@/hooks/useTypeformInit";

export default function Schedule() {
  useTypeformInit();

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
              data-tf-live={TYPEFORM_EMBED_ID}
              style={{ height: "600px", width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
