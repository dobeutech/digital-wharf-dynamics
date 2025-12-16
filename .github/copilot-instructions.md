# GitHub Copilot Instructions for DOBEU

This document provides AI agents with context and guidelines for working on the DOBEU Tech Solutions codebase.

## Database Architecture

This project uses a **hybrid database architecture**:

| Database | Purpose | Location |
|----------|---------|----------|
| **MongoDB Atlas** | Primary app data, user profiles, SMS verification | `netlify/functions/_mongo.ts` |
| **MongoDB GridFS** | File storage | `netlify/functions/_gridfs.ts` |
| **Supabase (PostgreSQL)** | Rate limiting, services catalog, projects | `supabase/migrations/` |

---

## MongoDB Collections

### Connection

```typescript
import { getMongoDb } from "./_mongo";

const db = await getMongoDb();
const collection = db.collection("collection_name");
```

### Collections Schema

#### `profiles` - User Profiles
```typescript
{
  _id: ObjectId,
  auth_user_id: string,      // Auth0 user ID
  email: string,
  username: string,
  phone?: string,            // Normalized 10 digits
  phone_verified: boolean,
  phone_verified_at?: string,
  created_at: string,        // ISO timestamp
  updated_at: string
}
```

#### `sms_verification_codes` - SMS Verification
```typescript
{
  _id: ObjectId,
  auth_user_id: string,
  phone: string,             // +1XXXXXXXXXX format
  code: string,              // 6-digit code
  attempts: number,          // Max 5
  created_at: Date,
  expires_at: Date           // 10 minutes TTL
}
```

#### `contact_submissions` - Contact Form
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone?: string,
  message: string,
  smsConsent: boolean,
  marketingConsent: boolean,
  created_at: string
}
```

#### `audit_logs` - Activity Tracking
```typescript
{
  _id: ObjectId,
  user_id?: string,
  action: string,
  resource_type: string,
  resource_id?: string,
  details?: object,
  ip_address?: string,
  user_agent?: string,
  created_at: string
}
```

#### `newsletter_posts` - Newsletter Content (MongoDB version)
```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,
  content: string,
  excerpt?: string,
  is_published: boolean,
  is_public: boolean,
  published_at?: string,
  created_at: string,
  updated_at: string
}
```

---

## Supabase Tables

### Migration Naming Convention

```
YYYYMMDDHHMMSS_description.sql
```

Example: `20251204000000_rate_limits_table.sql`

### Core Tables

#### `services` - Service Catalog
```sql
- id: UUID (PK)
- name: TEXT
- category: TEXT (Website|Software|Learning|Consulting|Strategic Planning|E-Commerce)
- description: TEXT
- base_price: DECIMAL(10,2)
- features: JSONB
- add_ons: JSONB
- is_active: BOOLEAN
- created_at, updated_at: TIMESTAMPTZ
```

#### `projects` - Client Projects
```sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users)
- purchase_id: UUID (FK -> purchases)
- title: TEXT
- description: TEXT
- status: TEXT (not_started|in_progress|completed|on_hold)
- progress_percentage: INTEGER (0-100)
- start_date, end_date: TIMESTAMPTZ
- created_at, updated_at: TIMESTAMPTZ
```

#### `purchases` - Payment Records
```sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users)
- service_id: UUID (FK -> services)
- stripe_payment_id, stripe_subscription_id: TEXT
- payment_type: TEXT (monthly_retainer|project_based|hourly)
- amount: DECIMAL(10,2)
- status: TEXT (pending|completed|cancelled|refunded)
- selected_add_ons: JSONB
- created_at, updated_at: TIMESTAMPTZ
```

#### `client_files` - File Metadata (3-year retention)
```sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users)
- project_id: UUID (FK -> projects)
- file_name, file_path, file_type: TEXT
- file_size: BIGINT
- storage_bucket: TEXT
- expires_at: TIMESTAMPTZ (auto-set to 3 years)
- created_at, updated_at: TIMESTAMPTZ
```

#### `newsletter_posts` - Newsletter (Supabase version)
```sql
- id: UUID (PK)
- title: TEXT
- slug: TEXT (UNIQUE)
- content: TEXT
- excerpt: TEXT
- is_public, is_published: BOOLEAN
- published_at: TIMESTAMPTZ
- author_id: UUID (FK -> auth.users)
- created_at, updated_at: TIMESTAMPTZ
```

#### `newsletter_subscribers` - Subscribers
```sql
- id: UUID (PK)
- email: TEXT (UNIQUE)
- phone: TEXT
- opted_in_marketing, opted_in_sms: BOOLEAN
- is_active: BOOLEAN
- subscribed_at, unsubscribed_at: TIMESTAMPTZ
```

#### `rate_limits` - API Rate Limiting
```sql
- id: UUID (PK)
- identifier: TEXT (UNIQUE) -- IP or user ID
- count: INTEGER
- window_start: BIGINT (ms timestamp)
- reset_time: TIMESTAMPTZ
- created_at, updated_at: TIMESTAMPTZ
```

---

## Row Level Security (RLS) Patterns

### User-Owned Data
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);
```

