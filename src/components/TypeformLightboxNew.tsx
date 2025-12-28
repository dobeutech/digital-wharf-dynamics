import { useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/mixpanel";
import { Widget } from "@typeform/embed-react";
import { TYPEFORM_EMBED_ID } from "@/config/typeform";

interface TypeformLightboxNewProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

/**
 * Typeform Lightbox Component
 * Uses the official @typeform/embed-react Widget component
 * This properly handles React's lifecycle and works in modals/dialogs
 */
export const TypeformLightboxNew = ({
  isOpen,
  onClose,
  source = "lightbox",
}: TypeformLightboxNewProps) => {
  // Handle dialog close
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose],
  );

  // Track when form is opened
  const handleReady = useCallback(() => {
    trackEvent("Typeform Lightbox Opened", { source });
  }, [source]);

  // Track form submission
  const handleSubmit = useCallback(() => {
    trackEvent("Typeform Submitted", { source });
  }, [source]);

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
