import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Target, Zap, Shield, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "Pixel-perfect execution with meticulous attention to every detail",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Lightning-fast solutions optimized for speed and efficiency",
    gradient: "from-primary to-yellow-400",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade protection built into every layer",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "Cutting-edge technology that keeps you ahead of the curve",
    gradient: "from-orange-500 to-red-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Mission() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsla(48,96%,53%,0.03),transparent_70%)]" />

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={
              inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
            }
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            Our Values
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Driven by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-orange-500 animate-gradient-x">
              Excellence
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            We craft digital experiences that combine stunning design with
            powerful functionality
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 group card-glow overflow-hidden">
                <CardContent className="p-8 text-center space-y-4 relative">
                  {/* Gradient glow on hover */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${value.gradient}`}
                  />

                  <motion.div
                    className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <value.icon className="w-8 h-8 text-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-bold relative">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed relative">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
