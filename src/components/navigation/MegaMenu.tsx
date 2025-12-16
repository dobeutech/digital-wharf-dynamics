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
      className="absolute left-0 right-0 top-full mt-1"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-background border border-border rounded-xl shadow-clean p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div key={category.label}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  {category.label}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={onClose}
                          className={cn(
                            "group flex items-start gap-3 p-2 rounded-lg transition-colors",
                            "hover:bg-muted",
                          )}
                        >
                          {Icon && (
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                              {item.label}
                              {item.badge && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
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
