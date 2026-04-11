import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ExternalLink } from "lucide-react";

const ecosystemLinks = [
  { label: "dobeu.dev", href: "https://dobeu.dev" },
  { label: "dobeu.net", href: "https://dobeu.net" },
  { label: "dobeu.online", href: "https://dobeu.online" },
  { label: "dobeu.tech", href: "https://dobeu.tech" },
  { label: "dobeu.cloud", href: "https://dobeu.cloud" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-surface text-white" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8">
          <div className="col-span-2 sm:col-span-3 md:col-span-1 space-y-4">
            <Logo className="h-8" />
            <p className="text-sm text-white/60">
              Templates and tools for builders. Curated digital products,
              starter kits, and developer tools.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white/90">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services#website"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/services#software"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Starter Kits
                </Link>
              </li>
              <li>
                <Link
                  to="/services#consulting"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Developer Tools
                </Link>
              </li>
              <li>
                <Link
                  to="/services#learning"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white/90">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/brand"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Brand Kit
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white/90">Ecosystem</h3>
            <ul className="space-y-2">
              {ecosystemLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-accent transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white/90">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://contra.com/jeremy_williams_fx413nca?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=jeremy_williams_fx413nca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  Hire on Contra
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.behance.net/jeremywilliams62"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-accent transition-colors inline-flex items-center gap-1"
                >
                  View on Behance
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white/90">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/ccpa-optout"
                  className="text-sm text-white/60 hover:text-accent transition-colors"
                >
                  Do Not Sell My Data
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/40">
            &copy; {currentYear} Dobeu Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
