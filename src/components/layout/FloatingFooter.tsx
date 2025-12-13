import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function FloatingFooter() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <>
      {/* Top gradient fade for floating effect */}
      <div 
        className="relative h-32 pointer-events-none -mb-32"
        style={{
          background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      
      <footer 
        ref={footerRef}
        className="relative bg-card/50 backdrop-blur-sm border-t border-border/50"
        role="contentinfo"
      >
        {/* Gradient border at top */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent, hsla(48, 96%, 53%, 0.3), transparent)",
          }}
        />

        {/* CTA Section */}
        <motion.div 
          className="container mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="max-w-4xl mx-auto text-center space-y-6 pb-16 border-b border-border/50">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                get started
              </span>
              ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Let's build something incredible together. Start a conversation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg rounded-full shadow-lg shadow-primary/20"
                >
                  <Link to="/contact" className="flex items-center gap-2">
                    Start a Project
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 hover:bg-primary/10 hover:border-primary/50 font-semibold px-8 py-6 text-lg rounded-full"
                >
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Links Section */}
        <motion.div 
          className="container mx-auto px-4 pb-12"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
            <motion.div 
              className="col-span-2 sm:col-span-3 md:col-span-1 space-y-4"
              variants={itemVariants}
            >
              <Logo className="h-8" />
              <p className="text-sm text-muted-foreground">
                Building exceptional digital experiences that drive growth and innovation.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-3">
                {[
                  { label: "Website Development", href: "/services#website" },
                  { label: "Software Solutions", href: "/services#software" },
                  { label: "Consulting", href: "/services#consulting" },
                  { label: "Learning & Training", href: "/services#learning" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Contact", href: "/contact" },
                  { label: "Brand Kit", href: "/brand" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://contra.com/jeremy_williams_fx413nca?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=jeremy_williams_fx413nca" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    Hire on Contra
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.behance.net/jeremywilliams62" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    View on Behance
                    <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "SMS Policy", href: "/privacy/sms" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Do Not Sell My Data", href: "/ccpa-optout" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div 
          className="border-t border-border/50"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Dobeu Tech Solutions. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      </footer>
    </>
  );
}
