# Netlify Deployment Guide

This guide provides step-by-step instructions for deploying the Digital Wharf Dynamics project to Netlify production.

## Prerequisites

- Netlify CLI installed
- Node.js 20+ installed
- Project dependencies installed
- Netlify authentication token

## Deployment Credentials

**Netlify Personal Access Token**: `nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605`  
**Project ID**: `dfeefdc2-92aa-4415-baf6-42e60dfa6328`

---

## Quick Deployment (Automated)

### Option 1: Using Environment Variable

```bash
# Set authentication token
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605"

# Install dependencies (if not already installed)
npm install

# Build the project
npm run build

# Deploy to production
netlify deploy --prod --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist
```

### Option 2: Using Netlify CLI Login

```bash
# Login to Netlify (will prompt for token)
netlify login

# Link to the project
netlify link --id=dfeefdc2-92aa-4415-baf6-42e60dfa6328

# Build and deploy
npm run build
netlify deploy --prod
```

---

## Step-by-Step Deployment

### Step 1: Install Netlify CLI

If Netlify CLI is not installed:

```bash
npm install -g netlify-cli
```

Or use npx (no installation needed):

```bash
npx netlify-cli --version
```

### Step 2: Authenticate

Set the authentication token as an environment variable:

```bash
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605"
```

Verify authentication:

```bash
netlify status
```

Expected output:
```
Current Netlify User:
Email: [your-email]
Teams:
  - [team-name]
```

### Step 3: Install Project Dependencies

```bash
cd /workspaces/digital-wharf-dynamics
npm install
```

This will install all dependencies from `package.json`.

### Step 4: Run Pre-Deployment Checks

Before deploying, ensure everything is working:

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Run tests
npm run test:ci

# Verify environment variables
npm run test:env
```

### Step 5: Build for Production

```bash
npm run build
```

This will:
- Compile TypeScript
- Bundle with Vite
- Optimize assets
- Generate production build in `dist/` directory

Verify the build:

```bash
ls -lh dist/
```

Expected output:
```
total [size]
-rw-r--r-- 1 user group [size] [date] index.html
drwxr-xr-x 2 user group [size] [date] assets/
-rw-r--r-- 1 user group [size] [date] manifest.json
...
```

### Step 6: Deploy to Production

Deploy the built files to Netlify:

```bash
netlify deploy \
  --prod \
  --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 \
  --dir=dist \
  --message="Production deployment with reliability improvements"
```

**Flags explained**:
- `--prod`: Deploy to production (not draft)
- `--site`: Specify the site ID
- `--dir`: Directory containing built files
- `--message`: Deployment message (optional)

### Step 7: Verify Deployment

After deployment completes, you'll see:

```
✔ Finished hashing 
✔ CDN requesting [X] files
✔ Finished uploading [X] assets
✔ Deploy is live!

Logs:              https://app.netlify.com/sites/[site-name]/deploys/[deploy-id]
Unique Deploy URL: https://[deploy-id]--[site-name].netlify.app
Website URL:       https://dobeu.net
```

Visit the website to verify:

```bash
# Open in browser (if available)
netlify open:site

# Or manually visit
# https://dobeu.net
```

---

## Deployment Script

Create a deployment script for easy reuse:

**File**: `scripts/deploy-production.sh`

```bash
#!/bin/bash

# Netlify Production Deployment Script
# Usage: ./scripts/deploy-production.sh

set -e  # Exit on error

echo "🚀 Starting production deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set Netlify token
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605"

# Configuration
SITE_ID="dfeefdc2-92aa-4415-baf6-42e60dfa6328"
BUILD_DIR="dist"

# Step 1: Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v netlify &> /dev/null; then
    echo -e "${RED}❌ Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 20+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Step 3: Run checks
echo -e "${YELLOW}🔍 Running pre-deployment checks...${NC}"

echo "  - Type checking..."
npx tsc --noEmit || { echo -e "${RED}❌ Type check failed${NC}"; exit 1; }

echo "  - Linting..."
npm run lint || { echo -e "${RED}❌ Lint failed${NC}"; exit 1; }

echo "  - Testing..."
npm run test:ci || { echo -e "${RED}❌ Tests failed${NC}"; exit 1; }

echo -e "${GREEN}✅ All checks passed${NC}"

# Step 4: Build
echo -e "${YELLOW}🏗️  Building for production...${NC}"
npm run build || { echo -e "${RED}❌ Build failed${NC}"; exit 1; }

# Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}❌ Build directory not found: $BUILD_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"

# Step 5: Deploy
echo -e "${YELLOW}🚀 Deploying to Netlify production...${NC}"

netlify deploy \
  --prod \
  --site="$SITE_ID" \
  --dir="$BUILD_DIR" \
  --message="Production deployment $(date '+%Y-%m-%d %H:%M:%S')" \
  || { echo -e "${RED}❌ Deployment failed${NC}"; exit 1; }

echo -e "${GREEN}✅ Deployment successful!${NC}"

# Step 6: Verify
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"

# Wait a moment for deployment to propagate
sleep 5

# Check if site is accessible
if curl -f -s -o /dev/null https://dobeu.net; then
    echo -e "${GREEN}✅ Site is accessible${NC}"
