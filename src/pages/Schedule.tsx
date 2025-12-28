import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageMeta } from "@/components/seo/PageMeta";

const APOLLO_MEETING_URL = "https://app.apollo.io/#/meet/jeremyw";

export default function Schedule() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Apollo.io meeting scheduler
    window.location.href = APOLLO_MEETING_URL;
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
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Taking you to the scheduling page.
            </p>
            <p className="text-sm text-muted-foreground">
              If you are not redirected automatically,{" "}
              <a
                href={APOLLO_MEETING_URL}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                click here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
