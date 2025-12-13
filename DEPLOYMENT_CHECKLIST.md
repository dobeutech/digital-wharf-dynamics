# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Environment Setup
- [ ] `.env` file created with all required variables
- [ ] Environment variables validated (`npm run test:env`)
- [ ] All secrets configured in deployment platform
- [ ] Backup secret token generated and stored securely

### Database
- [ ] Database migrations applied (`scripts/apply-migrations.sql`)
- [ ] Rate limits table created and verified
- [ ] Database backups table created and verified
- [ ] RLS policies verified
- [ ] Test database connection

### Edge Functions
- [ ] `backup-database` function deployed
- [ ] `rate-limiter` function deployed
- [ ] Edge function secrets configured:
  - [ ] `BACKUP_SECRET_TOKEN`
  - [ ] `RESEND_API_KEY` (if using email)
- [ ] Edge functions tested

### Code Quality
- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] Setup verification passes (`npm run verify`)

## Deployment

### Build & Deploy
- [ ] Application builds successfully
- [ ] All assets generated correctly
- [ ] Code splitting working (check chunk files)
- [ ] Deployed to production environment
- [ ] Environment variables loaded in production

### Post-Deployment Verification

#### Security
- [ ] Security headers present (check Network tab):
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `Content-Security-Policy` header
  - [ ] `Strict-Transport-Security` (if HTTPS)
- [ ] CSP not blocking legitimate resources
- [ ] No console errors related to security

#### Functionality
- [ ] Application loads without errors
- [ ] Authentication works (sign in/up)
- [ ] Protected routes redirect correctly
- [ ] Admin routes require admin access
- [ ] Error boundaries catch errors gracefully
- [ ] Service worker registers (check console)
- [ ] PWA manifest loads (`/manifest.json`)

#### Performance
- [ ] Initial load time acceptable
- [ ] Code splitting working (check Network tab)
- [ ] Images lazy load correctly
- [ ] No performance warnings in console
- [ ] Lighthouse score acceptable

#### Responsive Design
- [ ] Mobile layout works (test on device or DevTools)
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch targets are adequate (min 44x44px)
- [ ] Navigation works on all screen sizes

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader tested (optional but recommended)
- [ ] ARIA labels present
- [ ] Color contrast sufficient

#### Testing
- [ ] Critical user flows tested:
  - [ ] Sign up / Sign in
  - [ ] View services
  - [ ] Contact form submission
  - [ ] Admin dashboard access
- [ ] Error scenarios tested:
  - [ ] Network errors
  - [ ] Invalid input
  - [ ] Unauthorized access

## Monitoring Setup

### Error Tracking
- [ ] Sentry configured (if using)
- [ ] Error tracking working
- [ ] Alerts configured for critical errors

### Analytics
- [ ] Mixpanel tracking working
- [ ] PostHog tracking working
- [ ] Google Analytics working (if configured)
- [ ] Events firing correctly

### Uptime Monitoring
- [ ] Uptime monitor configured
- [ ] Alert channels set up (email/Slack)
- [ ] Health check endpoint working

## Backup & Recovery

### Automated Backups
- [ ] Backup function deployed
- [ ] Backup schedule configured (GitHub Actions or cron)
- [ ] Backup secret token configured
- [ ] Test backup manually
- [ ] Verify backup data integrity

### Recovery Testing
- [ ] Know how to restore from backup
- [ ] Recovery procedures documented
- [ ] Recovery time tested (optional)

## Documentation

- [ ] README.md updated
- [ ] Deployment procedures documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Team notified of deployment

## Rollback Plan

- [ ] Previous version tagged in Git
- [ ] Rollback procedure documented
- [ ] Database rollback plan (if migrations applied)
- [ ] Know how to revert edge functions

## Post-Deployment

### Monitoring (First 24 Hours)
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Monitor server resources
- [ ] Check backup execution

### Communication
- [ ] Deployment announcement (if needed)
- [ ] Team notified of new features
- [ ] Known issues documented

## Emergency Contacts

- **Primary Contact**: [Your Name/Email]
- **Backup Contact**: [Backup Name/Email]
- **Infrastructure**: [Infrastructure Team Contact]

## Notes

- Deployment Date: ___________
- Deployed By: ___________
- Version: ___________
- Issues Encountered: ___________
- Resolution: ___________

---

**Remember**: Always test in staging first if available!

