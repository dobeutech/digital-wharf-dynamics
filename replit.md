# DOBEU Digital Product Agency Website

## Overview
A React + TypeScript + Vite website for DOBEU, a digital product agency. The site showcases services, pricing, and allows users to contact the team and manage projects.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite 7
- **Styling**: Tailwind CSS 3.4, shadcn/ui components
- **State Management**: TanStack Query, React Context
- **Forms**: react-hook-form with zod validation
- **Backend**: Supabase (auth, database), Netlify Functions
- **Analytics**: PostHog, Mixpanel
- **Third-party**: Stripe (payments), Twilio (SMS), Intercom (chat), Typeform (forms)

## Project Structure
```
src/
  components/     # Reusable UI components
  pages/          # Route pages
  contexts/       # React context providers
  hooks/          # Custom React hooks
  lib/            # Utility functions
  config/         # Configuration files
  integrations/   # Third-party integrations
netlify/functions/  # Serverless API functions
supabase/          # Database migrations and edge functions
public/            # Static assets
```

## Development
- Run: `npm run dev` (Vite dev server on port 5000)
- Build: `npm run build`
- Test: `npm run test`

## Deployment
- Target: Static deployment
- Build command: `npm run build`
- Output directory: `dist`

## Recent Changes
- December 28, 2025: Fixed CSP for third-party analytics
  - Updated Content Security Policy to allow Intercom (js.intercomcdn.com, widget.intercom.io, api-iam.intercom.io, intercomassets.com)
  - Added Google Analytics and Mixpanel API domains to CSP
  - Fixed protocol-relative URLs in index.html for Mixpanel and Typeform to use HTTPS
  - Added ws/wss protocols for WebSocket connections in development mode
- December 28, 2025: Configured for Replit environment
  - Updated Vite to run on port 5000 with allowed hosts for proxy
  - Set up static deployment configuration
