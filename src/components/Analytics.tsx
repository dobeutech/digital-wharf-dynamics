import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';

interface WindowWithIntercom extends Window {
  Intercom?: unknown;
}

interface UserWithCreatedAt {
  created_at?: string | number;
  [key: string]: unknown;
}

export const Analytics = () => {
  const { user } = useAuth();
  const { user: auth0User } = useAuth0();
  const intercomInitialized = useRef(false);

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

  // Initialize Intercom immediately on mount (even without user)
  useEffect(() => {
    if (!intercomInitialized.current) {
      // Initialize Intercom with just app_id first
      try {
        Intercom({
          app_id: 'xu0gfiqb',
        });
        intercomInitialized.current = true;
        console.log('Intercom initialized with app_id: xu0gfiqb');
        
        // Verify Intercom is available on window
        if (typeof window !== 'undefined' && (window as unknown as WindowWithIntercom).Intercom) {
          console.log('Intercom SDK loaded successfully on window object');
        } else {
          console.warn('Intercom SDK may not be fully loaded yet');
        }
      } catch (error) {
        console.error('Failed to initialize Intercom:', error);
      }
    }
  }, []);

  // Update Intercom when user data changes
  useEffect(() => {
    if (!intercomInitialized.current) return;

    // Convert created_at to Unix timestamp (seconds) if available
    let createdAt: number | undefined;
    
    // First check the raw Auth0 user object (which may have created_at)
    if (auth0User && (auth0User as UserWithCreatedAt).created_at) {
      const created = (auth0User as UserWithCreatedAt).created_at;
      if (typeof created === 'string') {
        // ISO string - convert to Unix timestamp
        createdAt = Math.floor(new Date(created).getTime() / 1000);
      } else if (typeof created === 'number') {
        // Already a timestamp - ensure it's in seconds
        createdAt = created < 10000000000 ? created : Math.floor(created / 1000);
      }
    }
    // Fallback to mapped user object if not found in auth0User
    else if (user && (user as unknown as UserWithCreatedAt).created_at) {
      const created = (user as unknown as UserWithCreatedAt).created_at;
      if (typeof created === 'string') {
        createdAt = Math.floor(new Date(created).getTime() / 1000);
      } else if (typeof created === 'number') {
        createdAt = created < 10000000000 ? created : Math.floor(created / 1000);
      }
    }

    // Build Intercom config with user data
    const intercomConfig: {
      app_id: string;
      user_id?: string;
      name?: string;
      email?: string;
      created_at?: number;
    } = {
      app_id: 'xu0gfiqb',
    };

    if (user) {
      intercomConfig.user_id = user.id;
      if (user.name) intercomConfig.name = user.name;
      if (user.email) intercomConfig.email = user.email;
      if (createdAt) intercomConfig.created_at = createdAt;

      // Update Intercom by calling it again with full config
      try {
        Intercom('update', intercomConfig);
        console.log('Intercom updated with user data:', {
          user_id: intercomConfig.user_id,
          email: intercomConfig.email,
          name: intercomConfig.name,
          created_at: intercomConfig.created_at,
        });
      } catch (error) {
        console.error('Failed to update Intercom:', error);
      }
    }
  }, [user, auth0User]);

  return null;
};
