---
name: seopilot-masterplan
description: Complete production blueprint for SEOPilot SaaS — full audit of current state, AI agent architecture, missing features with priorities, automation workflows, best practices, and phased execution roadmap. Use when planning SEOPilot development, asking "what's missing", "what to build next", designing AI agents, or scaling the platform toward market leadership.
---

# SEOPilot — Production Masterplan

## Quick Reference

| Document | Contents |
|----------|----------|
| [audit.md](audit.md) | Full project audit: what exists, what's broken, gap analysis |
| [agents.md](agents.md) | AI agent system: 7 subagents, 35+ skills, orchestration |
| [features.md](features.md) | 25+ missing features with priority, implementation, and why |
| [workflows.md](workflows.md) | Automation pipelines, event flows, best practices |
| [roadmap.md](roadmap.md) | 4-phase execution plan from MVP fix to $100M scale |
| **Subagents** | Executable subagent definitions (invoked by coordinator or Task tool) |
| → [subagents/seopilot-seo-auditor.md](subagents/seopilot-seo-auditor.md) | SEO Auditor: crawl, audit, score |
| → [subagents/seopilot-technical-fixer.md](subagents/seopilot-technical-fixer.md) | Technical Fixer: generate + apply fixes |
| → [subagents/seopilot-content-generator.md](subagents/seopilot-content-generator.md) | Content Generator: expand, blog, FAQ, alt text |
| → [subagents/seopilot-keyword-researcher.md](subagents/seopilot-keyword-researcher.md) | Keyword Researcher: discover, cluster, track |
| → [subagents/seopilot-internal-linker.md](subagents/seopilot-internal-linker.md) | Internal Linker: graph, orphans, suggestions |
| → [subagents/seopilot-competitor-analyst.md](subagents/seopilot-competitor-analyst.md) | Competitor Analyst: crawl, compare, gaps |
| → [subagents/seopilot-backlink-strategist.md](subagents/seopilot-backlink-strategist.md) | Backlink Strategist: audit, toxic, outreach |

To run a subagent via the Task tool: use `subagent_type: generalPurpose`, attach the corresponding `subagents/seopilot-*.md` file and any context (e.g. siteId, scanId, options). The master coordinator (when implemented) will invoke these same subagents in sequence.

---

## 1. Current State (Summary)

**Stack:** Next.js 16 + Hono API + Drizzle/Postgres + Upstash Redis + tRPC + Supabase Auth

**Working:**
- Auth (login/register/forgot-password via Supabase)
- Add Site → creates DB row, detects platform
- Scan trigger → in-process crawl (Cheerio + fetch, 50 pages), analyze, store issues, compute score
- Site detail with SEO score ring, scan history, category breakdown
- Issues page with real data from latest scan
- Fixes page with template-based suggestions and apply/revert (DB only)
- Integrations status page (Database, Redis, Trigger.dev check)
- SSE events via Redis pub/sub during scan

**Broken or Stub:**
- Dashboard: hardcoded zeros, no real stats
- Score trend chart: fake sine-wave demo data
- Reports: stub router, demo data, no PDF generation
- Issue router: `list`, `bySeverity`, `byCategory` return empty
- Agent router: logs/status return empty
- Billing router: hardcoded free plan, no Stripe
- Integration router: fake OAuth URLs, all disconnected
- Fix apply: DB-only flag flip, no platform API calls
- Crawler: Cheerio only (no JS rendering, no Core Web Vitals)
- No scheduled scans, no competitor analysis, no AI content generation

---

## 2. Architecture (Target)

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND — Next.js 16 (App Router + RSC + Turbopack)          │
│  Dashboard │ Sites │ Issues │ Fixes │ Reports │ Keywords │ AI  │
│            tRPC + SSE (real-time scan/agent/fix progress)       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│  API GATEWAY — Hono.js on Node 22                               │
│  tRPC Routers │ REST (webhooks) │ Auth (Supabase) │ Rate Limit  │
└────┬─────────────┬───────────┬──────────────────────────────────┘
     │             │           │
