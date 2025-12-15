import { useApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "VIEW"
  | "STATUS_CHANGE"
  | "ROLE_CHANGE"
  | "LOGIN"
  | "LOGOUT";

type EntityType =
  | "user_role"
  | "service"
  | "project"
  | "newsletter_post"
  | "ccpa_request"
  | "contact_submission"
  | "profile";

interface AuditLogParams {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  oldValues?: unknown;
  newValues?: unknown;
}

export function useAuditLog() {
  const { user } = useAuth();
  const api = useApi();

  const logAction = async (params: AuditLogParams) => {
    if (!user) return;

    try {
      await api.post("/audit-logs", {
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId || null,
        old_values: params.oldValues || null,
        new_values: params.newValues || null,
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : null,
      });
    } catch (err) {
      console.error("Audit logging error:", err);
    }
  };

  return { logAction };
}
