---
name: build-seopilot
description: Orchestrates the full build of SEOPilot SaaS dashboard — monorepo scaffold, backend API, crawler engine, AI agents, dashboard UI, real-time events, integrations, and E2E verification. Uses specialist subagents for each phase. Use when the user says "build SEOPilot", "create SEOPilot dashboard", "build the SaaS", or wants the full platform built.
---

# Build SEOPilot — SaaS Dashboard Orchestrator

This skill builds the **complete SEOPilot SaaS platform** from scratch using specialist subagents. You (the main agent) run Phase 0, then delegate Phases 1–9 to subagents in sequence, passing context between them.

**Reference documents (read these first):**
- [tech-stack.md](tech-stack.md) — All technology decisions with research-backed reasoning
- [architecture.md](architecture.md) — System architecture, DB schema, API structure, monorepo layout

---

## Phase 0 — You Do This (Main Agent)

### 0.1 Validate Prerequisites

Before delegating, verify:

```bash
# Required global tools
node -v          # ≥ 22.0.0
npm -v           # ≥ 10.0.0
npx turbo --version  # or install: npm i -g turbo
```

### 0.2 Build Context Payload

Assemble this context for all subagents:

```json
{
  "projectName": "seopilot",
  "projectRoot": "<absolute-path>/seopilot",
  "port": {
    "web": 3000,
    "api": 4000
  },
  "database": {
    "provider": "neon",
    "orm": "drizzle"
  },
  "auth": "better-auth",
  "billing": "stripe",
  "queue": "trigger.dev",
  "cache": "upstash-redis",
  "crawler": "crawlee+playwright",
  "aiOrchestration": "langgraph",
  "llm": {
    "primary": "claude",
    "fallback": "gpt-4o"
  },
  "deployment": {
    "frontend": "vercel",
    "backend": "railway"
  },
  "referenceFiles": {
    "techStack": ".cursor/skills/build-seopilot/tech-stack.md",
    "architecture": ".cursor/skills/build-seopilot/architecture.md"
  }
}
```

### 0.3 Create Todo List

Create todos for: Phase 0 (done), Scaffold, Backend API, Crawler Engine, AI Agents, Dashboard UI, Real-time & SSE, Integrations, E2E Testing, MCP Verify.

---

## Subagent Sequence

Run subagents **one after another**. Wait for each to finish and capture its summary before starting the next. Pass the **context payload** (updated with any new info) in every prompt.

| Order | Subagent Type | Phase | What It Does | Output |
|-------|--------------|-------|-------------|--------|
| 1 | **seopilot-scaffold** | Phase 1 | Turborepo monorepo, packages, config files, env vars, basic build | "Monorepo scaffolded at /path, dev servers boot on ports 3000/4000" |
| 2 | **seopilot-backend-api** | Phase 2 | Hono API, Drizzle schema+migrations, tRPC routers, Better Auth, Stripe billing, R2 | "API running on :4000, 8 tRPC routers, DB migrated, auth works" |
| 3 | **seopilot-crawler-engine** | Phase 3 | Crawlee + Playwright crawler, extractors, analyzers, sitemap/robots parsing | "Crawler package built, can crawl URL and extract SEO data" |
| 4 | **seopilot-ai-agents** | Phase 4 | LangGraph workflow, audit nodes, fix generator, checkpointer, prompts | "Agent pipeline runs: crawl → audit → fix → verify → report" |
| 5 | **seopilot-dashboard-ui** | Phase 5 | Next.js pages, shadcn/ui components, layouts, charts, data tables, forms | "Dashboard renders all pages, connected to tRPC, dark mode works" |
| 6 | **seopilot-realtime** | Phase 6 | SSE subscriptions, scan progress, agent activity feed, fix progress | "Real-time events flow from workers → API → dashboard" |
| 7 | **seopilot-integrations** | Phase 7 | Shopify, WordPress, Webflow, GSC, GA connectors | "All platform connectors built, OAuth flows work" |
| 8 | **seopilot-workers** | Phase 8 | Trigger.dev job definitions, scheduled scans, report generation | "Workers process crawl/audit/fix/report jobs via Trigger.dev" |
| 9 | **seopilot-verify** | Phase 9 | E2E testing with MCP browser, full workflow verification | "All flows verified: signup → add site → scan → view issues → apply fix" |

---

## Phase 1 — Scaffold (seopilot-scaffold)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD}

