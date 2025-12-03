import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Phone, MapPin, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    smsConsent: false,
    marketingConsent: false
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.smsConsent && formData.phone) {
      toast.error("Please consent to SMS communication if providing a phone number");
      setFormStatus('error');
      return;
    }

    // Would send to backend in production
    setFormStatus('success');
    toast.success("Thank you! We'll be in touch soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      smsConsent: false,
      marketingConsent: false
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 gradient-primary bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's discuss how we can help bring your vision to life
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Card className="shadow-material-lg">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3" role="alert">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-green-500">Message sent successfully!</p>
                      <p className="text-sm text-muted-foreground">We'll be in touch within 24 hours.</p>
                    </div>
                  </div>
                )}
                
                {formStatus === 'error' && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3" role="alert">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-destructive">Something went wrong</p>
                      <p className="text-sm text-muted-foreground">Please check the form and try again.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                  <div>
                    <Label htmlFor="name">Name <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      aria-required="true"
                      className="mt-1 min-h-[44px]"
                      autoComplete="name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      aria-required="true"
                      className="mt-1 min-h-[44px]"
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 min-h-[44px]"
                      autoComplete="tel"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message <span className="text-destructive" aria-hidden="true">*</span></Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      aria-required="true"
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  {formData.phone && (
                    <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                      <Checkbox
                        id="sms"
                        checked={formData.smsConsent}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, smsConsent: checked as boolean })
                        }
                        className="mt-0.5"
                      />
                      <label htmlFor="sms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        I consent to receive SMS messages from DOBEU regarding my inquiry and project updates. 
                        Message and data rates may apply. Reply STOP to opt out anytime.
                      </label>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketing"
                      checked={formData.marketingConsent}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, marketingConsent: checked as boolean })
                      }
                      className="mt-0.5"
                    />
                    <label htmlFor="marketing" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      I'd like to receive marketing emails about services, tips, and special offers.
                    </label>
                  </div>

                  <Button type="submit" className="w-full shadow-material min-h-[44px]" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <Card className="shadow-material">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold mb-1">Email</h2>
                    <a href="mailto:hello@dobeu.cloud" className="text-muted-foreground hover:text-primary transition-colors">
                      hello@dobeu.cloud
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-material">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold mb-1">Phone</h2>
                    <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-material">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold mb-1">Location</h2>
                    <p className="text-muted-foreground">
                      San Francisco, CA<br />
                      Serving clients worldwide
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-material">
              <CardContent className="p-5 sm:p-6">
                <h2 className="font-semibold mb-3">Work With Jeremy</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Available for freelance projects and collaborations
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="sm" className="shadow-material flex-1 min-h-[44px]">
                    <a 
                      href="https://contra.com/jeremy_williams_fx413nca?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=jeremy_williams_fx413nca" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      Hire on Contra
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="shadow-material flex-1 min-h-[44px]">
                    <a 
                      href="https://www.behance.net/jeremywilliams62" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      View on Behance
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-material gradient-primary text-primary-foreground">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Prefer to Schedule a Call?</h2>
                <p className="mb-6 opacity-90 text-sm sm:text-base">
                  Book a free 30-minute consultation to discuss your project in detail.
                </p>
                <Button variant="secondary" size="lg" className="shadow-material min-h-[44px]">
                  Schedule Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
