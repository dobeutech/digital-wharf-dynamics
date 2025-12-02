import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Target, Zap, Shield, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "Pixel-perfect execution with meticulous attention to every detail",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Lightning-fast solutions optimized for speed and efficiency",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade protection built into every layer",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Cutting-edge technology that keeps you ahead of the curve",
  },
];

export function Mission() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Driven by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-400">
              Excellence
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            We craft digital experiences that combine stunning design with powerful functionality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
