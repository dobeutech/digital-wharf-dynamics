import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Code,
  Smartphone,
  Cloud,
  Briefcase,
  TrendingUp,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Custom websites and web applications built with modern frameworks and best practices.",
    link: "/services",
  },
  {
    icon: Smartphone,
    title: "Software Solutions",
    description:
      "Scalable software systems designed to streamline your business operations.",
    link: "/services",
  },
  {
    icon: Cloud,
    title: "Cloud Integration",
    description:
      "Seamless cloud infrastructure setup and deployment for maximum reliability.",
    link: "/services",
  },
  {
    icon: Briefcase,
    title: "Consulting",
    description:
      "Strategic technology guidance to help you make informed decisions.",
    link: "/services",
  },
  {
    icon: TrendingUp,
    title: "Growth & Optimization",
    description:
      "Data-driven strategies to maximize your digital presence and ROI.",
    link: "/services",
  },
  {
    icon: GraduationCap,
    title: "Training & Support",
    description:
      "Comprehensive training programs and ongoing technical support.",
    link: "/services",
  },
];

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28">
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
            Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What we can do for you
          </h2>
          <p className="text-muted-foreground">
            End-to-end digital solutions tailored to your unique business needs.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={service.link} className="block h-full group">
                <div
                  className={cn(
                    "h-full p-6 rounded-xl",
                    "border border-border bg-card",
                    "transition-all duration-200",
                    "hover:border-primary/30 hover:shadow-clean",
                  )}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline" size="lg" className="rounded-lg">
            <Link to="/services" className="flex items-center gap-2">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
