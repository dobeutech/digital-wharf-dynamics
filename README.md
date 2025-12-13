# DOBEU - Digital Wharf Dynamics

## Project Overview

DOBEU is a comprehensive web application for digital transformation services, built with modern technologies and best practices.

## How can I edit this code?

**Use your preferred IDE**

You can work locally using your own IDE. Clone this repo and push changes to deploy.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Database)
- Vitest (Unit Testing)
- Playwright (E2E Testing)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if it exists)
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
     ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Run tests:**
   ```bash
   npm run test          # Unit tests
   npm run test:e2e      # E2E tests
   ```

## Comprehensive Enhancements

This project includes comprehensive enhancements for:
- ✅ Security (Headers, CSP, CSRF protection)
- ✅ Error handling and resilience
- ✅ Performance optimizations
- ✅ PWA support
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Accessibility (WCAG 2.1 AA) - User-configurable accessibility settings
- ✅ Testing infrastructure
- ✅ CI/CD pipelines
- ✅ Monitoring and alerting setup

See `IMPLEMENTATION_SUMMARY.md` for complete details.

## Admin Portal Setup

The admin portal is accessible at `/admin` for authorized users.

### Creating an Admin User

1. **Register a new account** at `/auth`
2. **Grant admin role** using Supabase SQL Editor:
   ```sql
   -- Replace 'user@email.com' with the actual user email
   UPDATE profiles 
   SET roles = array_append(roles, 'admin')
   WHERE email = 'user@email.com';
   ```
   
   Or via the Supabase Dashboard:
   - Go to **Table Editor** > **profiles**
   - Find the user by email
   - Edit the `roles` column to include `admin`

3. **Admin Features**:
   - `/admin` - Dashboard overview
   - `/admin/services` - Manage service catalog
   - `/admin/projects` - View all client projects
   - `/admin/users` - User management & role assignment
   - `/admin/newsletter` - Newsletter management
   - `/admin/ccpa` - CCPA request handling
   - `/admin/contacts` - Contact form submissions
   - `/admin/audit-logs` - Activity audit trail
   - `/admin/analytics` - Site analytics dashboard

## Setup Guide

For detailed setup instructions, see `SETUP_GUIDE.md`.

## Documentation

- `SETUP_GUIDE.md` - Complete setup instructions
- `IMPLEMENTATION_SUMMARY.md` - All enhancements overview
- `docs/monitoring-setup.md` - Monitoring configuration
- `docs/disaster-recovery.md` - Disaster recovery procedures
- `docs/linear-workflow.md` - Linear project workflow and issue management

## How can I deploy this project?

This project is configured for deployment to Netlify. See `DEPLOYMENT_CHECKLIST.md` for deployment instructions.

## Custom Domain

The project is configured to work with custom domains. Update the domain configuration in your deployment platform settings.
