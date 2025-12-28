import { TYPEFORM_EMBED_ID } from "@/config/typeform";
import { useTypeformInit } from "@/hooks/useTypeformInit";

/**
 * Typeform Embed Component
 * Uses the Typeform embed script loaded in index.html
 * The script automatically initializes all elements with data-tf-widget attribute
 */
export const TypeformEmbed = () => {
  useTypeformInit();

  return (
    <div
      data-tf-widget={TYPEFORM_EMBED_ID}
      data-tf-inline-on-mobile
      data-tf-medium="snippet"
      style={{ width: "100%", height: "500px" }}
    />
  );
};
