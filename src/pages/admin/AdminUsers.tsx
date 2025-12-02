import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  auth_user_id: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: string;
}

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<Map<string, string[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);

    if (profilesRes.error) {
      console.error("Error fetching profiles:", profilesRes.error);
    } else {
      setProfiles(profilesRes.data || []);
    }

    if (rolesRes.error) {
      console.error("Error fetching roles:", rolesRes.error);
    } else {
      const rolesMap = new Map<string, string[]>();
      (rolesRes.data || []).forEach((role: UserRole) => {
        const existing = rolesMap.get(role.user_id) || [];
        rolesMap.set(role.user_id, [...existing, role.role]);
      });
      setUserRoles(rolesMap);
    }

    setLoading(false);
  };

  const toggleRole = async (userId: string, role: "admin" | "moderator" | "user") => {
    const currentRoles = userRoles.get(userId) || [];
    const hasRole = currentRoles.includes(role);

    if (hasRole) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) {
        toast.error("Failed to remove role");
        console.error(error);
      } else {
        toast.success("Role removed successfully");
        fetchUsers();
      }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role as any });

      if (error) {
        toast.error("Failed to add role");
        console.error(error);
      } else {
        toast.success("Role added successfully");
        fetchUsers();
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4" />;
      case "moderator":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">User Management</h1>
          <p className="text-xl text-muted-foreground">
            Manage user accounts and roles
          </p>
        </div>

        <div className="grid gap-6">
          {profiles.map((profile) => {
            const roles = userRoles.get(profile.auth_user_id) || [];
            return (
              <Card key={profile.id} className="shadow-material">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{profile.username}</CardTitle>
                    <div className="flex gap-2">
                      {roles.map((role) => (
                        <Badge key={role} variant="outline" className="gap-1">
                          {getRoleIcon(role)}
                          {role}
                        </Badge>
                      ))}
                      {roles.length === 0 && (
                        <Badge variant="outline" className="gap-1">
                          <User className="h-4 w-4" />
                          user
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant={roles.includes("admin") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleRole(profile.auth_user_id, "admin")}
                    >
                      {roles.includes("admin") ? "Remove" : "Make"} Admin
                    </Button>
                    <Button
                      variant={roles.includes("moderator") ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleRole(profile.auth_user_id, "moderator")}
                    >
                      {roles.includes("moderator") ? "Remove" : "Make"} Moderator
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Joined: {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {profiles.length === 0 && (
          <Card className="shadow-material">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
