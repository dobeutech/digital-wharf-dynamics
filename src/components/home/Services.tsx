import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Code, Palette, Brain, TrendingUp, ShoppingCart, Server } from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Website Development",
    description: "Custom websites built with modern frameworks, optimized for performance and SEO.",
    link: "/services#website",
  },
  {
    icon: Server,
    title: "Software Solutions",
    description: "Enterprise-grade applications tailored to your business needs.",
    link: "/services#software",
  },
  {
    icon: Brain,
    title: "Learning & Training",
    description: "Upskill your team with our expert-led training programs.",
    link: "/services#learning",
  },
  {
    icon: TrendingUp,
    title: "Consulting",
    description: "Strategic guidance to help you navigate digital transformation.",
    link: "/services#consulting",
  },
  {
    icon: Palette,
    title: "Strategic Planning",
    description: "Data-driven strategies to optimize your digital presence.",
    link: "/services#planning",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    description: "Complete e-commerce solutions from design to deployment.",
    link: "/services#ecommerce",
  },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive digital solutions to help your business thrive in the modern world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0">
                    <Link to={service.link}>Learn More →</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Button asChild size="lg">
            <Link to="/services">View All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
