import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";
import { AccessibleUsersTable } from "@/components/admin/AccessibleUsersTable";

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
  const { logAction } = useAuditLog();

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
        // Audit log for role removal
        await logAction({
          action: "ROLE_CHANGE",
          entityType: "user_role",
          entityId: userId,
          oldValues: { role },
          newValues: null,
        });
        toast.success("Role removed successfully");
        fetchUsers();
      }
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: role });

      if (error) {
        toast.error("Failed to add role");
        console.error(error);
      } else {
        // Audit log for role addition
        await logAction({
          action: "ROLE_CHANGE",
          entityType: "user_role",
          entityId: userId,
          oldValues: null,
          newValues: { role },
        });
        toast.success("Role added successfully");
        fetchUsers();
      }
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

        <Card className="shadow-material">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <AccessibleUsersTable
              profiles={profiles}
              userRoles={userRoles}
              onToggleRole={toggleRole}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
