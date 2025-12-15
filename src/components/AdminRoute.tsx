import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { SessionWarningDialog } from "@/components/SessionWarningDialog";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { showWarning, timeRemaining, extendSession, logoutNow } =
    useSessionTimeout();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {children}
      <SessionWarningDialog
        open={showWarning}
        timeRemaining={timeRemaining}
        onExtend={extendSession}
        onLogout={logoutNow}
      />
    </>
  );
}
