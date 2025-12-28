/**
 * Typeform configuration
 * Configure your Typeform settings here
 */

/**
 * Typeform form slug for customer inquiry form
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
