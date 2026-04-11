import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg viewBox="0 0 100 100" className="h-10 w-10" aria-label="Dobeu logo">
        <circle cx="42" cy="50" r="35" fill="#6B5CE7" />
        <circle cx="58" cy="50" r="35" fill="#4A3FA8" />
        <ellipse cx="50" cy="50" rx="19" ry="19" fill="#F4A261" />
      </svg>
      <span className="text-xl font-semibold text-foreground lowercase tracking-normal">
        dobeu<span className="text-primary">.store</span>
      </span>
    </div>
  );
}