┌────┴────┐  ┌─────┴─────┐  ┌─┴──────────────────────────────────┐
│Postgres │  │  Redis     │  │  JOB SYSTEM (Trigger.dev v3)       │
│ (Neon)  │  │ (Upstash)  │  │  ┌─────────┐ ┌─────────┐          │
│+pgvector│  │ pub/sub    │  │  │Crawl Job│ │Audit Job│          │
│         │  │ cache      │  │  │(Crawlee)│ │(LangGr.)│          │
└─────────┘  │ rate limit │  │  ├─────────┤ ├─────────┤          │
             └────────────┘  │  │Fix Job  │ │Report   │          │
                             │  │(API push│ │(PDF gen)│          │
                             │  ├─────────┤ ├─────────┤          │
                             │  │Keyword  │ │Schedule │          │
                             │  │Research │ │Scan Cron│          │
                             │  └─────────┘ └─────────┘          │
                             └────────────────────────────────────┘
                                        │
                          ┌─────────────┼─────────────┐
                          │             │             │
                    ┌─────┴─────┐ ┌─────┴────┐ ┌─────┴─────┐
                    │ Platform  │ │ Google   │ │ AI / LLM  │
                    │ APIs      │ │ APIs     │ │ Layer     │
                    │ Shopify   │ │ GSC      │ │ Claude    │
                    │ WordPress │ │ GA4      │ │ GPT-4o    │
                    │ Webflow   │ │ PageSpeed│ │ Embeddings│
                    └───────────┘ └──────────┘ └───────────┘
```

---

## 3. AI Agent System (Summary)

One **master coordinator** (LangGraph) invokes seven **subagents**, each with granular skills:

| Subagent | Skills | Trigger |
|-------|--------|---------|
| **SEO Auditor** | Crawl, meta analysis, heading audit, schema validation, CWV check, broken link detection | On scan trigger |
| **Technical Fixer** | Meta tag generation, canonical fix, robots fix, schema injection, redirect cleanup | After audit completes |
| **Content Generator** | Title/description writing, alt-text generation, thin content expansion, blog autopublish | On demand or scheduled |
| **Keyword Researcher** | Keyword discovery, SERP analysis, keyword clustering, content gap analysis | On demand |
| **Internal Linker** | Link graph analysis, orphan detection, anchor text optimization, link injection | After crawl |
| **Competitor Analyst** | Competitor crawl, gap analysis, backlink comparison, content comparison | On demand |
| **Backlink Strategist** | Backlink audit, toxic link detection, outreach email generation, DR tracking | On demand |

Full details with inputs/outputs/tools/memory in [agents.md](agents.md).

---

## 4. Missing Features (Top 10)

| # | Feature | Priority | Why |
|---|---------|----------|-----|
| 1 | Dashboard real data | Critical | Product looks broken with zeros |
| 2 | Score trend from DB | Critical | Chart is fake data |
| 3 | AI-powered fix generation (LLM) | High | Template fixes are low quality |
| 4 | Report generation (PDF) | High | Core deliverable, currently stub |
| 5 | Platform fix apply (Shopify/WP) | High | "Apply" does nothing |
| 6 | Scheduled scans | High | No automation without this |
| 7 | Keyword research & tracking | High | Core SEO feature entirely missing |
| 8 | Crawler upgrade (Playwright + CWV) | Medium | Misses JS sites and performance data |
| 9 | Billing (Stripe) | Medium | Can't monetize |
| 10 | Competitor analysis | Medium | Growth differentiator |

Full list of 25+ features in [features.md](features.md).

---

## 5. Automation Workflows (Summary)

### Primary Loop
```
User connects site
  → Initial crawl (sitemap + internal links)
  → Technical + content + performance audit
  → AI generates prioritized fixes
  → Auto-apply (if enabled) OR queue for review
  → Verify fixes applied
  → Generate report
  → Schedule recurring scan (weekly)
  → Monitor rankings (GSC)
  → Continuous optimization loop
```

### Event-Driven Architecture
```
scan.triggered  → Crawl Job → scan.crawl.complete
                → Audit Job → scan.audit.complete
                → Fix Job   → fix.applied / fix.failed
                → Report Job → report.ready
                → score.update (WebSocket push to dashboard)
```

Full pipeline specs, retry logic, and failure handling in [workflows.md](workflows.md).

---

## 6. Execution Roadmap (Summary)

### Phase 1 — MVP Fix (1-2 weeks)
Wire real data to dashboard, score history chart, agent logs, issue router, site settings. Make existing features actually work.

### Phase 2 — Automation Core (2-4 weeks)
LLM-powered fix generation, PDF reports, scheduled scans via Trigger.dev, platform fix apply (Shopify first), Crawler upgrade to Crawlee + Playwright.

### Phase 3 — AI Agents Expansion (4-6 weeks)
LangGraph pipeline, keyword research agent, internal linking agent, content generator, competitor analysis, SERP tracking.

### Phase 4 — Scale & Monetize (6-10 weeks)
Stripe billing, OAuth integrations, multi-tenant teams, bulk optimization, programmatic SEO, backlink outreach, multi-language, white-label reports.

Detailed task breakdown with dependencies in [roadmap.md](roadmap.md).

---

## 7. Technology Decisions

| Layer | Current | Target | Why Change |
|-------|---------|--------|------------|
| Crawler | Cheerio + fetch | Crawlee + Playwright | JS rendering, real CWV |
| AI | Template strings | LangGraph + Claude/GPT-4o | Quality fixes, complex reasoning |
| Jobs | setImmediate (in-process) | Trigger.dev v3 | Retry, scheduling, monitoring |
| Search | None | pgvector | RAG for SEO knowledge, content similarity |
| Reports | Stub | @react-pdf/renderer + R2 | PDF generation and storage |
| Billing | Hardcoded | Stripe Checkout + Portal | Monetization |
| Auth | Supabase (working) | Keep Supabase | Already works |

---

## 8. How to Use This Skill

When asked to work on SEOPilot, read the relevant document:

- **"What should I build next?"** → Read [roadmap.md](roadmap.md)
- **"Design the AI system"** → Read [agents.md](agents.md)
- **"What's missing?"** → Read [features.md](features.md)
- **"Design the automation"** → Read [workflows.md](workflows.md)
- **"Audit current state"** → Read [audit.md](audit.md)

For implementation, use these alongside the existing build skill:
- `.cursor/skills/build-seopilot/SKILL.md` — Build orchestrator
- `.cursor/skills/build-seopilot/architecture.md` — System architecture + DB schema
- `.cursor/skills/build-seopilot/tech-stack.md` — Technology rationale

**Project path:** `/Users/mac/Desktop/seopilot`
**API:** `apps/api` (Hono, port 4000)
**Web:** `apps/web` (Next.js, port 3000)
