# Environment Variables Setup

This document provides the environment variables that need to be configured for the application to work correctly.

## Frontend Environment Variables (.env file)

Create a `.env` file in the root directory with the following variables:

```env
# Auth0 Configuration (Required)
VITE_AUTH0_DOMAIN=dobeucloud.us.auth0.com
VITE_AUTH0_CLIENT_ID=wVznWnd4ptC3wqryzHgO9dFOG5IjX7sr
VITE_AUTH0_AUDIENCE=https://api.dobeu.netlify.app

# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://brqpsnqronirmfegjiet.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycXBzbnFyb25pcm1mZWdqaWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MjgwNTMsImV4cCI6MjA4MTIwNDA1M30.mnlWkS-GfZsDYp3Q4AwEHdktR_UjiNERN_QuR6j6FcI
```

**Important:** 
- The `.env` file is already in `.gitignore` and will not be committed to version control
- Restart the dev server after creating/updating the `.env` file
- Remove any trailing spaces from the URLs

## Backend Environment Variables (Netlify Dashboard)

Set these in Netlify Dashboard > Site Settings > Environment Variables:

```env
# Auth0 Configuration (Required for JWT verification)
AUTH0_DOMAIN=dobeucloud.us.auth0.com
AUTH0_AUDIENCE=https://api.dobeu.netlify.app
AUTH0_CLIENT_SECRET=8wCo-V3Boc3FXorq5XH-e3GGFDgliDO0-khrauhOIYsNq_EJBAm8gDZTAhj1qkWs

# Supabase Configuration (Required for serverless functions)
SUPABASE_URL=https://brqpsnqronirmfegjiet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<obtain-from-supabase-dashboard>
```

### How to Get Supabase Service Role Key

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `brqpsnqronirmfegjiet`
3. Go to **Settings** > **API**
4. Copy the `service_role` key (NOT the `anon` key)
5. Add it to Netlify environment variables as `SUPABASE_SERVICE_ROLE_KEY`

**Security Note:** The service role key has admin privileges. Never expose it in client-side code or commit it to version control.

## Verification

After setting up environment variables:

1. **Frontend**: Start dev server with `npm run dev` and check browser console for warnings
2. **Auth0**: Try logging in - should redirect to Auth0 Universal Login
3. **Supabase**: Newsletter signup should work and create records in `newsletter_subscribers` table
4. **Backend**: Check Netlify function logs for any environment variable errors

## Troubleshooting

### "Auth is not configured" error
- Check that `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` are set in `.env`
- Restart dev server after adding variables

### Newsletter signup fails
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in Netlify
- Verify the `newsletter_subscribers` table exists in Supabase
- Check Netlify function logs for detailed error messages

### Supabase connection errors
- Verify the Supabase URL is correct (no trailing spaces)
- Check that the service role key is the correct one from Supabase dashboard
- Ensure RLS policies allow the operations needed
