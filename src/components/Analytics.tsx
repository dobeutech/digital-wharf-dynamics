import { useEffect } from 'react';
import posthog from 'posthog-js';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const Analytics = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize PostHog
    posthog.init('phc_Gaksl1OP0ZVYeErlumeRTuj5xJqPMQPe3H8UKxMpwAM', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
    });

    // Google Tag Manager is loaded via script tag in index.html
    console.log('Analytics initialized: PostHog, Intercom, and GTM');
  }, []);

  useEffect(() => {
    const boot = async () => {
      const app_id = 'xu0gfiqb';
      const api_base = 'https://api-iam.intercom.io';

      try {
        // Reset any previous session before booting with new identity
        Intercom('shutdown');
      } catch {
        // ignore
      }

      if (!user) {
        Intercom({ app_id, api_base });
        return;
      }

      // Fetch server-generated JWT (secret never ships to browser)
      const { data, error } = await supabase.functions.invoke('intercom-jwt');
      if (error || !data?.token) {
        console.warn('Failed to fetch Intercom JWT, booting anonymous:', error);
        Intercom({ app_id, api_base });
        return;
      }

      Intercom({
        app_id,
        api_base,
        intercom_user_jwt: data.token as string,
        user_id: user.id,
        ...(user.email ? { email: user.email } : {}),
        session_duration: 86400000, // 1 day
      });
    };

    void boot();

    return () => {
      try {
        Intercom('shutdown');
      } catch {
        // ignore
      }
    };
  }, [user]);

  return null;
};
