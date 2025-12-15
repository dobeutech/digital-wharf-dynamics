# DOBEU Engineering Standards

## Company-Wide Repository Requirements

**Effective Date:** December 15, 2024  
**Status:** MANDATORY for all repositories  
**Review Cycle:** Quarterly

---

## Core Principle

**Every deployment must be best-in-class. Mediocrity is unacceptable.**

If code doesn't meet these standards, it doesn't ship. Period.

---

## 1. Performance Standards (NON-NEGOTIABLE)

### Lighthouse Scores - Minimum Requirements

- **Performance:** ≥ 90
- **Accessibility:** ≥ 95
- **Best Practices:** ≥ 90
- **SEO:** ≥ 95
- **PWA:** ≥ 80

### Bundle Size Limits

- Initial JS bundle: ≤ 200KB (gzipped)
- Total page weight: ≤ 1MB
- Time to Interactive (TTI): ≤ 3.5s
- First Contentful Paint (FCP): ≤ 1.8s
- Largest Contentful Paint (LCP): ≤ 2.5s
- Cumulative Layout Shift (CLS): ≤ 0.1

### Performance Monitoring

- Real User Monitoring (RUM) required in production
- Performance budgets enforced in CI/CD
- Automated alerts for performance regressions

---

## 2. Build & Deployment Pipeline

### Pre-Deployment Validation (REQUIRED)

Every deployment MUST pass:

1. **Type Safety**

   ```bash
   npx tsc --noEmit
   ```

   - Zero TypeScript errors
   - No `any` types without explicit justification
   - Strict mode enabled

2. **Code Quality**

   ```bash
   npm run lint
   ```

   - Zero ESLint errors
   - Zero warnings in production builds
   - Prettier formatting enforced

3. **Testing**

   ```bash
   npm run test:ci
   ```

   - 80% minimum code coverage
   - All unit tests passing
   - All integration tests passing
   - E2E tests for critical paths

4. **Build Verification**

   ```bash
   npm run build
   ```

   - Clean build with zero errors
   - No console warnings
   - Bundle analysis passing size limits

5. **Security Audit**
   ```bash
   npm audit --production
   ```

   - Zero high/critical vulnerabilities
   - All dependencies up to date
   - License compliance verified

### CI/CD Requirements

**Pre-commit Hooks:**

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run type-check",
      "pre-push": "npm run test:ci && npm run build"
    }
  }
}
```

**GitHub Actions (or equivalent):**

- Run on every PR
- Run on every push to main
- Block merge if any check fails
- Automated deployment only after all checks pass

### Netlify/Vercel Configuration

**CRITICAL:** Never set `NODE_ENV=production` during install phase.

```toml
[build]
  command = "npm ci --include=dev && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--include=dev"
  NODE_ENV = ""  # Empty during install!
```

---

## 3. User Experience Standards

### Visual Design

- **Animated backgrounds** with company color palette
- Gradient overlays with scroll-responsive opacity (10-20%)
- Smooth transitions (200-300ms) on all interactive elements
- Micro-interactions on hover/focus states
- Consistent spacing using 8px grid system

### Accessibility (WCAG 2.1 AA Minimum)

- Semantic HTML throughout
- ARIA labels on all interactive elements
- Keyboard navigation fully functional
- Screen reader tested
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators visible and clear
- Skip links implemented

### Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px, 1536px
- Touch targets ≥ 44x44px
- Tested on iOS Safari, Chrome Mobile, Firefox Mobile
- No horizontal scroll on any device

### Loading States

- Skeleton screens for content loading
- Progress indicators for async operations
- Optimistic UI updates where appropriate
- Error boundaries with user-friendly messages

---

## 4. Code Quality Standards

### File Structure

```
src/
├── components/
│   ├── [feature]/
│   │   ├── Component.tsx
│   │   ├── Component.test.tsx
│   │   └── index.ts
├── hooks/
│   ├── useHook.ts
│   └── useHook.test.ts
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
├── pages/
│   └── PageName.tsx
└── __tests__/
    └── integration/
```

### TypeScript Standards

```typescript
// ✅ GOOD
interface UserProps {
  id: string;
  name: string;
  email: string;
}

export function UserCard({ id, name, email }: UserProps) {
  // Implementation
}

// ❌ BAD
export function UserCard(props: any) {
  // Implementation
}
```

### Component Standards

- Functional components only (no class components)
- Custom hooks for reusable logic
- Props interface defined and exported
- Default exports for pages, named exports for components
- Maximum 300 lines per file (split if larger)

### Testing Standards

```typescript
// Every component must have:
describe("ComponentName", () => {
  it("renders without crashing", () => {});
  it("handles user interactions", () => {});
  it("displays error states", () => {});
  it("handles loading states", () => {});
  it("meets accessibility requirements", () => {});
});
```

---

## 5. SEO & Metadata Requirements

### Every Page Must Have

```typescript
<PageMeta
  title="Page Title | DOBEU"
  description="Compelling 150-160 character description"
  keywords="relevant, keywords, here"
  canonical="https://dobeu.net/page-path"
  ogImage="https://dobeu.net/og-image.png"
