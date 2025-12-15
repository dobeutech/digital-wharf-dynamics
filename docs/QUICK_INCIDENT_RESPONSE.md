# Quick Incident Response Guide

**For on-call engineers responding to production incidents**

---

## 🚨 Site Down (P0)

**Immediate Actions (< 2 minutes):**

```bash
# 1. Check if site is accessible
curl -I https://dobeu.net

# 2. Check Netlify deploy status
netlify status

# 3. Rollback immediately
netlify rollback
```

**If rollback doesn't work:**

```bash
# Check last 5 deploys
netlify deploy:list | head -5

# Publish specific deploy
# Go to: https://app.netlify.com/projects/dobeutech/deploys
# Click on last successful deploy → "Publish deploy"
```

**Communicate:**

- Post in #incidents: "Site down. Rolled back to <deploy-id>. Investigating."

---

## 🔐 Auth Failures (P1)

**Quick Checks:**

```bash
# 1. Verify Auth0 status
curl https://status.auth0.com/api/v2/status.json

# 2. Check Auth0 function logs
netlify logs:function --name=_auth0 | tail -50

# 3. Verify env vars
netlify env:list | grep AUTH0
```

**Common Fixes:**

```bash
# If env vars missing/wrong:
netlify env:set AUTH0_DOMAIN <domain>
netlify env:set AUTH0_CLIENT_ID <id>
netlify env:set AUTH0_CLIENT_SECRET <secret>
netlify deploy --prod

# If Auth0 is down:
# - Check status page
# - Wait for resolution
# - Communicate ETA to users
```

---

## 💾 Database Connection Issues (P1)

**Quick Checks:**

```bash
# 1. Check MongoDB Atlas status
# Visit: https://status.mongodb.com/

# 2. Test connection
mongosh "mongodb+srv://<cluster>.mongodb.net/" \
  --tls \
  --tlsCAFile <cert.pem> \
  --tlsCertificateKeyFile <cert.pem>

# 3. Check function logs
netlify logs:function --name=projects | grep -i "mongo\|connection\|timeout"
```

**Common Fixes:**

```bash
# If connection pool exhausted:
# - Restart functions (redeploy)
netlify deploy --prod

# If certificate expired:
# 1. Download new cert from Atlas
# 2. Update MONGODB_CERT env var
# 3. Redeploy

# If IP whitelist issue:
# - Add Netlify IPs to Atlas whitelist
# - Or use 0.0.0.0/0 (less secure)
```

---

## 🐛 High Error Rate (P1)

**Quick Checks:**

```bash
# 1. Check PostHog for error spike
# Visit: https://us.posthog.com/

# 2. Check function logs
netlify logs:function --name=<function> | grep ERROR

# 3. Check recent deploys
git log --oneline -5
```

**Common Fixes:**

```bash
# If recent deploy caused it:
netlify rollback

# If CSP blocking resources:
# 1. Check violations: Netlify → Functions → __csp-violations
# 2. Update CSP in netlify.toml
# 3. Redeploy

# If rate limiting:
# - Check MongoDB connection count
# - Check function invocation count
# - Scale if needed
```

---

## 🐌 Performance Issues (P2)

**Quick Checks:**

```bash
# 1. Run Lighthouse
npx lighthouse https://dobeu.net --output=json

# 2. Check response time
time curl -s https://dobeu.net > /dev/null

# 3. Check CDN cache hit rate
# Netlify Dashboard → Analytics → Bandwidth
```

**Common Fixes:**

```bash
# If bundle too large:
npm run build
ls -lh dist/assets/*.js
# Optimize: code splitting, lazy loading

# If slow queries:
# - Check Atlas Performance Advisor
# - Add indexes
# - Optimize queries

# If CDN cache misses:
# - Check Cache-Control headers
# - Verify cache settings in netlify.toml
```

---

## 🔧 Build Failures (P2)

**Quick Checks:**

```bash
# 1. Check build logs
netlify logs:deploy

# 2. Reproduce locally
npm run build

# 3. Check dependencies
npm ls
```

**Common Fixes:**

```bash
# If dependency conflicts:
npm install --legacy-peer-deps

# If TypeScript errors:
npx tsc --noEmit
# Fix errors, commit, push

# If out of memory:
# - Increase Node memory in netlify.toml
# - Add: NODE_OPTIONS="--max-old-space-size=4096"

# If env vars missing:
netlify env:list
# Add missing vars
```

---

## 📊 Monitoring Dashboards

**Check these in order:**

1. **Netlify Dashboard**
   - URL: https://app.netlify.com/projects/dobeutech
   - Check: Deploy status, function errors, bandwidth

2. **PostHog**
   - URL: https://us.posthog.com/
   - Check: Error events, session recordings, user flows

3. **MongoDB Atlas**
   - URL: https://cloud.mongodb.com/
   - Check: Connection count, slow queries, storage

4. **Browser Console**
   - Open: https://dobeu.net
   - F12 → Console
   - Check: JavaScript errors, network failures

---

## 🔄 Standard Rollback

```bash
# Method 1: Netlify CLI (fastest)
netlify rollback

# Method 2: Netlify Dashboard
# 1. Go to: https://app.netlify.com/projects/dobeutech/deploys
# 2. Find last successful deploy
# 3. Click "Publish deploy"

# Method 3: Git revert
git revert HEAD
git push origin main
# Wait for auto-deploy
```

---

## 📞 Escalation

**When to escalate:**

- P0: Immediately (site down)
- P1: After 15 minutes if not resolved
- P2: After 1 hour if not resolved
- P3: Next business day

**Who to contact:**

- Engineering Lead: jeremyw@dobeu.wtf
- Slack: #engineering-oncall
- After hours: PagerDuty (if configured)

---

## 📝 Incident Communication Template

**Initial Message (< 5 minutes):**

```
🚨 INCIDENT: [Brief description]
Severity: P[0-3]
Impact: [What's affected]
Status: Investigating
ETA: [Unknown/15min/30min]
```

**Update Message (every 15 minutes):**

```
📊 UPDATE: [What we found]
Actions taken: [What we did]
Current status: [Better/Same/Worse]
Next steps: [What we're doing next]
ETA: [Updated estimate]
```

**Resolution Message:**

```
✅ RESOLVED: [Brief description]
Root cause: [What caused it]
Fix applied: [What we did]
Duration: [How long it lasted]
Follow-up: [Ticket/postmortem link]
```

---

## 🛠️ Essential Commands

```bash
# Check everything is working
curl -I https://dobeu.net && echo "✅ Site up"

# Quick health check
netlify status && echo "✅ Netlify OK"

# View recent errors
netlify logs:function --name=<function> | grep ERROR | tail -20

# Test database connection
mongosh "mongodb+srv://<cluster>.mongodb.net/" --eval "db.runCommand({ping:1})"

# Deploy to production
export NETLIFY_AUTH_TOKEN="<token>"
netlify deploy --prod --dir=dist

# Emergency rollback
netlify rollback && echo "✅ Rolled back"
```

---

## 🎯 Decision Tree

```
Is the site accessible?
├─ NO → P0: Rollback immediately
└─ YES
   ├─ Are users reporting errors?
   │  ├─ YES → P1: Check logs, investigate
   │  └─ NO → P2/P3: Monitor, schedule fix
   │
   ├─ Is performance degraded?
   │  ├─ YES → P2: Check metrics, optimize
   │  └─ NO → Continue monitoring
   │
   └─ Is a specific feature broken?
      ├─ YES → P1/P2: Check function logs
      └─ NO → P3: Document, backlog
```

---

**Keep this guide handy during on-call shifts!**
