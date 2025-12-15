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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

/**
 * Zod validation schema
 * Define all validation rules here
 */
const exampleFormSchema = z.object({
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

  age: z.coerce
    .number()
    .int("Age must be a whole number")
    .min(18, "You must be at least 18 years old")
    .max(120, "Please enter a valid age"),

  category: z.string().min(1, "Please select a category"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),

  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),

  newsletter: z.boolean().default(false),
});

/**
 * TypeScript type inferred from Zod schema
 */
type ExampleFormValues = z.infer<typeof exampleFormSchema>;

/**
 * Props for the ExampleForm component
 */
interface ExampleFormProps {
  onSuccess?: (data: ExampleFormValues) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * ExampleForm Component
 *
 * A comprehensive form example demonstrating:
 * - react-hook-form with useForm hook
 * - Zod validation with zodResolver
 * - TypeScript types inferred from schema
 * - Async form submission
 * - Error handling and display
 * - Tailwind CSS styling
 * - Loading states
 * - Success/error feedback
 *
 * @example
 * ```tsx
 * <ExampleForm
 *   onSuccess={(data) => console.log('Form submitted:', data)}
 *   onError={(error) => console.error('Form error:', error)}
 * />
 * ```
 */
export function ExampleForm({
  onSuccess,
  onError,
  className,
}: ExampleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // Initialize form with react-hook-form
  const form = useForm<ExampleFormValues>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      name: "",
      email: "",
      age: 18,
      category: "",
      message: "",
      agreeToTerms: false,
      newsletter: false,
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  /**
   * Async form submission handler
   * Simulates API call with error handling
   */
  const onSubmit = async (data: ExampleFormValues) => {
    setIsSubmitting(true);
    setFormStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random error for demonstration
      if (Math.random() < 0.1) {
        throw new Error("Simulated API error");
      }

      // Success handling
      setFormStatus("success");
      toast.success("Form submitted successfully!", {
        description: `Thank you, ${data.name}! We'll be in touch soon.`,
      });

      // Call success callback if provided
      onSuccess?.(data);

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setFormStatus("error");
      toast.error("Submission failed", {
        description: errorMessage,
      });

      // Call error callback if provided
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {/* Success Message */}
      {formStatus === "success" && (
        <div
          className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3"
          role="alert"
        >
          <CheckCircle
            className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium text-green-500">Success!</p>
            <p className="text-sm text-muted-foreground">
              Your form has been submitted successfully.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {formStatus === "error" && (
        <div
          className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3"
          role="alert"
        >
          <AlertCircle
            className="w-5 h-5 text-destructive mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium text-destructive">Error</p>
            <p className="text-sm text-muted-foreground">
              Please check the form and try again.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    disabled={isSubmitting}
                    className="transition-all duration-200"
                  />
                </FormControl>
                <FormDescription>
                  Your full name as it appears on official documents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                    disabled={isSubmitting}
                    className="transition-all duration-200"
                  />
                </FormControl>
                <FormDescription>
                  We'll never share your email with anyone else.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age Field */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="18"
                    {...field}
                    disabled={isSubmitting}
                    className="transition-all duration-200"
                  />
                </FormControl>
                <FormDescription>
                  You must be at least 18 years old.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Select */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the category that best describes your inquiry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Textarea */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[120px] resize-y transition-all duration-200"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Provide as much detail as possible (10-1000 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms Checkbox */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I agree to the terms and conditions *</FormLabel>
                  <FormDescription>
                    You must agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      terms and conditions
                    </a>{" "}
                    to submit this form.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Newsletter Checkbox */}
          <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Subscribe to newsletter</FormLabel>
                  <FormDescription>
                    Receive updates and news about our products and services.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>

            {/* Reset Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
              className="transition-all duration-200"
            >
              Reset
            </Button>
          </div>

          {/* Form State Debug (remove in production) */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 p-4 bg-muted rounded-lg text-xs">
              <summary className="cursor-pointer font-medium">
                Debug Info
              </summary>
              <pre className="mt-2 overflow-auto">
                {JSON.stringify(
                  {
                    values: form.getValues(),
                    errors: form.formState.errors,
                    isDirty: form.formState.isDirty,
                    isValid: form.formState.isValid,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          )}
        </form>
      </Form>
    </div>
  );
}
