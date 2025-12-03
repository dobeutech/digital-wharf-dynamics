// PostHog analytics utility for A/B testing and feature flags
import posthog from 'posthog-js';

// Funnel step constants for signup-to-purchase journey
export const FUNNEL_STEPS = {
  // Step 1: User visits site
  SITE_VISIT: 'funnel_site_visit',
  // Step 2: User signs up
  SIGNUP_COMPLETE: 'funnel_signup_complete',
  // Step 3: User views services/shop
  SHOP_VIEWED: 'funnel_shop_viewed',
  // Step 4: User views service details
  SERVICE_DETAIL_VIEWED: 'funnel_service_detail_viewed',
  // Step 5: User starts checkout
  CHECKOUT_INITIATED: 'funnel_checkout_initiated',
  // Step 6: Purchase complete
  PURCHASE_COMPLETE: 'funnel_purchase_complete',
} as const;

// Track funnel event in PostHog
export const trackFunnelStep = (
  step: string, 
  properties?: Record<string, unknown>
) => {
  posthog.capture(step, {
    funnel: 'signup_to_purchase',
    timestamp: new Date().toISOString(),
    ...properties,
  });
};

// Identify user in PostHog
export const identifyPostHogUser = (
  userId: string, 
  properties?: Record<string, unknown>
) => {
  posthog.identify(userId, properties);
};

// Reset PostHog user on logout
export const resetPostHogUser = () => {
  posthog.reset();
};

// Feature flag utilities for A/B testing
export const isFeatureEnabled = (flagKey: string): boolean => {
  return posthog.isFeatureEnabled(flagKey) ?? false;
};

export const getFeatureFlag = (flagKey: string): string | boolean | undefined => {
  return posthog.getFeatureFlag(flagKey);
};

export const getFeatureFlagPayload = (flagKey: string): Record<string, unknown> | undefined => {
  return posthog.getFeatureFlagPayload(flagKey) as Record<string, unknown> | undefined;
};

// Reload feature flags (useful after login/signup)
export const reloadFeatureFlags = () => {
  posthog.reloadFeatureFlags();
};

// A/B test helper - returns variant name
export const getExperimentVariant = (experimentKey: string): string => {
  const variant = posthog.getFeatureFlag(experimentKey);
  return typeof variant === 'string' ? variant : 'control';
};

// Track A/B test exposure
export const trackExperimentExposure = (
  experimentKey: string, 
  variant: string
) => {
  posthog.capture('$experiment_started', {
    experiment: experimentKey,
    variant: variant,
  });
};

// Group analytics (for team/company tracking)
export const setGroup = (groupType: string, groupKey: string) => {
  posthog.group(groupType, groupKey);
};

// Custom event tracking
export const trackPostHogEvent = (
  event: string, 
  properties?: Record<string, unknown>
) => {
  posthog.capture(event, properties);
};
