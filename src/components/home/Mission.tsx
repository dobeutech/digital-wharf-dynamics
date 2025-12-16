import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Target, Zap, Shield, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Pixel-perfect execution with meticulous attention to every detail.",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Lightning-fast solutions optimized for speed and efficiency.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade protection built into every layer.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Cutting-edge technology that keeps you ahead of the curve.",
  },
];

export function Mission() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 border-y border-border bg-muted/30">
      <div className="container px-4 mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
            Our Values
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built on excellence
          </h2>
          <p className="text-muted-foreground">
            We craft digital experiences that combine stunning design with
            powerful functionality.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl mx-auto mb-4",
                  "bg-background border border-border",
                  "flex items-center justify-center",
                )}
              >
                <value.icon className="w-5 h-5 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
