import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const pricingOptions = [
  {
    title: "Monthly Retainer",
    price: "$4,995",
    period: "/month",
    description: "Ongoing support and development",
    features: [
      "Dedicated development team",
      "Priority support",
      "Unlimited revisions",
      "Monthly strategy sessions",
      "Performance monitoring",
      "Flexible hours allocation",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    title: "Project-Based",
    price: "Custom",
    period: "quote",
    description: "One-time projects with clear scope",
    features: [
      "Fixed-price contract",
      "Defined deliverables",
      "Timeline guarantee",
      "Post-launch support",
      "Source code ownership",
      "Documentation included",
    ],
    cta: "Request Quote",
    highlighted: false,
  },
  {
    title: "Hourly Billing",
    price: "$150",
    period: "/hour",
    description: "Flexible pay-as-you-go model",
    features: [
      "No long-term commitment",
      "Transparent time tracking",
      "Flexible scheduling",
      "Expert consultation",
      "Quick turnaround",
      "Detailed invoicing",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
];

export function Pricing() {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Flexible Pricing</h2>
          <p className="text-xl text-muted-foreground">
            Choose the pricing model that works best for your business needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`h-full ${option.highlighted ? 'border-primary shadow-lg' : ''}`}>
                <CardHeader>
                  {option.highlighted && (
                    <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                  )}
                  <CardTitle className="text-2xl">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{option.price}</span>
                    <span className="text-muted-foreground">{option.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full" variant={option.highlighted ? "default" : "outline"}>
                    <Link to="/pricing">{option.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Need a custom solution?</p>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">Schedule a Consultation</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
