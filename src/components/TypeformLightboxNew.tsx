import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/mixpanel";

interface TypeformLightboxNewProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

export function TypeformLightboxNew({
  isOpen,
  onClose,
  source = "lightbox",
}: TypeformLightboxNewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      trackEvent("Typeform Lightbox Opened", { source });
      
      // The Typeform script is already loaded in index.html
      // Just need to initialize the embed when lightbox opens
      const initTypeform = () => {
        if (containerRef.current) {
          // Clear any existing content
          containerRef.current.innerHTML = '';
          
          // Create the embed div with the exact structure from user's requirements
          const embedDiv = document.createElement('div');
          embedDiv.setAttribute('data-tf-live', '01KCBVEXYD88HBQQB22XQA49ZR');
          containerRef.current.appendChild(embedDiv);
          
          // The script is already in index.html, so tf should be available
          // Wait a bit for it to be ready, then load
          const tryLoad = () => {
            if ((window as any).tf && (window as any).tf.load) {
              try {
                (window as any).tf.load();
              } catch (error) {
                console.error('Error loading Typeform:', error);
              }
            } else {
              // Retry after a short delay
              setTimeout(tryLoad, 100);
            }
          };
          
          // Start trying to load
          tryLoad();
        }
      };

      // Small delay to ensure DOM is ready
      setTimeout(initTypeform, 100);
    } else {
      // Clean up when closing
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    }
  }, [isOpen, source]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div 
          ref={containerRef}
          className="w-full h-full"
          style={{ minHeight: '600px' }}
        />
      </DialogContent>
    </Dialog>
  );
}

