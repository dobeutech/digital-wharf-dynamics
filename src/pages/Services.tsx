import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Code2,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Check,
  ArrowRight,
} from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { cn } from "@/lib/utils";

export default function Services() {
  const { hash } = useLocation();

  // Scroll to anchor when hash changes
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [hash]);

  const services = [
    {
      id: "website",
      icon: Globe,
      title: "Website Design & Development",
      description:
        "We create fast, mobile-friendly websites that look great and convert visitors into customers.",
      features: [
        "Custom design tailored to your brand",
        "Responsive across all devices",
        "SEO optimization included",
        "CMS integration available",
      ],
    },
    {
      id: "software",
      icon: Code2,
      title: "Software Development",
      description:
        "Custom software that automates your workflows and helps you work more efficiently.",
      features: [
        "Web and mobile applications",
        "API development and integration",
        "Database design and optimization",
        "Cloud deployment and scaling",
      ],
    },
    {
      id: "learning",
      icon: BookOpen,
      title: "Learning & Training",
      description:
        "Hands-on training to help your team master new technologies and best practices.",
      features: [
        "Team training sessions",
        "Best practices workshops",
        "Technology assessments",
        "Documentation creation",
      ],
    },
    {
      id: "consulting",
      icon: MessageSquare,
      title: "Consulting",
      description:
        "Strategic advice to help you choose the right technology for your goals.",
      features: [
        "Technology stack selection",
        "Architecture review",
        "Security audits",
        "Performance optimization",
      ],
    },
    {
      id: "strategic",
      icon: TrendingUp,
      title: "Strategic Planning & Optimization",
      description:
        "Build a technology roadmap that supports your business growth for years to come.",
      features: [
        "Digital transformation roadmap",
        "Process optimization",
        "Cost analysis and reduction",
        "Scalability planning",
      ],
    },
  ];

  return (
    <>
      <PageMeta
        title="Services"
        description="Web design, custom software, consulting, training, and strategic planning. Complete technology services to help your business succeed and grow."
        keywords="web design services, software development services, technology consulting, team training, strategic planning, custom applications"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              What We Offer
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete technology services designed to help your business
              succeed.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.id}
                className={cn(
                  "p-6 rounded-xl border border-border bg-card",
                  "hover:border-primary/30 transition-all duration-200",
                  "scroll-mt-24",
                )}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="max-w-lg mx-auto p-6 rounded-xl border border-border bg-muted/30">
              <h3 className="font-semibold mb-2">Ready to get started?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Let's discuss how we can help your business grow.
              </p>
              <Button asChild className="rounded-lg">
                <Link to="/contact" className="flex items-center gap-2">
                  Get a Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
