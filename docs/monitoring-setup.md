# Monitoring and Alerting Setup Guide

This guide explains how to set up monitoring and alerting for the DOBEU application.

## Sentry Integration

### 1. Install Sentry

```bash
npm install @sentry/react
```

### 2. Initialize Sentry

Create `src/lib/sentry.ts`:

```typescript
import * as Sentry from "@sentry/react";

export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
}
```

### 3. Update Error Handler

Modify `src/lib/error-handler.ts` to use Sentry:

```typescript
import * as Sentry from "@sentry/react";

// In logError function, replace the comment with:
if (import.meta.env.PROD) {
  Sentry.captureException(errorObj, {
    level: report.severity as Sentry.SeverityLevel,
    tags: { category: report.category },
    extra: report.context,
  });
}
```

### 4. Update Error Boundary

Modify `src/components/ErrorBoundary.tsx`:

```typescript
import * as Sentry from "@sentry/react";

componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: { react: errorInfo },
    });
  }
  // ... rest of the code
}
```

### 5. Add to main.tsx

```typescript
import { initSentry } from "@/lib/sentry";
initSentry();
```

## Environment Variables

Add to `.env`:

```
VITE_SENTRY_DSN=your-sentry-dsn-here
```

## Uptime Monitoring

### Option 1: UptimeRobot (Free)

1. Sign up at https://uptimerobot.com
2. Add a monitor for your production URL
3. Set up email/SMS alerts

### Option 2: Pingdom

1. Sign up at https://www.pingdom.com
2. Create an HTTP(S) check
3. Configure alert channels

## Performance Monitoring

### Web Vitals

Already integrated via PostHog and Mixpanel. To add custom tracking:

```typescript
import { onCLS, onFID, onLCP } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onLCP(console.log);
```

## Log Aggregation

### Option 1: Logtail (Recommended)

1. Sign up at https://logtail.com
2. Install the client library
3. Forward logs from edge functions

### Option 2: Datadog

1. Sign up at https://www.datadoghq.com
2. Install the Datadog agent
3. Configure log forwarding

## Alerting

### Slack Integration

1. Create a Slack webhook
2. Add to environment variables
3. Send alerts from edge functions:

```typescript
async function sendSlackAlert(message: string) {
  const webhook = Deno.env.get('SLACK_WEBHOOK_URL');
  if (webhook) {
    await fetch(webhook, {
      method: 'POST',
      body: JSON.stringify({ text: message }),
    });
  }
}
```

### Email Alerts

Already configured via Resend in edge functions.

## Health Checks

The application includes health check endpoints:

- `/api/health` - Basic health check
- Supabase connection health via `useSupabaseHealth` hook

## Best Practices

1. **Don't log sensitive data** - Never log passwords, tokens, or PII
2. **Use appropriate log levels** - Use error for errors, warn for warnings
3. **Set up alerting thresholds** - Don't alert on every error, use thresholds
4. **Monitor error rates** - Track error rates over time
5. **Set up dashboards** - Create dashboards for key metrics

