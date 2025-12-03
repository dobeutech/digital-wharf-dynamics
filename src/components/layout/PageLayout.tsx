import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function PageLayout({
  children,
  className,
  showBreadcrumbs = true,
  maxWidth = "7xl",
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <div className={cn("min-h-screen pt-24 pb-20 px-4", className)}>
      <div className={cn("container mx-auto", maxWidthClasses[maxWidth] || "max-w-7xl")}>
        {showBreadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
