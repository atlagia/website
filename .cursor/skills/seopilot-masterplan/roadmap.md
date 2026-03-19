# SEOPilot — Execution Roadmap

## Phase 1: MVP Fix (1-2 weeks)

**Goal:** Make everything that exists actually work. Stop showing fake data.

### Week 1: Data Layer

| Task | Feature | Files | Depends On |
|------|---------|-------|------------|
| 1.1 | Dashboard real stats | `apps/web/src/app/(dashboard)/page.tsx`, site router | — |
| 1.2 | Score history API + chart | Site router, `site-health-chart.tsx` | — |
| 1.3 | Issue router (real list/filter/counts) | `apps/api/src/trpc/routers/issue.ts` | — |
| 1.4 | Agent logs (write in pipeline + expose) | `scan-pipeline.ts`, `agent.ts` router | — |
| 1.5 | Auth middleware (protectedProcedure) | `apps/api/src/trpc/trpc.ts`, all routers | — |
| 1.6 | SSRF protection on crawler | `apps/api/src/workers/crawl.ts` | — |

### Week 2: Missing Pages + Polish

| Task | Feature | Files | Depends On |
|------|---------|-------|------------|
| 1.7 | Site settings page | New `sites/[siteId]/settings/page.tsx` | — |
| 1.8 | Scan history page | New `sites/[siteId]/scans/page.tsx` | — |
| 1.9 | Score formula calibration | `analyze.ts` → weight-per-rule system | 1.3 |
| 1.10 | Error boundaries on all pages | Layout components | — |
| 1.11 | Shared types package (kill `as any`) | `packages/shared/`, update imports | — |
| 1.12 | MCP verify all pages render with real data | All pages | 1.1-1.8 |

**Deliverable:** Dashboard shows real stats, charts, agent activity. Issues page filters work. Site settings editable. No more `(site as any)` casts. Auth protects all routes.

---

## Phase 2: Automation Core (2-4 weeks)

**Goal:** The product does things automatically — AI fixes, PDF reports, scheduled scans.

### Week 3: AI Fix Generation

| Task | Feature | Files | Depends On |
|------|---------|-------|------------|
| 2.1 | LLM integration (Claude SDK) | New `apps/api/src/lib/llm.ts` | — |
| 2.2 | AI fix generator (meta, schema, alt text) | New `apps/api/src/workers/ai-fix-generator.ts` | 2.1 |
| 2.3 | Wire fix.suggest to use LLM | `apps/api/src/trpc/routers/fix.ts` | 2.2 |
| 2.4 | Confidence scoring + structured output | Zod schemas for fix output | 2.2 |
| 2.5 | Fixes page: show AI confidence, reasoning | `apps/web/.../fixes/page.tsx` | 2.3 |

### Week 4: Reports + Scheduling

| Task | Feature | Files | Depends On |
|------|---------|-------|------------|
| 2.6 | PDF report generator | New `apps/api/src/workers/report-generator.ts` | — |
| 2.7 | Report API (generate/list/download) | `apps/api/src/trpc/routers/report.ts` | 2.6 |
| 2.8 | Reports page (real data, download) | `apps/web/.../reports/page.tsx` | 2.7 |
| 2.9 | Trigger.dev setup (crawl + analyze jobs) | New `apps/api/src/workers/jobs/` | — |
| 2.10 | Scheduled scan (cron) | New `apps/api/src/workers/scheduled-scan.ts` | 2.9 |
| 2.11 | Site settings: scan schedule picker | `sites/[siteId]/settings/page.tsx` | 2.10, 1.7 |

### Week 5: Crawler Upgrade

| Task | Feature | Files | Depends On |
|------|---------|-------|------------|
| 2.12 | Crawlee + Playwright integration | Rewrite `crawl.ts` | — |
| 2.13 | Core Web Vitals measurement | Performance extractor | 2.12 |
| 2.14 | Broken link verification (HEAD checks) | Link extractor | 2.12 |
| 2.15 | Redirect chain detection | Link analyzer | 2.12 |
| 2.16 | Duplicate content detection (similarity) | Content analyzer | 2.12 |
| 2.17 | Expanded rule set (50+ rules) | `analyze.ts` | 2.12-2.16 |

### Week 6: Platform Fix Apply (Shopify)

