import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Shield, CheckCircle } from "lucide-react";
import { useApi } from "@/lib/api";
import { PageMeta } from "@/components/seo/PageMeta";

const ccpaFormSchema = z.object({
  fullName: z
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
  address: z
    .string()
    .trim()
    .max(500, "Address must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  requestTypes: z
    .array(z.string())
    .min(1, "Please select at least one request type"),
  additionalInfo: z
    .string()
    .trim()
    .max(1000, "Additional information must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  confirmIdentity: z.boolean().refine((val) => val === true, {
    message: "You must confirm your identity to submit this request",
  }),
});

type CCPAFormValues = z.infer<typeof ccpaFormSchema>;

export default function CCPAOptOut() {
  const api = useApi();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string>("");
  const [responseDeadline, setResponseDeadline] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<CCPAFormValues>({
    resolver: zodResolver(ccpaFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      requestTypes: [],
      additionalInfo: "",
      confirmIdentity: false,
    },
  });

  const requestTypes = [
    { id: "opt-out", label: "Do Not Sell My Personal Information" },
    { id: "delete", label: "Delete My Personal Information" },
    { id: "access", label: "Access My Personal Information" },
    { id: "correction", label: "Correct My Personal Information" },
  ];

  const onSubmit = async (data: CCPAFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await api.post<{
        success: boolean;
        referenceId?: string;
        responseDeadline?: string;
        error?: string;
      }>("/ccpa-request", {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        requestTypes: data.requestTypes,
        additionalInfo: data.additionalInfo || null,
        confirmIdentity: data.confirmIdentity,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to submit request");
      }

      if (!response.referenceId || !response.responseDeadline) {
        throw new Error("Invalid response from server");
      }

      setReferenceId(response.referenceId);
      setResponseDeadline(response.responseDeadline);

      toast({
        title: "Request Submitted",
        description:
          "We will process your request within 45 days as required by law.",
      });

      setIsSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <PageMeta
          title="CCPA Request Submitted"
          description="Your CCPA privacy request has been submitted successfully. We will process your request within 45 days as required by California law."
          keywords="CCPA submitted, privacy request, data rights, California privacy"
          canonical="https://dobeu.net/ccpa-optout"
        />
        <div className="min-h-screen pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">
              Request Submitted Successfully
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for submitting your CCPA request. We will verify your
              identity and process your request within 45 days as required by
              California law. You will receive a confirmation email at the
              address you provided.
            </p>
            <div className="bg-card border border-border rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground mb-1">Reference ID</p>
              <p className="font-mono text-lg font-semibold text-primary">
                {referenceId}
              </p>
              {responseDeadline && (
                <>
                  <p className="text-sm text-muted-foreground mt-3 mb-1">
                    Response Deadline
                  </p>
                  <p className="font-medium">
                    {new Date(responseDeadline).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="CCPA Opt-Out - Do Not Sell My Data"
        description="Exercise your California Consumer Privacy Act (CCPA) rights. Opt-out of the sale of your personal information, request data deletion, or access your data."
        keywords="CCPA opt out, do not sell my data, California privacy rights, data deletion, personal information request"
        canonical="https://dobeu.net/ccpa-optout"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              Do Not Sell My Personal Information
            </h1>
          </div>

          <p className="text-muted-foreground mb-8">
            Under the California Consumer Privacy Act (CCPA), California
            residents have the right to opt-out of the sale of their personal
            information. Use this form to submit your request. We will respond
            within 45 days as required by law.
          </p>

          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Your Rights Under CCPA
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Right to Know:</strong> Request what personal
                information we collect about you
              </li>
              <li>
                • <strong>Right to Delete:</strong> Request deletion of your
                personal information
              </li>
              <li>
                • <strong>Right to Opt-Out:</strong> Opt-out of the sale of your
                personal information
              </li>
              <li>
                • <strong>Right to Non-Discrimination:</strong> Not be
                discriminated against for exercising your rights
              </li>
            </ul>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Legal Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        maxLength={100}
                        {...field}
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
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        maxLength={255}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      We'll use this to verify your identity and send
                      confirmation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        maxLength={20}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>California Address (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, Los Angeles, CA 90001"
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Helps verify California residency
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requestTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Request Type *</FormLabel>
                    <FormDescription>Select all that apply</FormDescription>
                    <div className="space-y-3 mt-2">
                      {requestTypes.map((type) => (
                        <FormField
                          key={type.id}
                          control={form.control}
                          name="requestTypes"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(type.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, type.id]
                                      : field.value?.filter(
                                          (val) => val !== type.id,
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {type.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional details about your request..."
                        className="min-h-[100px]"
                        maxLength={1000}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/1000 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmIdentity"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-muted/50">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        I confirm that I am a California resident and the
                        information provided is accurate *
                      </FormLabel>
                      <FormDescription>
                        We may need to verify your identity before processing
                        your request
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit CCPA Request"}
              </Button>
            </form>
          </Form>

          <p className="text-xs text-muted-foreground mt-8 text-center">
            For questions about this form, contact us at{" "}
            <a
              href="mailto:privacy@dobeu.cloud"
              className="text-primary hover:underline"
            >
              privacy@dobeu.cloud
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