### Public Read, Admin Write
```sql
-- Anyone can read active items
CREATE POLICY "Public can view active"
ON table_name FOR SELECT
USING (is_active = true);
```

### Service Role Only
```sql
-- Only backend can access
CREATE POLICY "Service role only"
ON table_name FOR ALL
USING (auth.role() = 'service_role');
```

---

## Creating New Migrations

1. Create file in `supabase/migrations/` with timestamp prefix
2. Include RLS policies
3. Add indexes for frequently queried columns
4. Include `updated_at` trigger

### Template

```sql
-- Description of what this migration does
CREATE TABLE IF NOT EXISTS public.table_name (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    -- columns here
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_table_column ON public.table_name(column);

-- Enable RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "policy_name"
ON public.table_name
FOR SELECT
USING (/* condition */);

-- Updated_at trigger
CREATE TRIGGER update_table_updated_at 
BEFORE UPDATE ON public.table_name 
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

---

## Netlify Functions Database Patterns

### MongoDB Pattern
```typescript
import { getMongoDb } from "./_mongo";
import { requireAuth } from "./_auth0";

export async function handler(event: APIGatewayEvent) {
  // Auth check
  const user = await requireAuth(event);
  
  // Get database
  const db = await getMongoDb();
  const collection = db.collection("collection_name");
  
  // Operations
  const result = await collection.findOne({ user_id: user.sub });
  
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}
```

### Common Operations

```typescript
// Find one
const doc = await collection.findOne({ _id: new ObjectId(id) });

// Find many
const docs = await collection.find({ status: "active" }).toArray();

// Insert
const result = await collection.insertOne({ ...data, created_at: new Date().toISOString() });

// Update
await collection.updateOne(
  { _id: new ObjectId(id) },
  { $set: { ...updates, updated_at: new Date().toISOString() } }
);

// Delete
await collection.deleteOne({ _id: new ObjectId(id) });
```

---

## Environment Variables

### Required for Database

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
MONGODB_DB_NAME=app
GRIDFS_BUCKET=files

# Supabase (optional - for Supabase features)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

---

## Best Practices

### 1. Always Use Indexes
```sql
CREATE INDEX idx_table_commonly_queried ON table(column);
```

### 2. Include Timestamps
All tables should have `created_at` and `updated_at` columns.

### 3. Use UUID for IDs
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
```

### 4. Validate at the Edge
Use Zod schemas in Netlify functions before database operations.

### 5. Handle Errors Gracefully
```typescript
try {
  const result = await collection.findOne({ _id: id });
  if (!result) {
    return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };
  }
} catch (error) {
  console.error("Database error:", error);
  return { statusCode: 500, body: JSON.stringify({ error: "Internal error" }) };
}
```

### 6. Never Log Sensitive Data
```typescript
// ❌ Bad
console.log("Connecting with URI:", uri);

// ✅ Good
console.log("Connecting to database...");
```

---

## Related Files

- `netlify/functions/_mongo.ts` - MongoDB connection
- `netlify/functions/_gridfs.ts` - GridFS file storage
- `supabase/migrations/` - All database migrations
- `supabase/config.toml` - Supabase configuration
- `src/integrations/supabase/` - Frontend Supabase client
