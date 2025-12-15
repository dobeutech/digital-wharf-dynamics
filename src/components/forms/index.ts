/**
 * Form Components
 *
 * Reusable form components built with react-hook-form, Zod, and TypeScript.
 *
 * @example
 * ```tsx
 * import { ExampleForm } from '@/components/forms';
 *
 * <ExampleForm
 *   onSuccess={(data) => console.log('Success:', data)}
 *   onError={(error) => console.error('Error:', error)}
 * />
 * ```
 */

export { ExampleForm } from "./ExampleForm";
export { FormTemplate } from "./FormTemplate";

// Re-export form UI components for convenience
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
