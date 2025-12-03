import { Link, useLocation } from "react-router-dom";
import { adminNavigationCategories } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn("w-64 border-r bg-muted/30 p-6 space-y-6", className)}
      role="navigation"
      aria-label="Admin navigation"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
        {adminNavigationCategories.map((category) => (
          <div key={category.label} className="space-y-1 mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {category.label}
            </h3>
            <nav className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-muted hover:text-primary",
                      isActive && "bg-primary/10 text-primary font-medium"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                    {item.badge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
