import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Code, Smartphone, Cloud, Briefcase, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Custom websites and web applications built with modern frameworks and best practices",
    link: "/services",
  },
  {
    icon: Smartphone,
    title: "Software Solutions",
    description: "Scalable software systems designed to streamline your business operations",
    link: "/services",
  },
  {
    icon: Cloud,
    title: "Cloud Integration",
    description: "Seamless cloud infrastructure setup and deployment for maximum reliability",
    link: "/services",
  },
  {
    icon: Briefcase,
    title: "Consulting",
    description: "Strategic technology guidance to help you make informed decisions",
    link: "/services",
  },
  {
    icon: TrendingUp,
    title: "Growth & Optimization",
    description: "Data-driven strategies to maximize your digital presence and ROI",
    link: "/services",
  },
  {
    icon: GraduationCap,
    title: "Training & Support",
    description: "Comprehensive training programs and ongoing technical support",
    link: "/services",
  },
];

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 md:py-32">
      <div className="container px-4 mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            What We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              Deliver
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            End-to-end digital solutions tailored to your unique business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <Button 
                    asChild
                    variant="ghost" 
                    className="text-primary hover:text-primary-hover hover:bg-primary/10 p-0 h-auto font-semibold group/btn"
                  >
                    <Link to={service.link}>
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Button 
            asChild
            size="lg"
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-bold px-10 py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-105"
          >
            <Link to="/services">View All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
