# Form Components

This directory contains reusable form components built with **react-hook-form**, **Zod validation**, and **TypeScript**.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Form Template](#form-template)
- [Complete Example](#complete-example)
- [Available Components](#available-components)
- [Validation Patterns](#validation-patterns)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Use the Template

Copy `FormTemplate.tsx` and rename it:

```bash
cp src/components/forms/FormTemplate.tsx src/components/forms/MyForm.tsx
```

### 2. Define Your Schema

```typescript
const myFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  age: z.coerce.number().min(18, "Must be 18 or older"),
});

type MyFormValues = z.infer<typeof myFormSchema>;
```

### 3. Add Form Fields

```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name *</FormLabel>
      <FormControl>
        <Input placeholder="John Doe" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 4. Implement Submission

```typescript
const onSubmit = async (data: MyFormValues) => {
  setIsSubmitting(true);
  try {
    await api.post("/endpoint", data);
    toast.success("Success!");
    form.reset();
  } catch (error) {
    toast.error("Failed to submit");
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Form Template

**File:** `FormTemplate.tsx`

A minimal template with all required patterns:

- ✅ react-hook-form with `useForm` hook
- ✅ Zod validation with `zodResolver`
- ✅ TypeScript types from `z.infer`
- ✅ Async form submission
- ✅ Error handling
- ✅ Loading states
- ✅ Tailwind CSS styling

**Usage:**

```tsx
import { FormTemplate } from "@/components/forms/FormTemplate";

<FormTemplate
  onSuccess={(data) => console.log("Success:", data)}
  onError={(error) => console.error("Error:", error)}
/>;
```

---

## Complete Example

**File:** `ExampleForm.tsx`

A comprehensive example demonstrating:

- Multiple field types (text, email, number, select, textarea, checkbox)
- Complex validation rules
- Success/error feedback
- Form reset functionality
- Debug mode for development

**Usage:**

```tsx
import { ExampleForm } from "@/components/forms/ExampleForm";

<ExampleForm
  onSuccess={(data) => {
    console.log("Form submitted:", data);
    // Handle success
  }}
  onError={(error) => {
    console.error("Form error:", error);
    // Handle error
  }}
  className="max-w-2xl mx-auto"
/>;
```

---

## Available Components

### UI Components (from shadcn/ui)

All form components are available from `@/components/ui/`:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
```

### Form Components

```tsx
// Form wrapper (provides context)
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Fields */}
  </form>
</Form>

// Form field (connects to react-hook-form)
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>Optional description</FormDescription>
      <FormMessage /> {/* Shows validation errors */}
    </FormItem>
  )}
/>
```

---

## Validation Patterns

### String Validation

```typescript
// Required string
z.string().min(1, "This field is required");

// Min/max length
z.string().min(2, "Too short").max(100, "Too long");

// Email
z.string().email("Invalid email address");

// URL
z.string().url("Invalid URL");

// Regex pattern
z.string().regex(/^[A-Z0-9]+$/, "Must be uppercase alphanumeric");

// Trim whitespace
z.string().trim().min(1, "Required");

// Optional string
z.string().optional();
z.string().optional().or(z.literal(""));
```

### Number Validation

```typescript
// Number with coercion (converts string to number)
z.coerce.number();

// Min/max
z.coerce.number().min(0, "Must be positive").max(100, "Too large");

// Integer only
z.coerce.number().int("Must be a whole number");

// Positive/negative
z.coerce.number().positive("Must be positive");
z.coerce.number().negative("Must be negative");
```

### Boolean Validation

```typescript
// Boolean
z.boolean();

// Required checkbox (must be true)
z.boolean().refine((val) => val === true, {
  message: "You must agree to continue",
});

// Optional checkbox
z.boolean().default(false);
```

### Date Validation

```typescript
// Date
z.date();

// Date with min/max
z.date().min(new Date("2020-01-01"), "Too old");
z.date().max(new Date(), "Cannot be in the future");

// Date from string
z.string().pipe(z.coerce.date());
```

### Array Validation

```typescript
// Array of strings
z.array(z.string());

// Min/max items
z.array(z.string()).min(1, "Select at least one").max(5, "Too many");

// Non-empty array
z.array(z.string()).nonempty("Required");
```

### Object Validation

```typescript
// Nested object
z.object({
  address: z.object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
  }),
});
```

### Custom Validation

```typescript
// Custom refinement
z.string().refine((val) => val.includes("@"), { message: "Must contain @" });

// Conditional validation
z.object({
  phone: z.string().optional(),
  smsConsent: z.boolean(),
}).refine(
  (data) => {
    if (data.phone && data.phone.length > 0) {
      return data.smsConsent === true;
    }
    return true;
  },
  {
    message: "SMS consent required when phone provided",
    path: ["smsConsent"],
  },
);
```

---

## Best Practices

### 1. Always Use TypeScript Types

```typescript
// ✅ Good: Infer type from schema
const schema = z.object({ name: z.string() });
type FormValues = z.infer<typeof schema>;

// ❌ Bad: Manual type definition
type FormValues = { name: string };
```

### 2. Trim String Inputs

```typescript
// ✅ Good: Trim whitespace
z.string().trim().min(1, "Required");

// ❌ Bad: No trimming (allows whitespace-only)
z.string().min(1, "Required");
```

### 3. Use Descriptive Error Messages

```typescript
// ✅ Good: Clear, actionable message
z.string().min(2, "Name must be at least 2 characters");

// ❌ Bad: Generic message
z.string().min(2, "Invalid");
```

### 4. Handle Loading States

```typescript
// ✅ Good: Disable form during submission
<Input {...field} disabled={isSubmitting} />
<Button disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</Button>

// ❌ Bad: No loading state
<Button>Submit</Button>
```

### 5. Reset Form After Success

```typescript
// ✅ Good: Reset after successful submission
const onSubmit = async (data) => {
  await api.post("/endpoint", data);
  form.reset(); // Clear form
};

// ❌ Bad: Leave form filled
const onSubmit = async (data) => {
  await api.post("/endpoint", data);
  // Form still has values
};
```

### 6. Use FormDescription for Guidance

```tsx
// ✅ Good: Provide helpful context
<FormDescription>
  Your email will never be shared with third parties.
</FormDescription>

// ❌ Bad: No guidance
<FormLabel>Email</FormLabel>
<FormControl><Input /></FormControl>
```

### 7. Validate on Blur

```typescript
// ✅ Good: Validate when user leaves field
const form = useForm({
  resolver: zodResolver(schema),
  mode: "onBlur",
});

// ❌ Bad: Validate on every keystroke (annoying)
const form = useForm({
  resolver: zodResolver(schema),
  mode: "onChange",
});
```

---

## Common Patterns

### Text Input

```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name *</FormLabel>
      <FormControl>
        <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
      </FormControl>
      <FormDescription>Your full name</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Email Input

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email *</FormLabel>
      <FormControl>
        <Input
          type="email"
          placeholder="john@example.com"
          {...field}
          disabled={isSubmitting}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Number Input

```tsx
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
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Select Dropdown

```tsx
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
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Textarea

```tsx
<FormField
  control={form.control}
  name="message"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Message *</FormLabel>
      <FormControl>
        <Textarea
          placeholder="Your message..."
          className="min-h-[120px]"
          {...field}
          disabled={isSubmitting}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox

```tsx
<FormField
  control={form.control}
  name="agreeToTerms"
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
        <FormLabel>I agree to the terms *</FormLabel>
        <FormDescription>You must agree to continue</FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  )}
