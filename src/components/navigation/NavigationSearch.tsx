import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  publicNavigation,
  authenticatedNavigationCategories,
  adminNavigationCategories,
  NavigationItem,
  NavigationCategory,
} from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";

export function NavigationSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const isMac =
    typeof navigator !== "undefined" &&
    (navigator.userAgent.indexOf("Mac") !== -1 ||
      navigator.userAgent.indexOf("iPhone") !== -1 ||
      navigator.userAgent.indexOf("iPad") !== -1);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const flattenCategories = (
    categories: NavigationCategory[],
  ): NavigationItem[] => {
    return categories.flatMap((cat) => cat.items);
  };

  const getNavigationItems = (): NavigationItem[] => {
    if (!user) {
      return publicNavigation;
    }

    const items = flattenCategories(authenticatedNavigationCategories);

    if (isAdmin) {
      items.push(...flattenCategories(adminNavigationCategories));
    }

    return items;
  };

  const handleSelect = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  const items = getNavigationItems();

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search navigation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {!user ? (
            <CommandGroup heading="Pages">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    onSelect={() => handleSelect(item.href)}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    <span>{item.label}</span>
                    {item.description && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ) : (
            <>
              <CommandGroup heading="Dashboard">
                {flattenCategories(authenticatedNavigationCategories).map(
                  (item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.href}
                        onSelect={() => handleSelect(item.href)}
                      >
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        <span>{item.label}</span>
                      </CommandItem>
                    );
                  },
                )}
              </CommandGroup>
              {isAdmin && (
                <CommandGroup heading="Admin">
                  {flattenCategories(adminNavigationCategories).map((item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.href}
                        onSelect={() => handleSelect(item.href)}
                      >
                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                        <span>{item.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
