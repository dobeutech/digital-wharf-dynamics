# MongoDB Optimization Guide

**How to run the MongoDB optimization script**

---

## 🚀 Quick Start

### Prerequisites

You need your MongoDB Atlas connection string. This should be stored securely and not committed to git.

---

## 📝 Setup Instructions

### Option 1: Using Environment Variables (Recommended)

1. **Create a `.env` file** (not committed to git):

```bash
# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=app
EOF
```

2. **Run the script**:

```bash
node scripts/mongodb-optimize.js
```

The script will automatically load variables from `.env`.

---

### Option 2: Using Netlify Environment Variables

If your MongoDB URI is stored in Netlify:

1. **Get the URI from Netlify**:

```bash
# List environment variables
netlify env:list

# Get specific variable
netlify env:get MONGODB_URI
```

2. **Set temporarily for the script**:

```bash
export MONGODB_URI="your-connection-string-here"
export MONGODB_DB_NAME="app"
node scripts/mongodb-optimize.js
```

---

### Option 3: Using MongoDB Atlas Dashboard

If you don't have the connection string:

1. **Log into MongoDB Atlas**: https://cloud.mongodb.com/

2. **Get Connection String**:
   - Click on your cluster
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

3. **Run the script**:

```bash
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
export MONGODB_DB_NAME="app"
node scripts/mongodb-optimize.js
```

---

## 🔍 What the Script Does

### 1. Creates Indexes

Adds indexes to improve query performance:

**Users Collection:**
- `email` (unique)
- `createdAt` (descending)

**Projects Collection:**
- `userId` + `createdAt` (compound)
- `status`

**Project Tasks Collection:**
- `projectId` + `status` (compound)
- `dueDate`

**Services Collection:**
- `active`
- `createdAt` (descending)

**Contact Submissions Collection:**
- `email`
- `createdAt` (descending)

**Newsletter Subscribers Collection:**
- `email` (unique)
- `active`

**News Collection:**
- `publishedAt` (descending)
- `author`

**Audit Logs Collection:**
- `userId` + `createdAt` (compound)
- `action`
- `resource`

**CCPA Requests Collection:**
- `userId`
- `status`
- `createdAt` (descending)

### 2. Adds TTL Indexes

Automatically deletes old data:

- **Audit Logs**: Deleted after 30 days
- **Contact Submissions**: Deleted after 90 days

### 3. Analyzes Collections

Shows:
- Document count
- Storage size
- Average document size
- Number of indexes

### 4. Provides Recommendations

Based on your database size, recommends:
- M0 (Free) for < 100 MB
- M2 ($9/month) for < 500 MB
- M5 ($25/month) for < 2 GB
- M10 ($57/month) for < 5 GB

---

## 📊 Expected Output

```
🚀 MongoDB Optimization Script

✅ Connected to MongoDB

📊 Creating Indexes...

  ✅ Created index "email_unique" on users
  ✅ Created index "created_at_desc" on users
  ✅ Created index "user_created" on projects
  ✅ Created index "status" on projects
  ...

⏰ Adding TTL Indexes for Auto-Cleanup...

  ✅ Created TTL index on audit_logs.createdAt (30 days)
  ✅ Created TTL index on contact_submissions.createdAt (90 days)

📈 Analyzing Collections...

  📦 users
     Documents: 150
     Size: 0.05 MB
     Avg Doc Size: 350 bytes
     Indexes: 3

  📦 projects
     Documents: 45
     Size: 0.02 MB
     Avg Doc Size: 450 bytes
     Indexes: 3

  📊 Total Database Size: 0.15 MB
  📄 Total Documents: 250

  💡 Recommendation: M0 (Free) tier is sufficient

🔍 Checking for Missing Indexes...

✅ Optimization complete!
```

---

## ⚠️ Important Notes

### Security

- **Never commit** `.env` files with credentials
- **Never commit** connection strings to git
- Use environment variables for sensitive data

### Safety

