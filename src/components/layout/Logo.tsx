import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "white" | "dark";
  className?: string;
}

export function Logo({ variant = "default", className }: LogoProps) {
  const fillColor = variant === "white" ? "#FFFFFF" : variant === "dark" ? "#000000" : "currentColor";
  
  return (
    <svg
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto", className)}
      aria-label="DBE Logo"
    >
      <text
        x="10"
        y="40"
        fill={fillColor}
        fontSize="32"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        DBE
      </text>
      <circle cx="180" cy="30" r="8" fill={fillColor} opacity="0.6" />
    </svg>
  );
}
