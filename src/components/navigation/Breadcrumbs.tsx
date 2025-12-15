import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbs } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb.href || crumb.label} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground mx-1"
                  aria-hidden="true"
                />
              )}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className={cn(
                    "hover:text-primary transition-colors inline-flex items-center gap-1",
                    isFirst && "text-muted-foreground",
                  )}
                >
                  {isFirst && <Home className="h-4 w-4" aria-hidden="true" />}
                  <span className={cn(isFirst && "sr-only md:not-sr-only")}>
                    {crumb.label}
                  </span>
                </Link>
              ) : (
                <span
                  className="text-foreground font-medium"
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