- The script is **read-mostly** with safe operations
- It only **creates** indexes (doesn't delete data)
- TTL indexes only affect **future** documents
- Existing documents are not deleted immediately

### Performance

- Creating indexes may take time on large collections
- Run during low-traffic periods if possible
- Indexes improve query performance but use storage

---

## 🐛 Troubleshooting

### Error: "MONGODB_URI environment variable is required"

**Solution:** Set the environment variable:

```bash
export MONGODB_URI="your-connection-string"
node scripts/mongodb-optimize.js
```

### Error: "Authentication failed"

**Solution:** Check your connection string:
- Verify username and password
- Ensure password is URL-encoded
- Check IP whitelist in Atlas

### Error: "Index already exists"

**Solution:** This is normal! The script will show:
```
ℹ️  Index "email_unique" already exists on users
```

This means the index was created previously.

### Error: "Collection does not exist"

**Solution:** This is normal for new databases. Collections are created when you insert the first document.

---

## 📈 Monitoring Results

### Check Index Usage

After running the script, monitor index usage in MongoDB Atlas:

1. Go to **Atlas Dashboard**
2. Click on your cluster
3. Go to **Metrics** → **Indexes**
4. Check which indexes are being used

### Check Storage Savings

Monitor storage over time:

1. Go to **Atlas Dashboard**
2. Click on your cluster
3. Go to **Metrics** → **Storage**
4. Watch for storage reduction as TTL indexes clean up old data

---

## 🔄 When to Re-run

Run the script:

- ✅ After initial setup (first time)
- ✅ When adding new collections
- ✅ When query performance degrades
- ✅ After schema changes
- ✅ Monthly as maintenance

**Note:** It's safe to run multiple times - existing indexes will be skipped.

---

## 💰 Expected Savings

### With Indexes

- **Query Performance**: 50-90% faster queries
- **Compute Costs**: 20-30% reduction
- **User Experience**: Faster page loads

### With TTL Indexes

- **Storage Costs**: 30-50% reduction over time
- **Automatic Cleanup**: No manual intervention needed
- **Compliance**: Automatic data retention policies

### Total Savings

- **Small Database** (< 1 GB): Save $5-10/month
- **Medium Database** (1-5 GB): Save $15-30/month
- **Large Database** (> 5 GB): Save $30-60/month

---

## 📚 Additional Resources

- [MongoDB Indexes Documentation](https://docs.mongodb.com/manual/indexes/)
- [TTL Indexes Documentation](https://docs.mongodb.com/manual/core/index-ttl/)
- [MongoDB Atlas Pricing](https://www.mongodb.com/pricing)
- [Cost Analysis](./MONGODB_COST_ANALYSIS.md)
- [Cost Summary](./MONGODB_COST_SUMMARY.md)

---

## ✅ Checklist

Before running the script:

- [ ] Have MongoDB Atlas connection string
- [ ] Know your database name (default: "app")
- [ ] Have Node.js installed
- [ ] Have `mongodb` package installed (`npm install`)
- [ ] Understand what the script does
- [ ] Have backup (if running on production)

After running the script:

- [ ] Verify indexes were created
- [ ] Check database size
- [ ] Monitor query performance
- [ ] Set up alerts in Atlas
- [ ] Schedule monthly re-runs

---

## 🎯 Quick Commands

```bash
# Check if MongoDB URI is set
echo $MONGODB_URI

# Set MongoDB URI temporarily
export MONGODB_URI="your-connection-string"
export MONGODB_DB_NAME="app"

# Run optimization script
node scripts/mongodb-optimize.js

# Check database size
mongosh "$MONGODB_URI" --eval "db.stats()"

# List collections
mongosh "$MONGODB_URI" --eval "db.getCollectionNames()"

# Check indexes on a collection
mongosh "$MONGODB_URI" --eval "db.users.getIndexes()"
```

---

## 📞 Need Help?

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
3. Check [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
4. Contact MongoDB Support (if on paid tier)

---

**Last Updated:** 2025-12-15  
**Script Version:** 1.0  
**Maintained By:** Engineering Team
