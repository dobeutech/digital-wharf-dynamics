import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo className="h-8" />
            <p className="text-sm text-muted-foreground">
              Building exceptional digital experiences that drive growth and innovation.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services#website" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Website Development
                </Link>
              </li>
              <li>
                <Link to="/services#software" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Software Solutions
                </Link>
              </li>
              <li>
                <Link to="/services#consulting" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link to="/services#learning" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Learning & Training
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/brand" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Brand Kit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} DBE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
