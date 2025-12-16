/**
 * Typeform configuration
 * Configure your Typeform embed settings here
 */

// Type definition for Typeform embed library
interface TypeformAPI {
  load: () => void;
  createPopup: (
    formId: string,
    options: Record<string, unknown>,
  ) => { open: () => void };
}

declare global {
  interface Window {
    tf?: TypeformAPI;
  }
}

export const typeformConfig = {
  // Replace with your Typeform form ID
  formId: import.meta.env.VITE_TYPEFORM_ID || "YOUR_TYPEFORM_ID",

  // Popup/lightbox configuration
  popup: {
    mode: "popup" as const,
    autoClose: 3000, // Auto-close after 3 seconds on completion
    hideHeaders: false,
    hideFooter: false,
    opacity: 85,
    buttonText: "Learn More",
  },

  // Widget configuration for embedded forms
  widget: {
    mode: "widget" as const,
    hideHeaders: false,
    hideFooter: false,
    opacity: 100,
  },

  // Tracking and analytics
  tracking: {
    utm_source: "dobeu_website",
    utm_medium: "website",
  },
};

/**
 * Get Typeform popup URL with tracking parameters
 */
export function getTypeformPopupUrl(source?: string): string {
  const params = new URLSearchParams({
    ...typeformConfig.tracking,
    ...(source && { utm_campaign: source }),
  });

  return `https://form.typeform.com/to/${typeformConfig.formId}?${params.toString()}`;
}

/**
 * Open Typeform in popup/lightbox mode
 */
export function openTypeformPopup(source?: string): void {
  const url = getTypeformPopupUrl(source);

  // Check if Typeform embed library is loaded
  if (typeof window !== "undefined" && window.tf) {
    const popup = window.tf.createPopup(typeformConfig.formId, {
      ...typeformConfig.popup,
      hidden: {
        ...typeformConfig.tracking,
        ...(source && { utm_campaign: source }),
      },
    });
    popup.open();
  } else {
    // Fallback to opening in new window
    window.open(url, "_blank", "width=800,height=600");
  }
}