/>
```

### Required Files

- `public/sitemap.xml` - Auto-generated, updated on build
- `public/robots.txt` - Properly configured
- `public/manifest.json` - PWA manifest
- `public/favicon.ico` + SVG icon
- Open Graph images (1200x630px)

### Structured Data

- JSON-LD schema on all pages
- Organization schema on homepage
- Article schema on blog posts
- Product schema on service pages

---

## 6. Security Standards

### Headers (Required)

```
Content-Security-Policy: default-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Environment Variables

- Never commit secrets to git
- Use `.env.example` for documentation
- Validate env vars on startup
- Fail fast if required vars missing

### Dependencies

- Automated security audits in CI/CD
- Dependabot enabled
- Review all dependency updates
- Pin major versions

---

## 7. Documentation Requirements

### README.md Must Include

1. Project description
2. Prerequisites
3. Installation steps
4. Development workflow
5. Testing instructions
6. Deployment process
7. Environment variables
8. Architecture overview
9. Contributing guidelines
10. License

### Code Documentation

- JSDoc comments for all exported functions
- Inline comments for complex logic only
- Architecture Decision Records (ADRs) for major decisions
- API documentation auto-generated from code

---

## 8. Git Workflow Standards

### Branch Naming

```
feature/description
fix/description
refactor/description
docs/description
test/description
```

### Commit Messages

```
type(scope): brief description

Detailed explanation of what changed and why.

- Key change 1
- Key change 2

Co-authored-by: Name <email>
```

**Types:** feat, fix, refactor, docs, test, chore, perf, style

### Pull Request Requirements

- Descriptive title and description
- Link to issue/ticket
- Screenshots for UI changes
- All CI checks passing
- At least one approval required
- No merge conflicts
- Branch up to date with main

---

## 9. Monitoring & Observability

### Required Integrations

- **Error Tracking:** Sentry or equivalent
- **Analytics:** Google Analytics + Mixpanel
- **Performance:** Lighthouse CI
- **Uptime:** UptimeRobot or equivalent
- **Logs:** Structured logging with correlation IDs

### Alerts (Required)

- Error rate > 1%
- Response time > 3s
- Lighthouse score drops > 10 points
- Build failures
- Security vulnerabilities

---

## 10. Review & Enforcement

### Pre-Deployment Checklist

Run this before EVERY deployment:

```bash
npm run pre-deploy-check
```

This script MUST verify:

- [ ] All tests passing
- [ ] Build succeeds
- [ ] Lighthouse scores meet minimums
- [ ] No console errors
- [ ] Bundle size within limits
- [ ] Security audit clean
- [ ] Environment variables validated

### Quarterly Reviews

- Review and update standards
- Audit all repositories for compliance
- Update tooling and dependencies
- Performance optimization sprint

### Consequences of Non-Compliance

1. **First Violation:** Warning + immediate fix required
2. **Second Violation:** Code review required for all commits
3. **Third Violation:** Repository access suspended until compliance

---

## 11. Tools & Automation

### Required Dev Dependencies

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest",
    "eslint": "latest",
    "prettier": "latest",
    "husky": "latest",
    "lint-staged": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "playwright": "latest"
  }
}
```

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- TypeScript
- GitLens
- Error Lens
- Import Cost
- TODO Highlight

---

## 12. Performance Optimization Checklist

### Images

- [ ] WebP format with fallbacks
- [ ] Lazy loading implemented
- [ ] Responsive images with srcset
- [ ] Proper alt text
- [ ] Compressed (TinyPNG or equivalent)

### JavaScript

- [ ] Code splitting by route
- [ ] Tree shaking enabled
- [ ] Dynamic imports for heavy components
- [ ] Service worker for caching
- [ ] Preload critical resources

### CSS

- [ ] Critical CSS inlined
- [ ] Unused CSS removed
- [ ] CSS modules or Tailwind
- [ ] No @import in CSS
- [ ] Minified in production

### Fonts

- [ ] Self-hosted or Google Fonts with display=swap
- [ ] Subset fonts to required characters
- [ ] Preload font files
- [ ] Maximum 2 font families

---

## Summary

**These standards are not suggestions. They are requirements.**

Every repository, every deployment, every line of code must meet or exceed these standards.

If you're unsure about any standard, ask. If you can't meet a standard, escalate immediately.

**Excellence is the baseline. Anything less is unacceptable.**

---

**Document Owner:** Engineering Leadership  
**Last Updated:** December 15, 2024  
**Next Review:** March 15, 2025

---

## Quick Reference Commands

```bash
# Pre-deployment validation
npm run pre-deploy-check

# Full quality check
npm run type-check && npm run lint && npm run test:ci && npm run build

# Performance audit
npm run lighthouse

# Security audit
npm audit --production

# Bundle analysis
npm run build -- --analyze
```

---

**Questions or concerns? Reach out to engineering leadership immediately.**

**Remember: We ship excellence, not excuses.**
