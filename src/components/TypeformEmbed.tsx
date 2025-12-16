import { TYPEFORM_EMBED_ID } from "@/config/typeform";

/**
 * Typeform Embed Component
 * Uses the Typeform embed script loaded in index.html
 * The script automatically initializes all elements with data-tf-live attribute
 */
export const TypeformEmbed = () => {
  return <div data-tf-live={TYPEFORM_EMBED_ID}></div>;
};
