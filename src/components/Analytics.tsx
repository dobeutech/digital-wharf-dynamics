import { useEffect } from "react";
import posthog from "posthog-js";
import Intercom from "@intercom/messenger-js-sdk";

export const Analytics = () => {
  // Auth removed - analytics work without user context

  useEffect(() => {
    // Initialize PostHog
    posthog.init("phc_Gaksl1OP0ZVYeErlumeRTuj5xJqPMQPe3H8UKxMpwAM", {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });

    // Google Tag Manager is loaded via script tag in index.html
    console.log("Analytics initialized: PostHog, Intercom, and GTM");
  }, []);

  // Initialize Intercom
  useEffect(() => {
    try {
      Intercom({
        app_id: "xu0gfiqb",
        api_base: "https://api-iam.intercom.io",
        hide_default_launcher: false, // Ensure launcher is always visible
      });

      if (import.meta.env.DEV) {
        console.log("Intercom initialized with app_id: xu0gfiqb");
      }
    } catch (error) {
      console.error("Failed to initialize Intercom:", error);
    }
  }, []);

  return null;
};
