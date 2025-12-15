# Form Components Guide

**Complete guide to creating forms in Digital Wharf Dynamics**

---

## 📚 Overview

This project uses a standardized approach to forms with:

- **react-hook-form** - Form state management
- **Zod** - Schema validation
- **TypeScript** - Type safety
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling

---

## 🚀 Quick Start

### 1. Copy the Template

```bash
cp src/components/forms/FormTemplate.tsx src/components/forms/MyNewForm.tsx
```

### 2. Define Your Schema

```typescript
const myFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message too short'),
});

type MyFormValues = z.infer<typeof myFormSchema>;
```

### 3. Customize the Form

Replace the example fields with your own:

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
    await api.post('/endpoint', data);
    toast.success('Success!');
    form.reset();
  } catch (error) {
    toast.error('Failed to submit');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 📁 Project Structure

```
src/components/forms/
├── README.md              # Detailed documentation
├── index.ts               # Exports for easy imports
├── FormTemplate.tsx       # Minimal template
├── ExampleForm.tsx        # Complete example
└── __tests__/
    └── ExampleForm.test.tsx  # Test examples
```

---

## 🎯 Requirements Checklist

All forms in this project must follow these patterns:

### ✅ Required Patterns

- [x] **Use `useForm` hook** from react-hook-form
- [x] **Use Zod validation** with `zodResolver`
- [x] **TypeScript types** inferred from schema (`z.infer<typeof schema>`)
- [x] **Async `onSubmit`** handler with try-catch
- [x] **Display validation errors** using `FormMessage`
- [x] **Tailwind CSS styling** following project conventions
- [x] **Loading states** during submission
- [x] **Disable inputs** while submitting
- [x] **Reset form** after successful submission
- [x] **Toast notifications** for success/error

### ✅ Best Practices

- [x] Trim string inputs with `.trim()`
- [x] Validate on blur (`mode: 'onBlur'`)
- [x] Provide helpful error messages
- [x] Include `FormDescription` for guidance
- [x] Mark required fields with `*`
- [x] Use proper ARIA labels
- [x] Handle errors gracefully
- [x] Test all validation rules

---

## 📖 Available Components

### Form Components (from shadcn/ui)

```tsx
import {
  Form,           // Form wrapper (provides context)
  FormControl,    // Wraps input elements
  FormDescription, // Optional field description
  FormField,      // Connects field to react-hook-form
  FormItem,       // Container for field
  FormLabel,      // Field label
  FormMessage,    // Displays validation errors
} from '@/components/ui/form';
```

### Input Components

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
```

### Utilities

```tsx
import { toast } from 'sonner';  // Toast notifications
import { Loader2 } from 'lucide-react';  // Loading spinner icon
```

---

## 🔧 Common Field Types

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

**Schema:**
```typescript
name: z.string().trim().min(2, 'Too short').max(100, 'Too long')
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
        <Input type="email" placeholder="john@example.com" {...field} disabled={isSubmitting} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Schema:**
```typescript
email: z.string().trim().email('Invalid email address')
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
        <Input type="number" placeholder="18" {...field} disabled={isSubmitting} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Schema:**
```typescript
age: z.coerce.number().int().min(18, 'Must be 18+').max(120, 'Invalid age')
```

### Select Dropdown

```tsx
<FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Category *</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
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

**Schema:**
```typescript
category: z.string().min(1, 'Please select a category')
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

**Schema:**
```typescript
message: z.string().trim().min(10, 'Too short').max(1000, 'Too long')
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
        <FormDescription>Required to continue</FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  )}
/>
```

**Schema:**
```typescript
agreeToTerms: z.boolean().refine((val) => val === true, {
  message: 'You must agree to continue',
})
```

---

## 🎨 Styling Guidelines

### Form Container

```tsx
<div className="space-y-6">
  {/* Form fields */}
</div>
```

### Form Layout

```tsx
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
  {/* Fields with consistent spacing */}
</form>
```

### Responsive Design

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Two columns on desktop, one on mobile */}
</div>
```

### Button Group

```tsx
<div className="flex items-center gap-4">
  <Button type="submit" disabled={isSubmitting}>Submit</Button>
  <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
</div>
```

---

## 🧪 Testing

### Test File Structure

