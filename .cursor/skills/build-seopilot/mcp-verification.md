# SEOPilot — MCP Verification Workflows

This document defines the MCP browser verification checkpoints for the SEOPilot dashboard build process. MCP verification uses `cursor-ide-browser` tools.

---

## Verification Points (Mandatory)

### Checkpoint 1: After Scaffold (Phase 1)

**When:** Both dev servers boot successfully.

```
MCP Actions:
1. browser_navigate → http://localhost:3000
   Expected: Next.js default page or blank dashboard shell
2. browser_take_screenshot → "checkpoint-1-web.png"
3. browser_navigate → http://localhost:4000/health
   Expected: JSON response { "status": "ok" }
4. browser_take_screenshot → "checkpoint-1-api.png"

Pass: Both URLs respond without error.
```

### Checkpoint 2: After Backend API (Phase 2)

**When:** Database migrated, auth and tRPC working.

```
MCP Actions:
1. browser_navigate → http://localhost:4000/health
   Expected: { "status": "ok", "database": "connected" }
2. Use shell to test auth:
   curl -X POST http://localhost:4000/api/auth/sign-up \
     -H "Content-Type: application/json" \
     -d '{"email":"test@seopilot.ai","password":"Test1234!","name":"Test"}'
   Expected: 200 with user object
3. Use shell to test tRPC:
   curl http://localhost:4000/trpc/site.list \
     -H "Cookie: <session-cookie>"
   Expected: 200 with empty array

Pass: Auth creates user, tRPC responds with data.
```

### Checkpoint 3: After Crawler (Phase 3)

**When:** Crawler package can scan a URL.

```
Test via shell:
  cd packages/crawler
  npx tsx src/test-crawl.ts http://localhost:7026/en

Expected output:
  - Pages discovered: > 0
  - Meta extracted for each page
  - Issues identified
  - No uncaught errors

Pass: Crawler returns structured CrawlResult.
```

### Checkpoint 4: After AI Agents (Phase 4)

**When:** LangGraph pipeline runs end-to-end.

```
Test via shell:
  cd packages/agents
  npx tsx src/test-pipeline.ts http://localhost:7026/en

Expected output:
  - Crawl node: pages scanned
  - Audit nodes: issues found per category
  - Fix generator: suggestions generated
  - Report builder: report compiled
  - SEO score calculated

Pass: Pipeline completes all nodes without error.
```

### Checkpoint 5: After Dashboard UI (Phase 5) — FULL MCP

**When:** All dashboard pages built and connected to API.

```
MCP Actions:

Page 1: Login
  browser_navigate → http://localhost:3000/login
  browser_snapshot → verify form elements (email, password, submit)
  browser_take_screenshot → "checkpoint-5-login.png"

Page 2: Dashboard Overview
  browser_navigate → http://localhost:3000
  (auth first via cookie or test user)
  browser_snapshot → verify: KPI cards, chart, recent scans, activity feed
  browser_take_screenshot → "checkpoint-5-dashboard.png"

Page 3: Site List
  browser_navigate → http://localhost:3000/sites
  browser_snapshot → verify: site cards or table, "Add Site" button
  browser_take_screenshot → "checkpoint-5-sites.png"

Page 4: Add Site
  browser_navigate → http://localhost:3000/sites/new
  browser_snapshot → verify: URL input, platform detection
  browser_take_screenshot → "checkpoint-5-add-site.png"

Page 5: Site Detail
  browser_navigate → http://localhost:3000/sites/{testSiteId}
  browser_snapshot → verify: score ring, breakdown, issues chart
  browser_take_screenshot → "checkpoint-5-site-detail.png"

Page 6: Issues
  browser_navigate → http://localhost:3000/sites/{testSiteId}/issues
  browser_snapshot → verify: data table, filters, pagination
  browser_take_screenshot → "checkpoint-5-issues.png"

Page 7: Fixes
  browser_navigate → http://localhost:3000/sites/{testSiteId}/fixes
  browser_snapshot → verify: fix cards, before/after, apply button
  browser_take_screenshot → "checkpoint-5-fixes.png"

Page 8: Settings
  browser_navigate → http://localhost:3000/settings
  browser_take_screenshot → "checkpoint-5-settings.png"
  browser_navigate → http://localhost:3000/settings/billing
  browser_take_screenshot → "checkpoint-5-billing.png"
  browser_navigate → http://localhost:3000/settings/integrations
  browser_take_screenshot → "checkpoint-5-integrations.png"

Page 9: Mobile
  browser_navigate → http://localhost:3000 (viewport: 375x812)
  browser_take_screenshot → "checkpoint-5-mobile.png"

Pass: All pages render without errors, dark mode active, responsive layout works.
```

