import { useEffect } from 'react';

export const TypeformEmbed = () => {
  useEffect(() => {
    // Typeform script is loaded in index.html
    // This ensures the live embed is initialized when the component mounts
    if (typeof window !== 'undefined' && (window as any).tf) {
      (window as any).tf.load();
    }
  }, []);

  return (
    <div
      data-tf-live="01KCBVEXYD88HBQQB22XQA49ZR"
      className="typeform-embed"
    />
  );
};
