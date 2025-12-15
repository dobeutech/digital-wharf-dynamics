import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

/**
 * STEP 1: Define Zod validation schema
 * Add your validation rules here
 */
const formSchema = z.object({
  // Example field - replace with your own
  fieldName: z.string()
    .trim()
    .min(1, 'This field is required')
    .max(100, 'Maximum 100 characters'),
  
  // Add more fields as needed
  // email: z.string().email('Invalid email address'),
  // age: z.coerce.number().min(18, 'Must be 18 or older'),
});

/**
 * STEP 2: Infer TypeScript type from schema
 */
type FormValues = z.infer<typeof formSchema>;

/**
 * STEP 3: Define component props (optional)
 */
interface FormTemplateProps {
  onSuccess?: (data: FormValues) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * FormTemplate Component
 * 
 * A minimal form template following project patterns.
 * Replace "FormTemplate" with your actual form name.
 * 
 * @example
 * ```tsx
 * <FormTemplate
 *   onSuccess={(data) => console.log('Success:', data)}
 *   onError={(error) => console.error('Error:', error)}
 * />
 * ```
 */
export function FormTemplate({ onSuccess, onError, className }: FormTemplateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * STEP 4: Initialize form with useForm hook
   */
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: '',
      // Add default values for all fields
    },
    mode: 'onBlur', // Validate on blur
  });

  /**
   * STEP 5: Implement async form submission
   */
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with your actual API call
      // Example:
      // const response = await api.post('/endpoint', data);
      // if (!response.success) throw new Error(response.error);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success handling
      toast.success('Form submitted successfully!');
      onSuccess?.(data);
      form.reset();
    } catch (error) {
      // Error handling
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * STEP 6: Render form with FormField components
   */
  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Example Field - Replace with your fields */}
          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field Label *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter value..."
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Optional description for this field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Add more FormField components here */}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
