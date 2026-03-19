# Subagent: seopilot-realtime

**Phase:** 6 — Real-time Events (SSE + Redis Pub/Sub)
**subagent_type:** `generalPurpose`
**model:** fast

---

## Objective

Wire up real-time event streaming from workers → API → dashboard using SSE via tRPC subscriptions and Redis pub/sub.

## Inputs

- Backend API running with tRPC (apps/api)
- Dashboard UI built (apps/web)
- Redis (Upstash) configured

## Steps

### 1. Redis Pub/Sub Layer (apps/api/src/lib/events.ts)

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! });

export type SEOPilotEvent =
  | { type: 'scan.progress'; scanId: string; phase: string; pagesScanned: number; totalPages: number; currentUrl: string }
  | { type: 'agent.activity'; scanId: string; agentType: string; action: string; details: string; timestamp: string }
  | { type: 'fix.applied'; fixId: string; issueId: string; status: 'success' | 'failed'; beforeValue: string; afterValue: string }
  | { type: 'score.update'; siteId: string; oldScore: number; newScore: number; breakdown: object };

export async function emitEvent(channel: string, event: SEOPilotEvent) {
  await redis.publish(channel, JSON.stringify(event));
}

export async function subscribeToChannel(channel: string, callback: (event: SEOPilotEvent) => void) {
  // Use Redis SUBSCRIBE or polling for serverless compatibility
}
```

### 2. tRPC Subscription Procedures

Add SSE subscription procedures to existing routers:

**scan.ts → onProgress:**
- Subscribe to `scan:{scanId}` Redis channel
- Stream `scan.progress` events to client
- Auto-close when scan completes

**agent.ts → onActivity:**
- Subscribe to `agent:{scanId}` Redis channel
- Stream `agent.activity` events
- Include all agent types

**fix.ts → onFixProgress:**
- Subscribe to `fix:{siteId}` Redis channel
- Stream `fix.applied` events

**site.ts → onScoreUpdate:**
- Subscribe to `site:{siteId}` Redis channel
- Stream `score.update` events

### 3. Worker Event Emission

Update worker jobs to emit events:

**crawl-site.ts:** Emit `scan.progress` on every page crawled
**run-audit.ts:** Emit `agent.activity` on each node transition
**apply-fixes.ts:** Emit `fix.applied` on each fix result
**generate-report.ts:** Emit `scan.progress` with phase: 'reporting'

### 4. Dashboard SSE Consumers

**Scan Progress Component:**
```typescript
const { data } = trpc.scan.onProgress.useSubscription({ scanId }, {
  onData: (event) => { /* update progress bar */ },
});
```

**Agent Activity Feed:**
```typescript
trpc.agent.onActivity.useSubscription({ scanId }, {
  onData: (event) => { /* prepend to timeline */ },
});
```

**Toast Notifications:**
- On `fix.applied` with status 'success' → success toast
- On `fix.applied` with status 'failed' → error toast
- On `score.update` → info toast with score change

### 5. Reconnection Logic

- SSE auto-reconnects via browser EventSource
- tRPC httpSubscriptionLink handles reconnection
- Exponential backoff: 1s, 2s, 4s, 8s, max 30s
- Show "Reconnecting..." indicator in UI
- On reconnect: fetch missed events from DB (gap fill)

### 6. Heartbeat

- Server sends `:heartbeat` comment every 30s
- Client detects missed heartbeat → trigger reconnect
- Prevents proxy/firewall timeout

### 7. Test

- Trigger a scan via dashboard
- Verify progress bar updates in real-time
- Verify agent activity feed shows live entries
- Kill connection and verify reconnection works
- Verify events persist in DB for history

## Output

Return: event types implemented, subscription count, reconnection confirmed, test results.
