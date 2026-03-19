# SEOPilot — Missing Features (Complete)

## Critical Priority

### F1. Dashboard Real Data
- **Why:** Product looks broken showing zeros. First thing users see after login.
- **Implement:** Wire dashboard `page.tsx` to `site.getStats` (totalSites, avgScore). Add `scan.listRecent` for cross-site recent scans. Add `agent.getLatestActivity` for agent feed. Replace hardcoded `stats` array with live tRPC queries.
- **Effort:** Small (1-2 days)
- **Files:** `apps/web/src/app/(dashboard)/page.tsx`, `apps/api/src/trpc/routers/site.ts`

### F2. SEO Score Trend (Real History)
- **Why:** Fake chart destroys trust. Score history is already being written to `seo_score_history`.
- **Implement:** Add `site.getScoreHistory` in API: `SELECT score, recorded_at FROM seo_score_history WHERE site_id = ? ORDER BY recorded_at`. Pass to `SiteHealthChart` instead of `DEMO_DATA`.
- **Effort:** Small (half day)
- **Files:** `apps/api/src/trpc/routers/site.ts`, `apps/web/src/components/dashboard/site-health-chart.tsx`, site detail page

### F3. Issue Router (Real Data)
- **Why:** `issue.list`, `bySeverity`, `byCategory` return empty. Users can't filter issues across scans.
- **Implement:** Query `issues` table with Drizzle filters (severity, category, fixStatus, pageUrl) and pagination. Aggregate counts for bySeverity/byCategory.
- **Effort:** Small (1 day)
- **Files:** `apps/api/src/trpc/routers/issue.ts`

### F4. Agent Activity Logs
- **Why:** "Agent Activity" shows empty. Users can't see what happened during a scan.
- **Implement:** In `scan-pipeline.ts`, insert into `agentLogs` at each phase start/end with timing. Implement `agent.getLogs` (query by scanId) and `agent.getStatus` (check for active scans). Wire dashboard agent feed.
- **Effort:** Small (1 day)
- **Files:** `apps/api/src/workers/scan-pipeline.ts`, `apps/api/src/trpc/routers/agent.ts`

---

## High Priority

### F5. AI-Powered Fix Generation (LLM)
- **Why:** Current template-based fixes are low quality (e.g., generic meta descriptions). LLM produces dramatically better results. This is the core AI value proposition.
- **Implement:** Add Claude/GPT-4o to `fix.suggest`. For each fixable issue, call LLM with page context to generate optimized fix (meta tags, schema, alt text). Return with confidence score. Use structured output (Zod) to guarantee valid format. Cache results.
- **Effort:** Medium (3-5 days)
- **Files:** New `apps/api/src/workers/ai-fix-generator.ts`, update `apps/api/src/trpc/routers/fix.ts`
- **Dependencies:** LLM API key (Claude or OpenAI)

### F6. Report Generation (PDF)
- **Why:** Core SaaS deliverable. Clients expect downloadable audit reports. Currently stub.
- **Implement:** After scan completes, compile: executive summary, score + breakdown, top issues by category, fixes applied, remaining recommendations. Use `@react-pdf/renderer` or Puppeteer to generate PDF. Upload to R2. Store URL in `reports` table. Wire Reports page to `report.list` and `report.download`.
- **Effort:** Medium (3-4 days)
- **Files:** New `apps/api/src/workers/report-generator.ts`, update `apps/api/src/trpc/routers/report.ts`, update `apps/web/src/app/(dashboard)/sites/[siteId]/reports/page.tsx`

### F7. Platform Fix Apply (Shopify/WordPress)
- **Why:** "Apply Fix" currently only flips a DB flag. The entire value of "auto-fix" is pushing changes to the live site.
- **Implement:** Start with Shopify (GraphQL Admin API) — update product/page meta tags, inject schema via metafields. Then WordPress (REST API + Yoast fields). In `fix.applyFix`, resolve platform + credentials, call connector, verify, update status.
- **Effort:** High (5-7 days per platform)
- **Files:** New `packages/integrations/src/shopify/`, `packages/integrations/src/wordpress/`, update fix router
- **Dependencies:** F17 (OAuth/integrations) for credentials

### F8. Scheduled Scans
- **Why:** Users expect automated monitoring. Without scheduling, the product is manual-only.
- **Implement:** Trigger.dev cron job: every hour, query sites where `scanSchedule != 'manual'` and `lastScanAt` is older than the schedule interval. Trigger `runScanPipeline` for each. Add "trigger" metadata to distinguish manual vs scheduled.
- **Effort:** Medium (2-3 days)
- **Files:** New `apps/api/src/workers/scheduled-scan.ts`, update scan pipeline
- **Dependencies:** Trigger.dev configured (already has API key)

