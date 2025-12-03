import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FolderOpen, ShoppingBag, FileText, Newspaper } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalFiles: 0,
    pendingPurchases: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const [projectsRes, filesRes, purchasesRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact" }).eq("user_id", user.id).neq("status", "completed"),
        supabase.from("client_files").select("id", { count: "exact" }).eq("user_id", user.id),
        supabase.from("purchases").select("id", { count: "exact" }).eq("user_id", user.id).eq("status", "pending"),
      ]);

      setStats({
        activeProjects: projectsRes.count || 0,
        totalFiles: filesRes.count || 0,
        pendingPurchases: purchasesRes.count || 0,
      });
    };

    fetchStats();
  }, [user]);

  return (
    <PageLayout maxWidth="2xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-xl text-muted-foreground">Manage your projects and services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                Active Projects
              </CardTitle>
              <CardDescription>Projects in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.activeProjects}</div>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/dashboard/projects">View All Projects →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Files
              </CardTitle>
              <CardDescription>Documents and assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.totalFiles}</div>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/dashboard/files">Manage Files →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material hover:shadow-material-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Pending Orders
              </CardTitle>
              <CardDescription>Services to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.pendingPurchases}</div>
              <Button asChild variant="link" className="mt-4 p-0">
                <Link to="/dashboard/shop">Browse Services →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-material">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/shop">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Purchase New Service
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/projects">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  View Project Status
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/files">
                  <FileText className="mr-2 h-4 w-4" />
                  Access Files
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/newsletter">
                  <Newspaper className="mr-2 h-4 w-4" />
                  Read Newsletter
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-material gradient-hero">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription className="text-foreground/80">
                Our support team is here to assist you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 text-foreground/80">
                Have questions about your project or need technical support? Use the chat icon in the bottom right to contact our team directly.
              </p>
              <Button variant="secondary" className="w-full">
                Open Support Chat
              </Button>
            </CardContent>
          </Card>
        </div>
    </PageLayout>
  );
}
