// Mixpanel tracking utility
// Mixpanel is initialized via script tag in index.html

declare global {
  interface Window {
    mixpanel: {
      track: (event: string, properties?: Record<string, any>) => void;
      identify: (userId: string) => void;
      people: {
        set: (properties: Record<string, any>) => void;
      };
      reset: () => void;
    };
  }
}

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.track(event, properties);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.identify(userId);
    if (properties) {
      window.mixpanel.people.set(properties);
    }
  }
};

export const resetUser = () => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.reset();
  }
};

// Event constants
export const MIXPANEL_EVENTS = {
  // Auth events
  SIGN_UP: 'User Signed Up',
  SIGN_IN: 'User Signed In',
  SIGN_IN_GOOGLE: 'User Signed In with Google',
  SIGN_OUT: 'User Signed Out',
  
  // Purchase events
  CHECKOUT_STARTED: 'Checkout Started',
  SERVICE_VIEWED: 'Service Viewed',
  
  // Contact events
  CONTACT_FORM_SUBMITTED: 'Contact Form Submitted',
  
  // Newsletter events
  NEWSLETTER_SUBSCRIBED: 'Newsletter Subscribed',
  
  // Page view events
  PAGE_VIEW: 'Page Viewed',
} as const;

// Track page view
export const trackPageView = (path: string, title?: string) => {
  trackEvent(MIXPANEL_EVENTS.PAGE_VIEW, {
    path,
    title: title || document.title,
    referrer: document.referrer,
  });
};
