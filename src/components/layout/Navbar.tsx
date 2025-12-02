import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo className="h-8" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                {isAdmin && (
                  <NavLink to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                    Admin
                  </NavLink>
                )}
                <NavLink to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                  Dashboard
                </NavLink>
                <NavLink to="/dashboard/projects" className="text-sm font-medium hover:text-primary transition-colors">
                  Projects
                </NavLink>
                <NavLink to="/dashboard/shop" className="text-sm font-medium hover:text-primary transition-colors">
                  Shop
                </NavLink>
                <NavLink to="/dashboard/files" className="text-sm font-medium hover:text-primary transition-colors">
                  Files
                </NavLink>
                <NavLink to="/newsletter" className="text-sm font-medium hover:text-primary transition-colors">
                  Newsletter
                </NavLink>
                <NavLink to="/brand" className="text-sm font-medium hover:text-primary transition-colors">
                  Brand Kit
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/services" className="text-sm font-medium hover:text-primary transition-colors">
                  Services
                </NavLink>
                <NavLink to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                  Pricing
                </NavLink>
                <NavLink to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                  About
                </NavLink>
                <NavLink to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                  Contact
                </NavLink>
                <NavLink to="/news" className="text-sm font-medium hover:text-primary transition-colors">
                  News
                </NavLink>
              </>
            )}
          </div>

          {/* Auth Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            {user ? (
              <>
                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="block text-sm font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </NavLink>
                )}
                <NavLink
                  to="/dashboard"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/dashboard/projects"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/dashboard/shop"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shop
                </NavLink>
                <NavLink
                  to="/dashboard/files"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Files
                </NavLink>
                <NavLink
                  to="/newsletter"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Newsletter
                </NavLink>
                <NavLink
                  to="/brand"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Brand Kit
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/services"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </NavLink>
                <NavLink
                  to="/pricing"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </NavLink>
                <NavLink
                  to="/about"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </NavLink>
                <NavLink
                  to="/news"
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  News
                </NavLink>
              </>
            )}
            <div className="pt-4 border-t flex items-center justify-between gap-4">
              <ThemeToggle />
              {user ? (
                <Button onClick={handleLogout} variant="outline" size="sm" className="flex-1">
                  Logout
                </Button>
              ) : (
                <Button asChild size="sm" className="flex-1">
                  <Link to="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
