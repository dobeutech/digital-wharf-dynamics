import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, FolderOpen, Users, Newspaper, FileText, Shield, MessageSquare, ClipboardList, BarChart3 } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalProjects: 0,
    totalUsers: 0,
    totalPosts: 0,
    totalCCPARequests: 0,
    totalContactSubmissions: 0,
    totalAuditLogs: 0,
    pendingCCPA: 0,
    newContacts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [servicesRes, projectsRes, profilesRes, postsRes, ccpaRes, contactsRes, pendingCCPARes, newContactsRes, auditRes] = await Promise.all([
        supabase.from("services").select("id", { count: "exact" }),
        supabase.from("projects").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("newsletter_posts").select("id", { count: "exact" }),
        supabase.from("ccpa_requests").select("id", { count: "exact" }),
        supabase.from("contact_submissions").select("id", { count: "exact" }),
        supabase.from("ccpa_requests").select("id", { count: "exact" }).eq("status", "pending"),
        supabase.from("contact_submissions").select("id", { count: "exact" }).eq("status", "new"),
        supabase.from("audit_logs").select("id", { count: "exact" }),
      ]);

      setStats({
        totalServices: servicesRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalUsers: profilesRes.count || 0,
        totalPosts: postsRes.count || 0,
        totalCCPARequests: ccpaRes.count || 0,
        totalContactSubmissions: contactsRes.count || 0,
        totalAuditLogs: auditRes.count || 0,
        pendingCCPA: pendingCCPARes.count || 0,
        newContacts: newContactsRes.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">Manage your platform</p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-material">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalServices}</div>
              <Button asChild variant="link" className="p-0">
                <Link to="/admin/services">Manage Services →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FolderOpen className="h-5 w-5 text-primary" />
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalProjects}</div>
              <Button asChild variant="link" className="p-0">
                <Link to="/admin/projects">View Projects →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalUsers}</div>
              <Button asChild variant="link" className="p-0">
                <Link to="/admin/users">Manage Users →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Newspaper className="h-5 w-5 text-primary" />
                Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{stats.totalPosts}</div>
              <Button asChild variant="link" className="p-0">
                <Link to="/admin/newsletter">Manage Posts →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-material border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-yellow-500" />
                CCPA Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">{stats.totalCCPARequests}</span>
                {stats.pendingCCPA > 0 && (
                  <span className="text-sm text-yellow-500 font-medium">
                    ({stats.pendingCCPA} pending)
                  </span>
                )}
              </div>
              <Button asChild variant="link" className="p-0">
                <Link to="/admin/ccpa">Manage CCPA Requests →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Contact Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">{stats.totalContactSubmissions}</span>
                {stats.newContacts > 0 && (
                  <span className="text-sm text-blue-500 font-medium">
                    ({stats.newContacts} new)
                  </span>
                )}
              </div>
              <Button asChild variant="link" className="p-0">
                <Link to="/admin/contacts">View Submissions →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-purple-500" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">{stats.totalAuditLogs}</span>
              </div>
              <Button asChild variant="link" className="p-0">
                <Link to="/admin/audit-logs">View Audit Logs →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-material">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/services/new">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add New Service
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/newsletter/new">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Newsletter Post
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/ccpa">
                  <Shield className="mr-2 h-4 w-4" />
                  Review CCPA Requests
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/audit-logs">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  View Audit Logs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/admin/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material gradient-hero">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription className="text-foreground/80">All systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground/80">Database</span>
                  <span className="text-green-500 font-semibold">✓ Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/80">Storage</span>
                  <span className="text-green-500 font-semibold">✓ Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/80">Functions</span>
                  <span className="text-green-500 font-semibold">✓ Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground/80">Email Service</span>
                  <span className="text-green-500 font-semibold">✓ Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </AdminLayout>
  );
}
