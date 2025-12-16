import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { cn } from "@/lib/utils";

export default function About() {
  const approaches = [
    {
      title: "Client-Focused",
      description:
        "We listen to your needs first. Then we build solutions that fit your specific goals.",
    },
    {
      title: "Innovation-Driven",
      description:
        "We use the latest proven technologies to give you the best solutions.",
    },
    {
      title: "Quality Obsessed",
      description:
        "We test every feature thoroughly to make sure it works perfectly.",
    },
    {
      title: "Partnership Minded",
      description:
        "We support you long-term as your business grows and changes.",
    },
  ];

  return (
    <>
      <PageMeta
        title="About Us"
        description="Learn about DOBEU and founder Jeremy Williams. We help businesses grow with modern technology solutions. Years of experience in web development and software engineering."
        keywords="about dobeu, web developer, software engineer, jeremy williams, technology consulting, business solutions"
      />
      <div className="min-h-screen pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <header className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About DOBEU</h1>
            <p className="text-lg text-muted-foreground">
              Helping businesses grow with modern technology solutions.
            </p>
          </header>

          <div className="space-y-16">
            {/* Story */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We started DOBEU with one goal: help businesses use modern
                  technology to grow. Every company should have access to great
                  digital tools, no matter their size.
                </p>
                <p>
                  Our team brings years of experience in web development and
                  software engineering. We create solutions that work today and
                  prepare you for tomorrow.
                </p>
                <p>
                  We focus on building tools that solve real problems. No
                  unnecessary complexity. Just results that help your business
                  succeed.
                </p>
              </div>
            </section>

            {/* Founder */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Meet the Founder</h2>
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold mb-2">Jeremy Williams</h3>
                <p className="text-muted-foreground mb-4">
                  Jeremy is a full-stack developer who builds digital solutions
                  for growing businesses. He specializes in modern web
                  technologies and helps companies scale with the right tools.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <a
                      href="https://contra.com/jeremy_williams_fx413nca"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Hire on Contra
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href="https://www.behance.net/jeremywilliams62"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      View on Behance
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </section>

            {/* Approach */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {approaches.map((approach) => (
                  <div
                    key={approach.title}
                    className={cn(
                      "p-5 rounded-xl border border-border bg-card",
                      "hover:border-primary/30 transition-colors",
                    )}
                  >
                    <h3 className="font-semibold mb-2">{approach.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {approach.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="p-8 rounded-xl border border-border bg-muted/30 text-center">
              <h2 className="text-2xl font-bold mb-2">
                Let's Build Something Amazing
              </h2>
              <p className="text-muted-foreground mb-6">
                Ready to transform your digital presence? We're here to help.
              </p>
              <Button asChild className="rounded-lg">
                <Link to="/contact" className="flex items-center gap-2">
                  Get in Touch
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
