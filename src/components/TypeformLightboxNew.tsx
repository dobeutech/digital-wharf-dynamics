import { useCallback, useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/mixpanel";
import { Widget } from "@typeform/embed-react";
import { TYPEFORM_EMBED_ID, getTypeformDirectUrl } from "@/config/typeform";

interface TypeformLightboxNewProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

// Timeout before auto-redirect (5 seconds)
const LOAD_TIMEOUT_MS = 5000;

/**
 * Typeform Lightbox Component
 * Uses the official @typeform/embed-react Widget component
 * Auto-redirects to Typeform if the form fails to load within timeout
 */
export const TypeformLightboxNew = ({
  isOpen,
  onClose,
  source = "lightbox",
}: TypeformLightboxNewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRedirected = useRef(false);

  // Get the direct Typeform URL for fallback
  const typeformDirectUrl = getTypeformDirectUrl({
    utm_source: "dobeu_website",
    utm_medium: "website",
    utm_campaign: source,
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setLoadFailed(false);
      hasRedirected.current = false;

      // Set timeout to auto-redirect if form doesn't load
      timeoutRef.current = setTimeout(() => {
        if (!hasRedirected.current) {
          setLoadFailed(true);
          setIsLoading(false);
          // Auto-redirect to Typeform
          hasRedirected.current = true;
          trackEvent("Typeform Load Failed - Redirecting", { source });
          window.open(typeformDirectUrl, "_blank");
          onClose();
        }
      }, LOAD_TIMEOUT_MS);
    } else {
      // Cleanup timeout when dialog closes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen, typeformDirectUrl, source, onClose]);

  // Handle dialog close
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  // Track when form is ready (loaded successfully)
  const handleReady = useCallback(() => {
    // Cancel the timeout since form loaded successfully
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
    setLoadFailed(false);
    trackEvent("Typeform Lightbox Opened", { source });
  }, [source]);

  // Track form submission
  const handleSubmit = useCallback(() => {
    trackEvent("Typeform Submitted", { source });
  }, [source]);

  // Manual redirect button handler
  const handleManualRedirect = useCallback(() => {
    hasRedirected.current = true;
    trackEvent("Typeform Manual Redirect", { source });
    window.open(typeformDirectUrl, "_blank");
    onClose();
  }, [typeformDirectUrl, source, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenChange(false)}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Loading overlay with manual redirect option */}
        {isOpen && isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-40">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground mb-4">Loading form...</p>
            <Button
              variant="outline"
              onClick={handleManualRedirect}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open form in new tab
            </Button>
          </div>
        )}

        {isOpen && (
          <Widget
            id={TYPEFORM_EMBED_ID}
            style={{ width: "100%", height: "100%" }}
            onReady={handleReady}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