/>
```

### Submit Button with Loading

```tsx
<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Submitting...
    </>
  ) : (
    "Submit"
  )}
</Button>
```

---

## Troubleshooting

### Form Not Submitting

**Problem:** Form doesn't submit when clicking button.

**Solution:** Ensure button has `type="submit"` and is inside the `<form>` tag:

```tsx
<form onSubmit={form.handleSubmit(onSubmit)}>
  <Button type="submit">Submit</Button> {/* ✅ Correct */}
</form>
```

### Validation Not Working

**Problem:** Validation errors not showing.

**Solution:** Check that:

1. `zodResolver` is passed to `useForm`
2. `FormMessage` component is included
3. Field name matches schema

```tsx
// ✅ Correct
const form = useForm({
  resolver: zodResolver(schema), // Must include this
});

<FormField name="email">
  {" "}
  {/* Must match schema */}
  <FormMessage /> {/* Must include this */}
</FormField>;
```

### TypeScript Errors

**Problem:** Type errors on form values.

**Solution:** Use `z.infer` to generate types:

```typescript
// ✅ Correct
const schema = z.object({ name: z.string() });
type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({
  // Use inferred type
  resolver: zodResolver(schema),
});
```

### Field Not Updating

**Problem:** Input value doesn't change when typing.

**Solution:** Ensure `{...field}` is spread on the input:

```tsx
// ✅ Correct
<Input {...field} />

// ❌ Wrong
<Input value={field.value} />
```

### Checkbox Not Working

**Problem:** Checkbox doesn't toggle.

**Solution:** Use `checked` and `onCheckedChange`:

```tsx
// ✅ Correct
<Checkbox
  checked={field.value}
  onCheckedChange={field.onChange}
/>

// ❌ Wrong
<Checkbox {...field} />
```

---

## Additional Resources

- [react-hook-form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [shadcn/ui Form Documentation](https://ui.shadcn.com/docs/components/form)
- [Project Form Examples](../../pages/Contact.tsx)

---

## Need Help?

Check existing forms in the project:

- `src/pages/Contact.tsx` - Complex form with conditional fields
- `src/pages/CCPAOptOut.tsx` - Simple form example
- `src/components/forms/ExampleForm.tsx` - Comprehensive example

---

**Last Updated:** 2025-12-15
