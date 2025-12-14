# Ona Agent Guide for Digital Wharf Dynamics

This guide helps developers work effectively with Ona agents in this React + TypeScript + Vite + Supabase project.

## Table of Contents

- [Quick Start](#quick-start)
- [Project Context](#project-context)
- [Common Tasks](#common-tasks)
- [Development Workflows](#development-workflows)
- [Testing with Agents](#testing-with-agents)
- [Database Operations](#database-operations)
- [Deployment Tasks](#deployment-tasks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Quick Start

### First Time Setup

When starting work on this project, ask Ona:

```
Review the project structure and help me set up my development environment.
Check if all dependencies are installed and environment variables are configured.
```

### Daily Development Start

```
Check git status and show me what branch I'm on.
Run the development server and show me any errors.
```

### Before Committing

```
Run linting and tests to verify my changes.
Review git diff and help me write a commit message.
```

---

## Project Context

### Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript 5, Vite 7 |
| **UI Framework** | Tailwind CSS, Radix UI, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **State Management** | React Query (TanStack Query) |
| **Testing** | Vitest (unit), Playwright (E2E) |
| **Deployment** | Netlify (CDN, Edge Functions) |
| **Analytics** | PostHog, Mixpanel |

### Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── brand/        # Brand kit components
│   ├── home/         # Homepage sections
│   ├── layout/       # Layout components
│   ├── navigation/   # Navigation components
│   ├── seo/          # SEO components
│   └── ui/           # shadcn/ui components
├── config/           # App configuration
├── contexts/         # React contexts
├── hooks/            # Custom hooks
├── integrations/     # External integrations (Supabase, analytics)
├── lib/              # Utility libraries
├── pages/            # Page components
│   └── admin/        # Admin portal pages
└── __tests__/        # Test files

supabase/
├── migrations/       # Database migrations
├── functions/        # Edge functions
└── config.toml       # Supabase configuration

scripts/
├── verify-setup.js   # Setup verification
├── test-env-validation.js  # Environment validation
└── deploy-checklist.js     # Pre-deployment checks
```

### Key Files

- `vite.config.ts` - Vite configuration with path aliases (`@/`)
- `tailwind.config.ts` - Tailwind configuration with custom theme
- `components.json` - shadcn/ui configuration
- `netlify.toml` - Netlify deployment configuration
- `supabase/config.toml` - Supabase project configuration

---

## Common Tasks

### 1. Creating New Components

**Ask Ona:**

```
Create a new React component called [ComponentName] in src/components/[category]/.
It should use TypeScript, Tailwind CSS, and follow the existing component patterns.
Include proper types and exports.
```

**Example:**

```
Create a new ServiceCard component in src/components/home/.
It should accept title, description, icon, and link props.
Use Tailwind for styling and match the existing design system.
```

### 2. Adding New Pages

**Ask Ona:**

```
Create a new page component for [PageName] in src/pages/.
Set up routing in App.tsx and add navigation links.
Include SEO metadata using the SEO component.
```

**Example:**

```
Create a new /pricing page with a PricingPage component.
Add it to the router and include a link in the main navigation.
Use the PageSEO component for meta tags.
```

### 3. Working with Supabase

**Ask Ona:**

```
Show me how to query the [table_name] table using Supabase client.
Create a custom hook for fetching [data_type] with React Query.
```

**Example:**

```
Create a useProjects hook that fetches all projects from the projects table.
Use React Query for caching and include loading/error states.
```

### 4. Adding Database Migrations

**Ask Ona:**

```
Create a new Supabase migration to [describe change].
Follow the existing migration naming convention.
Include RLS policies and necessary indexes.
```

**Example:**

```
Create a migration to add a 'featured' boolean column to the projects table.
Include an index on the featured column and update RLS policies.
```

### 5. Styling with Tailwind

**Ask Ona:**

```
Style this component using Tailwind CSS.
Match the existing design system with colors from tailwind.config.ts.
Ensure it's responsive for mobile, tablet, and desktop.
```

**Example:**

```
Style the ServiceCard component with:
- Electric Lemon (#FACC15) accent on hover
- Dark background with gradient
- Responsive grid layout
- Smooth transitions
```

### 6. Adding Tests

**Ask Ona:**

```
Create unit tests for [ComponentName] using Vitest and Testing Library.
Test all props, user interactions, and edge cases.
```

**Example:**

```
Create tests for the ContactForm component.
Test form validation, submission, error handling, and success states.
```

### 7. Fixing Bugs

**Ask Ona:**

```
I'm getting this error: [paste error message]
Help me debug and fix it.
```

**Example:**

```
I'm getting "Cannot read property 'map' of undefined" in ProjectList.
The data comes from Supabase. Help me add proper null checks and loading states.
```

---

## Development Workflows

### Starting Development

```bash
# Ask Ona to run these commands
npm run dev          # Start dev server on port 8080
npm run test         # Run tests in watch mode
npm run lint         # Check for linting errors
```

**Ona Command:**

```
Start the development server and run tests in watch mode.
Show me the preview URL where I can see the app.
```

### Code Quality Checks

**Ask Ona:**

```
Run all code quality checks:
1. TypeScript type checking
2. ESLint
3. Unit tests
4. Build verification
```

**Ona will execute:**

```bash
npx tsc --noEmit      # Type check
npm run lint          # Lint
npm run test:ci       # Run tests
npm run build         # Build
```

### Pre-Commit Workflow

**Ask Ona:**

```
I'm ready to commit my changes. Help me:
1. Review what changed (git diff)
2. Run linting and tests
3. Stage the relevant files
4. Write a good commit message following the project conventions
```

**Ona will:**
1. Show `git status` and `git diff`
2. Run `npm run lint` and `npm run test`
3. Help stage files with `git add`
4. Suggest a commit message based on `git log` style
5. Execute `git commit` with proper co-author

### Creating Pull Requests

**Ask Ona:**

```
I want to create a PR for [feature/fix description].
Help me:
1. Create a feature branch
2. Ensure I'm not on main
3. Push my changes
4. Generate a PR description
```

**Example:**

```
Create a PR for the new pricing page feature.
Branch name: feature/pricing-page
Include what changed and why in the description.
```

---

## Testing with Agents

### Unit Testing

**Ask Ona:**

```
Create unit tests for [component/function] using Vitest.
Include tests for:
- Happy path
- Error cases
- Edge cases
- User interactions
```

**Example Test Request:**

```
Create tests for src/hooks/useAuth.ts.
Test login, logout, session management, and error handling.
Mock the Supabase client.
```

### E2E Testing

**Ask Ona:**

```
Create an E2E test for the [user flow] using Playwright.
Test the complete flow from [start] to [end].
```

**Example:**

```
Create an E2E test for the contact form submission flow:
1. Navigate to /contact
2. Fill out the form
3. Submit
4. Verify success message
5. Check database for submission
```

### Running Tests

**Ask Ona:**

```
Run all tests and show me the results.
If any fail, help me debug them.
```

**Ona will execute:**

```bash
npm run test:ci       # Unit tests with coverage
npm run test:e2e      # E2E tests
```

---

## Database Operations

### Creating Tables

**Ask Ona:**

```
Create a new Supabase migration for a [table_name] table with:
- [column specifications]
- RLS policies for [access rules]
- Indexes on [columns]
- Foreign keys to [related tables]
```

**Example:**

```
Create a testimonials table with:
- id (uuid, primary key)
- author_name (text)
- author_role (text)
- content (text)
- rating (integer, 1-5)
- created_at (timestamp)
- is_featured (boolean)

Add RLS policies:
- Public can read featured testimonials
- Admins can manage all testimonials

Add index on is_featured and created_at.
```

### Modifying Tables

**Ask Ona:**

```
Create a migration to modify the [table_name] table:
- Add column [column_name] of type [type]
- Update existing data to [default value]
- Add constraint [constraint description]
```

### Querying Data

**Ask Ona:**

```
Show me how to query [data description] from Supabase.
Create a custom hook with React Query for caching.
Include TypeScript types.
```

**Example:**

```
Create a hook to fetch featured projects with their images.
Use React Query for caching with a 5-minute stale time.
Include proper TypeScript types for the project data.
```

---

## Deployment Tasks

### Pre-Deployment Checklist

**Ask Ona:**

```
Run the pre-deployment checklist:
1. Verify all tests pass
2. Check build succeeds
3. Verify environment variables
4. Check for console errors
5. Run the deploy checklist script
```

**Ona will execute:**

```bash
npm run test:ci
npm run build
node scripts/deploy-checklist.js
npm run verify
```

### Environment Variables

**Ask Ona:**

```
Help me set up environment variables for [environment].
Show me what variables are required and where to set them.
```

**Ona will reference:**
- `.env.example` for required variables
- `src/config/env.ts` for validation
- `netlify.toml` for Netlify-specific vars

### Deploying to Netlify

**Ask Ona:**

```
I'm ready to deploy to production.
Help me verify everything is ready and push to main.
```

**Ona will:**
1. Run pre-deployment checks
2. Verify branch is up to date
3. Confirm environment variables are set in Netlify
4. Help push to main (triggers auto-deploy)

### Database Migrations in Production

**Ask Ona:**

```
I need to apply database migrations to production.
Help me:
1. Review the migration SQL
2. Test in staging first
3. Apply to production safely
4. Verify the changes
```

---

## Troubleshooting

### Build Errors

**Ask Ona:**

```
My build is failing with this error: [paste error]
Help me fix it.
```

**Common Issues Ona Can Help With:**
- TypeScript type errors
- Missing dependencies
- Import path issues
- Environment variable problems
- Vite configuration issues

### Runtime Errors

**Ask Ona:**

```
I'm seeing this error in the browser console: [paste error]
Help me debug it.
```

**Ona will:**
1. Analyze the error message
2. Check relevant code files
3. Suggest fixes
4. Help implement the solution

### Supabase Connection Issues

**Ask Ona:**

```
I can't connect to Supabase. Help me debug:
1. Check environment variables
2. Verify Supabase client configuration
3. Test the connection
4. Check RLS policies
```

### Performance Issues

**Ask Ona:**

```
The [page/component] is slow. Help me:
1. Identify the bottleneck
2. Optimize the code
3. Add proper caching
4. Implement code splitting if needed
```

---

## Best Practices

### Working with Ona Effectively

#### 1. Be Specific

❌ **Vague:** "Fix the form"

✅ **Specific:** "The contact form in src/components/ContactForm.tsx isn't validating email addresses. Add Zod validation for email format."

#### 2. Provide Context

❌ **No Context:** "Add a button"

✅ **With Context:** "Add a 'Download PDF' button to the invoice page that generates a PDF using the existing invoice data. Style it to match the primary button style in the design system."

#### 3. Reference Existing Patterns

❌ **Generic:** "Create a new API call"

✅ **Pattern-Aware:** "Create a new Supabase query following the pattern in src/hooks/useProjects.ts. Query the services table and use React Query for caching."

#### 4. Break Down Complex Tasks

❌ **Too Large:** "Build the entire admin dashboard"

✅ **Broken Down:**
```
1. Create the admin layout component with sidebar navigation
2. Add the dashboard overview page with stats cards
3. Create the users management page with table and filters
4. Add the analytics page with charts
```

#### 5. Specify Testing Requirements

❌ **No Testing:** "Add a login form"

✅ **With Testing:** "Add a login form with email/password fields. Include unit tests for validation and E2E tests for the complete login flow."

### Code Quality Standards

When asking Ona to write code, expect:

- **TypeScript**: Proper types, no `any` unless necessary
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS classes, responsive design
- **Accessibility**: ARIA labels, keyboard navigation
- **Error Handling**: Try-catch blocks, error boundaries
- **Testing**: Unit tests for logic, E2E for flows
- **Documentation**: JSDoc comments for complex functions

### File Organization

When creating new files, Ona will follow:

```
src/
├── components/
│   └── [category]/
│       ├── ComponentName.tsx
│       └── __tests__/
│           └── ComponentName.test.tsx
├── hooks/
│   ├── useHookName.ts
│   └── __tests__/
│       └── useHookName.test.ts
├── lib/
│   ├── utility-name.ts
│   └── __tests__/
│       └── utility-name.test.ts
```

### Commit Message Format

Ona will help write commits following this format:

```
type(scope): brief description

Detailed explanation of what changed and why.

- Bullet points for key changes
- Reference issue numbers if applicable

Co-authored-by: Ona <no-reply@ona.com>
```

**Types:** feat, fix, refactor, docs, test, chore, style, perf

**Examples:**

```
feat(admin): add user management page

Add CRUD operations for user management in admin portal.
Includes table view, filters, and edit modal.

- Create UserManagement component
- Add useUsers hook with React Query
- Implement RLS policies for admin access

Co-authored-by: Ona <no-reply@ona.com>
```

```
fix(auth): handle session expiration gracefully

Redirect to login when session expires instead of showing error.
Add toast notification to inform user.

Co-authored-by: Ona <no-reply@ona.com>
```

---

## Advanced Workflows

### Refactoring with Ona

**Ask Ona:**

```
I want to refactor [component/module] to [improvement].
Help me:
1. Analyze the current code
2. Propose a refactoring approach
3. Implement the changes
4. Update tests
5. Verify nothing breaks
```

**Example:**

```
Refactor the authentication logic from components into a custom hook.
Extract useAuth hook with login, logout, and session management.
Update all components using auth to use the new hook.
Ensure all tests still pass.
```

### Performance Optimization

**Ask Ona:**

```
Optimize the performance of [page/component]:
1. Analyze current performance
2. Identify bottlenecks
3. Implement optimizations (memoization, lazy loading, etc.)
4. Measure improvements
```

### Adding New Features

**Complete Feature Request:**

```
Add a [feature name] feature:

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Technical approach:
- [Component structure]
- [Data flow]
- [API endpoints needed]

Design:
- [UI description]
- [Responsive behavior]
- [Accessibility requirements]

Testing:
- [Unit test scenarios]
- [E2E test flows]

Help me implement this step by step.
```

---

## Ona Environment Commands

### Gitpod CLI Commands

Ona can help with Gitpod-specific operations:

```bash
# Environment management
gitpod environment list
gitpod environment start
gitpod environment stop

# Port management
gitpod environment port list
gitpod environment port open 8080

# Dev container
gitpod environment devcontainer validate
```

**Ask Ona:**

```
Show me all running Gitpod environments.
Open port 8080 for the dev server.
Validate the dev container configuration.
```

### Preview Servers

Ona automatically uses `exec_preview` for development servers:

**Ask Ona:**

```
Start the development server and give me the preview URL.
```

**Ona will:**
1. Run `npm run dev` on port 8080
2. Create a preview server
3. Return the public URL

---

## Project-Specific Patterns

### Component Patterns

#### 1. Page Components

```typescript
// src/pages/PageName.tsx
import { PageSEO } from '@/components/seo/PageSEO';

export function PageName() {
  return (
    <>
      <PageSEO
        title="Page Title"
        description="Page description"
        path="/page-path"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Page content */}
      </div>
    </>
  );
}
```

#### 2. Data Fetching Hooks

```typescript
// src/hooks/useData.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useData() {
  return useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('table_name')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

#### 3. Form Components

```typescript
// src/components/forms/FormName.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  field: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

export function FormName() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Supabase Patterns

#### 1. RLS Policies

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access"
  ON table_name FOR SELECT
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert"
  ON table_name FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON table_name FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

#### 2. Edge Functions

```typescript
// supabase/functions/function-name/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Function logic

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## Quick Reference

### Common Commands

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Run tests | `npm run test` |
| Run E2E tests | `npm run test:e2e` |
| Lint code | `npm run lint` |
| Fix lint issues | `npm run lint:fix` |
| Type check | `npx tsc --noEmit` |
| Build for production | `npm run build` |
| Preview build | `npm run preview` |
| Verify setup | `npm run verify` |

### File Paths

| Type | Path |
|------|------|
| Components | `src/components/[category]/` |
| Pages | `src/pages/` |
| Hooks | `src/hooks/` |
| Utils | `src/lib/` |
| Config | `src/config/` |
| Tests | `src/__tests__/` or `[file]/__tests__/` |
| Migrations | `supabase/migrations/` |
| Edge Functions | `supabase/functions/` |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `VITE_POSTHOG_KEY` | PostHog analytics key |
| `VITE_POSTHOG_HOST` | PostHog API host |

### Useful Ona Prompts

```
# Setup
"Help me set up this project for the first time"
"Verify my development environment is configured correctly"

# Development
"Start the dev server and show me the preview URL"
"Create a new [component/page/hook] following project patterns"
"Add [feature] to [component]"

# Testing
"Create tests for [component/function]"
"Run all tests and help me fix any failures"
"Add E2E test for [user flow]"

# Database
"Create a migration to [change description]"
"Show me how to query [data] from Supabase"
"Add RLS policies for [access rules]"

# Debugging
"I'm getting this error: [error]. Help me fix it."
"Debug why [component] isn't working as expected"
"Optimize the performance of [component]"

# Git
"Review my changes and help me commit"
"Create a PR for [feature]"
"Show me what changed since last commit"

# Deployment
"Run pre-deployment checks"
"Help me deploy to production"
"Apply database migrations to production"
```

---

## Resources

### Documentation

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives/overview/introduction)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)

### Project Documentation

- [README.md](./README.md) - Project overview
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup instructions
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [docs/monitoring-setup.md](./docs/monitoring-setup.md) - Monitoring configuration
- [docs/disaster-recovery.md](./docs/disaster-recovery.md) - DR procedures
- [docs/linear-workflow.md](./docs/linear-workflow.md) - Linear project management

---

## Contributing

When working with Ona on this project:

1. **Read this guide** before starting
2. **Be specific** in your requests
3. **Follow project patterns** shown in examples
4. **Test your changes** before committing
5. **Update documentation** when adding features
6. **Ask for help** when stuck

Ona is here to help you be productive. The more context you provide, the better Ona can assist you.

---

**Last Updated:** December 2024  
**Project Version:** 1.0.0  
**Ona Version:** Claude 4.5 Sonnet
