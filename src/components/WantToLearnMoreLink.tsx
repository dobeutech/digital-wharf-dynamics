import { useState } from "react";
import { TypeformLightboxNew } from "./TypeformLightboxNew";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface WantToLearnMoreLinkProps {
  source?: string;
  className?: string;
  variant?: "header" | "footer";
}

export function WantToLearnMoreLink({
  source = "learn-more",
  className,
  variant = "header",
}: WantToLearnMoreLinkProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseStyles = variant === "header"
    ? "text-base font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105"
    : "text-lg font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105";

  const gradientStyles = "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white shadow-lg hover:shadow-xl";

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(baseStyles, gradientStyles, className)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Want to learn more? Open contact form"
      >
        Want to learn more?
      </motion.button>
      <TypeformLightboxNew
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        source={source}
      />
    </>
  );
}

