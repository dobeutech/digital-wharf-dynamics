import { TYPEFORM_EMBED_ID } from "@/config/typeform";
import { useTypeformInit } from "@/hooks/useTypeformInit";

/**
 * Typeform Embed Component
 * Uses the Typeform embed script loaded in index.html
 * The script automatically initializes all elements with data-tf-live attribute
 */
export const TypeformEmbed = () => {
  useTypeformInit();

  return <div data-tf-live={TYPEFORM_EMBED_ID}></div>;
};
