import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function Pricing() {
  const pricingPlans = [
    {
      name: "Project-Based",
      description: "Perfect for one-time projects",
      price: "Custom",
      features: [
        "Fixed scope and timeline",
        "Dedicated project manager",
        "Post-launch support included",
        "Source code ownership",
        "3 rounds of revisions"
      ],
      cta: "Get a Quote",
      popular: false
    },
    {
      name: "Hourly Consulting",
      description: "Flexible support when you need it",
      price: "$250",
      period: "/hour",
      features: [
        "Pay only for time used",
        "No long-term commitment",
        "Expert technical guidance",
        "Flexible scheduling",
        "Detailed time tracking"
      ],
      cta: "Schedule Session",
      popular: false
    },
    {
      name: "Monthly Retainer",
      description: "Ongoing support and development",
      price: "$2,500",
      period: "/month",
      features: [
        "20 hours per month included",
        "Priority support",
        "Proactive maintenance",
        "Monthly strategy calls",
        "Rollover unused hours"
      ],
      cta: "Start Membership",
      popular: true
    }
  ];

  const addOns = [
    "SEO Optimization Package",
    "Google Business & AdWords Setup",
    "Marketplace Integrations",
    "Advanced Analytics Setup",
    "Security Audit & Hardening",
    "Performance Optimization"
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 gradient-primary bg-clip-text text-transparent">
            Pricing Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that best fits your needs. All plans include quality assurance and deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={index} 
              className={`shadow-material hover:shadow-material-lg transition-material relative ${
                plan.popular ? 'border-2 border-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full shadow-material">
                  <Link to="/contact">{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-material-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Available Add-Ons</CardTitle>
              <CardDescription>
                Enhance your package with these additional services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addOns.map((addOn, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-secondary mr-2" />
                    <span>{addOn}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground mb-4">
                  Need something specific? We offer custom packages tailored to your requirements.
                </p>
                <Button asChild variant="outline" className="shadow-material">
                  <Link to="/contact">Request Custom Quote</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
