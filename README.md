# DOBEU Tech Solutions

<div align="center">

![DOBEU](https://img.shields.io/badge/DOBEU-Tech%20Solutions-FACC15?style=for-the-badge&labelColor=000000)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Auth0](https://img.shields.io/badge/Auth0-Auth-EB5424?style=flat-square&logo=auth0)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)
![Netlify](https://img.shields.io/badge/Netlify-Hosted-00C7B7?style=flat-square&logo=netlify)

**Transform Your Digital Vision**

[Live Site](https://dobeu.net) · [Brand Kit](https://dobeu.net/brand) · [Contact](https://dobeu.net/contact)

</div>

---

## Overview

DOBEU Tech Solutions is a premium digital services platform offering web development, software solutions, and strategic consulting. Built with modern technologies and designed for exceptional user experience.

### Brand Colors

| Color             | Hex       | Usage               |
| ----------------- | --------- | ------------------- |
| 🟡 Electric Lemon | `#FACC15` | Primary brand color |
| 🔵 Azure Tech     | `#3B82F6` | Technology accent   |
| 🟣 Deep Violet    | `#A855F7` | Premium accent      |
| 💖 Neon Rose      | `#EC4899` | Highlight accent    |
| ⬛ Void Black     | `#000000` | Dark backgrounds    |
| ⬜ Stark White    | `#FFFFFF` | Light backgrounds   |

## Tech Stack

| Category      | Technologies                    |
| ------------- | ------------------------------- |
| **Frontend**  | React 18, TypeScript 5, Vite    |
| **Styling**   | Tailwind CSS, Shadcn/ui         |
| **Animation** | Framer Motion                   |
| **Backend**   | Netlify Functions (Node)        |
| **Auth**      | Auth0 (SPA + JWT)               |
| **Database**  | Supabase (PostgreSQL)           |
| **Files**     | Supabase Storage                |
| **Hosting**   | Netlify (Edge, CDN, Functions)  |
| **Testing**   | Vitest (Unit), Playwright (E2E) |
| **Analytics** | Google Analytics, Mixpanel      |

## Quick Start

### Prerequisites

- Node.js 20+ ([install with nvm](https://github.com/nvm-sh/nvm))
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/dobeu-web.git
cd dobeu-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

```env
# Frontend (Vite) - Auth0
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_auth0_spa_client_id
VITE_AUTH0_AUDIENCE=https://api.dobeu.netlify.app

# Backend (Netlify Functions)
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://api.dobeu.netlify.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio SMS Verification
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend Supabase (optional for realtime features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Third-Party Integrations

### Intercom Chat Widget

The Intercom chat widget is integrated for customer support. If the widget is not appearing, follow these steps:

#### Installation

1. **Install the Intercom SDK package:**

   ```bash
   npm install @intercom/messenger-js-sdk
   ```

2. **Import and initialize in your component:**

   ```typescript
   import Intercom from "@intercom/messenger-js-sdk";

   // Initialize Intercom
   Intercom({
     app_id: "xu0gfiqb",
   });
   ```

#### Common Issues and Fixes

**Issue: Intercom widget not appearing**

1. **Verify the package is installed:**

   ```bash
   npm list @intercom/messenger-js-sdk
   ```

   If not installed, run: `npm install @intercom/messenger-js-sdk`

2. **Check the implementation:**
   - Ensure you're importing from `@intercom/messenger-js-sdk` (not the old script tag method)
   - Verify the `app_id` is correct: `xu0gfiqb`
   - Make sure Intercom is initialized in a component that mounts on page load (e.g., `Analytics.tsx`)

3. **Verify Content Security Policy:**
   - Check `netlify.toml` includes Intercom domains in CSP:
     - `script-src`: `https://*.intercom.io`
     - `connect-src`: `https://*.intercom.io wss://*.intercom.io`
     - `frame-src`: `https://*.intercom.io`

4. **Check browser console:**
   - Look for any errors related to Intercom
   - Verify the widget is not blocked by ad blockers

5. **Clear cache and rebuild:**
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

**Current Implementation Location:**

- File: `src/components/Analytics.tsx`
- The Intercom initialization happens automatically when the Analytics component mounts
- User data is updated when a user logs in

### Twilio SMS Verification

Twilio SMS verification is integrated to verify phone numbers for new OAuth users. When a user creates an account via OAuth (Google, etc.), they are required to verify their phone number before accessing protected features.

#### Setup

1. **Install Twilio SDK:**

   ```bash
   npm install twilio
   ```

2. **Configure Environment Variables:**

   Add these to your Netlify environment variables:

   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio phone number
   ```

3. **Get Twilio Credentials:**
   - Sign up at [Twilio](https://www.twilio.com/)
   - Get your Account SID and Auth Token from the Twilio Console
   - Purchase a phone number or use a trial number for testing

#### How It Works

1. **New User Flow:**
   - User signs up via OAuth (Google, etc.)
   - After successful authentication, the system checks if phone is verified
   - If not verified, user is redirected to `/verify-phone`
   - User enters phone number and receives SMS code
   - User enters 6-digit code to verify
   - Once verified, user can access all features

2. **Verification Functions:**
   - `/.netlify/functions/send-sms-verification` - Sends SMS verification code
   - `/.netlify/functions/verify-sms-code` - Verifies the SMS code
   - `/.netlify/functions/check-phone-verification` - Checks verification status

3. **Database Schema:**
   The `profiles` table in Supabase includes:

   ```typescript
   {
     auth_user_id: string; // Auth0 user ID
     phone: string; // Normalized phone number (10 digits)
     phone_verified: boolean; // Verification status
     phone_verified_at: string; // ISO timestamp
     username: string;
     created_at: string;
     updated_at: string;
   }
   ```

4. **SMS Verification Codes:**
   Codes are stored in `sms_verification_codes` collection:
   - 6-digit numeric codes
   - 10-minute expiration
   - Maximum 5 verification attempts
   - Rate limiting: 1 code per 10 minutes per user

#### Implementation Details

**Files:**

- `netlify/functions/send-sms-verification.ts` - Sends SMS code
- `netlify/functions/verify-sms-code.ts` - Verifies SMS code
- `netlify/functions/check-phone-verification.ts` - Checks status
- `src/pages/VerifyPhone.tsx` - Phone verification UI
- `src/contexts/AuthContext.tsx` - Auto-redirects to verification if needed

**Phone Number Format:**

- Accepts US phone numbers only
- Automatically normalizes to 10 digits
- Formats as `+1XXXXXXXXXX` for Twilio

**Security Features:**

- Rate limiting on code requests
- Code expiration (10 minutes)
- Maximum attempt limits (5 attempts)
- One-time use codes
- Authentication required for all endpoints

#### Troubleshooting

**Issue: SMS codes not being sent**

1. **Verify Twilio credentials:**

   ```bash
   # Check environment variables in Netlify
   netlify env:list
   ```

2. **Check Twilio account:**
   - Ensure account is active
   - Verify phone number is purchased/verified
   - Check account balance (if using pay-as-you-go)

3. **Check function logs:**
   - View Netlify function logs in dashboard
   - Look for Twilio API errors

**Issue: Codes not verifying**

1. **Check code expiration:**
   - Codes expire after 10 minutes
   - Request a new code if expired

2. **Verify attempt limits:**
   - Maximum 5 attempts per code
   - Request new code if limit reached

3. **Check phone number format:**
   - Must be valid US phone number
   - Should be 10 digits (area code + number)

### Netlify CLI and Auth0 Setup

The Netlify CLI must be properly linked to your Auth0 tenant for authentication to work correctly.

#### Verify Netlify CLI Link

1. **Check if Netlify CLI is linked:**

   ```bash
   netlify status
   ```

2. **Link to the project (if not already linked):**

   ```bash
   netlify link --id=dfeefdc2-92aa-4415-baf6-42e60dfa6328
   ```

3. **Verify Auth0 Integration in Netlify Dashboard:**
   - Go to [Netlify Dashboard](https://app.netlify.com/sites/dobeu-net/overview)
   - Navigate to **Site settings** → **Identity** → **Auth0**
   - Ensure Auth0 is enabled and properly configured
   - Verify the tenant domain matches your `VITE_AUTH0_DOMAIN` environment variable

4. **Verify Environment Variables:**
   - In Netlify Dashboard: **Site settings** → **Environment variables**
   - Ensure these are set for production:
     - `VITE_AUTH0_DOMAIN` (e.g., `your-tenant.us.auth0.com`)
     - `VITE_AUTH0_CLIENT_ID` (your Auth0 SPA client ID)
     - `VITE_AUTH0_AUDIENCE` (e.g., `https://api.dobeu.netlify.app`)
     - `AUTH0_DOMAIN` (same as VITE_AUTH0_DOMAIN)
     - `AUTH0_AUDIENCE` (same as VITE_AUTH0_AUDIENCE)

5. **Test Authentication:**
   - Visit https://dobeu.net/auth
   - Verify login/logout functionality works
   - Check browser console for any Auth0-related errors

**Note:** If Auth0 is already linked on the dashboard for the tenant, the Netlify CLI should automatically use those settings when deployed.

## Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint               |
| `npm run test`     | Run unit tests           |
| `npm run test:e2e` | Run E2E tests            |

## Features

### Core Features

- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Multi-language Support** - English, Spanish, French
- ✅ **Theme System** - Light, dark, and system modes
- ✅ **Accessibility** - WCAG 2.1 AA compliant with user-configurable settings
- ✅ **SEO Optimized** - Meta tags, sitemap, structured data
- ✅ **PWA Ready** - Offline support and installable

### Security

- ✅ CSRF protection
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ Secure authentication with Auth0

### Performance

- ✅ Code splitting and lazy loading
- ✅ Image optimization
- ✅ CDN caching via Netlify
- ✅ Lighthouse score 90+

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── brand/        # Brand kit components
│   ├── home/         # Homepage sections
│   ├── layout/       # Layout components
│   ├── navigation/   # Navigation components
│   ├── seo/          # SEO components
│   └── ui/           # Shadcn/ui components
├── config/           # App configuration
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── integrations/     # External integrations
├── lib/              # Utility libraries
├── pages/            # Page components
│   └── admin/        # Admin portal pages
└── __tests__/        # Test files
```

## Admin Portal

Access the admin portal at `/admin` with admin credentials.

### Creating an Admin User

1. Ensure the user can log in via Auth0.
2. Assign the Auth0 RBAC permission `admin:access` (or the configured equivalent) to the user.

### Admin Features

| Route               | Feature                    |
| ------------------- | -------------------------- |
| `/admin`            | Dashboard overview         |
| `/admin/services`   | Service catalog management |
| `/admin/projects`   | Client projects            |
| `/admin/users`      | User management            |
| `/admin/newsletter` | Newsletter management      |
| `/admin/ccpa`       | CCPA request handling      |
| `/admin/contacts`   | Contact submissions        |
| `/admin/audit-logs` | Activity audit trail       |
| `/admin/analytics`  | Site analytics             |

## Internationalization

The site supports three languages:

- 🇺🇸 English (default)
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)

User language preference is stored in:

- Browser localStorage
- URL parameter (`?lang=es`)
- Database (for logged-in users)

Backend data is always stored in English for consistency.

## Deployment

### Netlify (Production)

The site is deployed automatically on push to `main`:

1. Push to `main` branch
2. Netlify builds and deploys automatically
3. Live at [https://dobeu.net](https://dobeu.net)

### Manual Deployment

```bash
npm run build
npx netlify deploy --prod
```

## Documentation

| Document                                                 | Description              |
| -------------------------------------------------------- | ------------------------ |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)     | Pre-deployment checklist |
| [docs/monitoring-setup.md](./docs/monitoring-setup.md)   | Monitoring configuration |
| [docs/disaster-recovery.md](./docs/disaster-recovery.md) | DR procedures            |

## Contributing

1. Create a feature branch from `dev`
2. Make your changes
3. Run linting and tests
4. Submit a pull request to `dev`

## License

© 2024 Dobeu Tech Solutions. All rights reserved.

---

<div align="center">

**Built with ❤️ by [DOBEU](https://dobeu.net)**

[Website](https://dobeu.net) · [Contra](https://contra.com/jeremy_williams_fx413nca) · [Behance](https://www.behance.net/jeremywilliams62)

</div>