### F9. Keyword Research & Tracking
- **Why:** Core SEO feature entirely missing. Every SEO tool needs keyword intelligence. Without it, SEOPilot is just a technical auditor, not a full SEO platform.
- **Implement:** New `keyword` tRPC router. `keyword.discover` (Google Suggest + GSC data), `keyword.track` (periodic rank checks via GSC or DataForSEO), `keyword.cluster` (embedding-based grouping). New `/sites/[siteId]/keywords` page with keyword table, trend chart, cluster view.
- **Effort:** High (5-7 days)
- **Files:** New router, new page, new DB tables (`keywords`, `keyword_rankings`)
- **Dependencies:** Google Search Console API or DataForSEO account

### F10. Crawler Upgrade (Playwright + CWV)
- **Why:** Current Cheerio crawler misses JS-rendered content (SPAs, React sites) and can't measure real Core Web Vitals. Performance scoring is superficial.
- **Implement:** Swap to Crawlee with adaptive mode (CheerioCrawler for static, PlaywrightCrawler for JS-heavy). Add Lighthouse or Performance Observer for CWV. Populate LCP/CLS/INP/TTFB columns in pages table. Feed into performance score.
- **Effort:** High (5-7 days)
- **Files:** Rewrite `apps/api/src/workers/crawl.ts`, update `analyze.ts` performance rules

---

## Medium Priority

### F11. Site Settings Page
- **Why:** Users need to configure scan schedule, auto-fix, name, etc. Architecture defines it but page doesn't exist.
- **Implement:** Add `/sites/[siteId]/settings/page.tsx`. Form: name, platform, scanSchedule (daily/weekly/monthly/manual), autoFix toggle. Call `site.update` on save.
- **Effort:** Small (half day)

### F12. Scan History Page
- **Why:** Only last 5 scans shown on site detail. Users need full history with pagination.
- **Implement:** Add `/sites/[siteId]/scans/page.tsx`. Use `scan.list` with siteId + pagination. Table: date, status, pages, issues, score, duration, link to results.
- **Effort:** Small (half day)

### F13. Billing (Stripe)
- **Why:** Can't monetize without billing. Plan limits not enforced.
- **Implement:** Create Stripe products (Free/Starter $29/Pro $99/Enterprise $299). `billing.createCheckout` creates Stripe Checkout Session. `billing.createPortal` creates portal session. Webhook updates plan/limits. Enforce in `site.create` (max sites) and `scan.trigger` (max scans/month).
- **Effort:** Medium (3-4 days)
- **Files:** Update `apps/api/src/trpc/routers/billing.ts`, new webhook handler

### F14. Competitor Analysis
- **Why:** Growth differentiator. Users want to know how they compare.
- **Implement:** Add `competitor` tRPC router (add, list, remove, analyze). Run Auditor crawl on competitor URL, store in `competitors` table. `/sites/[siteId]/competitors/page.tsx`: add competitor by URL, see side-by-side scores, content/keyword gaps.
- **Effort:** Medium (3-4 days)

### F15. SSE Real-time Subscriptions
- **Why:** Dashboard polls every 2-5 seconds instead of streaming. Wasteful and laggy.
- **Implement:** Add tRPC SSE subscriptions (`scan.onProgress`, `agent.onActivity`, `fix.onFixProgress`). API subscribes to Redis pub/sub, streams to client. Dashboard replaces `refetchInterval` with subscription.
- **Effort:** Medium (2-3 days)

### F16. Bulk Page Optimization
- **Why:** Users with 500+ pages need to optimize many at once, not one by one.
- **Implement:** Select multiple pages → generate fixes for all → review → apply all. Requires batch LLM calls and batch platform API calls. Progress bar for bulk operations.
- **Effort:** Medium (3-4 days)

---

## Lower Priority

### F17. Integrations (OAuth)
- **Why:** Required for platform fix apply, GSC keyword data, GA traffic data.
- **Implement:** OAuth 2.0 flows for Shopify, WordPress, Webflow, Google (GSC + GA). Store tokens encrypted. Refresh token rotation. Test connection endpoint.
- **Effort:** High (2-3 days per platform)

### F18. AI Blog Autopublishing
- **Why:** Content marketing automation. Generate SEO-optimized blog posts and publish directly.
- **Implement:** Content Generator agent writes blog post. Internal Linker adds links. Schema generated. Published to platform via integration connector. Scheduled cadence (e.g., 2 posts/week).
- **Effort:** Medium (3-4 days)
- **Dependencies:** F5 (AI generation), F7 (platform apply), F17 (OAuth)

