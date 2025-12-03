import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

type AuditAction = 
  | "CREATE" | "UPDATE" | "DELETE" | "VIEW"
  | "STATUS_CHANGE" | "ROLE_CHANGE" | "LOGIN" | "LOGOUT";

type EntityType = 
  | "user_role" | "service" | "project" | "newsletter_post"
  | "ccpa_request" | "contact_submission" | "profile";

interface AuditLogParams {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  oldValues?: Json;
  newValues?: Json;
}

export function useAuditLog() {
  const { user } = useAuth();

  const logAction = async (params: AuditLogParams) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("audit_logs").insert([{
        user_id: user.id,
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId || null,
        old_values: params.oldValues || null,
        new_values: params.newValues || null,
        user_agent: navigator.userAgent,
      }]);

      if (error) {
        console.error("Failed to log audit action:", error);
      }
    } catch (err) {
      console.error("Audit logging error:", err);
    }
  };

  return { logAction };
}
