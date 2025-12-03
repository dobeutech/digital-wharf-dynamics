import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const pricingOptions = [
  {
    title: "Project-Based",
    price: "Custom",
    description: "Perfect for defined scopes and one-time builds",
    features: [
      "Fixed scope & timeline",
      "Detailed project roadmap",
      "Milestone-based delivery",
      "Post-launch support",
      "Source code ownership",
    ],
    cta: "Get a Quote",
    popular: false,
  },
  {
    title: "Monthly Retainer",
    price: "From $3,500",
    period: "/month",
    description: "Ongoing support and continuous development",
    features: [
      "Dedicated development hours",
      "Priority support & updates",
      "Regular sprint cycles",
      "Flexible scope adjustments",
      "Strategic consulting included",
    ],
    cta: "Start Subscription",
    popular: true,
  },
  {
    title: "Hourly Consulting",
    price: "$250",
    period: "/hour",
    description: "Flexible support for specific needs",
    features: [
      "Pay only for what you need",
      "Expert technical guidance",
      "Code review & optimization",
      "Architecture consulting",
      "No long-term commitment",
    ],
    cta: "Book Consultation",
    popular: false,
  },
];

export function Pricing() {
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
            Transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
              Pricing
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            Choose the engagement model that fits your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={option.popular ? "md:scale-105" : ""}
            >
              <Card className={`h-full relative ${
                option.popular 
                  ? "border-primary shadow-xl shadow-primary/20 bg-gradient-to-b from-card to-card/50" 
                  : "bg-card/50 backdrop-blur-sm border-border hover:border-primary/30"
              } transition-all duration-300`}>
                {option.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{option.title}</CardTitle>
                  <CardDescription className="text-base">{option.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">{option.price}</span>
                    {option.period && (
                      <span className="text-muted-foreground ml-2">{option.period}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    asChild
                    className={`w-full py-6 text-base font-semibold ${
                      option.popular
                        ? "bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl"
                        : "bg-secondary hover:bg-secondary-hover"
                    } transition-all hover:scale-105`}
                  >
                    <Link to="/pricing">{option.cta}</Link>
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
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-card to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Need a Custom Solution?</h3>
              <p className="text-muted-foreground mb-6">
                We'll craft a tailored engagement that perfectly fits your unique requirements
              </p>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary text-foreground hover:bg-primary/10 font-semibold px-8"
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
