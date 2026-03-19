# SEOPilot — Technology Stack (Research-Backed, March 2026)

This document captures the technology decisions for the SEOPilot SaaS dashboard, based on deep research of 2026 benchmarks, framework comparisons, and production scalability patterns.

---

## Layer 1: Frontend (Dashboard)

| Decision | Choice | Why (over alternatives) |
|----------|--------|------------------------|
| **Framework** | **Next.js 16** (App Router, RSC, Turbopack) | Battle-tested, largest ecosystem, parallel routes for independent dashboard sections, ISR for cached reports. Beat Remix (smaller ecosystem) and SvelteKit (smaller library ecosystem for auth/billing integrations). Turbopack default in v16 = 55% faster dev builds. |
| **UI Library** | **shadcn/ui** (Radix + Tailwind) | Full code ownership, CSS-variable theming, WAI-ARIA accessibility. No runtime dependency — components copy into project. TanStack Table v8 integration for data grids. |
| **Charts** | **Tremor** + **Recharts** | Tremor for dashboard KPI cards and sparklines (built on Tailwind). Recharts for custom SEO trend charts. Both integrate with shadcn dark mode. |
| **State/Data** | **TanStack Query v5** + **tRPC** | TanStack Query for cache/dedup/background refetch. tRPC for end-to-end type safety between Next.js and Hono backend — no codegen, no OpenAPI spec needed. |
| **Real-time** | **SSE via tRPC subscriptions** (`httpSubscriptionLink`) | SSE preferred over WebSockets for one-way server→client updates (agent progress, scan results). Works through firewalls/proxies, auto-reconnects, serverless-compatible. tRPC subscription support native since v11. |
| **Forms** | **React Hook Form** + **Zod** | Zero re-renders, schema-validated. Zod schemas shared with backend for single source of truth. |
| **Auth (client)** | **Better Auth** (self-hosted) | Open-source, multi-tenant, social + magic link + password. No vendor lock-in (vs Clerk). Supports organizations/teams for SaaS. |
| **Styling** | **Tailwind CSS v4** | CSS-first config, native cascade layers, 35% smaller output. Used by shadcn/ui natively. |
| **Dark mode** | **next-themes** | Flicker-free server/client hydration, system preference detection. |

### Frontend Alternatives Considered & Rejected

| Alternative | Reason rejected |
|------------|----------------|
| SvelteKit | 25-40kb bundles are appealing, but smaller ecosystem for Stripe/auth/chart integrations; team ramp-up cost |
| Remix (React Router v7) | Great nested routing but Next.js ecosystem + Vercel deployment is more mature for SaaS |
| Ant Design / MUI | Heavy runtime, opinionated styling conflicts with custom SaaS branding |
| Clerk (auth) | Vendor-locked, expensive at scale ($0.02/MAU after 10K), no self-hosting |

---

## Layer 2: Backend API

| Decision | Choice | Why |
|----------|--------|-----|
| **Runtime** | **Node.js 22 LTS** | Stability + largest ecosystem. Bun not mature enough for production Redis/Postgres drivers. |
| **Framework** | **Hono.js** | Multi-runtime (Node, Edge, Workers), 14KB bundle, Zod validation, 1.2M req/s on Bun. Pragmatic default for 2026. Faster DX than Fastify, more portable. |
| **API Protocol** | **tRPC** (primary) + **REST** (webhooks/integrations) | tRPC for dashboard ↔ API (type-safe, no codegen). REST endpoints for Stripe webhooks, OAuth callbacks, third-party integrations. |
| **Validation** | **Zod** (shared schemas) | Single schema definition used by tRPC, React Hook Form, and Hono middleware. |
| **ORM** | **Drizzle ORM** | SQL-first, 5-57KB runtime (vs Prisma 1.6MB), native edge/serverless support, crossed Prisma in npm downloads late 2025. TypeScript schema = migration source of truth. |
| **Database** | **PostgreSQL** (Neon serverless) | Neon: serverless branching (instant DB copies for preview deployments), auto-scaling, generous free tier. pgvector extension for embeddings. |
| **Cache/Queue** | **Upstash Redis** (cache) + **Trigger.dev v3** (jobs) | Upstash: serverless Redis, pay-per-request. Trigger.dev: open-source, long-running tasks (hours without timeouts), built-in OpenAI integration, better than BullMQ for AI pipelines. |
| **File Storage** | **Cloudflare R2** | S3-compatible, zero egress fees, global edge caching. For report PDFs, crawl snapshots, screenshots. |
| **Email** | **Resend** | React Email templates, 3K free/month, Vercel integration. |

### Backend Alternatives Considered & Rejected

| Alternative | Reason rejected |
|------------|----------------|
| Fastify | 50K req/s on Node (vs Hono 1.2M on Bun), heavier plugin architecture, Node-only |
| Elysia.js | Bun-only (not production-ready for all drivers), smaller community |
| Prisma | 3x larger bundle, slower cold starts, schema DSL adds friction vs SQL-first Drizzle |
| BullMQ | Self-hosted Redis infra required; poor for long-running AI tasks; no native timeout handling |
| Temporal | Enterprise complexity overkill for initial launch; requires dedicated infrastructure |
| Inngest | Cloud-first, limited self-hosting; vendor lock-in risk |
| Supabase (DB) | Good but Neon's branching + auto-scaling better for SaaS with preview deployments |