| Task | Feature | Files | Depends On |
|------|---------|-------|------------|
| 2.18 | Shopify OAuth flow | `packages/integrations/src/shopify/` | — |
| 2.19 | Shopify meta updater (GraphQL) | `shopify/meta-updater.ts` | 2.18 |
| 2.20 | Shopify schema injector (metafields) | `shopify/schema-injector.ts` | 2.18 |
| 2.21 | Wire fix.applyFix to Shopify connector | `fix.ts` router | 2.19, 2.20 |
| 2.22 | Fix verification (re-crawl after apply) | Scan pipeline | 2.21 |
| 2.23 | MCP verify: full scan → fix → verify flow | E2E | 2.1-2.22 |

**Deliverable:** AI generates real fixes with confidence scores. PDF reports downloadable. Scans run on schedule. Crawler measures CWV and detects broken links. Shopify fixes auto-apply.

---

## Phase 3: AI Agents Expansion (4-6 weeks)

**Goal:** Build the multi-agent system. SEOPilot becomes an AI SEO autopilot.

### Week 7-8: LangGraph Pipeline

| Task | Feature | Depends On |
|------|---------|------------|
| 3.1 | LangGraph state definition | Phase 2 |
| 3.2 | Crawl node (wraps Crawlee) | 2.12 |
| 3.3 | Technical audit node (rules + LLM) | 2.2 |
| 3.4 | Content audit node (LLM analysis) | 2.2 |
| 3.5 | Performance audit node | 2.13 |
| 3.6 | Merge + prioritize node | 3.3-3.5 |
| 3.7 | Fix generator node (LLM) | 2.2 |
| 3.8 | Human gate (auto-fix conditional) | 3.7 |
| 3.9 | Fix applier node (platform connectors) | 2.18-2.20 |
| 3.10 | Verification node (re-crawl) | 3.9 |
| 3.11 | Report builder node | 2.6 |
| 3.12 | Wire full graph: START → ... → END | 3.2-3.11 |
| 3.13 | Postgres checkpointer for resume | 3.12 |
| 3.14 | Replace setImmediate pipeline with LangGraph | 3.12 |

### Week 9-10: Keyword Research + Internal Linking

| Task | Feature | Depends On |
|------|---------|------------|
| 3.15 | Keywords DB tables + router | — |
| 3.16 | Google Search Console integration | OAuth flow |
| 3.17 | Keyword discovery (GSC + Google Suggest) | 3.15, 3.16 |
| 3.18 | Keyword clustering (embeddings + HDBSCAN) | 3.17, pgvector |
| 3.19 | Keywords page UI | 3.17 |
| 3.20 | Internal link graph builder | Crawl data |
| 3.21 | Orphan page detection | 3.20 |
| 3.22 | AI internal link suggestions (content similarity) | 3.20, pgvector |
| 3.23 | Content gap analysis (your pages vs keywords) | 3.17, 3.18 |

### Week 11-12: Content Generator + Competitor Analysis

| Task | Feature | Depends On |
|------|---------|------------|
| 3.24 | Content Generator agent (blog posts, FAQ) | 2.2 |
| 3.25 | Thin content expansion (AI rewrite) | 3.24 |
| 3.26 | Blog autopublish to platform | 3.24, platform connectors |
| 3.27 | Competitor crawl + analysis | Crawl pipeline |
| 3.28 | Competitor comparison page | 3.27 |
| 3.29 | Competitor keyword gap analysis | 3.17, 3.27 |
| 3.30 | SERP tracking (daily rank check) | 3.16 or DataForSEO |
| 3.31 | MCP verify: full agent pipeline E2E | 3.1-3.30 |

**Deliverable:** Full LangGraph pipeline runs autonomously. Keyword research with clustering. Internal linking suggestions. Content generation. Competitor analysis. SERP tracking.

---

## Phase 4: Scale & Monetize (6-10 weeks)

**Goal:** Production-ready SaaS that makes money and handles scale.

### Billing + Auth (Week 13-14)

| Task | Feature |
|------|---------|
| 4.1 | Stripe products/prices (Free, Starter, Pro, Enterprise) |
| 4.2 | Checkout flow + webhook |
| 4.3 | Billing portal + usage meter |
| 4.4 | Plan limit enforcement (max sites, scans, pages, AI tokens) |
| 4.5 | Google OAuth (Supabase) |
| 4.6 | Team invites + role-based access |
| 4.7 | Org-scoped data isolation |

### Platform Expansion (Week 15-16)

