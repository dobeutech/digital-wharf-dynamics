# ADR 001: Fix Intercom Chat Widget Visibility

**Status**: Proposed  
**Date**: 2025-12-13  
**Deciders**: Development Team  
**Technical Story**: Intercom chat widget not appearing on https://dobeu.net

## Context

The Intercom chat widget is integrated into the application but is not visible to users on the production site (https://dobeu.net). The widget should appear in the bottom-right corner of the page to provide customer support and engagement.

### Current Implementation

The Intercom integration is implemented in `src/components/Analytics.tsx` with the following behavior:

1. **Initialization**: Intercom is initialized with app ID `xu0gfiqb` and API base `https://api-iam.intercom.io`
2. **Authentication**: For logged-in users, a JWT token is fetched from Supabase Edge Function `intercom-jwt`
3. **Visibility Logic**: The widget is only shown automatically after 5 seconds on the homepage (`/`)
4. **Session Management**: Intercom session is shut down and reinitialized when user auth state changes

### Identified Issues

1. **Restrictive Visibility Logic**: Widget only shows on homepage after 5-second delay
   ```typescript
   useEffect(() => {
     // Show Intercom only if the user stays on home page > 5s
     if (location.pathname !== '/') return;
     
     const timer = window.setTimeout(() => {
       try {
         Intercom('show');
       } catch {
         // ignore
       }
     }, 5000);
     
     return () => window.clearTimeout(timer);
   }, [location.pathname]);
   ```

2. **No Default Visibility**: Widget is not set to be visible by default on other pages
3. **Silent Failures**: Errors are caught and ignored, making debugging difficult
4. **Missing Configuration**: No `hide_default_launcher` configuration, which controls default visibility

## Decision

We will modify the Intercom integration to make the chat widget visible by default across all pages while maintaining security and user experience.

### Changes to Implement

1. **Remove Homepage-Only Restriction**: Allow widget to appear on all pages
2. **Set Default Visibility**: Configure Intercom to show launcher by default
3. **Improve Error Handling**: Add logging for debugging while maintaining graceful degradation
4. **Add Configuration Options**: Include `hide_default_launcher: false` to ensure visibility
5. **Maintain Security**: Keep JWT-based identity verification for authenticated users

## Alternatives Considered

### Alternative 1: Keep Homepage-Only with Manual Trigger

**Description**: Keep current logic but add manual trigger buttons on other pages.

**Pros**:
- Maintains current behavior
- Gives users explicit control
- Reduces unsolicited interruptions

**Cons**:
- Requires UI changes on every page
- Less discoverable for users
- More maintenance overhead
- Inconsistent UX across pages

**Decision**: Rejected - Too complex and reduces discoverability

### Alternative 2: Use Intercom's Built-in Visibility Rules

**Description**: Configure visibility rules in Intercom dashboard instead of code.

**Pros**:
- No code changes needed
- Configurable without deployment
- Centralized management

**Cons**:
- Less transparent (configuration not in code)
- Requires Intercom dashboard access
- Harder to version control
- May conflict with code-based logic

**Decision**: Rejected - Prefer code-based configuration for transparency

### Alternative 3: Progressive Enhancement with Delay

**Description**: Show widget immediately on homepage, with delay on other pages.

**Pros**:
- Balances visibility and user experience
- Reduces interruptions on content pages
- Maintains homepage priority

**Cons**:
- Inconsistent behavior across pages
- More complex logic
- Still delays access on some pages

**Decision**: Rejected - Inconsistency is confusing

### Alternative 4: Show Widget Everywhere Immediately (Chosen)

**Description**: Configure Intercom to show launcher by default on all pages without delays.

**Pros**:
- ✅ Consistent user experience
- ✅ Maximum discoverability
- ✅ Simple implementation
- ✅ Standard Intercom behavior
- ✅ Easy to debug

**Cons**:
- ⚠️ May be perceived as intrusive by some users
- ⚠️ Slightly more visual clutter

**Decision**: Accepted - Benefits outweigh drawbacks

## Implementation

### Code Changes

**File**: `src/components/Analytics.tsx`

```typescript
// BEFORE
useEffect(() => {
  const boot = async () => {
    const app_id = 'xu0gfiqb';
    const api_base = 'https://api-iam.intercom.io';

    try {
      Intercom('shutdown');
    } catch {
      // ignore
    }

    if (!user) {
      Intercom({ app_id, api_base });
      return;
    }

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
      session_duration: 86400000,
    });
  };

  void boot();
}, [user]);

useEffect(() => {
  // Show Intercom only if the user stays on home page > 5s
  if (location.pathname !== '/') return;

  const timer = window.setTimeout(() => {
    try {
      Intercom('show');
    } catch {
      // ignore
    }
  }, 5000);

  return () => window.clearTimeout(timer);
}, [location.pathname]);

// AFTER
useEffect(() => {
  const boot = async () => {
    const app_id = 'xu0gfiqb';
    const api_base = 'https://api-iam.intercom.io';

    try {
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
      hide_default_launcher: false, // Ensure launcher is visible
    };

    if (!user) {
      // Boot anonymously with visible launcher
      Intercom(baseConfig);
      if (import.meta.env.DEV) {
        console.log('Intercom booted anonymously');
      }
      return;
    }

    // Fetch JWT for authenticated users
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

// REMOVED: Homepage-only visibility logic
// The widget will now be visible by default on all pages
```

### Configuration Verification

Ensure the following are configured:

1. **Intercom App Settings**:
   - App ID: `xu0gfiqb`
   - Identity Verification: Enabled
   - Messenger visibility: Set to "Show to everyone" or "Show to specific users"

2. **Supabase Edge Function**:
   - Function: `intercom-jwt`
   - Environment variable: `INTERCOM_IDENTITY_VERIFICATION_SECRET` must be set
   - Verify function is deployed and accessible

3. **Content Security Policy** (already configured in `vite.config.ts`):
   - `script-src`: Includes `https://widget.intercom.io` and `https://js.intercomcdn.com`
   - `connect-src`: Includes `https://*.intercom.io` and `wss://*.intercom.io`
   - `frame-src`: Includes `https://*.intercom.io`

## Consequences

### Positive

1. **Improved Discoverability**: Users can access support chat from any page
2. **Consistent UX**: Widget behavior is predictable across the site
3. **Better Support Access**: Reduces friction for users seeking help
4. **Standard Implementation**: Follows Intercom's recommended practices
5. **Easier Debugging**: Better logging helps identify issues
6. **Increased Engagement**: More opportunities for user interaction

### Negative

1. **Visual Presence**: Widget is always visible, may be perceived as clutter
2. **Potential Distraction**: Some users may find it intrusive
3. **Load Impact**: Widget loads on all pages (minimal, but measurable)

### Neutral

1. **User Preference**: Users can minimize the widget if they don't want to use it
2. **Customization**: Intercom dashboard allows further customization if needed
3. **Analytics**: Can track engagement to validate the decision

### Mitigation Strategies

1. **Monitor Engagement**: Track widget usage to ensure it's valuable
2. **User Feedback**: Collect feedback on widget visibility
3. **A/B Testing**: Consider testing visibility rules if engagement is low
4. **Customization**: Use Intercom's targeting rules to hide on specific pages if needed
5. **Performance**: Monitor page load times to ensure minimal impact

## Validation

### Testing Checklist

- [ ] Widget appears on homepage (https://dobeu.net)
- [ ] Widget appears on services page (https://dobeu.net/services)
- [ ] Widget appears on contact page (https://dobeu.net/contact)
- [ ] Widget appears on admin pages (for authenticated users)
- [ ] Widget works for anonymous users
- [ ] Widget works for authenticated users
- [ ] JWT authentication succeeds for logged-in users
- [ ] Widget can be minimized and reopened
- [ ] No console errors related to Intercom
- [ ] CSP headers allow Intercom resources
- [ ] Widget loads within 2 seconds
- [ ] Widget doesn't block page interaction

### Debugging Steps

If widget still doesn't appear:

1. **Check Browser Console**:
   ```javascript
   // Check if Intercom is loaded
   console.log(typeof Intercom); // Should be 'function'
   
   // Check Intercom status
   Intercom('getVisitorId'); // Should return visitor ID
   ```

2. **Verify Network Requests**:
   - Check for requests to `widget.intercom.io`
   - Check for requests to `api-iam.intercom.io`
   - Verify no CORS or CSP errors

3. **Check Intercom Dashboard**:
   - Verify app ID is correct
   - Check messenger visibility settings
   - Review identity verification configuration

4. **Test JWT Generation**:
   ```bash
   # Test Supabase Edge Function
   curl -X POST https://[project].supabase.co/functions/v1/intercom-jwt \
     -H "Authorization: Bearer [token]"
   ```

5. **Verify Environment**:
   - Check `INTERCOM_IDENTITY_VERIFICATION_SECRET` is set in Supabase
   - Verify secret matches Intercom dashboard

## References

- [Intercom Messenger Documentation](https://developers.intercom.com/installing-intercom/docs/intercom-javascript)
- [Intercom Identity Verification](https://developers.intercom.com/installing-intercom/docs/enable-identity-verification-on-your-web-product)
- [Intercom Messenger SDK](https://www.npmjs.com/package/@intercom/messenger-js-sdk)
- Current Implementation: `src/components/Analytics.tsx`
- Edge Function: `supabase/functions/intercom-jwt/index.ts`

## Rollback Plan

If the change causes issues:

1. **Immediate Rollback**: Revert `Analytics.tsx` to previous version
2. **Partial Rollback**: Re-add homepage-only logic with shorter delay (2s instead of 5s)
3. **Configuration Rollback**: Set `hide_default_launcher: true` to hide widget
4. **Dashboard Rollback**: Disable messenger in Intercom dashboard

## Future Considerations

1. **Smart Visibility**: Use Intercom's targeting rules to show widget based on:
   - User behavior (time on site, pages visited)
   - User segment (new vs returning)
   - Page type (support pages vs content pages)

2. **Customization**: Consider custom launcher button that matches site design

3. **Performance**: Lazy load Intercom on user interaction if performance becomes an issue

4. **Analytics**: Track widget engagement to optimize visibility rules

5. **Internationalization**: Configure Intercom for multi-language support

## Approval

- [ ] Technical Lead Review
- [ ] Product Owner Approval
- [ ] Security Review (JWT implementation)
- [ ] UX Review (widget placement and behavior)
- [ ] QA Testing Complete

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-13  
**Next Review**: 2025-01-13 (30 days after implementation)