```typescript
describe('MyForm', () => {
  describe('Rendering', () => {
    it('renders all form fields', () => {
      // Test field rendering
    });
  });

  describe('Validation', () => {
    it('shows error for invalid input', async () => {
      // Test validation
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      // Test submission
    });
  });
});
```

### Example Test

```typescript
it('shows error when name is too short', async () => {
  const user = userEvent.setup();
  render(<MyForm />);

  const nameInput = screen.getByLabelText(/name/i);
  await user.type(nameInput, 'A');
  await user.tab(); // Trigger blur validation

  await waitFor(() => {
    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
  });
});
```

---

## 🐛 Common Issues & Solutions

### Issue: Form Not Submitting

**Problem:** Button click doesn't trigger submission.

**Solution:** Ensure button has `type="submit"`:

```tsx
<Button type="submit">Submit</Button>  // ✅ Correct
<Button>Submit</Button>                // ❌ Wrong
```

### Issue: Validation Not Working

**Problem:** Errors not showing.

**Solution:** Include `FormMessage` component:

```tsx
<FormField name="email">
  <FormControl><Input {...field} /></FormControl>
  <FormMessage />  {/* ✅ Required */}
</FormField>
```

### Issue: Checkbox Not Toggling

**Problem:** Checkbox doesn't change state.

**Solution:** Use `checked` and `onCheckedChange`:

```tsx
<Checkbox
  checked={field.value}
  onCheckedChange={field.onChange}
/>
```

### Issue: TypeScript Errors

**Problem:** Type errors on form values.

**Solution:** Use `z.infer` to generate types:

```typescript
const schema = z.object({ name: z.string() });
type FormValues = z.infer<typeof schema>;  // ✅ Correct

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
});
```

---

## 📚 Examples in Project

### Simple Form
**File:** `src/pages/CCPAOptOut.tsx`
- Basic form with few fields
- Simple validation
- Good starting point

### Complex Form
**File:** `src/pages/Contact.tsx`
- Multiple field types
- Conditional validation
- Draft saving
- Advanced patterns

### Template Form
**File:** `src/components/forms/FormTemplate.tsx`
- Minimal boilerplate
- Copy and customize
- All required patterns

### Complete Example
**File:** `src/components/forms/ExampleForm.tsx`
- All field types demonstrated
- Comprehensive validation
- Success/error handling
- Loading states

---

## 🔗 Resources

### Documentation
- [react-hook-form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [shadcn/ui Forms](https://ui.shadcn.com/docs/components/form)

### Project Files
- [Form Components README](./src/components/forms/README.md)
- [Form Template](./src/components/forms/FormTemplate.tsx)
- [Example Form](./src/components/forms/ExampleForm.tsx)
- [Test Examples](./src/components/forms/__tests__/ExampleForm.test.tsx)

---

## ✅ Checklist for New Forms

Before submitting a PR with a new form:

- [ ] Uses `useForm` hook with `zodResolver`
- [ ] TypeScript types inferred from Zod schema
- [ ] All fields have validation rules
- [ ] Error messages are clear and helpful
- [ ] Form has loading state during submission
- [ ] Inputs are disabled while submitting
- [ ] Form resets after successful submission
- [ ] Toast notifications for success/error
- [ ] Required fields marked with `*`
- [ ] Includes `FormDescription` where helpful
- [ ] Follows Tailwind CSS styling conventions
- [ ] Has unit tests for validation
- [ ] Has tests for submission flow
- [ ] Documented in component JSDoc

---

## 🎓 Training

### For New Developers

1. **Read** the [Form Components README](./src/components/forms/README.md)
2. **Study** the [ExampleForm](./src/components/forms/ExampleForm.tsx)
3. **Copy** the [FormTemplate](./src/components/forms/FormTemplate.tsx)
4. **Build** a simple form (name + email)
5. **Test** your form with unit tests
6. **Review** existing forms in the project

### Practice Exercise

Create a "Feedback Form" with:
- Name (required, 2-100 chars)
- Email (required, valid email)
- Rating (required, 1-5 stars)
- Comments (optional, max 500 chars)
- Submit button with loading state
- Success/error handling
- Unit tests

---

**Last Updated:** 2025-12-15  
**Maintained By:** Engineering Team
