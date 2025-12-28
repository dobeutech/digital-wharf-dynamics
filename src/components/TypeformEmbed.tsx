import { Widget } from "@typeform/embed-react";
import { TYPEFORM_EMBED_ID } from "@/config/typeform";

/**
 * Typeform Embed Component
 * Uses the official @typeform/embed-react Widget component
 * This properly handles React's lifecycle for inline embedding
 */
export const TypeformEmbed = () => {
  return (
    <Widget id={TYPEFORM_EMBED_ID} style={{ width: "100%", height: "500px" }} />
  );
};