Instructions:
1. Read .cursor/skills/build-seopilot/architecture.md section "2. Monorepo Structure"
2. Create the Turborepo monorepo at {projectRoot}:
   - Initialize with `npx create-turbo@latest`
   - Create workspace structure: apps/web, apps/api, packages/shared, packages/crawler, packages/agents, packages/integrations, workers/
   - Configure turbo.json with build/dev/lint/test pipelines
   - Set up TypeScript configs (base, web, api) with path aliases
3. apps/web: Initialize Next.js 16 with App Router, Tailwind v4, TypeScript
   - Install: shadcn/ui init, @tanstack/react-query, @trpc/client, next-themes, recharts
   - Create basic layout structure: (auth) and (dashboard) route groups
   - Add shadcn components: sidebar, table, card, chart, button, input, dialog, sheet, badge, separator, dropdown-menu, avatar, progress
4. apps/api: Initialize Hono.js server
   - Install: hono, drizzle-orm, @neondatabase/serverless, @trpc/server, zod, better-auth, stripe, @upstash/redis, @aws-sdk/client-s3 (for R2)
   - Create basic server entry with health check endpoint
   - Set up Drizzle config pointing to Neon
5. packages/shared: Create shared Zod schemas and TypeScript types
6. Create .env.example with all required environment variables
7. Verify both apps boot: `turbo dev` → web on :3000, api on :4000
8. Return summary: paths created, ports confirmed, any issues.
```

**MCP verification:** After scaffold, navigate to `http://localhost:3000` and `http://localhost:4000/health` to confirm both apps respond.

---

## Phase 2 — Backend API (seopilot-backend-api)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "Scaffold done at {projectRoot}"

Instructions:
1. Read .cursor/skills/build-seopilot/architecture.md sections "3. Database Schema" and "4. tRPC API Structure"
2. Implement the full Drizzle schema in apps/api/drizzle/schema.ts:
   - All tables: users, organizations, orgMembers, sites, scans, pages, issues, fixes, agentLogs, reports, seoScoreHistory, competitors, seoKnowledge
   - All enums: plan, scan_status, issue_severity, issue_category, fix_status, platform, agent_type
   - All indexes for query performance
   - All relations
3. Run `npx drizzle-kit generate` and `npx drizzle-kit migrate` to create tables
4. Set up Better Auth:
   - Email/password + Google OAuth + magic link strategies
   - Organization/team support (multi-tenant)
   - Session management with Hono middleware
5. Set up Stripe billing:
   - Products: Free, Starter ($29/mo), Pro ($99/mo), Enterprise ($299/mo)
   - Webhook handler for subscription events
   - Usage metering (scans per month)
6. Implement all tRPC routers (8 routers):
   - site: CRUD + stats
   - scan: trigger + status + list + results + onProgress (SSE subscription)
   - issue: list (paginated/filtered) + byId + bySeverity + byCategory + bulkUpdate
   - fix: suggest + apply + applyBulk + revert + onFixProgress (SSE)
   - report: generate + list + download
   - agent: getLogs + getStatus + onActivity (SSE)
   - billing: getSubscription + createCheckout + createPortal + getUsage
   - integration: connect + disconnect + list + test
7. Add middleware: auth (protect routes), rate limiting (Upstash), CORS
8. Set up R2 client for file storage (reports, screenshots)
9. Verify: API boots, auth flow works (register/login), tRPC playground accessible
10. Return summary: routes created, schema migrated, auth working.
```

---

## Phase 3 — Crawler Engine (seopilot-crawler-engine)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "API done" + schema info

Instructions:
1. Read .cursor/skills/build-seopilot/architecture.md section "2" → packages/crawler
2. Install in packages/crawler: crawlee, playwright, cheerio, @crawlee/playwright
3. Build the SEO crawler (seo-crawler.ts):
   - Adaptive mode: CheerioCrawler for static pages, PlaywrightCrawler for JS-rendered
   - Configurable: maxConcurrency, maxCrawlDepth, maxRequestsPerCrawl
   - Auto-discovers pages via sitemap.xml, internal links, and robots.txt
   - Progress callback for SSE events
4. Build extractors (one file per concern):
   - meta.ts: title, description, OG tags, Twitter cards, canonical, robots meta
   - headings.ts: H1-H6 hierarchy and content
   - links.ts: internal/external link map, broken link detection (HEAD requests)
   - images.ts: src, alt text, dimensions, format, lazy loading
   - schema.ts: JSON-LD extraction and validation
   - performance.ts: Core Web Vitals (LCP, FID, CLS, INP, TTFB) via Playwright
   - accessibility.ts: basic a11y checks (ARIA, contrast, labels)
5. Build analyzers:
   - technical-seo.ts: missing/duplicate titles, missing descriptions, canonical issues, redirect chains, robots.txt problems, sitemap issues, HTTPS mixed content
   - content-seo.ts: thin content (<300 words), keyword density, missing headings, heading hierarchy violations, duplicate content detection
   - link-health.ts: broken links, orphan pages, excessive redirects, nofollow analysis
   - speed.ts: CWV scoring (good/needs improvement/poor), page weight analysis
6. Build utilities:
   - sitemap-parser.ts: parse XML sitemaps (including sitemap index)
   - robots-parser.ts: parse robots.txt rules
   - url-utils.ts: normalize URLs, detect duplicates, classify pages
7. Export a main function: `crawlSite(url: string, options: CrawlOptions): Promise<CrawlResult>`
8. Test: crawl a sample site (e.g., the SEOPilot marketing site at localhost:7026)
9. Return summary: extractors built, analyzers built, sample crawl results.
```

