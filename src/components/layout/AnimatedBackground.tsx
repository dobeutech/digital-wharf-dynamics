/**
 * AnimatedBackground - Subtle, minimal background effect
 *
 * Design inspired by: huggingface.co, jitter.video, designjoy.co
 * Uses a very subtle gradient overlay instead of animated blobs
 */
export const AnimatedBackground = () => {
  // For a clean, minimal design, we use CSS-only subtle effects
  // No canvas animations to keep performance optimal
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.08), transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 50%, hsl(var(--primary) / 0.04), transparent 50%)
          `,
        }}
      />
    </div>
  );
};
