# Deploy to Production NOW

Quick reference for deploying to Netlify production.

## 🚀 Quick Deploy (Copy & Paste)

### Prerequisites Check

```bash
# Verify you have Node.js and npm
node --version  # Should be 20+
npm --version   # Should be 9+
```

### One-Command Deploy

```bash
# Set token and deploy in one go
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605" && \
npm ci && \
npm run build && \
npx netlify-cli deploy --prod --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist
```

### Using the Deployment Script

```bash
# Run the automated deployment script
./scripts/deploy-production.sh
```

---

## 📋 Manual Step-by-Step

If you prefer to run each step manually:

### 1. Set Authentication

```bash
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605"
```

### 2. Install Dependencies

```bash
npm ci
```

### 3. Run Checks (Optional but Recommended)

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Tests
npm run test:ci
```

### 4. Build

```bash
npm run build
```

### 5. Deploy

```bash
npx netlify-cli deploy \
  --prod \
  --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 \
  --dir=dist \
  --message="Production deployment $(date '+%Y-%m-%d %H:%M:%S')"
```

### 6. Verify

```bash
# Check if site is up
curl -I https://dobeu.net

# Open in browser
open https://dobeu.net  # macOS
xdg-open https://dobeu.net  # Linux
```

---

## ⚡ Super Quick (Skip Tests)

**⚠️ Use only if you're confident in your changes**

```bash
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605" && \
npm ci && \
npm run build && \
npx netlify-cli deploy --prod --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist --message="Quick deploy"
```

---

## 🔧 Troubleshooting

### "netlify: command not found"

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Or use npx (no installation needed)
npx netlify-cli deploy --prod --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328 --dir=dist
```

### "Build failed"

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### "Authentication failed"

```bash
# Make sure token is set
echo $NETLIFY_AUTH_TOKEN

# If empty, set it again
export NETLIFY_AUTH_TOKEN="nfp_4WVe7jj6shYCiRcTi8AzSfYDxCnEmv6Eb605"
```

### "Site not found"

```bash
# Verify site ID
npx netlify-cli sites:list

# Should show: dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

---

## 📊 After Deployment

### Check Deployment Status

```bash
# View recent deploys
npx netlify-cli deploys:list --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328

# View logs
npx netlify-cli logs --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

### Verify Site

Visit these URLs to verify:

- Homepage: https://dobeu.net
- Services: https://dobeu.net/services
- Contact: https://dobeu.net/contact
- Admin: https://dobeu.net/admin

### Monitor

- **Netlify Dashboard**: https://app.netlify.com/sites/dobeu-net/overview
- **Deployment Logs**: https://app.netlify.com/sites/dobeu-net/logs
- **Analytics**: https://app.netlify.com/sites/dobeu-net/analytics

---

## 🔄 Rollback

If something goes wrong:

```bash
# List recent deploys
npx netlify-cli deploys:list --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328

# Rollback to previous deploy
npx netlify-cli rollback --site=dfeefdc2-92aa-4415-baf6-42e60dfa6328
```

Or via dashboard:

1. Go to https://app.netlify.com/sites/dobeu-net/deploys
2. Find the previous working deploy
3. Click "Publish deploy"

---

## 📝 Deployment Checklist

Before deploying:

- [ ] All changes committed to git
- [ ] Tests passing locally
- [ ] No console errors
- [ ] Environment variables set in Netlify
- [ ] Database migrations applied (if any)

After deploying:

- [ ] Site loads correctly
- [ ] No console errors
- [ ] Forms work
- [ ] Authentication works
- [ ] Admin panel accessible
- [ ] Analytics tracking

---

## 🆘 Need Help?

1. Check [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed guide
2. Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for pre-deployment checks
3. View Netlify logs: https://app.netlify.com/sites/dobeu-net/logs
4. Check Netlify status: https://www.netlifystatus.com/

---

## 🔐 Security Note

The Netlify token in this file has full access to your account.

**Keep it secure**:

- Don't commit to git
- Don't share publicly
- Rotate regularly
- Revoke if compromised

To revoke: https://app.netlify.com/user/applications

---

**Site ID**: `dfeefdc2-92aa-4415-baf6-42e60dfa6328`  
**Production URL**: https://dobeu.net  
**Last Updated**: December 2024
