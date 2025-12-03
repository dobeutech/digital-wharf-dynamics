import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/Analytics";
import { CookieConsentBanner } from "@/components/CookieConsent";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { PageTracker } from "@/components/PageTracker";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { SkipLink } from "@/components/SkipLink";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CCPAOptOut from "./pages/CCPAOptOut";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Shop from "./pages/Shop";
import Files from "./pages/Files";
import News from "./pages/News";
import Newsletter from "./pages/Newsletter";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminCCPA from "./pages/admin/AdminCCPA";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import { BrandKit } from "@/components/brand/BrandKit";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Analytics />
            <PageTracker />
            <SkipLink />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main id="main-content" className="flex-grow" tabIndex={-1}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/tos" element={<Terms />} />
                  <Route path="/ccpa-optout" element={<CCPAOptOut />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/projects" element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/shop" element={
                    <ProtectedRoute>
                      <Shop />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard/files" element={
                    <ProtectedRoute>
                      <Files />
                    </ProtectedRoute>
                  } />
                  <Route path="/newsletter" element={
                    <ProtectedRoute>
                      <Newsletter />
                    </ProtectedRoute>
                  } />
                  <Route path="/brand" element={
                    <ProtectedRoute>
                      <BrandKit />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/services" element={
                    <AdminRoute>
                      <AdminServices />
                    </AdminRoute>
                  } />
                  <Route path="/admin/projects" element={
                    <AdminRoute>
                      <AdminProjects />
                    </AdminRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  } />
                  <Route path="/admin/newsletter" element={
                    <AdminRoute>
                      <AdminNewsletter />
                    </AdminRoute>
                  } />
                  <Route path="/admin/ccpa" element={
                    <AdminRoute>
                      <AdminCCPA />
                    </AdminRoute>
                  } />
                  <Route path="/admin/contacts" element={
                    <AdminRoute>
                      <AdminContacts />
                    </AdminRoute>
                  } />
                  <Route path="/admin/audit-logs" element={
                    <AdminRoute>
                      <AdminAuditLogs />
                    </AdminRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <CookieConsentBanner />
            <NewsletterPopup />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
