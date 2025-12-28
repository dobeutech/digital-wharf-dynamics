import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/mixpanel";
import { useAuth } from "@/contexts/AuthContext";
import { TYPEFORM_EMBED_ID } from "@/config/typeform";

// Type definition for Typeform embed library
interface TypeformAPI {
  load: () => void;
  createPopup: (
    formId: string,
    options: Record<string, unknown>,
  ) => { open: () => void };
}

declare global {
  interface Window {
    tf?: TypeformAPI;
  }
}

interface TypeformLightboxNewProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

/**
 * Build Typeform URL with query parameters and hash parameters for pre-filling
 */
function buildTypeformUrl(
  source: string,
  user?: { id?: string; email?: string; name?: string },
): string {
  // Use the standard Typeform URL format with the embed ID
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [useIframe, setUseIframe] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);

  // Handle dialog close and reset state
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset states when closing
      setUseIframe(false);
      setEmbedFailed(false);
      onClose();
    }
  };

  // Track when lightbox opens
  useEffect(() => {
    if (isOpen) {
      trackEvent("Typeform Lightbox Opened", { source });
    }
  }, [isOpen, source]);

  // Handle Typeform initialization when dialog opens
  useEffect(() => {
    // Only run initialization logic when isOpen becomes true
    if (!isOpen) {
      // Store ref value for cleanup
      const container = containerRef.current;
      if (container) {
        container.innerHTML = "";
      }
      return;
    }

    let pollInterval: NodeJS.Timeout | null = null;
    let initTimeout: NodeJS.Timeout | null = null;
    let fallbackTimeout: NodeJS.Timeout | null = null;
    let mounted = true;
    // Store ref value to avoid stale closure
    const container = containerRef.current;

    const initTypeform = () => {
      if (!container || !mounted) return;

      // Clear any existing content
      container.innerHTML = "";

      // Create the embed div with exact structure: <div data-tf-live="TYPEFORM_EMBED_ID"></div>
      const embedDiv = document.createElement("div");
      embedDiv.setAttribute("data-tf-live", TYPEFORM_EMBED_ID);
      embedDiv.style.width = "100%";
      embedDiv.style.height = "100%";
      container.appendChild(embedDiv);

      // Trigger Typeform load
      if (window.tf?.load) {
        try {
          window.tf.load();
        } catch (error) {
          console.error("Error loading Typeform:", error);
          // Fall back to iframe on error
          if (mounted) {
            setEmbedFailed(true);
            setUseIframe(true);
          }
        }
      }
    };

    // Wait for Typeform script to be ready
    const waitForTypeform = () => {
      if (!mounted) return;

      if (window.tf?.load) {
        // Typeform is ready, initialize
        initTypeform();

        // Check if embed loaded after a delay, fallback to iframe if not
        fallbackTimeout = setTimeout(() => {
          if (!mounted || !container) return;

          const hasTypeformContent =
            container.querySelector("iframe") ||
            container.querySelector('[class*="tf-"]') ||
            container.querySelector('[data-tf-loaded]');

          if (!hasTypeformContent) {
            // Embed didn't load, fallback to iframe
            setEmbedFailed(true);
            setUseIframe(true);
          }
        }, 4000);
      } else {
        // Typeform not ready yet, poll every 100ms for up to 5 seconds
        let attempts = 0;
        pollInterval = setInterval(() => {
          attempts++;
          if (window.tf?.load) {
            if (pollInterval) clearInterval(pollInterval);
            initTypeform();

            // Check if embed loaded after a delay
            fallbackTimeout = setTimeout(() => {
              if (!mounted || !container) return;

              const hasTypeformContent =
                container.querySelector("iframe") ||
                container.querySelector('[class*="tf-"]') ||
                container.querySelector('[data-tf-loaded]');

              if (!hasTypeformContent) {
                setEmbedFailed(true);
                setUseIframe(true);
              }
            }, 4000);
          } else if (attempts >= 50) {
            // After 5 seconds, fall back to iframe
            if (pollInterval) clearInterval(pollInterval);
            if (mounted) {
              setEmbedFailed(true);
              setUseIframe(true);
            }
          }
        }, 100);
      }
    };

    // Small delay to ensure DOM is ready
    initTimeout = setTimeout(waitForTypeform, 50);

    // Cleanup function
    return () => {
      mounted = false;
      if (pollInterval) clearInterval(pollInterval);
      if (initTimeout) clearTimeout(initTimeout);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      // Clean up when closing
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [isOpen]);

  const typeformUrl = buildTypeformUrl(source, user);

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
        {useIframe || embedFailed ? (
          <iframe
            src={typeformUrl}
            className="w-full h-full border-0"
            title="Contact Form"
            allow="camera; microphone; autoplay; encrypted-media;"
            style={{ minHeight: "600px" }}
          />
        ) : (
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ minHeight: "600px" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
