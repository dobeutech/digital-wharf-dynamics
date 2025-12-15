import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";

export default function About() {
  return (
    <>
      <PageMeta
        title="About Us"
        description="Learn about DOBEU and founder Jeremy Williams. We help businesses grow with modern technology solutions. Years of experience in web development and software engineering."
        keywords="about dobeu, web developer, software engineer, jeremy williams, technology consulting, business solutions"
      />
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <header className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6 gradient-primary bg-clip-text text-transparent">
              About DOBEU
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Helping businesses grow with modern technology solutions
            </p>
          </header>

          <div className="space-y-12 md:space-y-16">
            <section aria-labelledby="story-heading">
              <h2
                id="story-heading"
                className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
              >
                Our Story
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-4">
                We started DOBEU with one goal: help businesses use modern
                technology to grow. Every company should have access to great
                digital tools, no matter their size.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground mb-4">
                Our team brings years of experience in web development and
                software engineering. We create solutions that work today and
                prepare you for tomorrow.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground">
                We focus on building tools that solve real problems. No
                unnecessary complexity. Just results that help your business
                succeed.
              </p>
            </section>

            <section aria-labelledby="founder-heading">
              <h2
                id="founder-heading"
                className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
              >
                Meet the Founder
              </h2>
              <Card className="shadow-material-lg overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex-1">
                      <h3 className="text-xl sm:text-2xl font-bold mb-2">
                        Jeremy Williams
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Jeremy is a full-stack developer who builds digital
                        solutions for growing businesses. He specializes in
                        modern web technologies and helps companies scale with
                        the right tools.
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
                            <ExternalLink
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="shadow-material"
                        >
                          <a
                            href="https://www.behance.net/jeremywilliams62"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2"
                          >
                            View on Behance
                            <ExternalLink
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section aria-labelledby="approach-heading">
              <h2
                id="approach-heading"
                className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
              >
                Our Approach
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Card className="shadow-material">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                      Client-Focused
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      We listen to your needs first. Then we build solutions
                      that fit your specific goals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-material">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                      Innovation-Driven
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      We use the latest proven technologies to give you the best
                      solutions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-material">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                      Quality Obsessed
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      We test every feature thoroughly to make sure it works
                      perfectly.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-material">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                      Partnership Minded
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      We support you long-term as your business grows and
                      changes.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section
              className="gradient-hero rounded-lg p-8 sm:p-12 text-center"
              aria-labelledby="cta-heading"
            >
              <h2
                id="cta-heading"
                className="text-2xl sm:text-3xl font-bold mb-4"
              >
                Let's Build Something Amazing Together
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                Ready to transform your digital presence? We're here to help.
              </p>
              <Button
                asChild
                size="lg"
                className="shadow-material-lg min-h-[44px]"
              >
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
