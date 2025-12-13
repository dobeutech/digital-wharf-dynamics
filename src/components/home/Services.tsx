import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Code, Smartphone, Cloud, Briefcase, TrendingUp, GraduationCap, ArrowRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Custom websites and web applications built with modern frameworks and best practices",
    link: "/services",
    color: "from-blue-500 to-cyan-400",
    number: "01",
  },
  {
    icon: Smartphone,
    title: "Software Solutions",
    description: "Scalable software systems designed to streamline your business operations",
    link: "/services",
    color: "from-purple-500 to-pink-400",
    number: "02",
  },
  {
    icon: Cloud,
    title: "Cloud Integration",
    description: "Seamless cloud infrastructure setup and deployment for maximum reliability",
    link: "/services",
    color: "from-primary to-yellow-400",
    number: "03",
  },
  {
    icon: Briefcase,
    title: "Consulting",
    description: "Strategic technology guidance to help you make informed decisions",
    link: "/services",
    color: "from-green-500 to-emerald-400",
    number: "04",
  },
  {
    icon: TrendingUp,
    title: "Growth & Optimization",
    description: "Data-driven strategies to maximize your digital presence and ROI",
    link: "/services",
    color: "from-orange-500 to-red-400",
    number: "05",
  },
  {
    icon: GraduationCap,
    title: "Training & Support",
    description: "Comprehensive training programs and ongoing technical support",
    link: "/services",
    color: "from-indigo-500 to-violet-400",
    number: "06",
  },
];

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
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(48,96%,53%,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsla(25,95%,53%,0.05),transparent_50%)]" />
      
      <div className="container px-4 mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            Our Services
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            What We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-400 to-orange-500 animate-gradient-x">
              Deliver
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            End-to-end digital solutions tailored to your unique business needs
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -12, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              className="relative"
            >
              <Link to={service.link} className="block h-full">
                <Card className="h-full bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 group overflow-hidden">
                  {/* Number indicator */}
                  <span className="absolute top-4 right-4 text-6xl font-bold text-muted/10 group-hover:text-primary/10 transition-colors duration-500">
                    {service.number}
                  </span>
                  
                  {/* Gradient overlay on hover */}
                  <div 
                    className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${service.color}`}
                  />
                  
                  <CardHeader className="relative">
                    <motion.div 
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} mb-4 shadow-lg`}
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                        rotate: hoveredIndex === index ? 5 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <service.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {service.title}
                      <motion.span
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ x: hoveredIndex === index ? 0 : -10 }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                      </motion.span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                  
                  {/* Bottom gradient line on hover */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  />
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-7 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Link to="/services" className="flex items-center gap-2">
                View All Services
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
