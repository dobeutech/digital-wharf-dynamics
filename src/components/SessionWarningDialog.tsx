import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, LogOut } from "lucide-react";

interface SessionWarningDialogProps {
  open: boolean;
  timeRemaining: number;
  onExtend: () => void;
  onLogout: () => void;
}

export function SessionWarningDialog({
  open,
  timeRemaining,
  onExtend,
  onLogout,
}: SessionWarningDialogProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Your session will expire due to inactivity.
            </p>
            <p className="text-2xl font-mono font-bold text-foreground">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
            <p>
              Click "Stay Logged In" to continue your session.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout Now
          </AlertDialogCancel>
          <AlertDialogAction onClick={onExtend}>
            Stay Logged In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