---

## Phase 4 — AI Agents (seopilot-ai-agents)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "Crawler done" + crawl output shape

Instructions:
1. Read .cursor/skills/build-seopilot/architecture.md section "5. AI Agent Pipeline"
2. Install in packages/agents: @langchain/langgraph, @langchain/core, @langchain/anthropic, @langchain/openai
3. Define LangGraph state (state.ts):
   - siteUrl, crawlData, technicalIssues, contentIssues, performanceIssues,
     mergedIssues (prioritized), suggestedFixes, appliedFixes, verificationResults,
     reportData, seoScore, progress
4. Build LangGraph nodes:
   - crawl-node.ts: triggers packages/crawler, validates output, updates state
   - technical-audit.ts: LLM analyzes crawl data → technical issues (structured output via Zod)
   - content-audit.ts: LLM analyzes content → content issues
   - performance-audit.ts: CWV data → performance issues
   - merge-prioritize.ts: combines all issues, deduplicates, sorts by severity
   - fix-generator.ts: LLM generates fix suggestions for each fixable issue
     - Meta tag generation (title ≤60 chars, description ≤160 chars)
     - JSON-LD schema markup generation
     - Heading restructuring
     - Internal link suggestions
     - Alt text generation
     - Content optimization suggestions
   - human-gate.ts: conditional node — if auto_fix enabled, proceed; else wait for approval
   - fix-applier.ts: uses packages/integrations to apply fixes via platform API
   - verification.ts: re-crawl affected pages, verify fixes applied
   - report-builder.ts: compile all data into report JSON + trigger PDF generation
5. Build the main graph (graph.ts):
   - START → crawl → [technical | content | performance] (parallel) → merge → fix-generator → human-gate → fix-applier → verification → report → END
   - Conditional edges: human-gate branches on auto_fix flag
   - Checkpoint: PostgresCheckpointer for resume-after-failure
6. Build tools (LLM tool definitions):
   - meta-generator.ts: generate optimized <title> and <meta description>
   - schema-generator.ts: generate JSON-LD for different page types
   - content-optimizer.ts: rewrite thin content with keyword optimization
   - alt-text-generator.ts: generate descriptive alt text from image context
   - internal-linker.ts: suggest relevant internal links based on content similarity
7. Build prompts (system prompts for each audit type):
   - technical-audit.ts: systematic technical SEO analysis prompt
   - content-audit.ts: content quality and keyword optimization prompt
   - fix-generation.ts: SEO fix generation with constraints (char limits, best practices)
   - report-template.ts: executive summary + detailed findings format
