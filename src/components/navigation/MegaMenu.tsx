import { Link } from "react-router-dom";
import { NavigationCategory } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface MegaMenuProps {
  categories: NavigationCategory[];
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ categories, isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full mt-2 animate-fade-in"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-background/95 backdrop-blur-lg border rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div key={category.label}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  {category.label}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={onClose}
                          className={cn(
                            "group flex items-start gap-3 p-2 rounded-md transition-colors",
                            "hover:bg-muted focus:bg-muted focus:outline-none",
                          )}
                        >
                          {Icon && (
                            <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium group-hover:text-primary transition-colors">
                              {item.label}
                              {item.badge && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
