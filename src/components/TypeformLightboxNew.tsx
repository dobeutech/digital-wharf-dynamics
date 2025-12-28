import { useEffect, useState, useCallback, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/mixpanel";
import { TYPEFORM_EMBED_ID } from "@/config/typeform";

interface TypeformLightboxNewProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

/**
 * Typeform Lightbox Component
 * Uses Typeform embed SDK with data-tf-live attribute for live embedding
 * data-tf-live allows embed settings to update automatically without re-embedding
 * The script is loaded in index.html: https://embed.typeform.com/next/embed.js
 */
export const TypeformLightboxNew = ({
  isOpen,
  onClose,
  source = "lightbox",
}: TypeformLightboxNewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const initAttemptedRef = useRef(false);
  const retryCountRef = useRef(0);

  // Handle dialog close - reset loading state for next open
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        initAttemptedRef.current = false;
        retryCountRef.current = 0;
        onClose();
      }
    },
    [onClose],
  );

  // Reset loading state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      initAttemptedRef.current = false;
      retryCountRef.current = 0;
      trackEvent("Typeform Lightbox Opened", { source });
    }
  }, [isOpen, source]);

  // Initialize Typeform embed when dialog opens and element is in DOM
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let checkInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    // Wait for both the script and the DOM element to be ready
    const initTypeform = () => {
      // Check if script is loaded
      if (typeof window === "undefined" || !window.tf) {
        // Retry after a short delay if script not loaded yet (max 10 seconds)
        if (retryCountRef.current < 100) {
          retryCountRef.current += 1;
          retryTimeout = setTimeout(initTypeform, 100);
        } else {
          console.error("Typeform script failed to load");
          setIsLoading(false);
        }
        return;
      }

      // Check if element is in DOM and visible
      const container = embedContainerRef.current;
      if (!container) {
        // Retry after a short delay if element not in DOM yet
        retryTimeout = setTimeout(initTypeform, 100);
        return;
      }

      // Prevent multiple initialization attempts
      if (initAttemptedRef.current) {
        return;
      }

      initAttemptedRef.current = true;

      try {
        // Call load() to initialize all data-tf-live elements
        // This will automatically find and initialize the div with data-tf-live
        window.tf.load();

        // Wait for Typeform to render content
        // Check periodically if the form has loaded
        checkInterval = setInterval(() => {
          const currentContainer = embedContainerRef.current;
          if (currentContainer) {
            // Check if Typeform has rendered content
            // Typeform creates an iframe or wrapper elements
            const hasContent =
              currentContainer.querySelector("iframe") ||
              currentContainer.querySelector('[class*="tf-"]') ||
              currentContainer.querySelector('[id*="typeform"]') ||
              (currentContainer.children.length > 0 &&
                currentContainer.innerHTML.trim().length > 0);

            if (hasContent) {
              setIsLoading(false);
              if (checkInterval) clearInterval(checkInterval);
              if (timeoutId) clearTimeout(timeoutId);
            }
          }
        }, 300);

        // Timeout after 10 seconds - stop loading indicator even if form didn't load
        timeoutId = setTimeout(() => {
          if (checkInterval) clearInterval(checkInterval);
          setIsLoading(false);
          console.warn("Typeform embed took too long to load");
        }, 10000);
      } catch (error) {
        console.error("Error loading Typeform:", error);
        setIsLoading(false);
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Delay to ensure Dialog is fully rendered and element is in DOM
    // Dialog components often have transition animations
    const timer = setTimeout(initTypeform, 200);

    return () => {
      clearTimeout(timer);
      if (retryTimeout) clearTimeout(retryTimeout);
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
      retryCountRef.current = 0;
    };
  }, [isOpen]);

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
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-40">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Loading form...
              </span>
            </div>
          </div>
        )}
        {isOpen && (
          <div
            ref={embedContainerRef}
            data-tf-live={TYPEFORM_EMBED_ID}
            style={{ width: "100%", height: "100%", minHeight: "600px" }}
            className="w-full h-full"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
