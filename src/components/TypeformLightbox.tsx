import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { typeformConfig, TYPEFORM_EMBED_ID } from "@/config/typeform";
import { trackEvent } from "@/lib/mixpanel";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TypeformLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  title?: string;
  description?: string;
}

export function TypeformLightbox({
  isOpen,
  onClose,
  source = "lightbox",
  title = "Get in Touch",
  description = "Fill out the form below and we'll get back to you shortly.",
}: TypeformLightboxProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      trackEvent("Typeform Lightbox Opened", { source });
      setIsLoaded(true);
    }
  }, [isOpen, source]);

  const typeformUrl = `https://form.typeform.com/to/${TYPEFORM_EMBED_ID}?utm_source=${typeformConfig.tracking.utm_source}&utm_medium=${typeformConfig.tracking.utm_medium}&utm_campaign=${source}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
              <DialogDescription className="mt-2">
                {description}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {isLoaded && (
            <iframe
              src={typeformUrl}
              className="w-full h-full border-0"
              title="Contact Form"
              allow="camera; microphone; autoplay; encrypted-media;"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook to manage Typeform lightbox state
 */
export function useTypeformLightbox() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