| Task | Feature |
|------|---------|
| 4.8 | WordPress connector (REST API + Yoast) |
| 4.9 | Webflow connector (Data API v2) |
| 4.10 | Google Analytics integration (GA4 Data API) |
| 4.11 | Multi-platform fix apply |

### Advanced Features (Week 17-20)

| Task | Feature |
|------|---------|
| 4.12 | Bulk page optimization (batch fix apply) |
| 4.13 | Programmatic SEO (template + data → pages) |
| 4.14 | Multi-language SEO (hreflang, translated meta) |
| 4.15 | Image SEO optimization (format, alt text, compression) |
| 4.16 | Schema auto-generation (per page type) |
| 4.17 | White-label reports (custom branding) |
| 4.18 | Backlink audit + outreach automation |
| 4.19 | API rate limiting and abuse prevention |
| 4.20 | Performance optimization (ISR, edge caching, connection pooling) |

### Launch Prep (Week 21-22)

| Task | Feature |
|------|---------|
| 4.21 | Production deployment (Vercel + Railway) |
| 4.22 | Domain + SSL |
| 4.23 | Monitoring (Sentry, Vercel Analytics, Trigger.dev dashboard) |
| 4.24 | Onboarding flow (product tour, first-scan wizard) |
| 4.25 | Landing page with pricing |
| 4.26 | Documentation / help center |
| 4.27 | Full E2E test suite |
| 4.28 | Security audit |

**Deliverable:** Production SaaS with billing, teams, multi-platform, advanced SEO features. Ready for public launch.

---

## Dependency Graph

```
Phase 1 (MVP Fix)
  └─→ Phase 2 (Automation)
        ├─→ 2.1-2.5 (AI Fixes) ─────────────┐
        ├─→ 2.6-2.8 (Reports) ──────────────┤
        ├─→ 2.9-2.11 (Scheduling) ──────────┤
        ├─→ 2.12-2.17 (Crawler) ────────────┤
        └─→ 2.18-2.22 (Shopify) ────────────┤
                                              │
        Phase 3 (AI Agents) ◀─────────────────┘
          ├─→ 3.1-3.14 (LangGraph) ─────────┐
          ├─→ 3.15-3.23 (Keywords + Links) ──┤
          └─→ 3.24-3.30 (Content + Comp.) ───┤
                                              │
          Phase 4 (Scale) ◀───────────────────┘
            ├─→ 4.1-4.7 (Billing + Auth)
            ├─→ 4.8-4.11 (Platforms)
            ├─→ 4.12-4.18 (Advanced)
            └─→ 4.21-4.28 (Launch)
```

---

## Subagent Mapping

When implementing, delegate to these subagent types:

| Phase Task Group | Subagent Type | Model |
|-----------------|---------------|-------|
| 1.1-1.6 (data layer) | `generalPurpose` | fast |
| 1.7-1.12 (pages + polish) | `generalPurpose` | fast |
| 2.1-2.5 (AI fixes) | `generalPurpose` | default |
| 2.6-2.8 (reports) | `generalPurpose` | default |
| 2.9-2.11 (scheduling) | `generalPurpose` | fast |
| 2.12-2.17 (crawler) | `generalPurpose` | default |
| 2.18-2.23 (Shopify) | `generalPurpose` | default |
| 3.1-3.14 (LangGraph) | `generalPurpose` | default |
| 3.15-3.23 (keywords) | `generalPurpose` | default |
| 3.24-3.31 (content) | `generalPurpose` | default |
| 4.x (all Phase 4) | `generalPurpose` | default |
| MCP verification | `browser-use` | default |

---

## Success Metrics

| Metric | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|
| Dashboard data accuracy | 100% real | 100% real | 100% real | 100% real |
| SEO rules checked | 11 | 50+ | 100+ | 200+ |
| Fix quality (AI confidence) | N/A (template) | >0.8 avg | >0.85 avg | >0.9 avg |
| Scan speed (50 pages) | 20s | 15s | 12s | <10s |
| Pages per scan (max) | 50 | 500 | 5000 | Unlimited |
| Concurrent scans | 1 | 5 | 10 | 50+ |
| Platform integrations | 0 | 1 (Shopify) | 1 | 4+ |
| Report types | 0 | PDF | PDF + HTML | PDF + HTML + branded |
| Revenue | $0 | $0 | $0 (beta) | MRR >$0 |
