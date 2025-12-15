import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let scrollY = 0;
    let rotation = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const colors = [
      { r: 250, g: 204, b: 21 }, // Electric Lemon #FACC15
      { r: 234, g: 179, b: 8 }, // Darker yellow
      { r: 251, g: 146, b: 60 }, // Orange
      { r: 249, g: 115, b: 22 }, // Deep orange
      { r: 234, g: 88, b: 12 }, // Burnt orange
    ];

    class Blob {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      color: { r: number; g: number; b: number };

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 300 + 200;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
      }

      draw(
        ctx: CanvasRenderingContext2D,
        scrollOffset: number,
        rotationAngle: number,
      ) {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y + scrollOffset * 0.5,
          0,
          this.x,
          this.y + scrollOffset * 0.5,
          this.radius,
        );

        const alpha = 0.15 + Math.sin(rotationAngle) * 0.05;
        gradient.addColorStop(
          0,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`,
        );
        gradient.addColorStop(
          0.5,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.5})`,
        );
        gradient.addColorStop(
          1,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`,
        );

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(
          this.x,
          this.y + scrollOffset * 0.5,
          this.radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }

    const blobs: Blob[] = [];
    for (let i = 0; i < 5; i++) {
      blobs.push(new Blob());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      rotation += 0.001;
      const scrollOffset = scrollY * 0.3;

      blobs.forEach((blob) => {
        blob.update();
        blob.draw(ctx, scrollOffset, rotation);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};