### F19. Programmatic SEO Pages
- **Why:** High-impact SEO strategy for sites with structured data (products, locations, etc.).
- **Implement:** User defines template + data source (CSV, API, DB). System generates hundreds of unique, keyword-targeted pages. Each page gets meta, schema, internal links. Published via platform API.
- **Effort:** High (5-7 days)

### F20. Image SEO Optimization
- **Why:** Image search drives traffic. Most sites have poor image SEO.
- **Implement:** Analyze all images: missing alt text, unoptimized format (not WebP), oversized dimensions, missing lazy loading. AI generates alt text. Optionally convert to WebP and upload.
- **Effort:** Medium (2-3 days)

### F21. Multi-Language SEO
- **Why:** International sites need hreflang, translated meta, localized content.
- **Implement:** Detect language versions. Validate hreflang tags. Generate translated meta via LLM. Check for consistent internal linking across languages.
- **Effort:** Medium (3-4 days)

### F22. Schema Auto-Generation
- **Why:** Most sites lack structured data. Rich results dramatically improve CTR.
- **Implement:** Detect page type → generate appropriate JSON-LD (Product, Article, FAQ, Organization, BreadcrumbList, HowTo, Recipe, Event, LocalBusiness). Validate against Google's requirements. Inject via platform API.
- **Effort:** Medium (2-3 days)
- **Dependencies:** F5 (AI generation), F7 (platform apply)

### F23. SERP Tracking & Monitoring
- **Why:** Users need to see if their SEO improvements move the needle.
- **Implement:** Track keyword positions daily/weekly. Integrate GSC data. Show ranking trends per keyword, per page. Alert on significant drops.
- **Effort:** Medium (3-4 days)
- **Dependencies:** F9 (keyword research)

### F24. Backlink Outreach Automation
- **Why:** Link building is the hardest part of SEO. Automation saves hours.
- **Implement:** Find link opportunities from competitor backlinks. AI generates personalized outreach emails. Track sent/replied/acquired. CRM-like pipeline for link building.
- **Effort:** High (5-7 days)
- **Dependencies:** External API (Ahrefs/SEMrush/Moz)

### F25. White-Label Reports
- **Why:** Agency users want to send reports with their own branding.
- **Implement:** Custom logo, colors, footer in PDF reports. Shareable public URL with branding. Custom domain support for report links.
- **Effort:** Medium (2-3 days)
- **Dependencies:** F6 (report generation)

### F26. Auth Improvements
- **Why:** No Google OAuth, no team management, no role-based access.
- **Implement:** Add Google OAuth via Supabase. Implement team invites (orgMembers table). Role-based permissions (owner/admin/member). API middleware checks org membership.
- **Effort:** Medium (3-4 days)

### F27. SSRF Protection on Crawler
- **Why:** User-supplied URLs are crawled by the server — potential SSRF attack.
- **Implement:** URL validation before crawl: block private IPs, localhost, internal ranges. DNS resolution check. Allowlist of protocols (http/https only).
- **Effort:** Small (half day)

---

## Summary Matrix

| Feature | Priority | Effort | Revenue Impact | User Impact |
|---------|----------|--------|---------------|-------------|
| F1 Dashboard data | Critical | S | Low | High |
| F2 Score trend | Critical | S | Low | High |
| F3 Issue router | Critical | S | Low | Medium |
| F4 Agent logs | Critical | S | Low | Medium |
| F5 AI fix gen | High | M | High | High |
| F6 Reports PDF | High | M | High | High |
| F7 Platform apply | High | H | High | High |
| F8 Scheduled scans | High | M | Medium | High |
| F9 Keyword research | High | H | High | High |
| F10 Crawler upgrade | High | H | Medium | Medium |
| F11 Site settings | Medium | S | Low | Medium |
| F12 Scan history | Medium | S | Low | Medium |
| F13 Billing | Medium | M | Critical | Low |
| F14 Competitors | Medium | M | Medium | Medium |
| F15 SSE real-time | Medium | M | Low | Medium |
| F16 Bulk optimize | Medium | M | Medium | High |
| F17 OAuth integrations | Lower | H | Medium | Medium |
| F18 Blog autopublish | Lower | M | High | Medium |
| F19 Programmatic SEO | Lower | H | High | Low |
| F20 Image SEO | Lower | M | Medium | Medium |
| F21 Multi-language | Lower | M | Medium | Low |
| F22 Schema auto-gen | Lower | M | Medium | Medium |
| F23 SERP tracking | Lower | M | High | High |
| F24 Backlink outreach | Lower | H | High | Medium |
| F25 White-label | Lower | M | Medium | Low |
| F26 Auth improvements | Lower | M | Low | Medium |
| F27 SSRF protection | Lower | S | Low | Low |
