import { TYPEFORM_EMBED_ID } from "@/config/typeform";
import { useTypeformInit } from "@/hooks/useTypeformInit";

/**
 * Typeform Embed Component
 * Uses the Typeform embed script loaded in index.html
 * The script automatically initializes all elements with data-tf-live attribute
 * data-tf-live allows embed settings to update automatically without re-embedding
 */
export const TypeformEmbed = () => {
  useTypeformInit();

  return (
    <div
      data-tf-live={TYPEFORM_EMBED_ID}
      style={{ width: "100%", height: "500px" }}
    />
  );
};
