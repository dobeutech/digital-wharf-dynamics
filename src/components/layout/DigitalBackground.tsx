/**
 * DigitalBackground - Clean, minimal background for hero sections
 *
 * Design inspired by: huggingface.co, jitter.video, designjoy.co
 * Uses subtle CSS gradients instead of heavy canvas animations
 */

interface DigitalBackgroundProps {
  className?: string;
  particleCount?: number; // Kept for backwards compatibility, but not used
  showGrid?: boolean;
  showConnections?: boolean; // Kept for backwards compatibility, but not used
}

export function DigitalBackground({
  className = "",
  showGrid = false,
}: DigitalBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--primary) / 0.06), transparent 50%)
          `,
        }}
      />

      {/* Optional subtle grid pattern */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      )}
    </div>
  );
}
