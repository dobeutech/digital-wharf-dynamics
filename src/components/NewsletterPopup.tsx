import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterPopup = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds if user hasn't seen it
    const hasSeenPopup = localStorage.getItem("newsletterPopupSeen");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!marketingConsent) {
      toast.error("Please consent to receive marketing emails");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: { email: email.trim(), marketingConsent }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      localStorage.setItem("newsletterPopupSeen", "true");
      toast.success(data?.message || "Thank you for subscribing!");
      setOpen(false);
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("newsletterPopupSeen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md shadow-material-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Stay Updated with DOBEU</DialogTitle>
          <DialogDescription>
            Subscribe to "The Digital Wharf" and get quarterly updates on the latest tech trends, 
            project showcases, and exclusive insights.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing"
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
            />
            <label
              htmlFor="marketing"
              className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
            >
              I consent to receive marketing emails and understand I can unsubscribe at any time. 
              By subscribing, you agree to our Privacy Policy and Terms of Service.
            </label>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 shadow-material" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Maybe Later
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
