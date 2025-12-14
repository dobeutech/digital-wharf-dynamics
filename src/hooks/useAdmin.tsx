import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useAdmin() {
  const { user, getAccessToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Prefer Auth0 RBAC permission claim from access token
      const token = await getAccessToken();
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const payloadPart = token.split(".")[1];
        const json = atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/").padEnd(payloadPart.length + ((4 - (payloadPart.length % 4)) % 4), "="));
        const claims = JSON.parse(json) as Record<string, unknown>;
        const permissions = Array.isArray(claims.permissions) ? (claims.permissions.filter((p) => typeof p === "string") as string[]) : [];
        setIsAdmin(permissions.includes("admin:access"));
      } catch (e) {
        console.error("Error checking admin status:", e);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAdminStatus();
  }, [user, getAccessToken]);

  return { isAdmin, loading };
}
