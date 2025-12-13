import { useEffect, useState } from 'react';
import { checkSupabaseHealth } from '@/integrations/supabase/client';

/**
 * Hook to monitor Supabase connection health
 */
export function useSupabaseHealth(intervalMs: number = 30000) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const healthy = await checkSupabaseHealth();
      setIsHealthy(healthy);
    } catch (error) {
      console.error('Health check failed:', error);
      setIsHealthy(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Set up periodic health checks
    const interval = setInterval(checkHealth, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { isHealthy, isChecking, checkHealth };
}

