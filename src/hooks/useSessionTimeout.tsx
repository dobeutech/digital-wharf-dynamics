import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE = 5 * 60 * 1000; // 5 minutes warning

export function useSessionTimeout() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);

    if (user && isAdmin) {
      // Warning timer - show dialog 5 minutes before timeout
      warningRef.current = setTimeout(() => {
        setShowWarning(true);
        setTimeRemaining(Math.floor(WARNING_BEFORE / 1000));
        
        // Start countdown
        countdownRef.current = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              if (countdownRef.current) clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, TIMEOUT_DURATION - WARNING_BEFORE);

      // Logout timer
      timeoutRef.current = setTimeout(() => {
        clearAllTimers();
        signOut();
        toast.warning("Session expired due to inactivity");
      }, TIMEOUT_DURATION);
    }
  }, [user, isAdmin, signOut, clearAllTimers]);

  useEffect(() => {
    if (!user || !isAdmin) return;

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    
    const handleActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearAllTimers();
    };
  }, [user, isAdmin, resetTimer, showWarning, clearAllTimers]);

  const extendSession = useCallback(() => {
    resetTimer();
    setShowWarning(false);
    toast.success("Session extended");
  }, [resetTimer]);

  const logoutNow = useCallback(() => {
    clearAllTimers();
    signOut();
  }, [clearAllTimers, signOut]);

  return { showWarning, timeRemaining, extendSession, logoutNow };
}
