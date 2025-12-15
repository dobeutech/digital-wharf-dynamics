# Disaster Recovery Plan

This document outlines the disaster recovery procedures for the DOBEU application.

## Backup Strategy

### Database Backups

1. **Automated Daily Backups**
   - Location: Supabase automated backups
   - Retention: 30 days
   - Frequency: Daily at 2 AM UTC
   - Edge Function: `backup-database`

2. **Manual Backups**
   - Can be triggered via Supabase dashboard
   - Or via edge function with authentication

3. **Backup Verification**
   - Weekly restoration tests
   - Automated backup integrity checks

### File Storage Backups

1. **Supabase Storage**
   - Automatic replication
   - Point-in-time recovery available
   - Manual export available via Supabase dashboard

### Configuration Backups

1. **Environment Variables**
   - Stored in version control (encrypted)
   - Backup in secure password manager
   - Documented in `.env.example`

2. **Database Migrations**
   - All migrations in version control
   - Located in `supabase/migrations/`

## Recovery Procedures

### Database Recovery

1. **From Automated Backup**

   ```bash
   # Via Supabase Dashboard
   # 1. Navigate to Database > Backups
   # 2. Select backup point
   # 3. Restore to new database or overwrite existing
   ```

2. **From Manual Backup**
   ```bash
   # Restore from database_backups table
   # Use Supabase SQL editor to restore data
   ```

### Application Recovery

1. **Code Recovery**
   - All code in Git repository
   - Deploy from main branch
   - Rollback to previous deployment if needed

2. **Environment Recovery**
   - Restore environment variables from backup
   - Verify all services are configured correctly

### Full System Recovery

1. **Infrastructure**
   - Redeploy from Git repository
   - Restore environment variables
   - Verify Supabase connection

2. **Database**
   - Restore from most recent backup
   - Run pending migrations
   - Verify data integrity

3. **File Storage**
   - Restore from Supabase Storage backup
   - Verify file accessibility

4. **Verification**
   - Run health checks
   - Test critical user flows
   - Monitor error rates

## Recovery Time Objectives (RTO)

- **Critical Systems**: 1 hour
- **Non-Critical Systems**: 4 hours
- **Full Recovery**: 24 hours

## Recovery Point Objectives (RPO)

- **Database**: 24 hours (daily backups)
- **File Storage**: Real-time (replicated)
- **Configuration**: 1 hour (version control)

## Testing

### Backup Testing

- Weekly automated backup verification
- Monthly full restoration test
- Quarterly disaster recovery drill

### Documentation Updates

- Update this document quarterly
- Review and update recovery procedures
- Document any changes to infrastructure

## Contact Information

- **Primary Contact**: [Your Name]
- **Backup Contact**: [Backup Name]
- **Emergency Escalation**: [Escalation Path]

## Post-Recovery

After a disaster recovery:

1. Document the incident
2. Review what went wrong
3. Update procedures if needed
4. Test backups more frequently
5. Review monitoring and alerting