---

## Layer 3: AI Agent System

| Decision | Choice | Why |
|----------|--------|-----|
| **Orchestration** | **LangGraph** (TypeScript) | 91% task completion rate with verification nodes, built-in checkpoint persistence for resume-after-failure, conditional routing for complex SEO pipelines, LangSmith observability. Beat CrewAI (less deterministic) and AutoGen (conversational focus, not pipeline). |
| **LLM Provider** | **Claude API** (primary) + **GPT-4o** (fallback) | Claude for content analysis/generation (longer context, better structured output). GPT-4o fallback for rate-limit resilience. |
| **Embeddings** | **OpenAI text-embedding-3-small** | Best price/performance for SEO knowledge base. Store in pgvector (same Neon DB). |
| **Vector Store** | **pgvector** (in Neon PostgreSQL) | No extra service to manage. Supports HNSW indexes for fast similarity search. Good enough for <10M vectors. |
| **Web Crawling** | **Crawlee** + **Playwright** | Crawlee: production framework with auto-scaling, retry, queue management, stealth mode. PlaywrightCrawler for JS-rendered sites; CheerioCrawler (100x faster) for static pages. Adaptive mode auto-switches. |
| **HTML Parsing** | **Cheerio** (static) + **Playwright** (dynamic) | Cheerio for meta extraction, link parsing. Playwright for Core Web Vitals, visual rendering, screenshot capture. |
| **Structured Output** | **Zod + LLM structured output** | Zod schemas define expected agent outputs. Claude/GPT structured output mode ensures valid JSON. |

### AI Alternatives Considered & Rejected

| Alternative | Reason rejected |
|------------|----------------|
| CrewAI | Role-based metaphor is nice for prototyping but less deterministic control for production SEO pipelines |
| AutoGen | Conversational pattern; SEO needs pipeline/graph not chat |
| Puppeteer | Chrome-only, no new features planned, Playwright is successor |
| Raw Playwright (no Crawlee) | Missing queue management, retry logic, auto-scaling, stealth — would need to build all of this |
| Pinecone (vector DB) | Extra service + cost; pgvector in same DB is simpler and sufficient at our scale |

---

## Layer 4: Infrastructure & DevOps

| Decision | Choice | Why |
|----------|--------|-----|
| **Monorepo** | **Turborepo** | Incremental builds, task caching, parallel execution. Better than Nx for Node/Next.js projects. |
| **Deployment** | **Vercel** (frontend) + **Railway** (backend/workers) | Vercel: best Next.js hosting, preview deployments. Railway: containers for Hono API + Trigger.dev workers + Crawlee crawlers. |
| **CI/CD** | **GitHub Actions** | Standard, free for open-source, Vercel/Railway auto-deploy on push. |
| **Monitoring** | **Sentry** (errors) + **LangSmith** (AI) + **Vercel Analytics** (web) | Sentry for crash reporting. LangSmith for AI agent tracing/debugging. Vercel Analytics for Core Web Vitals. |
| **Secrets** | **Vercel Environment Variables** + **Railway Variables** | Per-environment secrets, no `.env` files in CI. |
| **DNS/CDN** | **Cloudflare** | Free CDN, DDoS protection, R2 integration, Workers for edge logic. |

---

## Layer 5: Integrations (Platform Connectors)

| Platform | Integration Method | Auth |
|----------|-------------------|------|
| **Shopify** | Admin API (GraphQL) + Storefront API | OAuth 2.0 app installation |
| **WordPress** | REST API v2 + Application Passwords | OAuth or App Password |
| **Webflow** | Data API v2 | OAuth 2.0 |
| **Google Search Console** | Search Console API v3 | OAuth 2.0 (Google Cloud) |
| **Google Analytics** | GA4 Data API | OAuth 2.0 (Google Cloud) |
| **Custom websites** | Crawlee crawl + REST API (if exposed) | API key or crawl-only |

---

## Scalability Path

| Stage | Users | Architecture | Monthly Cost |
|-------|-------|-------------|-------------|
| **MVP** | 0-100 | Vercel (free) + Railway ($5) + Neon (free) + Upstash (free) | ~$20/mo |
| **Growth** | 100-1K | Vercel Pro + Railway Pro + Neon Pro + dedicated crawl workers | ~$200/mo |
| **Scale** | 1K-10K | Vercel Enterprise + Railway Teams + Neon Business + Crawlee on Apify Cloud | ~$2K/mo |
| **Enterprise** | 10K+ | Multi-region, dedicated infrastructure, Temporal for workflow, custom crawler fleet | ~$10K+/mo |

---

## Package Versions (Pin These)

```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "hono": "^4.7.0",
  "drizzle-orm": "^0.38.0",
  "drizzle-kit": "^0.30.0",
  "@langchain/langgraph": "^0.2.0",
  "@langchain/core": "^0.3.0",
  "crawlee": "^3.16.0",
  "playwright": "^1.50.0",
  "zod": "^3.24.0",
  "@trpc/server": "^11.0.0",
  "@trpc/client": "^11.0.0",
  "@tanstack/react-query": "^5.65.0",
  "@tanstack/react-table": "^8.21.0",
  "tailwindcss": "^4.0.0",
  "recharts": "^2.15.0",
  "better-auth": "^1.2.0",
  "resend": "^4.1.0",
  "@trigger.dev/sdk": "^3.3.0"
}
```
