import { useCallback, useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/mixpanel";
import { getTypeformDirectUrl } from "@/config/typeform";

interface TypeformLightboxNewProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

// Timeout before showing manual redirect option (10 seconds)
const LOAD_TIMEOUT_MS = 10000;

/**
 * Typeform Lightbox Component
 * Uses iframe embed for reliable loading across all environments
 * Falls back to direct link if iframe fails to load
 */
export const TypeformLightboxNew = ({
  isOpen,
  onClose,
  source = "lightbox",
}: TypeformLightboxNewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Get the direct Typeform URL for embedding
  const typeformUrl = getTypeformDirectUrl({
    utm_source: "dobeu_website",
    utm_medium: "website",
    utm_campaign: source,
  });

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setShowFallback(false);

      // Set timeout to show fallback option if form doesn't load
      timeoutRef.current = setTimeout(() => {
        setShowFallback(true);
        setIsLoading(false);
      }, LOAD_TIMEOUT_MS);

      trackEvent("Typeform Lightbox Opened", { source });
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
  }, [isOpen, source]);

  // Handle iframe load event
  const handleIframeLoad = useCallback(() => {
    // Cancel the timeout since form loaded successfully
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoading(false);
    setShowFallback(false);
  }, []);

  // Handle dialog close
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  // Manual redirect button handler
  const handleManualRedirect = useCallback(() => {
    trackEvent("Typeform Manual Redirect", { source });
    window.open(typeformUrl, "_blank");
    onClose();
  }, [typeformUrl, source, onClose]);

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

        {/* Loading overlay */}
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

        {/* Fallback message if loading takes too long */}
        {isOpen && showFallback && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-40">
            <p className="text-muted-foreground mb-4 text-center px-4">
              The form is taking longer than expected to load.
            </p>
            <Button onClick={handleManualRedirect} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Open form in new tab
            </Button>
          </div>
        )}

        {/* Typeform iframe embed */}
        {isOpen && (
          <iframe
            ref={iframeRef}
            src={typeformUrl}
            onLoad={handleIframeLoad}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="Contact Form"
            allow="camera; microphone; autoplay; encrypted-media;"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
