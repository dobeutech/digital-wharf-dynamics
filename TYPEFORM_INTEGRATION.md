# Typeform Integration Guide

This guide explains how to set up and use the Typeform integration in the Digital Wharf Dynamics website.

## Overview

The Typeform integration provides multiple ways for visitors to engage with your contact/inquiry form:

1. **Header Button** - "Get Started" button in the navigation header
2. **Footer CTA** - "Learn More" button in the footer call-to-action section
3. **Floating Action Button** - Persistent floating button on pages (currently on Home page)
4. **Lightbox/Modal** - Full-screen modal with embedded Typeform

## Setup Instructions

### 1. Create Your Typeform

1. Go to [Typeform](https://www.typeform.com/) and create an account
2. Create a new form with your desired questions
3. Publish your form
4. Copy the form ID from the URL: `https://form.typeform.com/to/YOUR_FORM_ID`

### 2. Configure Environment Variables

Add your Typeform ID to your environment variables:

```bash
# Add to .env or .env.local
VITE_TYPEFORM_ID=YOUR_FORM_ID
```

For production (Netlify):

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add `VITE_TYPEFORM_ID` with your form ID

### 3. Update Configuration (Optional)

Edit `src/config/typeform.ts` to customize:

```typescript
export const typeformConfig = {
  formId: import.meta.env.VITE_TYPEFORM_ID || "YOUR_TYPEFORM_ID",

  popup: {
    mode: "popup" as const,
    autoClose: 3000, // Auto-close after completion (ms)
    hideHeaders: false,
    hideFooter: false,
    opacity: 85,
    buttonText: "Learn More",
  },

  tracking: {
    utm_source: "dobeu_website",
    utm_medium: "website",
  },
};
```

## Usage

### Header Button

Already integrated in `src/components/layout/GlassmorphicHeader.tsx`:

```tsx
import { HeaderTypeformButton } from "@/components/TypeformButton";

// In your component
<HeaderTypeformButton source="header" />;
```

### Footer CTA

Already integrated in `src/components/layout/FloatingFooter.tsx`:

```tsx
import { LearnMoreButton } from "@/components/TypeformButton";

// In your component
<LearnMoreButton source="footer-cta" />;
```

### Floating Action Button

Add to any page:

```tsx
import { TypeformFloatingButton } from "@/components/TypeformFloatingButton";

export default function YourPage() {
  return (
    <>
      {/* Your page content */}
      <TypeformFloatingButton
        position="bottom-right"
        source="your-page"
        title="Let's Talk"
        description="Your custom description"
      />
    </>
  );
}
```

**Position options:**

- `bottom-right` (default)
- `bottom-left`
- `top-right`
- `top-left`

### Custom Button

Create a custom trigger button:

```tsx
import { TypeformButton } from "@/components/TypeformButton";

<TypeformButton
  variant="default"
  size="lg"
  source="custom-location"
  text="Contact Us"
  icon="message"
  className="your-custom-classes"
/>;
```

### Lightbox/Modal

Use the lightbox directly with custom trigger:

```tsx
import {
  TypeformLightbox,
  useTypeformLightbox,
} from "@/components/TypeformLightbox";

export function YourComponent() {
  const { isOpen, open, close } = useTypeformLightbox();

  return (
    <>
      <button onClick={open}>Open Form</button>

      <TypeformLightbox
        isOpen={isOpen}
        onClose={close}
        source="custom-trigger"
        title="Get in Touch"
        description="Fill out the form below"
      />
    </>
  );
}
```

## Components Reference

### TypeformButton

Main button component with multiple variants.

**Props:**

- `variant`: "default" | "outline" | "ghost" | "link" | "secondary"
- `size`: "default" | "sm" | "lg" | "icon"
- `source`: String for analytics tracking
- `text`: Button text
- `icon`: "message" | "calendar" | "none"
- `className`: Additional CSS classes
- `fullWidth`: Boolean for full-width button

### TypeformFloatingButton

Floating action button with pulse animation.

**Props:**

- `position`: "bottom-right" | "bottom-left" | "top-right" | "top-left"
- `source`: String for analytics tracking
- `title`: Hover text
- `description`: Modal description

### TypeformLightbox

Modal/dialog with embedded Typeform.

**Props:**

- `isOpen`: Boolean to control visibility
- `onClose`: Function to close modal
- `source`: String for analytics tracking
- `title`: Modal title
- `description`: Modal description

## Analytics Tracking

All Typeform interactions are tracked via Mixpanel:

- **Event**: "Typeform Opened"
- **Properties**:
  - `source`: Where the form was triggered from
  - `text`: Button text (for buttons)

- **Event**: "Typeform Lightbox Opened"
- **Properties**:
  - `source`: Lightbox trigger source

## Styling

All components use Tailwind CSS and follow the existing design system:

- Electric Lemon (#FACC15)
- Pink (#EC4899)
- Purple (#A855F7)
- Blue (#3B82F6)

Buttons feature gradient animations and hover effects consistent with the brand.

## Testing

To test the integration:

1. Set `VITE_TYPEFORM_ID` in your `.env` file
2. Run the development server: `npm run dev`
3. Check these locations:
   - Header: "Get Started" button (when not logged in)
   - Footer: "Learn More" button in CTA section
   - Home page: Floating button in bottom-right corner
4. Click any button to open the Typeform
5. Verify the form loads correctly in the popup/lightbox

## Troubleshooting

### Form doesn't open

1. Check that `VITE_TYPEFORM_ID` is set correctly
2. Verify the Typeform embed script is loaded in `index.html`
3. Check browser console for errors

### Form opens in new window instead of popup

This is the fallback behavior when the Typeform SDK isn't loaded. Ensure:

- The script tag is in `index.html`: `<script src="https://embed.typeform.com/next/embed.js"></script>`
- The page has fully loaded before clicking

### Styling issues

- Ensure Tailwind CSS is properly configured
- Check that motion/react (Framer Motion) is installed
- Verify all component imports are correct

## Customization

### Change button text

Edit the preset components in `src/components/TypeformButton.tsx`:

```typescript
export function LearnMoreButton({ source = "learn-more" }: { source?: string }) {
  return (
    <TypeformButton
      text="Your Custom Text"  // Change this
      // ... other props
    />
  );
}
```

### Change colors

Update the gradient classes in the component files:

```tsx
className = "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500";
```

### Add to more pages

Import and add the floating button to any page component:

```tsx
import { TypeformFloatingButton } from "@/components/TypeformFloatingButton";

// Add to your page JSX
<TypeformFloatingButton source="page-name" />;
```

## Support

For issues or questions:

1. Check the Typeform documentation: https://www.typeform.com/help/
2. Review the component source code in `src/components/`
3. Check the configuration in `src/config/typeform.ts`

## Future Enhancements

Potential improvements:

- [ ] Add form submission webhooks
- [ ] Integrate with CRM systems
- [ ] Add custom thank you page
- [ ] A/B test different form variants
- [ ] Add conditional logic based on user type
- [ ] Implement form analytics dashboard
