import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseOffset: number;
}

interface DigitalBackgroundProps {
  className?: string;
  particleCount?: number;
  showGrid?: boolean;
  showConnections?: boolean;
}

export function DigitalBackground({
  className = "",
  particleCount = 50,
  showGrid = true,
  showConnections = true,
}: DigitalBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      setDimensions({ width: rect.width, height: rect.height });
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    let time = 0;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw animated grid
      if (showGrid) {
        const gridSize = 40;
        const gridOpacity = 0.03 + Math.sin(time * 0.5) * 0.01;
        ctx.strokeStyle = `hsla(48, 96%, 53%, ${gridOpacity})`;
        ctx.lineWidth = 1;

        // Vertical lines with wave effect
        for (let x = 0; x <= rect.width; x += gridSize) {
          ctx.beginPath();
          const waveOffset = Math.sin(time + x * 0.01) * 5;
          ctx.moveTo(x + waveOffset, 0);
          ctx.lineTo(x + waveOffset, rect.height);
          ctx.stroke();
        }

        // Horizontal lines with wave effect
        for (let y = 0; y <= rect.height; y += gridSize) {
          ctx.beginPath();
          const waveOffset = Math.sin(time + y * 0.01) * 5;
          ctx.moveTo(0, y + waveOffset);
          ctx.lineTo(rect.width, y + waveOffset);
          ctx.stroke();
        }
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse interaction - subtle attraction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          particle.vx += dx * 0.00005;
          particle.vy += dy * 0.00005;
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Pulsing opacity
        const pulseOpacity = particle.opacity * (0.7 + Math.sin(time * 2 + particle.pulseOffset) * 0.3);

        // Draw particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `hsla(48, 96%, 53%, ${pulseOpacity})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.fillStyle = `hsla(48, 96%, 70%, ${pulseOpacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        if (showConnections) {
          particlesRef.current.slice(i + 1).forEach((other) => {
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              const lineOpacity = (1 - dist / 120) * 0.15;
              ctx.strokeStyle = `hsla(48, 96%, 53%, ${lineOpacity})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        }
      });

      // Floating code/digital elements
      const codeSymbols = ["0", "1", "<", ">", "/", "{", "}", "="];
      ctx.font = "12px monospace";
      for (let i = 0; i < 15; i++) {
        const x = (Math.sin(time * 0.3 + i * 0.7) * 0.5 + 0.5) * rect.width;
        const y = ((time * 20 + i * 100) % (rect.height + 100)) - 50;
        const symbol = codeSymbols[i % codeSymbols.length];
        const symbolOpacity = 0.08 + Math.sin(time + i) * 0.03;
        ctx.fillStyle = `hsla(48, 96%, 53%, ${symbolOpacity})`;
        ctx.fillText(symbol, x, y);
      }

      time += 0.02;
      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", resize);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, showGrid, showConnections, dimensions.width, dimensions.height]);

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ y, opacity }}
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      
      {/* Radial glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsla(48,96%,53%,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,hsla(25,95%,50%,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsla(48,96%,53%,0.05),transparent_40%)]" />
      
      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
}
