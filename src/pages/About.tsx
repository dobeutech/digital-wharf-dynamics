import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 gradient-primary bg-clip-text text-transparent">
            About DOBEU
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering businesses through innovative technology solutions
          </p>
        </header>

        <div className="space-y-12 md:space-y-16">
          <section aria-labelledby="story-heading">
            <h2 id="story-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Story</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-4">
              DOBEU was founded with a simple mission: to make cutting-edge technology accessible 
              to businesses of all sizes. We believe that every organization deserves world-class 
              digital solutions that drive growth and innovation.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground">
              Our team combines decades of experience in web development, software engineering, 
              and strategic consulting to deliver solutions that not only meet today's needs but 
              anticipate tomorrow's challenges.
            </p>
          </section>

          <section aria-labelledby="founder-heading">
            <h2 id="founder-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Meet the Founder</h2>
            <Card className="shadow-material-lg overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Jeremy Williams</h3>
                    <p className="text-muted-foreground mb-4">
                      Full-stack developer and digital strategist with a passion for creating 
                      impactful digital experiences. Specializing in modern web technologies, 
                      software architecture, and helping businesses scale through technology.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button asChild size="sm" className="shadow-material">
                        <a 
                          href="https://contra.com/jeremy_williams_fx413nca?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=jeremy_williams_fx413nca" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Hire on Contra
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="shadow-material">
                        <a 
                          href="https://www.behance.net/jeremywilliams62" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          View on Behance
                          <ExternalLink className="w-4 h-4" aria-hidden="true" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="approach-heading">
            <h2 id="approach-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Our Approach</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Card className="shadow-material">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Client-Focused</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    We listen first, then create solutions tailored to your unique business goals 
                    and challenges.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-material">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Innovation-Driven</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    We stay ahead of technology trends to bring you the most modern and effective 
                    solutions available.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-material">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Quality Obsessed</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Every project undergoes rigorous testing and quality assurance to ensure 
                    flawless performance.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-material">
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Partnership Minded</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    We build long-term relationships, providing ongoing support and guidance as 
                    your business evolves.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="gradient-hero rounded-lg p-8 sm:p-12 text-center" aria-labelledby="cta-heading">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold mb-4">Let's Build Something Amazing Together</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Ready to transform your digital presence? We're here to help.
            </p>
            <Button asChild size="lg" className="shadow-material-lg min-h-[44px]">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
