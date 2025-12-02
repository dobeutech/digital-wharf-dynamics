import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, FolderOpen, Users, Newspaper, FileText } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalProjects: 0,
    totalUsers: 0,
    totalPosts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [servicesRes, projectsRes, profilesRes, postsRes] = await Promise.all([
        supabase.from("services").select("id", { count: "exact" }),
        supabase.from("projects").select("id", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("newsletter_posts").select("id", { count: "exact" }),
      ]);

      setStats({
        totalServices: servicesRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalUsers: profilesRes.count || 0,
        totalPosts: postsRes.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-xl text-muted-foreground">Manage your platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                <Link to="/admin/projects">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View All Projects
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
