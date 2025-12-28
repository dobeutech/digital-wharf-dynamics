import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/mixpanel";
import { useAuth } from "@/contexts/AuthContext";
import { TYPEFORM_EMBED_ID } from "@/config/typeform";

interface TypeformLightboxNewProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

/**
 * Build Typeform embed URL for iframe
 * Uses the widget embed format which is more reliable in modal contexts
 */
function buildTypeformEmbedUrl(
  source: string,
  user?: { id?: string; email?: string; name?: string },
): string {
  // Use the widget embed URL format for reliable iframe embedding
  const baseUrl = `https://form.typeform.com/to/${TYPEFORM_EMBED_ID}`;

  // Query parameters for UTM tracking
  const params = new URLSearchParams({
    utm_source: "dobeu_website",
    utm_medium: "website",
    utm_campaign: source || "lightbox",
    utm_term: "contact_form",
    utm_content: "learn_more_button",
  });

  // Hash parameters for pre-filling form fields
  const hashParams: string[] = [];

  if (user?.name) {
    const nameParts = user.name.split(" ");
    if (nameParts.length > 0)
      hashParams.push(`first_name=${encodeURIComponent(nameParts[0])}`);
    if (nameParts.length > 1)
      hashParams.push(
        `last_name=${encodeURIComponent(nameParts.slice(1).join(" "))}`,
      );
  }

  if (user?.email) hashParams.push(`email=${encodeURIComponent(user.email)}`);
  if (user?.id) hashParams.push(`user_id=${encodeURIComponent(user.id)}`);

  const url = `${baseUrl}?${params.toString()}`;
  return hashParams.length > 0 ? `${url}#${hashParams.join("&")}` : url;
}

export function TypeformLightboxNew({
  isOpen,
  onClose,
  source = "lightbox",
}: TypeformLightboxNewProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsLoading(true);
      onClose();
    }
  };

  // Track when lightbox opens
  useEffect(() => {
    if (isOpen) {
      trackEvent("Typeform Lightbox Opened", { source });
    }
  }, [isOpen, source]);

  const typeformUrl = buildTypeformEmbedUrl(source, user);

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
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Loading form...
              </span>
            </div>
          </div>
        )}
        {isOpen && (
          <iframe
            src={typeformUrl}
            className="w-full h-full border-0"
            title="Contact Form"
            allow="camera; microphone; autoplay; encrypted-media;"
            style={{ minHeight: "600px" }}
            onLoad={() => setIsLoading(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