8. Test: run the full pipeline on a sample URL
9. Return summary: graph built, nodes working, sample pipeline output shape.
```

---

## Phase 5 — Dashboard UI (seopilot-dashboard-ui)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "Backend API + Crawler + Agents done"

Instructions:
1. Read .cursor/skills/build-seopilot/architecture.md section "7. Dashboard Pages"
2. Read .cursor/skills/build-seopilot/tech-stack.md for UI library choices
3. Set up tRPC client in apps/web/lib/trpc.ts with TanStack Query provider
4. Build layout:
   - (dashboard)/layout.tsx: sidebar (shadcn Sidebar), header with org switcher, mobile nav
   - (auth)/layout.tsx: centered card layout for auth pages
   - Sidebar items: Dashboard, Sites, Settings (with sub-items for Billing, Team, Integrations)
5. Build auth pages:
   - login/page.tsx: email + password + Google OAuth + magic link
   - register/page.tsx: signup form with org creation
   - Forgot password flow
6. Build dashboard overview page (/):
   - KPI cards: Total sites, Avg SEO score, Issues this month, Fixes applied (CountUp animation)
   - Score trend chart (Recharts LineChart, 30-day)
   - Recent scans table (shadcn Table with status badges)
   - Agent activity feed (live SSE timeline)
   - Quick action buttons
7. Build site pages:
   - /sites/page.tsx: site list with search + filter
   - /sites/new/page.tsx: add site wizard (URL input, platform detection, credentials)
   - /sites/[siteId]/page.tsx: score ring, breakdown, issue summary chart, last scan
   - /sites/[siteId]/issues/page.tsx: TanStack Table, filters (severity, category, status), expandable rows, bulk actions
   - /sites/[siteId]/fixes/page.tsx: fix queue with confidence, before/after diff, apply/revert
   - /sites/[siteId]/reports/page.tsx: report list with download
   - /sites/[siteId]/competitors/page.tsx: competitor comparison table
   - /sites/[siteId]/settings/page.tsx: site-specific settings
8. Build settings pages:
   - /settings/page.tsx: profile editor
   - /settings/billing/page.tsx: Stripe portal + usage meter
   - /settings/team/page.tsx: member list + invite
   - /settings/integrations/page.tsx: OAuth connect buttons per platform
9. Build reusable dashboard components:
   - seo-score-ring.tsx: animated circular progress (0-100)
   - issue-table.tsx: configurable TanStack Table for issues
   - agent-activity-feed.tsx: timeline with SSE updates
   - scan-progress-bar.tsx: multi-phase progress indicator
   - fix-suggestion-card.tsx: before/after diff with apply button
   - site-health-chart.tsx: Recharts area chart for score history
10. Implement dark mode with next-themes (default: dark)
11. MCP verify: navigate through every page, screenshot, confirm rendering
12. Return summary: all pages built, components list, any issues.
```

**MCP verification required:** Screenshot every major page — overview, site list, site detail, issues, fixes, settings.

---

## Phase 6 — Real-time & SSE (seopilot-realtime)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "Dashboard UI done"

Instructions:
1. Read .cursor/skills/build-seopilot/architecture.md section "6. SSE Event Types"
2. Implement SSE infrastructure:
   - API side: tRPC subscription procedures using SSE (httpSubscriptionLink)
   - Trigger.dev workers emit events to Redis pub/sub
   - API subscribes to Redis and streams to connected clients
3. Implement event types:
   - scan.progress: crawling phase, pages scanned, current URL
   - agent.activity: which agent is active, what it's doing
   - fix.applied: fix success/failure with before/after
   - score.update: score change after scan completes
4. Dashboard integration:
   - Scan progress: show real-time progress bar during active scans
   - Agent feed: live timeline of agent actions with icons/timestamps
   - Notifications: toast notifications for completed scans, new critical issues
   - Fix progress: real-time status when applying fixes
5. Add reconnection logic with exponential backoff
6. Test: trigger a scan and verify real-time updates appear in dashboard
7. Return summary: events flowing, reconnection works, UI updates confirmed.
```

---

## Phase 7 — Platform Integrations (seopilot-integrations)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "Real-time done"

Instructions:
1. Read .cursor/skills/build-seopilot/architecture.md section "2" → packages/integrations
2. Build base connector interface (base-connector.ts):
   - connect(credentials): Promise<void>
   - disconnect(): Promise<void>
   - testConnection(): Promise<boolean>
   - getPages(): Promise<Page[]>
   - updateMeta(pageId, meta): Promise<void>
   - addSchema(pageId, schema): Promise<void>
3. Shopify connector:
   - OAuth 2.0 app installation flow
   - GraphQL Admin API for page/product/collection meta updates
   - Metafield API for JSON-LD injection
4. WordPress connector:
   - Application Password auth or OAuth
   - REST API v2 for post/page meta updates
   - Yoast SEO REST fields for title/description/schema
5. Webflow connector:
   - OAuth 2.0 flow
   - Data API v2 for CMS item SEO field updates
6. Google Search Console connector:
   - OAuth 2.0 (Google Cloud Console)
   - Fetch search analytics data (impressions, clicks, CTR, position)
   - Fetch sitemap status
   - Fetch URL inspection results
7. Google Analytics connector:
   - OAuth 2.0 (shared Google Cloud project)
   - GA4 Data API for traffic, bounce rate, session data
8. Wire up OAuth callbacks in apps/api/webhooks/
9. Dashboard: integration settings page shows connect/disconnect per platform
10. Test: verify OAuth flow works for at least one platform
11. Return summary: connectors built, OAuth flows, test results.
```

