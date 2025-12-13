import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DigitalBackground } from "@/components/layout/DigitalBackground";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { useState } from "react";

export function EnhancedHero() {
  const [isHovering, setIsHovering] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const titleY = useTransform(scrollY, [0, 500], [0, 100]);
  const subtitleY = useTransform(scrollY, [0, 500], [0, 50]);
  const buttonsY = useTransform(scrollY, [0, 500], [0, 30]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom easing like designjoy.co
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.03,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const headlineText = "Transform Your";
  const highlightText = "Digital Vision";

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Animated digital background with parallax */}
      <DigitalBackground 
        particleCount={60}
        showGrid={true}
        showConnections={true}
      />
      
      {/* Gradient overlays for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, transparent 0%, hsl(var(--background)) 100%)",
        }}
        aria-hidden="true"
      />
      
      <motion.div 
        className="container relative z-10 px-4 sm:px-6 py-20 sm:py-28 md:py-32 mx-auto"
        style={{ opacity }}
      >
        <motion.div
          className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            <span>Premium Digital Solutions</span>
          </motion.div>

          {/* Main headline with letter animation */}
          <motion.h1 
            id="hero-heading" 
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]"
            style={{ y: titleY }}
          >
            <motion.span className="block" variants={itemVariants}>
              {headlineText.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-block"
                  style={{ whiteSpace: letter === " " ? "pre" : "normal" }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
            <motion.span 
              className="block mt-2"
              variants={itemVariants}
            >
              <span className="relative inline-block">
                <span 
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: "linear-gradient(135deg, hsl(48, 96%, 53%) 0%, hsl(40, 100%, 50%) 50%, hsl(25, 95%, 53%) 100%)",
                    backgroundSize: "200% 200%",
                    animation: "gradient-shift 5s ease infinite",
                  }}
                >
                  {highlightText}
                </span>
                {/* Animated underline */}
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, hsl(48, 96%, 53%), hsl(25, 95%, 53%))",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed px-4"
            variants={itemVariants}
            style={{ y: subtitleY }}
          >
            We craft stunning websites and powerful software that help ambitious businesses 
            <span className="text-foreground font-medium"> grow faster</span> and 
            <span className="text-foreground font-medium"> stand out</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 px-4"
            variants={itemVariants}
            style={{ y: buttonsY }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <Button
                asChild
                size="lg"
                className="relative w-full sm:w-auto overflow-hidden group bg-primary hover:bg-primary text-primary-foreground font-bold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg rounded-full min-h-[56px]"
              >
                <Link to="/contact" className="flex items-center gap-2">
                  {/* Shimmer effect */}
                  <span 
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    }}
                  />
                  <span className="relative z-10">Start Your Project</span>
                  <motion.span
                    className="relative z-10"
                    animate={{ x: isHovering ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-border/50 bg-background/30 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 font-semibold px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg rounded-full transition-all duration-300 min-h-[56px]"
              >
                <Link to="/services" className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Explore Services
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Available for new projects</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold">50+</span>
              <span>Projects delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold">100%</span>
              <span>Client satisfaction</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
