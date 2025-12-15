import { useEffect } from 'react';
import posthog from 'posthog-js';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '@/contexts/AuthContext';

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

  // Initialize Intercom
  useEffect(() => {
    try {
      Intercom({
        app_id: 'xu0gfiqb',
      });
      
      if (import.meta.env.DEV) {
        console.log('Intercom initialized with app_id: xu0gfiqb');
      }
    } catch (error) {
      console.error('Failed to initialize Intercom:', error);
    }
  }, []);

  // Update Intercom when user data changes
  useEffect(() => {
    if (!user) return;

    try {
      // Use the 'update' method to modify user attributes after boot
      Intercom('update', {
        user_id: user.id,
        ...(user.name && { name: user.name }),
        ...(user.email && { email: user.email }),
      });

      if (import.meta.env.DEV) {
        console.log('Intercom updated with user data:', {
          user_id: user.id,
          email: user.email,
          name: user.name,
        });
      }
    } catch (error) {
      console.error('Failed to update Intercom:', error);
    }
  }, [user]);

  return null;
};
