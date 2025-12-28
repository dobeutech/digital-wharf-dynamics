import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { NavigationProvider } from "./contexts/NavigationContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { GlassmorphicHeader } from "@/components/layout/GlassmorphicHeader";
import { FloatingFooter } from "@/components/layout/FloatingFooter";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { Analytics } from "@/components/Analytics";
import { CookieConsentBanner } from "@/components/CookieConsent";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { PageTracker } from "@/components/PageTracker";
import { SkipLink } from "@/components/SkipLink";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "@/config/env"; // Validate environment variables on startup
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Schedule = lazy(() => import("./pages/Schedule"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const SMSPrivacy = lazy(() => import("./pages/SMSPrivacy"));
const CCPAOptOut = lazy(() => import("./pages/CCPAOptOut"));
const NotFound = lazy(() => import("./pages/NotFound"));
const News = lazy(() => import("./pages/News"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 w-full max-w-md p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <SettingsProvider>
                <LanguageProvider>
                  <NavigationProvider>
                    <Analytics />
                    <PageTracker />
                    <SkipLink />
                    <AnimatedBackground />
                    <div className="flex flex-col min-h-screen">
                      <GlassmorphicHeader />
                      <main
                        id="main-content"
                        className="flex-grow"
                        tabIndex={-1}
                      >
                        <ErrorBoundary>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/services" element={<Services />} />
                              <Route path="/pricing" element={<Pricing />} />
                              <Route path="/about" element={<About />} />
                              <Route path="/contact" element={<Contact />} />
                              <Route path="/schedule" element={<Schedule />} />
                              <Route path="/privacy" element={<Privacy />} />
                              <Route
                                path="/privacy/sms"
                                element={<SMSPrivacy />}
                              />
                              <Route path="/terms" element={<Terms />} />
                              <Route path="/tos" element={<Terms />} />
                              <Route
                                path="/ccpa-optout"
                                element={<CCPAOptOut />}
                              />
                              <Route path="/news" element={<News />} />
                              {/* Redirect old auth routes to home */}
                              <Route
                                path="/auth"
                                element={<Navigate to="/" replace />}
                              />
                              <Route
                                path="/reset-password"
                                element={<Navigate to="/" replace />}
                              />
                              <Route
                                path="/verify-email"
                                element={<Navigate to="/" replace />}
                              />
                              <Route
                                path="/verify-phone"
                                element={<Navigate to="/" replace />}
                              />
                              <Route
                                path="/dashboard/*"
                                element={<Navigate to="/" replace />}
                              />
                              <Route
                                path="/admin/*"
                                element={<Navigate to="/" replace />}
                              />
                              <Route
                                path="/newsletter"
                                element={<Navigate to="/" replace />}
                              />
                              <Route
                                path="/brand"
                                element={<Navigate to="/" replace />}
                              />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </ErrorBoundary>
                      </main>
                      <FloatingFooter />
                    </div>
                    <CookieConsentBanner />
                    <NewsletterPopup />
                  </NavigationProvider>
                </LanguageProvider>
              </SettingsProvider>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
