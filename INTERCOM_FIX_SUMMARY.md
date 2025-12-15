# Intercom Chat Widget Fix - Summary

## Problem

The Intercom chat widget was not appearing on https://dobeu.net. The widget should be visible in the bottom-right corner to provide customer support.

## Root Cause

The implementation had restrictive visibility logic that only showed the widget:

1. On the homepage (`/`) only
2. After a 5-second delay
3. Required manual `Intercom('show')` call

This made the widget invisible on all other pages and difficult to discover.

## Solution

Modified `src/components/Analytics.tsx` to:

1. ✅ Remove homepage-only restriction
2. ✅ Remove 5-second delay
3. ✅ Add `hide_default_launcher: false` configuration
4. ✅ Fix `user_hash` property name (was `intercom_user_jwt`)
5. ✅ Improve error logging for debugging

## Changes Made

### File: `src/components/Analytics.tsx`

**Before**:

```typescript
// Only showed on homepage after 5 seconds
useEffect(() => {
  if (location.pathname !== "/") return;

  const timer = window.setTimeout(() => {
    Intercom("show");
  }, 5000);

  return () => window.clearTimeout(timer);
}, [location.pathname]);
```

**After**:

```typescript
// Widget visible by default on all pages
const baseConfig = {
  app_id,
  api_base,
  hide_default_launcher: false, // Explicit visibility
};

Intercom(baseConfig); // No delay, no restrictions
```

### Key Configuration Changes

1. **Added `hide_default_launcher: false`**
   - Ensures widget is visible by default
   - Standard Intercom configuration

2. **Fixed Identity Verification**
   - Changed `intercom_user_jwt` to `user_hash`
   - Correct property name per Intercom docs

3. **Removed Visibility Restrictions**
   - No homepage-only logic
   - No 5-second delay
   - Widget appears immediately on all pages

4. **Improved Logging**
   - Added debug logs in development mode
   - Better error messages for troubleshooting

## Testing

### Quick Test

1. Visit https://dobeu.net
2. Look for Intercom widget in bottom-right corner
3. Widget should appear within 2 seconds
4. Click widget to open chat

### Comprehensive Testing

Run through this checklist:

- [ ] **Homepage**: Widget visible at https://dobeu.net
- [ ] **Services Page**: Widget visible at https://dobeu.net/services
- [ ] **Contact Page**: Widget visible at https://dobeu.net/contact
- [ ] **About Page**: Widget visible at https://dobeu.net/about
- [ ] **Admin Pages**: Widget visible for authenticated users
- [ ] **Anonymous Users**: Widget works without login
- [ ] **Authenticated Users**: Widget shows user identity
- [ ] **Widget Interaction**: Can open, close, and minimize
- [ ] **No Console Errors**: Check browser console for errors
- [ ] **Performance**: Page loads within 3 seconds

### Debugging

If widget still doesn't appear:

1. **Check Browser Console**:

   ```javascript
   // Should return 'function'
   console.log(typeof Intercom);

   // Should return visitor ID
   Intercom("getVisitorId");
   ```

2. **Check Network Tab**:
   - Look for requests to `widget.intercom.io`
   - Look for requests to `api-iam.intercom.io`
   - Verify no 404 or CORS errors

3. **Verify Configuration**:
   - App ID: `xu0gfiqb`
   - API Base: `https://api-iam.intercom.io`
   - Check Intercom dashboard settings

4. **Check CSP Headers**:
   - Verify Content Security Policy allows Intercom
   - Already configured in `vite.config.ts`

5. **Test JWT Function**:
   ```bash
   # For authenticated users
   curl -X POST https://[project].supabase.co/functions/v1/intercom-jwt \
     -H "Authorization: Bearer [token]"
   ```

## Deployment

### Prerequisites

- [ ] Code changes reviewed
- [ ] ADR-001 approved
- [ ] Testing completed
- [ ] No breaking changes

### Deploy Steps

1. **Build and Test Locally**:

   ```bash
   npm run build
   npm run preview
   ```

2. **Deploy to Production**:

   ```bash
   ./scripts/deploy-production.sh
   ```

3. **Verify Deployment**:
   - Visit https://dobeu.net
   - Check widget appears
   - Test functionality

### Rollback Plan

If issues occur:

1. **Quick Rollback**:

   ```bash
   git revert [commit-hash]
   ./scripts/deploy-production.sh
   ```

2. **Temporary Fix**:
   - Set `hide_default_launcher: true` in code
   - Deploy immediately

3. **Dashboard Fix**:
   - Disable messenger in Intercom dashboard
   - No code deployment needed

## Expected Behavior

### Before Fix

- ❌ Widget only on homepage
- ❌ 5-second delay
- ❌ Not visible on other pages
- ❌ Poor discoverability

### After Fix

- ✅ Widget on all pages
- ✅ Appears immediately
- ✅ Visible by default
- ✅ Easy to discover

## Impact

### Positive

- **Better Support Access**: Users can get help from any page
- **Increased Engagement**: More opportunities for interaction
- **Consistent UX**: Predictable behavior across site
- **Standard Implementation**: Follows Intercom best practices

### Considerations

- **Visual Presence**: Widget always visible (can be minimized by users)
- **Load Time**: Minimal impact (~50KB additional load)
- **User Preference**: Some users may find it intrusive

### Metrics to Monitor

1. **Widget Engagement**:
   - Number of conversations started
   - Pages where conversations initiated
   - Time to first message

2. **User Feedback**:
   - Support tickets about widget
   - User comments on visibility
   - Satisfaction scores

3. **Performance**:
   - Page load time impact
   - Widget load time
   - Error rates

## Documentation

- **ADR**: `docs/adr/001-fix-intercom-chat-widget-visibility.md`
- **Implementation**: `src/components/Analytics.tsx`
- **Edge Function**: `supabase/functions/intercom-jwt/index.ts`
- **Configuration**: `vite.config.ts` (CSP headers)

## References

- [Intercom JavaScript API](https://developers.intercom.com/installing-intercom/docs/intercom-javascript)
- [Identity Verification](https://developers.intercom.com/installing-intercom/docs/enable-identity-verification-on-your-web-product)
- [Messenger SDK](https://www.npmjs.com/package/@intercom/messenger-js-sdk)

## Support

### Common Issues

**Issue**: Widget still not visible  
**Solution**: Check browser console for errors, verify Intercom app ID

**Issue**: JWT authentication fails  
**Solution**: Verify `INTERCOM_IDENTITY_VERIFICATION_SECRET` in Supabase

**Issue**: CSP errors in console  
**Solution**: Verify `vite.config.ts` includes Intercom domains

**Issue**: Widget appears but doesn't work  
**Solution**: Check Intercom dashboard for app status

### Getting Help

1. Check browser console for errors
2. Review ADR-001 for detailed context
3. Test with Intercom's debugging tools
4. Contact Intercom support if needed

## Next Steps

1. **Deploy to Production**: Use deployment script
2. **Monitor Engagement**: Track widget usage
3. **Collect Feedback**: Ask users about experience
4. **Optimize**: Adjust based on data
5. **Document Learnings**: Update ADR with findings

---

**Status**: Ready for Deployment  
**Priority**: High  
**Estimated Impact**: Immediate improvement in support accessibility  
**Risk Level**: Low (easy rollback available)
