import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { NavigationSearch } from "./NavigationSearch";
import { useNavigation } from "@/contexts/NavigationContext";
import {
  publicNavigation,
  authenticatedNavigationCategories,
  adminNavigationCategories,
} from "@/config/navigation";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/mixpanel";

export function EnhancedNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
        if (showMegaMenu) {
          setShowMegaMenu(false);
        }
        if (showAdminMenu) {
          setShowAdminMenu(false);
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, showMegaMenu, showAdminMenu, setIsMobileMenuOpen]);

  const handleLogout = async () => {
    trackEvent("Navigation", { action: "logout" });
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavClick = (label: string, href: string) => {
    trackEvent("Navigation Click", { label, href });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isMobileMenuOpen
          ? "bg-background"
          : isScrolled
            ? "bg-background/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent",
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center"
            aria-label="DOBEU Home"
            onClick={() => handleNavClick("Logo", "/")}
          >
            <Logo className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                {publicNavigation.slice(0, 5).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleNavClick(item.label, item.href)}
                    className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowMegaMenu(true)}
                    onClick={() => setShowMegaMenu(!showMegaMenu)}
                    className={cn(
                      "text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md",
                      "flex items-center gap-1",
                      showMegaMenu && "text-primary",
                    )}
                    aria-expanded={showMegaMenu}
                    aria-haspopup="true"
                  >
                    Dashboard
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        showMegaMenu && "rotate-180",
                      )}
                    />
                  </button>
                  <MegaMenu
                    categories={authenticatedNavigationCategories}
                    isOpen={showMegaMenu}
                    onClose={() => setShowMegaMenu(false)}
                  />
                </div>

                {isAdmin && (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowAdminMenu(true)}
                      onClick={() => setShowAdminMenu(!showAdminMenu)}
                      className={cn(
                        "text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md",
                        "flex items-center gap-1",
                        showAdminMenu && "text-primary",
                      )}
                      aria-expanded={showAdminMenu}
                      aria-haspopup="true"
                    >
                      Admin
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          showAdminMenu && "rotate-180",
                        )}
                      />
                    </button>
                    <MegaMenu
                      categories={adminNavigationCategories}
                      isOpen={showAdminMenu}
                      onClose={() => setShowAdminMenu(false)}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Search, Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <NavigationSearch />
            <AccessibilitySettings />
            <ThemeToggle />
            {user && (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="min-h-[44px] min-w-[44px]"
              >
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <AccessibilitySettings />
            <ThemeToggle />
            <button
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" role="menu">
            <MobileMenu
              publicItems={publicNavigation}
              categories={
                user
                  ? isAdmin
                    ? [
                        ...authenticatedNavigationCategories,
                        ...adminNavigationCategories,
                      ]
                    : authenticatedNavigationCategories
                  : []
              }
              isAuthenticated={!!user}
              isAdmin={isAdmin}
              onClose={() => setIsMobileMenuOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
