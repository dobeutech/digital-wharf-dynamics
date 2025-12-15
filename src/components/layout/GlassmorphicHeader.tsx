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
import { motion, useScroll, useTransform } from "motion/react";
import { WantToLearnMoreLink } from "@/components/WantToLearnMoreLink";

export function GlassmorphicHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.5, 0.85]);
  const headerBlur = useTransform(scrollY, [0, 100], [8, 20]);

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
    <>
      {/* Top gradient fade for floating effect */}
      <div
        className="fixed top-0 left-0 right-0 h-32 pointer-events-none z-40"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "border-b transition-all duration-500",
          isScrolled
            ? "border-border/20 shadow-lg shadow-black/5"
            : "border-transparent",
        )}
        style={{
          backgroundColor: `hsla(var(--background) / ${headerOpacity.get()})`,
          backdropFilter: `blur(${headerBlur.get()}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${headerBlur.get()}px) saturate(180%)`,
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Animated gradient border at bottom - uses all brand colors */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500",
            isScrolled ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "linear-gradient(90deg, transparent, #FACC15, #EC4899, #A855F7, #3B82F6, transparent)",
            backgroundSize: "200% 100%",
            animation: "gradient-x 5s ease infinite",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                to="/"
                className="flex items-center group"
                aria-label="DOBEU Home"
                onClick={() => handleNavClick("Logo", "/")}
              >
                <Logo className="h-8 transition-transform duration-300 group-hover:scale-105" />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              className="hidden md:flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {!user ? (
                <>
                  {publicNavigation.slice(0, 5).map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => handleNavClick(item.label, item.href)}
                        className={cn(
                          "relative text-sm font-medium px-4 py-2 rounded-full",
                          "transition-all duration-300",
                          "hover:text-yellow-400 hover:bg-gradient-to-r hover:from-yellow-400/10 hover:via-pink-500/10 hover:to-purple-500/10",
                          "after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5",
                          "after:bg-gradient-to-r after:from-yellow-400 after:via-pink-500 after:to-purple-500",
                          "after:transition-all after:duration-300 after:-translate-x-1/2",
                          "hover:after:w-1/2",
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </>
              ) : (
                <>
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowMegaMenu(true)}
                      onClick={() => setShowMegaMenu(!showMegaMenu)}
                      className={cn(
                        "text-sm font-medium px-4 py-2 rounded-full",
                        "transition-all duration-300 flex items-center gap-1",
                        "hover:text-primary hover:bg-primary/10",
                        showMegaMenu && "text-primary bg-primary/10",
                      )}
                      aria-expanded={showMegaMenu}
                      aria-haspopup="true"
                    >
                      Dashboard
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
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
                          "text-sm font-medium px-4 py-2 rounded-full",
                          "transition-all duration-300 flex items-center gap-1",
                          "hover:text-primary hover:bg-primary/10",
                          showAdminMenu && "text-primary bg-primary/10",
                        )}
                        aria-expanded={showAdminMenu}
                        aria-haspopup="true"
                      >
                        Admin
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-300",
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
            </motion.div>

            {/* Right side actions */}
            <motion.div
              className="hidden md:flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <NavigationSearch />
              <LanguageSelector />
              <AccessibilitySettings />
              <CursorToggle />
              <ThemeToggle />
              {!user && (
                <WantToLearnMoreLink source="header" variant="header" />
              )}
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="min-h-[44px] rounded-full hover:bg-primary/10"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "relative min-h-[44px] rounded-full px-6 overflow-hidden",
                    "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500",
                    "text-white font-semibold",
                    "shadow-lg hover:shadow-xl",
                    "transition-all duration-300 hover:scale-105",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:via-pink-500 before:to-yellow-400",
                    "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
                  )}
                >
                  <Link to="/auth" className="relative z-10">
                    Sign In
                  </Link>
                </Button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSelector />
              <AccessibilitySettings />
              <CursorToggle />
              <ThemeToggle />
              <motion.button
                className={cn(
                  "p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full",
                  "hover:bg-primary/10 transition-colors",
                )}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              role="menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
            </motion.div>
          )}
        </div>
      </motion.nav>
    </>
  );
}
