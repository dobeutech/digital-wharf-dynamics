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

/**
 * Typeform form slug for customer inquiry form
 * This is the form ID used with @typeform/embed-react Widget
 */
export const TYPEFORM_EMBED_ID = "customer-inq";

/**
 * Typeform workspace domain
 */
export const TYPEFORM_WORKSPACE = "dobeu";

/**
 * Get the full Typeform URL for direct redirect
 */
export function getTypeformDirectUrl(params?: {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}): string {
  const baseUrl = `https://${TYPEFORM_WORKSPACE}.typeform.com/${TYPEFORM_EMBED_ID}`;

  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  if (params.utm_source) searchParams.set("utm_source", params.utm_source);
  if (params.utm_medium) searchParams.set("utm_medium", params.utm_medium);
  if (params.utm_campaign)
    searchParams.set("utm_campaign", params.utm_campaign);
  if (params.utm_term) searchParams.set("utm_term", params.utm_term);
  if (params.utm_content) searchParams.set("utm_content", params.utm_content);

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export const typeformConfig = {
  // Use TYPEFORM_EMBED_ID as the default form ID
  formId: import.meta.env.VITE_TYPEFORM_ID || TYPEFORM_EMBED_ID,

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
