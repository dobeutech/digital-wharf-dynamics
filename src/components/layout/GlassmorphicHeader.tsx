import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CursorToggle } from "@/components/CursorToggle";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";
import { LanguageSelector } from "@/components/LanguageSelector";
import { MegaMenu } from "@/components/navigation/MegaMenu";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { NavigationSearch } from "@/components/navigation/NavigationSearch";
import { useNavigation } from "@/contexts/NavigationContext";
import {
  publicNavigation,
  authenticatedNavigationCategories,
  adminNavigationCategories,
} from "@/config/navigation";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/mixpanel";
import { WantToLearnMoreLink } from "@/components/WantToLearnMoreLink";

export function GlassmorphicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (showMegaMenu) setShowMegaMenu(false);
        if (showAdminMenu) setShowAdminMenu(false);
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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-200",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-subtle"
          : "bg-transparent",
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
            aria-label="DOBEU Home"
            onClick={() => handleNavClick("Logo", "/")}
          >
            <Logo className="h-7" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {!user ? (
              <>
                {publicNavigation.slice(0, 5).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => handleNavClick(item.label, item.href)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg",
                      "text-muted-foreground hover:text-foreground",
                      "hover:bg-muted transition-colors duration-150",
                    )}
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
                      "px-4 py-2 text-sm font-medium rounded-lg",
                      "flex items-center gap-1 transition-colors duration-150",
                      showMegaMenu
                        ? "text-foreground bg-muted"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                    aria-expanded={showMegaMenu}
                    aria-haspopup="true"
                  >
                    Dashboard
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-150",
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
                        "px-4 py-2 text-sm font-medium rounded-lg",
                        "flex items-center gap-1 transition-colors duration-150",
                        showAdminMenu
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      )}
                      aria-expanded={showAdminMenu}
                      aria-haspopup="true"
                    >
                      Admin
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-150",
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
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-1">
            <NavigationSearch />
            <LanguageSelector />
            <AccessibilitySettings />
            <CursorToggle />
            <ThemeToggle />

            {/* Divider */}
            <div className="w-px h-6 bg-border mx-2" />

            {!user && <WantToLearnMoreLink source="header" variant="header" />}
            {user ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Logout
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageSelector />
            <AccessibilitySettings />
            <CursorToggle />
            <ThemeToggle />
            <button
              className={cn(
                "p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors duration-150",
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            role="menu"
            className="md:hidden py-4 border-t border-border animate-fade-in"
          >
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
    </header>
  );
}