---

## Phase 8 — Workers (seopilot-workers)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "Integrations done"

Instructions:
1. Set up Trigger.dev v3 in workers/:
   - Configure trigger.config.ts
   - Connect to Trigger.dev cloud (or self-hosted)
2. Build job definitions:
   - crawl-site.ts: accepts siteId, runs packages/crawler, stores results in DB, emits SSE events
   - run-audit.ts: accepts scanId, runs packages/agents pipeline, stores issues in DB
   - apply-fixes.ts: accepts fixIds[], applies each via packages/integrations, updates DB
   - generate-report.ts: accepts scanId, compiles report data, generates PDF, uploads to R2
   - scheduled-scan.ts: cron job (weekly/daily per site), triggers crawl-site + run-audit
   - competitor-scan.ts: accepts competitorId, crawls competitor, compares SEO metrics
3. Wire up progress reporting:
   - Each job emits progress events to Redis pub/sub
   - API SSE subscriptions pick up and stream to dashboard
4. Error handling:
   - Retry logic (3 attempts with exponential backoff)
   - Dead letter queue for persistent failures
   - Alert notification on job failure
5. Test: trigger a full scan workflow (crawl → audit → report)
6. Return summary: jobs created, scheduled tasks configured, test results.
```

---

## Phase 9 — E2E Testing & MCP Verification (seopilot-verify)

**Subagent prompt template:**

```
Context: {CONTEXT_PAYLOAD} + "All phases complete"

Instructions:
1. Use MCP browser (cursor-ide-browser) for full E2E verification
2. Test user flows:
   Flow 1 — Signup & Onboarding:
   - Navigate to /register
   - Create account (email + password)
   - Verify redirect to dashboard
   - Screenshot: dashboard overview (empty state)

   Flow 2 — Add Site:
   - Navigate to /sites/new
   - Enter site URL (use localhost:7026 for SEOPilot marketing site)
   - Select platform (custom)
   - Verify site appears in list
   - Screenshot: site list with new site

   Flow 3 — Run Scan:
   - Open site detail page
   - Click "Run Scan" button
   - Verify progress bar appears (SSE)
   - Wait for scan completion
   - Screenshot: scan results with issues

   Flow 4 — View Issues:
   - Navigate to issues page
   - Verify table renders with issues
   - Test filters (severity, category)
   - Expand an issue row
   - Screenshot: issues table

   Flow 5 — Apply Fix:
   - Navigate to fixes page
   - Click "Apply" on a suggested fix
   - Verify fix applied status
   - Screenshot: fix applied

   Flow 6 — Settings & Billing:
   - Navigate to settings
   - Verify profile, team, integrations pages render
   - Navigate to billing
   - Screenshot: billing page

3. Verify responsive design: test at mobile viewport (375px)
4. Verify dark mode toggle works
5. Check for console errors on every page
6. Return summary: all flows pass/fail, screenshots taken, issues found.
```

---

## Orchestration Rules

1. **You never do Phases 1–9 yourself.** You only run Phase 0 and delegate.
2. **One subagent at a time.** Wait for the previous subagent's result before launching the next.
3. **Update context between steps.** If a subagent returns e.g. "API running on port 4001", update context.
4. **MCP verification is mandatory** after Phase 1 (scaffold boots), Phase 5 (UI renders), and Phase 9 (E2E).
5. **If a subagent fails**, analyze the error, fix if possible, and re-run that subagent before continuing.
6. **Pass reference files** to every subagent: tech-stack.md and architecture.md paths.

---

## Prompt Template for Each Subagent

```
Context for this task (from orchestrator):
{CONTEXT}

Reference files to read first:
- .cursor/skills/build-seopilot/tech-stack.md (technology decisions)
- .cursor/skills/build-seopilot/architecture.md (system design, DB schema, API structure)

