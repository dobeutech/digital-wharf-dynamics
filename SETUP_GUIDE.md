# Setup Guide

Follow these steps to complete the setup after the comprehensive enhancements.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all new testing and development dependencies including:

- Vitest (unit testing)
- Playwright (E2E testing)
- Testing Library (React testing utilities)

## Step 2: Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Frontend (Vite) - Auth0 (required once migration is complete)
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_spa_client_id
VITE_AUTH0_AUDIENCE=https://api.dobeu.netlify.app

# Backend (Netlify Functions) - Auth0 verification (required)
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.dobeu.netlify.app

# Backend (Netlify Functions) - MongoDB (required)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB_NAME=app
GRIDFS_BUCKET=files

# Optional: Supabase Realtime (optional integration only)
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

# Optional: Sentry (for error tracking)
# VITE_SENTRY_DSN=your-sentry-dsn-here

# Optional: Backup Secret Token (for backup automation)
# BACKUP_SECRET_TOKEN=your-secret-token-here
```

**Important:** Never commit the `.env` file to version control.

## Step 3: Database Migrations

Apply the new database migrations for rate limiting and backups:

```bash
# If using Supabase CLI locally
supabase migration up

# Or apply via Supabase Dashboard:
# 1. Go to Database > Migrations
# 2. Apply migrations:
#    - 20251204000000_rate_limits_table.sql
#    - 20251204000001_database_backups_table.sql
```

### Migration Details

**Rate Limits Table:**

- Creates `rate_limits` table for persistent rate limiting
- Enables RLS (Row Level Security)
- Sets up automatic cleanup function

**Database Backups Table:**

- Creates `database_backups` table for storing backup records
- Enables RLS
- Sets up size calculation triggers

## Step 4: Configure Supabase Edge Functions

If you still use Supabase Edge Functions (legacy), update `supabase/config.toml` to include the new functions:

```toml
[functions.backup-database]
verify_jwt = true

[functions.rate-limiter]
verify_jwt = false  # Internal function, called by other functions
```

## Step 5: Set Up Edge Function Secrets

Configure secrets for edge functions in Supabase Dashboard:

1. Go to **Edge Functions** > **Secrets**
2. Add the following secrets:
   - `BACKUP_SECRET_TOKEN` - Secret token for backup function authentication
   - `RESEND_API_KEY` - Already configured for email functions

## Step 6: Test the Setup

### Run Unit Tests

```bash
npm run test
```

### Run E2E Tests

```bash
# First time setup - install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Run Linting

```bash
npm run lint
```

### Build the Application

```bash
npm run build
```

## Step 7: Verify Security Headers

After deployment, verify security headers are working:

1. Visit your production site
2. Open browser DevTools > Network tab
3. Check response headers for:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `Content-Security-Policy`
   - `Strict-Transport-Security`

## Step 8: Set Up Monitoring (Optional but Recommended)

Follow the guide in `docs/monitoring-setup.md` to:

- Set up Sentry for error tracking
- Configure uptime monitoring
- Set up performance monitoring

## Step 9: Configure Automated Backups

### Option 1: Supabase Cron (Recommended)

If you have pg_cron extension enabled:

```sql
SELECT cron.schedule(
  'daily-backup',
  '0 2 * * *',  -- 2 AM UTC daily
  $$SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/backup-database',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('trigger', 'scheduled')
  )$$
);
```

### Option 2: External Scheduler

Use a service like:

- **GitHub Actions** (scheduled workflow)
- **Cron job** on your server
- **Cloud Scheduler** (GCP/AWS)

Example GitHub Actions workflow (`.github/workflows/backup.yml`):

```yaml
name: Daily Backup

on:
  schedule:
    - cron: "0 2 * * *" # 2 AM UTC daily
  workflow_dispatch: # Allow manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Backup
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.BACKUP_SECRET_TOKEN }}" \
            https://your-project.supabase.co/functions/v1/backup-database
```

## Step 10: Verify Everything Works

### Test Checklist

- [ ] Application builds successfully
- [ ] All tests pass
- [ ] Environment variables are loaded correctly
- [ ] Database migrations applied
- [ ] Edge functions deploy successfully
- [ ] Security headers present in production
- [ ] PWA manifest loads correctly
- [ ] Service worker registers
- [ ] Error boundaries catch errors
- [ ] Rate limiting works (test with multiple rapid requests)
- [ ] Health checks return success

## Troubleshooting

### Environment Variables Not Loading

- Ensure `.env` file exists in root directory
- Check variable names start with `VITE_` for client-side access
- Restart dev server after adding new variables

### Database Migration Errors

- Check Supabase connection
- Verify you have necessary permissions
- Review migration SQL for syntax errors
- Check if tables already exist (may need to drop first)

### Edge Function Deployment Issues

- Verify `supabase/config.toml` is correct
- Check function code for syntax errors
- Ensure secrets are configured
- Review function logs in Supabase Dashboard

### Test Failures

- Run `npm install` to ensure all dependencies are installed
- Check that test environment variables are set
- Verify Playwright browsers are installed: `npx playwright install`

## Next Steps

1. **Review Implementation Summary**: See `IMPLEMENTATION_SUMMARY.md` for all changes
2. **Set Up Monitoring**: Follow `docs/monitoring-setup.md`
3. **Review Disaster Recovery**: See `docs/disaster-recovery.md`
4. **Deploy to Production**: Push to main branch (CI/CD will handle deployment)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error logs in browser console and Supabase Dashboard
3. Verify all environment variables are set correctly
4. Ensure database migrations are applied