### Checkpoint 6: After Real-time (Phase 6)

**When:** SSE events flow from workers to dashboard.

```
MCP Actions:
1. browser_navigate → http://localhost:3000/sites/{testSiteId}
2. Trigger scan via API:
   curl -X POST http://localhost:4000/trpc/scan.trigger \
     -H "Content-Type: application/json" \
     -d '{"siteId":"test-site-id"}'
3. browser_snapshot → verify progress bar appears
4. browser_wait → 5s
5. browser_snapshot → verify progress updates (pages scanned counter changes)
6. browser_take_screenshot → "checkpoint-6-realtime.png"

Pass: Real-time progress visible in dashboard without page refresh.
```

### Checkpoint 7: After Integrations (Phase 7)

**When:** OAuth flows and connector tests work.

```
MCP Actions:
1. browser_navigate → http://localhost:3000/settings/integrations
2. browser_snapshot → verify: platform cards (Shopify, WordPress, Webflow, GSC, GA)
3. browser_take_screenshot → "checkpoint-7-integrations.png"
4. browser_click → "Connect" on any platform
5. browser_snapshot → verify OAuth redirect or connection modal

Pass: Integration cards render, connect button initiates flow.
```

### Checkpoint 8: After Workers (Phase 8)

**When:** Trigger.dev jobs process successfully.

```
Test via shell:
  # Check Trigger.dev dashboard (if available)
  # Or trigger a job and verify completion:
  curl -X POST http://localhost:4000/trpc/scan.trigger \
    -d '{"siteId":"test-site-id"}'
  # Wait 30s
  curl http://localhost:4000/trpc/scan.getStatus?scanId=...
  Expected: status = "completed"

Pass: Jobs execute, complete, and update DB.
```

### Checkpoint 9: Full E2E (Phase 9) — COMPREHENSIVE MCP

See `subagents/seopilot-verify.md` for the full 10-flow verification matrix.

```
Summary:
- 10 user flows tested
- 20+ screenshots captured
- Mobile responsive verified
- Dark mode verified
- Console errors checked
- All critical paths validated

Pass: All 10 flows pass. No critical console errors.
```

---

## Screenshot Naming Convention

```
checkpoint-{phase}-{page/feature}.png
```

Examples:
- `checkpoint-1-web.png`
- `checkpoint-5-dashboard.png`
- `checkpoint-5-issues.png`
- `checkpoint-9-flow3-scan-progress.png`

---

## Failure Protocol

If any checkpoint fails:
1. Identify the failing element (page, component, API endpoint)
2. Check browser console for errors
3. Check API logs for errors
4. Fix the issue
5. Re-run the checkpoint
6. Only proceed to next phase when checkpoint passes

---

## Tools Used

| Tool | Purpose |
|------|---------|
| `browser_navigate` | Load pages |
| `browser_snapshot` | DOM/accessibility tree inspection |
| `browser_take_screenshot` | Visual verification |
| `browser_click` | Interact with buttons/links |
| `browser_fill` | Enter text in forms |
| `browser_wait` | Wait for async operations |
| `browser_scroll` | Scroll to verify below-fold content |
| `browser_tabs` | Check open tabs |
| `browser_lock` / `browser_unlock` | Lock tab for interactions |
