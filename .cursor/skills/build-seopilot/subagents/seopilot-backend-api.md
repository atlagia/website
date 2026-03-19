# Subagent: seopilot-backend-api

**Phase:** 2 — Backend API (Hono + Drizzle + tRPC + Auth + Billing)
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Implement the complete backend: database schema, authentication, billing, and all 8 tRPC routers.

## Inputs

- `projectRoot`: Monorepo root path
- Scaffold confirmation (apps/api boots on :4000)
- DATABASE_URL from .env

## Steps

### 1. Drizzle Schema (apps/api/drizzle/schema.ts)

Implement the full schema from architecture.md section 3:
- **13 tables:** users, organizations, orgMembers, sites, scans, pages, issues, fixes, agentLogs, reports, seoScoreHistory, competitors, seoKnowledge
- **7 enums:** plan, scan_status, issue_severity, issue_category, fix_status, platform, agent_type
- **All indexes** for query performance (sites_org_idx, scans_site_idx, issues_severity_idx, etc.)
- **All relations** (users → orgs, sites → scans → pages/issues, etc.)

### 2. Drizzle Config & Migrations

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

Run: `npx drizzle-kit generate && npx drizzle-kit migrate`

### 3. Database Client (apps/api/src/lib/db.ts)

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import * as schema from '../../drizzle/schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### 4. Better Auth Setup (apps/api/src/lib/auth.ts)

- Email/password strategy
- Google OAuth strategy
- Magic link strategy (via Resend)
- Organization plugin (multi-tenant)
- Session stored in DB
- Hono middleware for route protection

### 5. Stripe Setup (apps/api/src/lib/stripe.ts)

Products and prices:
| Plan | Price | Max Sites | Scans/Month |
|------|-------|-----------|-------------|
| Free | $0 | 1 | 5 |
| Starter | $29/mo | 5 | 50 |
| Pro | $99/mo | 25 | 500 |
| Enterprise | $299/mo | Unlimited | Unlimited |

Webhook handler for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 6. tRPC Setup

**Context (apps/api/src/trpc/context.ts):**
- Extract auth session from request
- Provide db, redis, stripe clients
- Provide authed user and org

**Root Router (apps/api/src/trpc/router.ts):**
Merge all 8 sub-routers.

### 7. Implement tRPC Routers

Each router file in `apps/api/src/trpc/routers/`:

**site.ts:**
- `list`: paginated query with org filter
- `getById`: site + latest scan + score history
- `create`: validate URL, detect platform, insert
- `update`: partial update (name, settings, auto_fix, schedule)
- `delete`: cascade delete (soft delete preferred)
- `getStats`: aggregate across all org sites

**scan.ts:**
- `trigger`: create scan record, enqueue Trigger.dev job, return scanId
- `getStatus`: scan with progress info
- `list`: paginated scan history for a site
- `getResults`: scan + pages + issues (with pagination)
- `onProgress`: SSE subscription — stream scan progress events

**issue.ts:**
- `list`: paginated, filterable (severity, category, fixStatus, pageUrl search), sortable
- `getById`: issue + page + fix suggestions
- `bySeverity`: GROUP BY severity → counts
- `byCategory`: GROUP BY category → counts
- `bulkUpdateStatus`: update multiple issues' fixStatus

**fix.ts:**
- `suggest`: call AI agent to generate fix for issue
- `apply`: apply fix via platform integration
- `applyBulk`: batch apply multiple fixes
- `revert`: revert applied fix
- `onFixProgress`: SSE subscription

**report.ts:**
- `generate`: trigger report generation job
- `list`: report history for site
- `download`: generate signed R2 URL for PDF

**agent.ts:**
- `getLogs`: paginated agent activity logs for a scan
- `getStatus`: current agent states (which is active, queue depth)
- `onActivity`: SSE subscription — live agent actions

**billing.ts:**
- `getSubscription`: current plan, usage, limits
- `createCheckout`: Stripe checkout session URL
- `createPortal`: Stripe billing portal URL
- `getUsage`: scans used vs limit this month

**integration.ts:**
- `connect`: initiate OAuth flow → return redirect URL
- `disconnect`: revoke tokens, remove credentials
- `list`: connected platforms for org
- `test`: ping platform API with stored credentials

### 8. Middleware

- **auth.ts:** Verify session, attach user/org to context. Public routes: health, webhooks.
- **rate-limit.ts:** Upstash rate limiter (100 req/min for API, 10 req/min for scan triggers)
- **cors.ts:** Allow frontend origin, credentials

### 9. R2 Storage (apps/api/src/lib/r2.ts)

S3-compatible client for Cloudflare R2. Functions:
- `uploadReport(key, buffer): Promise<string>` → returns public URL
- `uploadScreenshot(key, buffer): Promise<string>`
- `getSignedUrl(key): Promise<string>` → temporary download URL

### 10. Wire Everything into Hono App

```typescript
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/context';

app.use('/trpc/*', trpcServer({ router: appRouter, createContext }));
app.post('/webhooks/stripe', stripeWebhookHandler);
app.all('/api/auth/*', betterAuthHandler);
```

### 11. Verify

- API boots on :4000
- `POST /api/auth/sign-up` → creates user
- `POST /api/auth/sign-in` → returns session
- `/trpc/site.list` → returns empty array (authed)
- Stripe webhook endpoint responds

## Output

Return: routes created (list all 8 routers with procedure counts), schema migrated (table count), auth flow confirmed, Stripe products created, any issues.
