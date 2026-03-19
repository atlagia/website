# Subagent: seopilot-workers

**Phase:** 8 — Background Workers (Trigger.dev v3)
**subagent_type:** `generalPurpose`
**model:** fast

---

## Objective

Set up Trigger.dev v3 workers for all background jobs: crawling, auditing, fixing, reporting, and scheduled scans.

## Inputs

- Monorepo with all packages built
- Crawler, agents, integrations packages available
- API with tRPC routers and Redis events

## Steps

### 1. Trigger.dev Setup

```bash
cd workers
npm install @trigger.dev/sdk @trigger.dev/react-hooks
npx trigger.dev@latest init
```

Configure `trigger.config.ts`:
```typescript
import { defineConfig } from '@trigger.dev/sdk/v3';
export default defineConfig({
  project: 'seopilot',
  runtime: 'node',
  retries: { default: { maxAttempts: 3, factor: 2, minTimeoutInMs: 1000, maxTimeoutInMs: 30000 } },
});
```

### 2. Job: crawl-site.ts

```typescript
import { task } from '@trigger.dev/sdk/v3';
import { crawlSite } from '@seopilot/crawler';
import { emitEvent } from '../lib/events';

export const crawlSiteTask = task({
  id: 'crawl-site',
  maxDuration: 600, // 10 minutes max
  run: async (payload: { siteId: string; scanId: string; url: string; options?: CrawlOptions }) => {
    // 1. Update scan status → 'crawling'
    // 2. Run crawlSite with progress callback → emitEvent('scan.progress')
    // 3. Store crawl results in DB (pages table)
    // 4. Upload raw data to R2
    // 5. Update scan: pagesScanned, status → 'analyzing'
    // 6. Trigger run-audit task
    return { pagesScanned: result.pages.length, issueCount: result.issues.length };
  },
});
```

### 3. Job: run-audit.ts

```typescript
export const runAuditTask = task({
  id: 'run-audit',
  maxDuration: 900, // 15 minutes (LLM calls)
  run: async (payload: { scanId: string; siteId: string; autoFix: boolean }) => {
    // 1. Load crawl data from DB
    // 2. Run seoAuditGraph.invoke() from packages/agents
    // 3. Progress events emitted by graph nodes → Redis → SSE
    // 4. Store issues in DB
    // 5. Store fixes in DB
    // 6. Update scan: issuesFound, seoScoreBefore/After
    // 7. If autoFix: trigger apply-fixes
    // 8. Trigger generate-report
    return { issuesFound, fixesSuggested, seoScore };
  },
});
```

### 4. Job: apply-fixes.ts

```typescript
export const applyFixesTask = task({
  id: 'apply-fixes',
  maxDuration: 300, // 5 minutes
  run: async (payload: { siteId: string; fixIds: string[] }) => {
    // 1. Load fixes from DB
    // 2. Load platform connector for site
    // 3. For each fix:
    //    a. Call connector method (updateMeta, addSchema, etc.)
    //    b. Update fix status in DB
    //    c. Emit fix.applied event
    // 4. Return summary: applied, failed counts
    return { applied: successCount, failed: failCount };
  },
});
```

### 5. Job: generate-report.ts

```typescript
export const generateReportTask = task({
  id: 'generate-report',
  maxDuration: 120, // 2 minutes
  run: async (payload: { scanId: string; siteId: string }) => {
    // 1. Load scan + issues + fixes from DB
    // 2. Compile report data (executive summary, scores, issues, recommendations)
    // 3. Generate PDF using @react-pdf/renderer
    // 4. Upload PDF to R2
    // 5. Store report record in DB with R2 URL
    // 6. Emit scan.progress with phase: 'completed'
    // 7. Update scan status → 'completed'
    return { reportUrl, reportId };
  },
});
```

### 6. Job: scheduled-scan.ts

```typescript
export const scheduledScanTask = task({
  id: 'scheduled-scan',
  // Triggered by cron schedule, not on-demand
  run: async () => {
    // 1. Query sites where scanSchedule matches current time
    //    - daily: every day at 3:00 UTC
    //    - weekly: every Monday at 3:00 UTC
    //    - monthly: 1st of month at 3:00 UTC
    // 2. For each site:
    //    a. Check scan quota (plan limits)
    //    b. Create scan record
    //    c. Trigger crawl-site task
    // 3. Log scheduled scan execution
    return { sitesScanned: count };
  },
});

// Register cron in trigger.config.ts or via API
```

### 7. Job: competitor-scan.ts

```typescript
export const competitorScanTask = task({
  id: 'competitor-scan',
  maxDuration: 600,
  run: async (payload: { competitorId: string; siteId: string }) => {
    // 1. Load competitor URL
    // 2. Run lightweight crawl (max 50 pages)
    // 3. Run technical + content analyzers
    // 4. Calculate competitor SEO score
    // 5. Store results in competitors table
    // 6. Compare with site's latest scan
    return { competitorScore, comparisonData };
  },
});
```

### 8. Progress Utility (src/utils/progress-emitter.ts)

```typescript
import { emitEvent } from '../../apps/api/src/lib/events';

export function createProgressEmitter(scanId: string) {
  return {
    crawlProgress: (pagesScanned: number, totalPages: number, currentUrl: string) =>
      emitEvent(`scan:${scanId}`, { type: 'scan.progress', scanId, phase: 'crawling', pagesScanned, totalPages, currentUrl }),
    agentActivity: (agentType: string, action: string, details: string) =>
      emitEvent(`agent:${scanId}`, { type: 'agent.activity', scanId, agentType, action, details, timestamp: new Date().toISOString() }),
    fixApplied: (fixId: string, issueId: string, status: 'success' | 'failed', beforeValue: string, afterValue: string) =>
      emitEvent(`fix:${scanId}`, { type: 'fix.applied', fixId, issueId, status, beforeValue, afterValue }),
  };
}
```

### 9. Error Handler (src/utils/error-handler.ts)

- Catch task failures
- Log to agentLogs table with error details
- Update scan status to 'failed' if critical
- Send notification email (via Resend) to user
- Retry logic handled by Trigger.dev config

### 10. Test

- Trigger crawl-site job manually
- Verify progress events flow to dashboard
- Trigger scheduled-scan and verify site selection
- Test error handling: simulate failure and verify retry

## Output

Return: jobs created (6), scheduled tasks configured, progress events flowing, retry logic tested, any issues.