Instructions:
1. Read both reference files before starting.
2. Execute Phase {PHASE_NUMBER} as described above.
3. Use MCP browser verification where specified.
4. Return a concise summary: what you did, files/paths changed, and any info the next subagent needs.
```

---

## Subagent Type Mapping

When invoking the Task tool, use these subagent types:

| Logical Name | `subagent_type` | `model` | Notes |
|-------------|----------------|---------|-------|
| seopilot-scaffold | `generalPurpose` | default | Monorepo setup, config files |
| seopilot-backend-api | `generalPurpose` | default | Complex: schema, auth, billing, 8 routers |
| seopilot-crawler-engine | `generalPurpose` | default | Crawlee + extractors + analyzers |
| seopilot-ai-agents | `generalPurpose` | default | LangGraph pipeline, LLM integration |
| seopilot-dashboard-ui | `generalPurpose` | default | 15+ pages, many components |
| seopilot-realtime | `generalPurpose` | fast | SSE wiring, smaller scope |
| seopilot-integrations | `generalPurpose` | default | OAuth flows, platform APIs |
| seopilot-workers | `generalPurpose` | fast | Job definitions, wiring |
| seopilot-verify | `browser-use` | default | E2E testing via MCP browser |

---

## Checklist

```
Phase 0: Parse & validate
  - [ ] Check Node/npm versions
  - [ ] Build context payload
  - [ ] Create todo list

Phase 1: Scaffold
  - [ ] Turborepo monorepo created
  - [ ] apps/web (Next.js 16 + shadcn) boots on :3000
  - [ ] apps/api (Hono) boots on :4000
  - [ ] packages/ structure created
  - [ ] MCP verify: both apps respond

Phase 2: Backend API
  - [ ] Drizzle schema: all tables + enums + indexes + relations
  - [ ] Database migrated (Neon)
  - [ ] Better Auth: register + login + session
  - [ ] Stripe: products + webhook + checkout
  - [ ] 8 tRPC routers implemented
  - [ ] Middleware: auth, rate-limit, CORS
  - [ ] R2 storage configured

Phase 3: Crawler Engine
  - [ ] Crawlee + Playwright installed
  - [ ] SEO crawler with adaptive mode
  - [ ] 7 extractors (meta, headings, links, images, schema, performance, a11y)
  - [ ] 4 analyzers (technical, content, links, speed)
  - [ ] Utilities (sitemap, robots, URL)
  - [ ] Sample crawl successful

Phase 4: AI Agents
  - [ ] LangGraph state definition
  - [ ] 10 graph nodes built
  - [ ] Main graph wired (START → crawl → audits → merge → fix → verify → report → END)
  - [ ] Postgres checkpointer for resume
  - [ ] 5 LLM tools (meta, schema, content, alt-text, internal-link)
  - [ ] 4 prompt templates
  - [ ] Sample pipeline run successful

Phase 5: Dashboard UI
  - [ ] Auth pages (login, register)
  - [ ] Dashboard overview with KPIs + charts
  - [ ] Site pages (list, add, detail, issues, fixes, reports, competitors, settings)
  - [ ] Settings pages (profile, billing, team, integrations)
  - [ ] Reusable components (score ring, issue table, agent feed, etc.)
  - [ ] Dark mode default
  - [ ] MCP verify: all pages render correctly

Phase 6: Real-time
  - [ ] SSE infrastructure (API → Redis → client)
  - [ ] 4 event types (scan progress, agent activity, fix applied, score update)
  - [ ] Dashboard components consume SSE
  - [ ] Reconnection with exponential backoff

Phase 7: Integrations
  - [ ] Base connector interface
  - [ ] Shopify connector (OAuth + GraphQL)
  - [ ] WordPress connector (REST API)
  - [ ] Webflow connector (Data API)
  - [ ] Google Search Console connector
  - [ ] Google Analytics connector
  - [ ] OAuth callbacks wired

Phase 8: Workers
  - [ ] Trigger.dev configured
  - [ ] 6 job definitions (crawl, audit, fix, report, scheduled, competitor)
  - [ ] Progress events → Redis → SSE
  - [ ] Retry logic + error handling
  - [ ] Scheduled scan cron working

Phase 9: E2E Verification
  - [ ] Flow 1: Signup & onboarding ✓
  - [ ] Flow 2: Add site ✓
  - [ ] Flow 3: Run scan with SSE progress ✓
  - [ ] Flow 4: View & filter issues ✓
  - [ ] Flow 5: Apply fix ✓
  - [ ] Flow 6: Settings & billing ✓
  - [ ] Mobile responsive ✓
  - [ ] Dark mode ✓
  - [ ] No console errors ✓
```
