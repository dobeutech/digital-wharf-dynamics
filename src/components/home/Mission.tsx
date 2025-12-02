import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Target, Lightbulb, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "Every project we undertake is guided by clear goals and measurable outcomes.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We leverage cutting-edge technology to create solutions that stand out.",
  },
  {
    icon: Users,
    title: "Client-Centric",
    description: "Your success is our success. We build long-lasting partnerships.",
  },
  {
    icon: Zap,
    title: "Agile & Fast",
    description: "Quick iterations, rapid deployment, and continuous improvement.",
  },
];

export function Mission() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-muted-foreground">
            Empowering businesses through innovative digital solutions that drive real results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <value.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
