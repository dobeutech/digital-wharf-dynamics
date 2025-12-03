import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Mail, Phone, MapPin, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z.string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  smsConsent: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
}).refine(
  (data) => {
    // If phone is provided, smsConsent must be true
    if (data.phone && data.phone.length > 0) {
      return data.smsConsent === true;
    }
    return true;
  },
  {
    message: "SMS consent is required when providing a phone number",
    path: ["smsConsent"],
  }
);

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      smsConsent: false,
      marketingConsent: false,
    },
  });

  const watchPhone = form.watch("phone");

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setFormStatus('idle');

    try {
      const { data: response, error } = await supabase.functions.invoke('contact-submit', {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: data.message,
          smsConsent: data.smsConsent,
          marketingConsent: data.marketingConsent,
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to submit message');
      }

      if (!response.success) {
        throw new Error(response.error || 'Failed to submit message');
      }

      setFormStatus('success');
      toast.success("Thank you! We'll be in touch soon.");
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setFormStatus('error');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name <span className="text-destructive" aria-hidden="true">*</span></FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="name"
                              className="min-h-[44px]"
                              maxLength={100}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email <span className="text-destructive" aria-hidden="true">*</span></FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              autoComplete="email"
                              className="min-h-[44px]"
                              maxLength={255}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              autoComplete="tel"
                              className="min-h-[44px]"
                              maxLength={20}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message <span className="text-destructive" aria-hidden="true">*</span></FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              maxLength={2000}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value?.length || 0}/2000 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchPhone && watchPhone.length > 0 && (
                      <FormField
                        control={form.control}
                        name="smsConsent"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 p-4 bg-muted rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="mt-0.5"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="cursor-pointer text-sm font-normal text-muted-foreground leading-relaxed">
                                I consent to receive SMS messages from DOBEU regarding my inquiry and project updates. 
                                Message and data rates may apply. Reply STOP to opt out anytime. <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="marketingConsent"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer text-sm font-normal text-muted-foreground leading-relaxed">
                            I'd like to receive marketing emails about services, tips, and special offers.
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full shadow-material min-h-[44px]" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </Form>
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
