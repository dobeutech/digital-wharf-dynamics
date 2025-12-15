# Outstanding Items Checklist

**Comprehensive list of incomplete features, issues, and improvements needed**

**Last Updated:** 2025-12-15  
**Status:** Active Development

---

## 🚨 High Priority Items

### 1. Missing Admin Routes (Critical)

**Status:** ❌ Not Implemented  
**Impact:** 404 errors when trying to edit newsletter posts or services  
**Effort:** Medium (2-4 hours)

**Missing Routes:**

- [ ] `/admin/newsletter/new` - Create new newsletter post
- [ ] `/admin/newsletter/edit/:id` - Edit existing newsletter post
- [ ] `/admin/services/new` - Create new service
- [ ] `/admin/services/edit/:id` - Edit existing service

**Files to Update:**

- `src/App.tsx` - Add route definitions
- Create new page components or reuse existing admin pages with edit mode

**Implementation Steps:**

1. Create `AdminNewsletterEdit.tsx` component
2. Create `AdminServiceEdit.tsx` component
3. Add routes to App.tsx
4. Update navigation links in AdminNewsletter.tsx and AdminServices.tsx
5. Test CRUD operations

---

### 2. Services Page Anchor Navigation

**Status:** ❌ Not Implemented  
**Impact:** Footer links to service sections don't scroll to correct position  
**Effort:** Low (30 minutes)

**Missing Anchor IDs:**

- [ ] `#website` - Website Development section
- [ ] `#software` - Software Development section
- [ ] `#consulting` - Consulting section
- [ ] `#learning` - Learning & Training section

**Files to Update:**

- `src/pages/Services.tsx` - Add `id` attributes to service sections

**Implementation:**

```tsx
<section id="website" className="...">
  {/* Website Development content */}
</section>
```

---

### 3. CCPA Admin Endpoints

**Status:** ⚠️ Partially Implemented  
**Impact:** Admin CCPA page may fail to load or update requests  
**Effort:** Medium (3-5 hours)

**Issues:**

- [ ] Admin endpoint for fetching CCPA requests (line 68 in AdminCCPA.tsx)
- [ ] Admin endpoint for updating CCPA request status (line 95 in AdminCCPA.tsx)

**Files to Update:**

- `netlify/functions/ccpa-request.ts` - Add admin-specific endpoints
- `src/pages/admin/AdminCCPA.tsx` - Update API calls

**Implementation Steps:**

1. Add admin authentication check to ccpa-request function
2. Add GET endpoint for admin to fetch all requests
3. Add PATCH endpoint for admin to update request status
4. Add proper error handling in AdminCCPA.tsx
5. Test with different user roles

---

## 🔧 Medium Priority Items

### 4. Dashboard Pending Purchases

**Status:** ❌ Not Implemented  
**Impact:** Dashboard shows hardcoded 0 for pending purchases  
**Effort:** Medium (4-6 hours)

**Issue:**

- [ ] Implement purchases/orders tracking system
- [ ] Create backend endpoint for purchase data
- [ ] Update Dashboard.tsx to fetch real data

**Files to Update:**

- Create `netlify/functions/purchases.ts`
- `src/pages/Dashboard.tsx` - Update to fetch real purchase data
- Add database schema for purchases

**Alternative:**

- Remove pending purchases stat if not needed

---

### 5. Support Chat Button

**Status:** ❌ Not Implemented  
**Impact:** Button does nothing when clicked  
**Effort:** Low (1 hour)

**Issue:**

- [ ] "Open Support Chat" button has no functionality (Dashboard.tsx line 136)

**Options:**

1. **Integrate Intercom:** Add onClick to open Intercom widget
2. **Link to Contact:** Navigate to /contact page
3. **Remove Button:** If support chat not needed

**Recommended Implementation:**

```tsx
<Button
  variant="secondary"
  className="w-full"
  onClick={() => window.Intercom && window.Intercom("show")}
>
  Open Support Chat
</Button>
```

---

### 6. Form Template API Implementation

