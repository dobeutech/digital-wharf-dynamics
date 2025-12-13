# DOBEU Tech Solutions

<div align="center">

![DOBEU](https://img.shields.io/badge/DOBEU-Tech%20Solutions-FACC15?style=for-the-badge&labelColor=000000)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase)
![Netlify](https://img.shields.io/badge/Netlify-Hosted-00C7B7?style=flat-square&logo=netlify)

**Transform Your Digital Vision**

[Live Site](https://dobeu.net) · [Brand Kit](https://dobeu.net/brand) · [Contact](https://dobeu.net/contact)

</div>

---

## Overview

DOBEU Tech Solutions is a premium digital services platform offering web development, software solutions, and strategic consulting. Built with modern technologies and designed for exceptional user experience.

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| 🟡 Electric Lemon | `#FACC15` | Primary brand color |
| 🔵 Azure Tech | `#3B82F6` | Technology accent |
| 🟣 Deep Violet | `#A855F7` | Premium accent |
| 💖 Neon Rose | `#EC4899` | Highlight accent |
| ⬛ Void Black | `#000000` | Dark backgrounds |
| ⬜ Stark White | `#FFFFFF` | Light backgrounds |

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, TypeScript 5, Vite |
| **Styling** | Tailwind CSS, Shadcn/ui |
| **Animation** | Framer Motion |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Functions) |
| **Hosting** | Netlify (Edge, CDN, Functions) |
| **Testing** | Vitest (Unit), Playwright (E2E) |
| **Analytics** | Google Analytics, Mixpanel |

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
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |

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
- ✅ Secure authentication with Supabase Auth

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

1. Register at `/auth`
2. Grant admin role via Supabase SQL Editor:

```sql
UPDATE profiles 
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Admin Features

| Route | Feature |
|-------|---------|
| `/admin` | Dashboard overview |
| `/admin/services` | Service catalog management |
| `/admin/projects` | Client projects |
| `/admin/users` | User management |
| `/admin/newsletter` | Newsletter management |
| `/admin/ccpa` | CCPA request handling |
| `/admin/contacts` | Contact submissions |
| `/admin/audit-logs` | Activity audit trail |
| `/admin/analytics` | Site analytics |

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

| Document | Description |
|----------|-------------|
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Pre-deployment checklist |
| [docs/monitoring-setup.md](./docs/monitoring-setup.md) | Monitoring configuration |
| [docs/disaster-recovery.md](./docs/disaster-recovery.md) | DR procedures |

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