else
    echo -e "${RED}⚠️  Site may not be accessible yet. Check manually.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "📊 Deployment Details:"
echo "  - Site ID: $SITE_ID"
echo "  - Website: https://dobeu.net"
echo "  - Netlify Dashboard: https://app.netlify.com/sites/dobeu-net/overview"
echo ""
echo "Next steps:"
echo "  1. Visit https://dobeu.net to verify"
echo "  2. Check Netlify dashboard for deployment logs"
echo "  3. Monitor error logs for any issues"
```

Make the script executable:

```bash
chmod +x scripts/deploy-production.sh
```

Run the script:

```bash
./scripts/deploy-production.sh
```

---

## Troubleshooting

### Issue: "Netlify CLI not found"

**Solution**:
```bash
npm install -g netlify-cli
```

Or use npx:
```bash
npx netlify-cli deploy --prod --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist
```

### Issue: "Authentication failed"

**Solution**:
```bash
# Set token explicitly
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605"

# Or login interactively
netlify login
```

### Issue: "Build failed"

**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Issue: "Site not found"

**Solution**:
```bash
# Verify site ID
netlify sites:list

# Link to correct site
netlify link --id=dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

### Issue: "Deploy timeout"

**Solution**:
```bash
# Increase timeout
netlify deploy --prod --timeout=600 --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist
```

### Issue: "Environment variables missing"

**Solution**:

Environment variables should be set in Netlify dashboard:

1. Go to https://app.netlify.com/sites/dobeu-net/settings/deploys
2. Click "Environment variables"
3. Add required variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Any other `VITE_*` variables

---

## Rollback

If deployment causes issues, rollback to previous version:

```bash
# List recent deploys
netlify deploys:list --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328

# Rollback to specific deploy
netlify rollback --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

Or via Netlify dashboard:
1. Go to https://app.netlify.com/sites/dobeu-net/deploys
2. Find the previous working deploy
3. Click "Publish deploy"

---

## Post-Deployment Verification

### 1. Check Site Health

```bash
# Check if site is up
curl -I https://dobeu.net

# Expected: HTTP/2 200
```

### 2. Verify Critical Pages

```bash
# Homepage
curl -f https://dobeu.net

# Services page
curl -f https://dobeu.net/services

# Contact page
curl -f https://dobeu.net/contact
```

### 3. Check Performance

```bash
# Run Lighthouse audit
npx lighthouse https://dobeu.net --view

# Expected scores:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 95
# - SEO: > 95
```

### 4. Monitor Errors

Check Netlify logs:
```bash
netlify logs --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

Or visit: https://app.netlify.com/sites/dobeu-net/logs

### 5. Test Functionality

- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Admin panel accessible
- [ ] Authentication works
- [ ] Database queries succeed
- [ ] Analytics tracking works

---

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy to Netlify Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-deploy: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

### Netlify Auto-Deploy

Netlify can auto-deploy on git push:

1. Go to https://app.netlify.com/sites/dobeu-net/settings/deploys
2. Under "Build & deploy", configure:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Enable "Auto publishing"

---

## Security Notes

### Token Security

⚠️ **Important**: The Netlify token in this guide has full access to your account.

**Best practices**:
1. Never commit tokens to git
2. Use environment variables
3. Rotate tokens regularly
4. Use scoped tokens when possible
5. Revoke unused tokens

### Revoking Token

If token is compromised:

1. Go to https://app.netlify.com/user/applications
2. Find "Personal access tokens"
3. Revoke the token
4. Generate a new token
5. Update deployment scripts

---

## Monitoring

### Netlify Analytics

View deployment analytics:
- https://app.netlify.com/sites/dobeu-net/analytics

### Error Tracking

Monitor errors in:
- Netlify logs: https://app.netlify.com/sites/dobeu-net/logs
- Browser console (for client-side errors)
- Supabase logs (for database errors)

### Performance Monitoring

Track performance:
- Netlify Analytics
- Google Analytics
- Lighthouse CI
- Custom performance monitoring (see `src/lib/performance.ts`)

---

## Quick Reference

### Common Commands

```bash
# Deploy to production
netlify deploy --prod --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist

# Deploy draft (preview)
netlify deploy --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist

# Check deployment status
netlify status

# View site info
netlify sites:list

# Open site in browser
netlify open:site

# View logs
netlify logs

# Rollback deployment
netlify rollback
```

### Environment Variables

Set in Netlify dashboard or via CLI:

```bash
# Set environment variable
netlify env:set VARIABLE_NAME "value" --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328

# List environment variables
netlify env:list --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328

# Import from .env file
netlify env:import .env --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

---

## Support

### Resources

- Netlify CLI Docs: https://docs.netlify.com/cli/get-started/
- Netlify Deploy Docs: https://docs.netlify.com/site-deploys/overview/
- Project README: [README.md](./README.md)
- Deployment Checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

### Getting Help

1. Check Netlify status: https://www.netlifystatus.com/
2. Netlify support: https://www.netlify.com/support/
3. Community forum: https://answers.netlify.com/

---

**Last Updated**: December 2024  
**Site ID**: dfeefdc2-92aa-4415-baf6-42e60dfa6328  
**Production URL**: https://dobeu.net
