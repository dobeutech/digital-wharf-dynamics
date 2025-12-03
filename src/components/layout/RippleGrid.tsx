import { useEffect, useRef } from "react";

interface RippleGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
}

export function RippleGrid({ 
  className = "", 
  dotColor = "hsl(var(--muted-foreground))",
  dotSize = 4,
  gap = 24
}: RippleGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cols = Math.ceil(rect.width / gap) + 1;
      const rows = Math.ceil(rect.height / gap) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;

          // Wave calculation - creates ripple from center
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const distFromCenter = Math.sqrt(
            Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
          );

          // Multiple wave sources for complex pattern
          const wave1 = Math.sin(distFromCenter * 0.02 - time * 0.8) * 0.5 + 0.5;
          const wave2 = Math.sin(x * 0.03 + time * 0.5) * 0.3;
          const wave3 = Math.sin(y * 0.025 - time * 0.6) * 0.3;

          const combinedWave = wave1 + wave2 + wave3;
          const opacity = Math.max(0.08, Math.min(0.5, combinedWave * 0.3 + 0.1));
          const scale = 0.6 + combinedWave * 0.4;

          ctx.beginPath();
          ctx.arc(x, y, (dotSize / 2) * scale, 0, Math.PI * 2);
          ctx.fillStyle = dotColor.replace(")", ` / ${opacity})`).replace("hsl(", "hsla(");
          ctx.fill();
        }
      }

      time += 0.03;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dotColor, dotSize, gap]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity: 0.6 }}
    />
  );
}