**Status:** ⚠️ Template Only  
**Impact:** None (it's a template)  
**Effort:** N/A

**Issue:**

- [ ] FormTemplate.tsx has placeholder API call (line 82)

**Action:**

- Update documentation to clarify this is a template
- Add more prominent comments
- Consider moving to `/examples` directory

---

## 🐛 Code Quality Issues

### 7. ESLint Errors in Edge Functions

**Status:** ❌ Failing Lint  
**Impact:** Code quality, potential bugs  
**Effort:** Low (1-2 hours)

**Issues:**

- [ ] 5 `@ts-ignore` comments in `__csp-nonce.ts` (should use `@ts-expect-error`)
- [ ] 37 `var` declarations in `ua_blocker_ef.ts` (should use `let` or `const`)
- [ ] 1 empty block statement in `ua_blocker_ef.ts` (line 57)

**Files to Fix:**

- `.netlify/edge-functions/__csp-nonce.ts`
- `.netlify/edge-functions/ua_blocker_ef.ts`

**Implementation:**

```bash
# Fix automatically where possible
npm run lint:fix

# Manual fixes for remaining issues
```

---

## 🔒 Security Issues

### 8. Dependency Vulnerabilities

**Status:** ⚠️ 6 Moderate Vulnerabilities  
**Impact:** Security risk in development dependencies  
**Effort:** Low (30 minutes)

**Vulnerabilities:**

- [ ] esbuild <=0.24.2 - Moderate severity
- [ ] Related vite, vitest, vite-node vulnerabilities

**Resolution:**

```bash
# Review breaking changes first
npm audit fix --force

# Or update manually
npm update vitest@latest
```

**Note:** These are dev dependencies, not production code.

---

## 🌐 Environment & Configuration

### 9. Missing Environment Variables

**Status:** ⚠️ Optional Variables Not Set  
**Impact:** Supabase Realtime features disabled  
**Effort:** Low (if needed)

**Missing Variables:**

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`

**Action:**

- Document that these are optional (app uses MongoDB + Auth0)
- Update `.env.example` with clear comments
- Update `src/config/env.ts` validation messages

---

## 📚 Documentation Improvements

### 10. Update Documentation Index

**Status:** ⚠️ Needs Update  
**Impact:** Developers may miss new documentation  
**Effort:** Low (30 minutes)

**Tasks:**

- [ ] Add SYSTEM_ARCHITECTURE.md to docs index
- [ ] Add FORM_COMPONENTS_GUIDE.md to main README
- [ ] Update QUICK_START.md with new form components
- [ ] Add link to operational runbooks in README

---

## ✅ Completed Items

### Recently Completed

- [x] Form component system with templates and examples
- [x] Comprehensive operational runbooks
- [x] Monitoring and alerting documentation
- [x] System architecture diagrams
- [x] Test suite for form components
- [x] Deployment to production via Netlify CLI
- [x] Merged all open branches to main

---

## 📊 Progress Summary

| Category        | Total  | Complete | In Progress | Not Started |
| --------------- | ------ | -------- | ----------- | ----------- |
| High Priority   | 3      | 0        | 1           | 2           |
| Medium Priority | 3      | 0        | 1           | 2           |
| Code Quality    | 1      | 0        | 0           | 1           |
| Security        | 1      | 0        | 0           | 1           |
| Environment     | 1      | 0        | 0           | 1           |
| Documentation   | 1      | 0        | 0           | 1           |
| **TOTAL**       | **10** | **0**    | **2**       | **8**       |

---

## 🎯 Recommended Implementation Order

### Sprint 1 (Week 1)

1. **Services Page Anchor Navigation** (30 min) - Quick win
2. **Support Chat Button** (1 hour) - User-facing
3. **ESLint Errors** (2 hours) - Code quality
4. **Dependency Vulnerabilities** (30 min) - Security

**Total Effort:** ~4 hours

### Sprint 2 (Week 2)

5. **Missing Admin Routes** (4 hours) - Critical functionality
6. **CCPA Admin Endpoints** (5 hours) - Complete admin features

**Total Effort:** ~9 hours

### Sprint 3 (Week 3)

7. **Dashboard Pending Purchases** (6 hours) - Feature completion
8. **Documentation Updates** (30 min) - Maintenance
9. **Environment Variables** (30 min) - Configuration

**Total Effort:** ~7 hours

---

## 🔗 Related Documentation

- [System Architecture](./docs/SYSTEM_ARCHITECTURE.md)
- [Operational Runbook](./docs/OPERATIONAL_RUNBOOK.md)
- [Form Components Guide](./FORM_COMPONENTS_GUIDE.md)
- [Quick Start Guide](./QUICK_START.md)

---

## 📝 Notes for Developers

### Before Starting Work

1. **Check this list** for current status
2. **Update status** when starting work (In Progress)
3. **Create branch** following naming convention: `feature/item-name` or `fix/item-name`
4. **Reference this doc** in PR description

### When Completing Items

1. **Mark item as complete** with [x]
2. **Update progress summary**
3. \*\*Add to "Recently Completed" section
4. **Update related documentation**
5. **Create PR** with reference to this checklist

### Adding New Items

1. **Add to appropriate priority section**
2. **Include:**
   - Status indicator
   - Impact description
   - Effort estimate
   - Files to update
   - Implementation steps
3. **Update progress summary**

---

## 🚀 Quick Actions

### For Product Managers

```bash
# View high priority items
grep -A 5 "High Priority" OUTSTANDING_ITEMS_CHECKLIST.md

# Check progress
grep "Progress Summary" -A 10 OUTSTANDING_ITEMS_CHECKLIST.md
```

### For Developers

```bash
# Find items to work on
grep "\[ \]" OUTSTANDING_ITEMS_CHECKLIST.md

# Check your assigned items
grep "@your-username" OUTSTANDING_ITEMS_CHECKLIST.md
```

### For QA

```bash
# Find recently completed items to test
grep "\[x\]" OUTSTANDING_ITEMS_CHECKLIST.md | tail -10
```

---

## 📞 Questions or Issues?

- **Slack:** #engineering
- **Email:** engineering@dobeu.wtf
- **Linear:** Create issue with label `outstanding-items`

---

**Maintained By:** Engineering Team  
**Review Frequency:** Weekly  
**Next Review:** 2025-12-22
