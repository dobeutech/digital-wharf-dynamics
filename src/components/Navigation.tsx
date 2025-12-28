import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border ${isOpen ? "bg-background" : "bg-background/80 backdrop-blur-lg"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/icon.svg" alt="DOBEU Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              DOBEU
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-material"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-foreground hover:text-primary transition-material"
            >
              Services
            </Link>
            <Link
              to="/pricing"
              className="text-foreground hover:text-primary transition-material"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-primary transition-material"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-material"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/"
              className="block py-2 text-foreground hover:text-primary transition-material"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block py-2 text-foreground hover:text-primary transition-material"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/pricing"
              className="block py-2 text-foreground hover:text-primary transition-material"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="block py-2 text-foreground hover:text-primary transition-material"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
