import { useEffect } from 'react';
import posthog from 'posthog-js';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

export const Analytics = () => {
  const { user } = useAuth();
  const location = useLocation();

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
    /**
     * Initialize Intercom chat widget
     * 
     * Changes (ADR-001):
     * - Widget now visible by default on all pages
     * - Removed homepage-only restriction
     * - Added hide_default_launcher: false for explicit visibility
     * - Improved error logging for debugging
     * - Fixed user_hash property name for identity verification
     */
    const boot = async () => {
      const app_id = 'xu0gfiqb';
      const api_base = 'https://api-iam.intercom.io';

      try {
        // Reset any previous session before booting with new identity
        Intercom('shutdown');
      } catch (error) {
        // Log for debugging but don't fail
        if (import.meta.env.DEV) {
          console.warn('Intercom shutdown error:', error);
        }
      }

      // Base configuration with default visibility
      const baseConfig = {
        app_id,
        api_base,
        hide_default_launcher: false, // Ensure launcher is visible by default
      };

      if (!user) {
        // Boot anonymously with visible launcher
        Intercom(baseConfig);
        if (import.meta.env.DEV) {
          console.log('Intercom booted anonymously with visible launcher');
        }
        return;
      }

      // Fetch server-generated JWT for identity verification (secret never ships to browser)
      const { data, error } = await supabase.functions.invoke('intercom-jwt');
      if (error || !data?.token) {
        console.warn('Failed to fetch Intercom JWT, booting anonymous:', error);
        Intercom(baseConfig);
        return;
      }

      // Boot with user identity and visible launcher
      Intercom({
        ...baseConfig,
        user_hash: data.token as string, // Correct property name for identity verification
        user_id: user.id,
        ...(user.email ? { email: user.email } : {}),
        session_duration: 86400000, // 1 day
      });

      if (import.meta.env.DEV) {
        console.log('Intercom booted with user identity:', user.id);
      }
    };

    void boot();

    return () => {
      try {
        Intercom('shutdown');
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('Intercom shutdown error on cleanup:', error);
        }
      }
    };
  }, [user]);

  // REMOVED: Homepage-only visibility logic (ADR-001)
  // The widget will now be visible by default on all pages
  // Previous logic only showed widget after 5s on homepage, which limited discoverability

  return null;
};
