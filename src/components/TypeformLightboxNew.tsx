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
 * Uses Typeform embed SDK with data-tf-live attribute for proper embedding
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

  // Handle dialog close
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsLoading(true);
        initAttemptedRef.current = false;
        onClose();
      }
    },
    [onClose],
  );

  // Track when lightbox opens
  useEffect(() => {
    if (isOpen) {
      trackEvent("Typeform Lightbox Opened", { source });
    }
  }, [isOpen, source]);

  // Initialize Typeform embed when dialog opens and element is in DOM
  useEffect(() => {
    if (!isOpen) {
      initAttemptedRef.current = false;
      setIsLoading(true);
      return;
    }

    // Reset when dialog opens
    initAttemptedRef.current = false;
    setIsLoading(true);

    // Wait for both the script and the DOM element to be ready
    const initTypeform = () => {
      // Check if script is loaded
      if (typeof window === "undefined" || !window.tf) {
        // Retry after a short delay if script not loaded yet
        setTimeout(initTypeform, 100);
        return;
      }

      // Check if element is in DOM
      if (!embedContainerRef.current) {
        // Retry after a short delay if element not in DOM yet
        setTimeout(initTypeform, 100);
        return;
      }

      // Prevent multiple initialization attempts
      if (initAttemptedRef.current) {
        return;
      }

      initAttemptedRef.current = true;

      try {
        // Call load() to initialize all data-tf-live elements
        window.tf.load();

        // Wait a bit for Typeform to render, then check if it loaded
        // Typeform SDK will automatically initialize elements with data-tf-live
        const checkLoaded = setInterval(() => {
          const container = embedContainerRef.current;
          if (container) {
            // Check if Typeform has rendered content (look for iframe or Typeform elements)
            const hasContent =
              container.querySelector("iframe") ||
              container.querySelector('[class*="tf-"]') ||
              container.children.length > 0;

            if (hasContent) {
              setIsLoading(false);
              clearInterval(checkLoaded);
            }
          }
        }, 200);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          setIsLoading(false);
        }, 10000);
      } catch (error) {
        console.error("Error loading Typeform:", error);
        setIsLoading(false);
      }
    };

    // Small delay to ensure DOM is ready and dialog is fully rendered
    const timer = setTimeout(initTypeform, 100);

    return () => {
      clearTimeout(timer);
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
            data-tf-opacity="100"
            data-tf-hide-headers="false"
            data-tf-hide-footer="false"
            style={{ width: "100%", height: "100%", minHeight: "600px" }}
            className="w-full h-full"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
