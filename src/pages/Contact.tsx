import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApi } from "@/lib/api";
import { trackEvent, MIXPANEL_EVENTS } from "@/lib/mixpanel";
import { PageMeta } from "@/components/seo/PageMeta";
import { cn } from "@/lib/utils";

const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(255, "Email must be less than 255 characters"),
    phone: z
      .string()
      .trim()
      .max(20, "Phone must be less than 20 characters")
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(10, "Message must be at least 10 characters")
      .max(2000, "Message must be less than 2000 characters"),
    smsConsent: z.boolean().default(false),
    marketingConsent: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.phone && data.phone.length > 0) {
        return data.smsConsent === true;
      }
      return true;
    },
    {
      message: "SMS consent is required when providing a phone number",
      path: ["smsConsent"],
    },
  );

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const api = useApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [showPhoneField, setShowPhoneField] = useState(false);

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
  const watchName = form.watch("name");
  const watchEmail = form.watch("email");
  const watchMessage = form.watch("message");

  useEffect(() => {
    const savedDraft = localStorage.getItem("contact-form-draft");
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.name) form.setValue("name", draft.name);
        if (draft.email) form.setValue("email", draft.email);
        if (draft.message) form.setValue("message", draft.message);
        if (draft.phone) {
          form.setValue("phone", draft.phone);
          setShowPhoneField(true);
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [form]);

  useEffect(() => {
    const values = form.getValues();
    if (values.name || values.email || values.message) {
      const timer = setTimeout(() => {
        localStorage.setItem("contact-form-draft", JSON.stringify(values));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [watchName, watchEmail, watchMessage, form]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setFormStatus("idle");

    try {
      const response = await api.post<{
        success: boolean;
        submission?: unknown;
        error?: string;
      }>("/contact-submissions", {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
        smsConsent: data.smsConsent,
        marketingConsent: data.marketingConsent,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to submit message");
      }

      trackEvent(MIXPANEL_EVENTS.CONTACT_FORM_SUBMITTED, {
        has_phone: !!data.phone,
        marketing_consent: data.marketingConsent,
      });

      setFormStatus("success");
      toast.success("Thank you! We'll be in touch soon.");
      localStorage.removeItem("contact-form-draft");
      form.reset();
      setShowPhoneField(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setFormStatus("error");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Contact Us"
        description="Get in touch with DOBEU for your next project. We respond within 24 hours. Call (215) 370-5332 or email devops@dobeu.cloud."
        keywords="contact dobeu, web development inquiry, software project, free consultation, get quote"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <header className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a project in mind? We typically respond within 24 hours.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="p-6 rounded-xl border border-border bg-card">
                <h2 className="text-lg font-semibold mb-1">
                  Send Us a Message
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us about your project and we'll reach out soon.
                </p>

                {formStatus === "success" && (
                  <div
                    className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
                    role="alert"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-green-600 dark:text-green-400">
                        Message sent successfully!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        We'll be in touch within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {formStatus === "error" && (
                  <div
                    className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-destructive">
                        Something went wrong
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please check the form and try again.
                      </p>
                    </div>
                  </div>
                )}

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Name <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              autoComplete="name"
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
                          <FormLabel>
                            Email <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              autoComplete="email"
                              maxLength={255}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!showPhoneField && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPhoneField(true)}
                        className="text-primary hover:text-primary/80 -mt-2"
                      >
                        + Add phone number for faster response
                      </Button>
                    )}

                    {showPhoneField && (
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="tel"
                                autoComplete="tel"
                                placeholder="(555) 123-4567"
                                maxLength={20}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Message <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              maxLength={2000}
                              placeholder="Tell us about your project, timeline, and goals..."
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
                                I agree to receive SMS updates about my project.
                                Reply STOP to opt out.{" "}
                                <span className="text-destructive">*</span>
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
                            Send me helpful tips and updates about web
                            development.
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
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
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Email</h3>
                    <a
                      href="mailto:devops@dobeu.cloud"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      devops@dobeu.cloud
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Phone</h3>
                    <a
                      href="tel:+12153705332"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      (215) 370-5332
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm mb-1">Location</h3>
                    <p className="text-sm text-muted-foreground">
                      NJ, USA — Serving clients worldwide
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-medium text-sm mb-3">Work With Jeremy</h3>
                <div className="flex flex-col gap-2">
                  <Button asChild size="sm" className="w-full">
                    <a
                      href="https://contra.com/jeremy_williams_fx413nca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      Hire on Contra
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a
                      href="https://www.behance.net/jeremywilliams62"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      View on Behance
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-primary/30 bg-primary/5">
                <h3 className="font-semibold mb-2">
                  Prefer to Schedule a Call?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book a free 30-minute consultation.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    to="/schedule"
                    className="flex items-center justify-center gap-2"
                  >
                    Schedule Consultation
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
