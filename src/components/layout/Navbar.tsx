import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMobileMenuOpen
          ? "bg-background"
          : isScrolled
            ? "bg-background/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center" aria-label="DOBEU Home">
            <Logo className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <NavLink
              to="/services"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Services
            </NavLink>
            <NavLink
              to="/pricing"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Contact
            </NavLink>
            <NavLink
              to="/news"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              News
            </NavLink>
          </div>

          {/* Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
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
          <div
            id="mobile-menu"
            className="md:hidden py-4 space-y-1 border-t animate-fade-in"
            role="menu"
          >
            <NavLink
              to="/services"
              className="block px-3 py-3 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              Services
            </NavLink>
            <NavLink
              to="/pricing"
              className="block px-3 py-3 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              className="block px-3 py-3 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="block px-3 py-3 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              Contact
            </NavLink>
            <NavLink
              to="/news"
              className="block px-3 py-3 text-sm font-medium hover:text-primary hover:bg-muted rounded-md transition-colors min-h-[44px]"
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              News
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
