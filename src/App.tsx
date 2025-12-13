import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { EnhancedNavbar } from "@/components/navigation/EnhancedNavbar";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/Analytics";
import { CookieConsentBanner } from "@/components/CookieConsent";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { PageTracker } from "@/components/PageTracker";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
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
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const SMSPrivacy = lazy(() => import("./pages/SMSPrivacy"));
const CCPAOptOut = lazy(() => import("./pages/CCPAOptOut"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Projects = lazy(() => import("./pages/Projects"));
const Shop = lazy(() => import("./pages/Shop"));
const Files = lazy(() => import("./pages/Files"));
const News = lazy(() => import("./pages/News"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminCCPA = lazy(() => import("./pages/admin/AdminCCPA"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminAuditLogs = lazy(() => import("./pages/admin/AdminAuditLogs"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const BrandKit = lazy(() => import("@/components/brand/BrandKit").then(m => ({ default: m.BrandKit })));

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
              <AuthProvider>
                <NavigationProvider>
                  <Analytics />
                  <PageTracker />
                  <SkipLink />
                  <div className="flex flex-col min-h-screen">
                    <EnhancedNavbar />
                  <main id="main-content" className="flex-grow" tabIndex={-1}>
                    <ErrorBoundary>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/pricing" element={<Pricing />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="/privacy/sms" element={<SMSPrivacy />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/tos" element={<Terms />} />
                          <Route path="/ccpa-optout" element={<CCPAOptOut />} />
                          <Route path="/auth" element={<Auth />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/verify-email" element={<VerifyEmail />} />
                          <Route path="/news" element={<News />} />
                          <Route path="/dashboard" element={
                            <ProtectedRoute>
                              <Suspense fallback={<PageLoader />}>
                                <Dashboard />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/dashboard/projects" element={
                            <ProtectedRoute>
                              <Suspense fallback={<PageLoader />}>
                                <Projects />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/dashboard/shop" element={
                            <ProtectedRoute>
                              <Suspense fallback={<PageLoader />}>
                                <Shop />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/dashboard/files" element={
                            <ProtectedRoute>
                              <Suspense fallback={<PageLoader />}>
                                <Files />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/newsletter" element={
                            <ProtectedRoute>
                              <Suspense fallback={<PageLoader />}>
                                <Newsletter />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/brand" element={
                            <ProtectedRoute>
                              <Suspense fallback={<PageLoader />}>
                                <BrandKit />
                              </Suspense>
                            </ProtectedRoute>
                          } />
                          <Route path="/admin" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminDashboard />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/services" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminServices />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/projects" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminProjects />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/users" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminUsers />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/newsletter" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminNewsletter />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/ccpa" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminCCPA />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/contacts" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminContacts />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/audit-logs" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminAuditLogs />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="/admin/analytics" element={
                            <AdminRoute>
                              <Suspense fallback={<PageLoader />}>
                                <AdminAnalytics />
                              </Suspense>
                            </AdminRoute>
                          } />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </main>
                  <Footer />
                </div>
                  <CookieConsentBanner />
                  <NewsletterPopup />
                </NavigationProvider>
              </AuthProvider>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
