/* global use, db */
// MongoDB Playground - Digital Wharf Dynamics Database Configuration
// Optimized for contact submissions, audit logs, client files, services, and projects
//
// CONNECTION SETUP:
// To connect this playground to MongoDB Atlas:
// 1. Open VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
// 2. Run "MongoDB: Connect to MongoDB"
// 3. Use the connection string below, or click "Click here to add connection" in the playground
//
// Atlas SQL Connection String (X.509 Certificate Authentication):
// mongodb://<user>@<cluster>/?tls=true&tlsCAFile=<path-to-cert.pem>&tlsCertificateKeyFile=<path-to-cert.pem>

const database = 'app'; // Matches MONGODB_DB_NAME from environment

// Switch to the database
use(database);

// ============================================================================
// 1. CONTACT SUBMISSIONS COLLECTION
// ============================================================================
// Stores contact form submissions with status tracking and metadata
db.createCollection('contact_submissions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'message', 'sms_consent', 'marketing_consent', 'status', 'submitted_at', 'created_at', 'updated_at'],
      properties: {
        name: { bsonType: 'string', minLength: 2 },
        email: { bsonType: 'string', pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
        phone: { bsonType: ['string', 'null'], maxLength: 20 },
        message: { bsonType: 'string', minLength: 10 },
        sms_consent: { bsonType: 'bool' },
        marketing_consent: { bsonType: 'bool' },
        status: { enum: ['new', 'read', 'responded', 'archived'] },
        notes: { bsonType: ['string', 'null'] },
        ip_address: { bsonType: ['string', 'null'] },
        user_agent: { bsonType: ['string', 'null'] },
        submitted_at: { bsonType: 'string' },
        responded_at: { bsonType: ['string', 'null'] },
        created_at: { bsonType: 'string' },
        updated_at: { bsonType: 'string' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

// Indexes for contact_submissions
db.contact_submissions.createIndex({ email: 1 }); // Fast email lookups
db.contact_submissions.createIndex({ status: 1 }); // Filter by status
db.contact_submissions.createIndex({ submitted_at: -1 }); // Sort by submission time (most recent first)
db.contact_submissions.createIndex({ created_at: -1 }); // Alternative timestamp index

// ============================================================================
// 2. AUDIT LOGS COLLECTION
// ============================================================================
// Append-only audit trail for user actions and entity changes
db.createCollection('audit_logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'action', 'entity_type', 'created_at'],
      properties: {
        user_id: { bsonType: 'string' },
        action: { bsonType: 'string' },
        entity_type: { bsonType: 'string' },
        entity_id: { bsonType: ['string', 'null'] },
        old_values: { bsonType: ['object', 'null'] },
        new_values: { bsonType: ['object', 'null'] },
        user_agent: { bsonType: ['string', 'null'] },
        created_at: { bsonType: 'string' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

// Indexes for audit_logs
db.audit_logs.createIndex({ created_at: -1 }); // Primary sort: most recent first
db.audit_logs.createIndex({ user_id: 1, created_at: -1 }); // User activity queries
db.audit_logs.createIndex({ action: 1, created_at: -1 }); // Filter by action type
db.audit_logs.createIndex({ entity_type: 1, entity_id: 1 }); // Entity-specific queries
db.audit_logs.createIndex({ entity_type: 1, created_at: -1 }); // Entity type with time sorting

// ============================================================================
// 3. CLIENT FILES COLLECTION
// ============================================================================
// File metadata with expiration dates (files stored in GridFS)
db.createCollection('client_files', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'file_name', 'file_type', 'file_size', 'created_at', 'expires_at', 'gridfs_id'],
      properties: {
        user_id: { bsonType: 'string' },
        file_name: { bsonType: 'string' },
        file_type: { bsonType: 'string' },
        file_size: { bsonType: 'number', minimum: 0 },
        created_at: { bsonType: 'string' },
        expires_at: { bsonType: 'string' },
        project_id: { bsonType: ['string', 'null'] },
        gridfs_id: { bsonType: 'objectId' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

// Indexes for client_files
db.client_files.createIndex({ user_id: 1, created_at: -1 }); // User's files, newest first
db.client_files.createIndex({ expires_at: 1 }); // TTL cleanup queries
db.client_files.createIndex({ project_id: 1 }); // Project file associations
db.client_files.createIndex({ gridfs_id: 1 }, { unique: true }); // Unique GridFS reference

// TTL Index: Automatically delete expired files (requires expires_at as Date, not string)
// Note: If expires_at is stored as ISO string, convert to Date or use application-level cleanup
// db.client_files.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });

// ============================================================================
// 4. SERVICES COLLECTION
// ============================================================================
// Service catalog with pricing, features, and categories
db.createCollection('services', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'category', 'base_price', 'is_active', 'created_at', 'updated_at'],
      properties: {
        name: { bsonType: 'string' },
        category: { bsonType: 'string' },
        description: { bsonType: ['string'] },
        base_price: { bsonType: 'number', minimum: 0 },
        features: { bsonType: ['array', 'object', 'null'] },
        add_ons: { bsonType: ['array', 'object', 'null'] },
        is_active: { bsonType: 'bool' },
        created_at: { bsonType: 'string' },
        updated_at: { bsonType: 'string' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

// Indexes for services
db.services.createIndex({ category: 1, name: 1 }); // Primary query pattern: sort by category then name
db.services.createIndex({ is_active: 1, category: 1 }); // Filter active services by category
db.services.createIndex({ name: 1 }); // Name lookups

// ============================================================================
// 5. PROJECTS COLLECTION
// ============================================================================
// Project tracking with status, progress, and dates
db.createCollection('projects', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'title', 'status', 'progress_percentage', 'created_at', 'updated_at'],
      properties: {
        user_id: { bsonType: 'string' },
        title: { bsonType: 'string' },
        description: { bsonType: ['string', 'null'] },
        status: { bsonType: 'string' },
        progress_percentage: { bsonType: 'number', minimum: 0, maximum: 100 },
        start_date: { bsonType: ['string', 'null'] },
        end_date: { bsonType: ['string', 'null'] },
        created_at: { bsonType: 'string' },
        updated_at: { bsonType: 'string' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

// Indexes for projects
db.projects.createIndex({ user_id: 1, created_at: -1 }); // User's projects, newest first
db.projects.createIndex({ status: 1, created_at: -1 }); // Filter by status with time sorting
db.projects.createIndex({ user_id: 1, status: 1 }); // User projects by status

// ============================================================================
// SUMMARY
// ============================================================================
// Collections created:
// - contact_submissions: Contact form data with status tracking
// - audit_logs: Append-only audit trail
// - client_files: File metadata with expiration
// - services: Service catalog
// - projects: Project tracking
//
// All collections include:
// - Schema validation for data integrity
// - Optimized indexes for common query patterns
// - Timestamp-based sorting indexes
//
// Note: TTL indexes require Date objects, not ISO strings.
// Consider converting timestamp strings to Date objects or implement
// application-level cleanup for expired records.
