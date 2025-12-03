import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationCategory, NavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  publicItems?: NavigationItem[];
  categories?: NavigationCategory[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function MobileMenu({
  publicItems = [],
  categories = [],
  isAuthenticated,
  isAdmin,
  onClose,
  onLogout,
}: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  return (
    <div className="md:hidden border-t animate-fade-in">
      <div className="py-4 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
        {!isAuthenticated ? (
          publicItems
            .filter((item) => item.showInMobile)
            .map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium",
                    "hover:text-primary hover:bg-muted rounded-md transition-colors min-h-[44px]"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {item.label}
                </Link>
              );
            })
        ) : (
          <>
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.label);
              return (
                <div key={category.label} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(category.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3",
                      "text-sm font-semibold text-muted-foreground",
                      "hover:bg-muted rounded-md transition-colors min-h-[44px]"
                    )}
                  >
                    {category.label}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="pl-4 space-y-1 animate-fade-in">
                      {category.items
                        .filter((item) => item.showInMobile)
                        .map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={onClose}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm",
                                "hover:text-primary hover:bg-muted rounded-md transition-colors min-h-[44px]"
                              )}
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              <span className="flex-1">{item.label}</span>
                              {item.badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        <div className="pt-4 mt-4 border-t px-3">
          {isAuthenticated ? (
            <Button
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              variant="outline"
              size="sm"
              className="w-full min-h-[44px]"
            >
              Logout
            </Button>
          ) : (
            <Button asChild size="sm" className="w-full min-h-[44px]">
              <Link to="/auth" onClick={onClose}>
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
