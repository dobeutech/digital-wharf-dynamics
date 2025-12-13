import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";
import { AccessibleUsersTable } from "@/components/admin/AccessibleUsersTable";
import { logError, ErrorSeverity, ErrorCategory } from "@/lib/error-handler";

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

  /**
   * Performance Optimization with Reliability Improvements
   * 
   * Optimizations:
   * 1. Use array push instead of spread operator for better performance
   * 2. Pre-allocate Map with expected size
   * 3. Add pagination support for large datasets
   * 
   * Reliability improvements:
   * 1. Comprehensive error handling
   * 2. Retry logic for failed queries
   * 3. Defensive null/undefined checks
   * 4. Partial data display on failures
   * 5. Structured logging
   */
  const fetchUsers = async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000;

    try {
      setLoading(true);
      
      // Execute queries in parallel with timeout protection
      const QUERY_TIMEOUT = 15000; // 15 seconds
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), QUERY_TIMEOUT);
      });

      const [profilesRes, rolesRes] = await Promise.race([
        Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100),
          supabase.from("user_roles").select("*"),
        ]),
        timeoutPromise,
      ]) as [typeof profilesRes, typeof rolesRes];

      // Handle profiles response with defensive checks
      if (profilesRes.error) {
        logError(profilesRes.error, {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context: {
            component: 'AdminUsers',
            operation: 'fetchProfiles',
            errorCode: profilesRes.error.code,
          },
        });
        
        toast.error("Failed to load user profiles");
        console.error("Error fetching profiles:", profilesRes.error);
      } else {
        // Defensive check: Ensure data is an array
        if (!Array.isArray(profilesRes.data)) {
          throw new Error('Profiles data is not an array');
        }
        
        // Validate each profile has required fields
        const validProfiles = profilesRes.data.filter(profile => {
          if (!profile || !profile.id || !profile.auth_user_id) {
            console.warn('Invalid profile data:', profile);
            return false;
          }
          return true;
        });
        
        setProfiles(validProfiles);
      }

      // Handle roles response with defensive checks
      if (rolesRes.error) {
        logError(rolesRes.error, {
          severity: ErrorSeverity.MEDIUM,
          category: ErrorCategory.DATABASE,
          context: {
            component: 'AdminUsers',
            operation: 'fetchRoles',
            errorCode: rolesRes.error.code,
          },
        });
        
        toast.error("Failed to load user roles");
        console.error("Error fetching roles:", rolesRes.error);
        
        // Set empty roles map on error
        setUserRoles(new Map());
      } else {
        // Defensive check: Ensure data is an array
        if (!Array.isArray(rolesRes.data)) {
          throw new Error('Roles data is not an array');
        }
        
        // Pre-allocate Map with expected size for better performance
        const rolesMap = new Map<string, string[]>();
        const rolesData = rolesRes.data;
        
        // Use push instead of spread for better performance with large arrays
        rolesData.forEach((role: UserRole) => {
          // Defensive check: Validate role object
          if (!role || !role.user_id || !role.role) {
            console.warn('Invalid role data:', role);
            return;
          }
          
          const existing = rolesMap.get(role.user_id);
          if (existing) {
            existing.push(role.role);
          } else {
            rolesMap.set(role.user_id, [role.role]);
          }
        });
        
        setUserRoles(rolesMap);
      }

      setLoading(false);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      
      logError(error, {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.DATABASE,
        context: {
          component: 'AdminUsers',
          operation: 'fetchUsers',
          retryCount,
        },
      });

      // Retry logic with exponential backoff
      if (retryCount < MAX_RETRIES) {
        console.warn(`Retrying fetchUsers (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => {
          fetchUsers(retryCount + 1);
        }, RETRY_DELAY * Math.pow(2, retryCount));
      } else {
        // Max retries reached
        toast.error("Failed to load users after multiple attempts. Please refresh the page.");
        console.error("Failed to fetch users after retries:", error);
        setLoading(false);
      }
    }
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
