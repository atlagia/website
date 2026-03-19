# SEOPilot — System Architecture

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 16 (App Router + RSC + Turbopack)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐      │
│  │Dashboard │ │Scan View │ │Settings  │ │Reports    │      │
│  │Overview  │ │& Issues  │ │& Billing │ │& Export   │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘      │
│       │             │            │              │             │
│       └─────────────┴────────────┴──────────────┘             │
│                        │ tRPC + SSE                           │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                    API GATEWAY                                │
│  Hono.js (Node.js 22 LTS)                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐      │
│  │tRPC      │ │REST      │ │Webhooks  │ │Auth       │      │
│  │Router    │ │(integr.) │ │(Stripe)  │ │(BetterAuth│      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘      │
│       └─────────────┴────────────┴──────────────┘             │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────────┐
         │               │                   │
┌────────┴───┐  ┌───────┴────────┐  ┌───────┴──────────┐
│ PostgreSQL │  │ Redis          │  │ Trigger.dev v3   │
│ (Neon)     │  │ (Upstash)      │  │ (Job Workers)    │
│ + pgvector │  │ Cache/Sessions │  │                  │
└────────────┘  └────────────────┘  │ ┌──────────────┐ │
                                    │ │Crawl Worker  │ │
                                    │ │(Crawlee+PW)  │ │
                                    │ ├──────────────┤ │
                                    │ │AI Agent      │ │
                                    │ │(LangGraph)   │ │
                                    │ ├──────────────┤ │
                                    │ │Report Worker │ │
                                    │ │(PDF gen)     │ │
                                    │ ├──────────────┤ │
                                    │ │Fix Worker    │ │
                                    │ │(API apply)   │ │
                                    │ └──────────────┘ │
                                    └──────────────────┘
```

---

## 2. Monorepo Structure (Turborepo)

```
seopilot/
├── apps/
│   ├── web/                          # Next.js 16 dashboard
│   │   ├── app/
│   │   │   ├── (auth)/               # Auth pages (login, register, forgot)
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── layout.tsx        # Centered layout, no sidebar
│   │   │   ├── (dashboard)/          # Main dashboard layout
│   │   │   │   ├── layout.tsx        # Sidebar + header layout
│   │   │   │   ├── page.tsx          # Dashboard overview
│   │   │   │   ├── sites/
│   │   │   │   │   ├── page.tsx              # Site list
│   │   │   │   │   ├── new/page.tsx          # Add site wizard
│   │   │   │   │   └── [siteId]/
│   │   │   │   │       ├── page.tsx          # Site overview
│   │   │   │   │       ├── issues/page.tsx   # Issue list + filters
│   │   │   │   │       ├── scans/page.tsx    # Scan history
│   │   │   │   │       ├── fixes/page.tsx    # AI fix suggestions
│   │   │   │   │       ├── reports/page.tsx  # Download reports
│   │   │   │   │       ├── competitors/page.tsx
│   │   │   │   │       └── settings/page.tsx # Site-specific settings
│   │   │   │   ├── settings/
│   │   │   │   │   ├── page.tsx              # Account settings
│   │   │   │   │   ├── billing/page.tsx      # Stripe billing portal
│   │   │   │   │   ├── team/page.tsx         # Team management
│   │   │   │   │   └── integrations/page.tsx # Connected platforms
│   │   │   │   └── @notifications/           # Parallel route: live notifications
│   │   │   │       └── page.tsx
│   │   │   └── api/
│   │   │       ├── trpc/[trpc]/route.ts      # tRPC handler
│   │   │       ├── webhooks/stripe/route.ts  # Stripe webhook
│   │   │       └── auth/[...all]/route.ts    # Better Auth catch-all
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── dashboard/            # Dashboard-specific components
│   │   │   │   ├── seo-score-ring.tsx
│   │   │   │   ├── issue-table.tsx
│   │   │   │   ├── agent-activity-feed.tsx
│   │   │   │   ├── scan-progress-bar.tsx
│   │   │   │   ├── fix-suggestion-card.tsx
│   │   │   │   └── site-health-chart.tsx
│   │   │   ├── layout/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   └── mobile-nav.tsx
│   │   │   └── providers/
│   │   │       ├── trpc-provider.tsx
│   │   │       ├── theme-provider.tsx
│   │   │       └── auth-provider.tsx
│   │   ├── lib/
│   │   │   ├── trpc.ts               # tRPC client setup
│   │   │   ├── auth-client.ts        # Better Auth client
│   │   │   └── utils.ts
│   │   └── styles/
│   │       └── globals.css
│   │
│   └── api/                          # Hono.js API server
│       ├── src/
│       │   ├── index.ts              # Hono app entry
│       │   ├── trpc/
│       │   │   ├── router.ts         # Root tRPC router
│       │   │   ├── context.ts        # tRPC context (auth, db)
│       │   │   └── routers/
│       │   │       ├── site.ts       # CRUD sites
│       │   │       ├── scan.ts       # Trigger/monitor scans
│       │   │       ├── issue.ts      # Issue CRUD + filters
│       │   │       ├── fix.ts        # AI fix suggestions + apply
│       │   │       ├── report.ts     # Generate/download reports
│       │   │       ├── agent.ts      # Agent status + logs
│       │   │       ├── billing.ts    # Stripe subscription
│       │   │       └── integration.ts # Platform connections
│       │   ├── middleware/
│       │   │   ├── auth.ts           # Better Auth middleware
│       │   │   ├── rate-limit.ts     # Upstash rate limiter
│       │   │   └── cors.ts
│       │   ├── webhooks/
│       │   │   ├── stripe.ts
│       │   │   └── platform-hooks.ts
│       │   └── lib/
│       │       ├── db.ts             # Drizzle client
│       │       ├── redis.ts          # Upstash client
│       │       ├── auth.ts           # Better Auth server
│       │       ├── stripe.ts         # Stripe client
│       │       └── r2.ts             # Cloudflare R2 client
│       └── drizzle/
│           ├── schema.ts             # All Drizzle table definitions
│           └── migrations/           # Auto-generated
│
├── packages/
│   ├── shared/                       # Shared types and schemas
│   │   ├── src/
│   │   │   ├── schemas/              # Zod schemas (shared FE + BE)
│   │   │   │   ├── site.ts
│   │   │   │   ├── scan.ts
│   │   │   │   ├── issue.ts
│   │   │   │   ├── fix.ts
│   │   │   │   └── report.ts
│   │   │   ├── types/
│   │   │   │   ├── agent.ts
│   │   │   │   ├── seo.ts
│   │   │   │   └── platform.ts
│   │   │   └── constants/
│   │   │       ├── seo-rules.ts      # 200+ SEO rules with severity
│   │   │       └── issue-categories.ts
│   │   └── package.json
│   │
│   ├── crawler/                      # Crawlee + Playwright engine
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── seo-crawler.ts        # Main Crawlee crawler
│   │   │   ├── extractors/
│   │   │   │   ├── meta.ts           # Meta tags, OG, Twitter
│   │   │   │   ├── headings.ts       # H1-H6 structure
│   │   │   │   ├── links.ts          # Internal/external links
│   │   │   │   ├── images.ts         # Alt text, dimensions, format
│   │   │   │   ├── schema.ts         # JSON-LD structured data
│   │   │   │   ├── performance.ts    # Core Web Vitals via Lighthouse
│   │   │   │   └── accessibility.ts  # A11y checks
│   │   │   ├── analyzers/
│   │   │   │   ├── technical-seo.ts  # Canonicals, redirects, robots
│   │   │   │   ├── content-seo.ts    # Thin content, keyword density
│   │   │   │   ├── link-health.ts    # Broken links, orphan pages
│   │   │   │   └── speed.ts          # Performance scoring
│   │   │   └── utils/
│   │   │       ├── sitemap-parser.ts
│   │   │       ├── robots-parser.ts
│   │   │       └── url-utils.ts
│   │   └── package.json
│   │
│   ├── agents/                       # LangGraph AI agent system
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── graph.ts              # Main LangGraph workflow
│   │   │   ├── nodes/
│   │   │   │   ├── crawl-node.ts     # Triggers crawl, validates output
│   │   │   │   ├── technical-audit.ts # Analyzes crawl data for tech issues
│   │   │   │   ├── content-audit.ts  # Analyzes content quality
│   │   │   │   ├── fix-generator.ts  # AI-generates fixes
│   │   │   │   ├── fix-applier.ts    # Applies fixes via platform API
│   │   │   │   ├── report-builder.ts # Compiles final report
│   │   │   │   └── verification.ts   # Re-checks after fixes
│   │   │   ├── tools/
│   │   │   │   ├── meta-generator.ts # Generate optimized meta tags
│   │   │   │   ├── schema-generator.ts # Generate JSON-LD
│   │   │   │   ├── content-optimizer.ts # Rewrite thin content
│   │   │   │   ├── alt-text-generator.ts # AI alt text for images
│   │   │   │   └── internal-linker.ts # Suggest internal links
│   │   │   ├── state.ts              # LangGraph state definition
│   │   │   ├── checkpointer.ts       # Postgres checkpoint for resume
│   │   │   └── prompts/
│   │   │       ├── technical-audit.ts
│   │   │       ├── content-audit.ts
│   │   │       ├── fix-generation.ts
│   │   │       └── report-template.ts
│   │   └── package.json
│   │
│   └── integrations/                 # Platform connectors
│       ├── src/
│       │   ├── index.ts
│       │   ├── shopify/
│       │   │   ├── client.ts         # GraphQL Admin API
│       │   │   ├── meta-updater.ts   # Update meta tags
│       │   │   └── schema-injector.ts # Add JSON-LD
│       │   ├── wordpress/
│       │   │   ├── client.ts         # REST API v2
│       │   │   ├── yoast-updater.ts  # Update Yoast SEO fields
│       │   │   └── plugin-checker.ts # Check SEO plugin status
│       │   ├── webflow/
│       │   │   ├── client.ts         # Data API v2
│       │   │   └── seo-updater.ts
│       │   ├── google/
│       │   │   ├── search-console.ts # GSC API v3
│       │   │   └── analytics.ts      # GA4 Data API
│       │   └── base-connector.ts     # Abstract connector interface
│       └── package.json
│
├── workers/                          # Trigger.dev job definitions
│   ├── src/
│   │   ├── trigger.ts               # Trigger.dev client config
│   │   ├── jobs/
│   │   │   ├── crawl-site.ts        # Full site crawl job
│   │   │   ├── run-audit.ts         # Run AI audit pipeline
│   │   │   ├── apply-fixes.ts       # Apply fixes to platform
│   │   │   ├── generate-report.ts   # PDF report generation
│   │   │   ├── scheduled-scan.ts    # Cron: weekly re-scan
│   │   │   └── competitor-scan.ts   # Competitor analysis
│   │   └── utils/
│   │       ├── progress-emitter.ts  # SSE progress updates
│   │       └── error-handler.ts
│   └── package.json
│
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
├── .env.example
└── README.md
```

---

## 3. Database Schema (Drizzle ORM)

```typescript
// drizzle/schema.ts

import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, pgEnum, varchar, real, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ───

export const planEnum = pgEnum('plan', ['free', 'starter', 'pro', 'enterprise']);
export const scanStatusEnum = pgEnum('scan_status', ['queued', 'crawling', 'analyzing', 'fixing', 'completed', 'failed']);
export const issueSeverityEnum = pgEnum('issue_severity', ['critical', 'high', 'medium', 'low', 'info']);
export const issueCategoryEnum = pgEnum('issue_category', [
  'meta_tags', 'headings', 'links', 'images', 'performance',
  'schema_markup', 'canonical', 'robots', 'sitemap', 'content',
  'mobile', 'security', 'accessibility', 'core_web_vitals'
]);
export const fixStatusEnum = pgEnum('fix_status', ['suggested', 'approved', 'applied', 'failed', 'reverted']);
export const platformEnum = pgEnum('platform', ['shopify', 'wordpress', 'webflow', 'custom', 'woocommerce']);
export const agentTypeEnum = pgEnum('agent_type', ['crawler', 'technical', 'content', 'fixer', 'performance', 'monitor']);

// ─── Users & Organizations ───

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  avatarUrl: text('avatar_url'),
  plan: planEnum('plan').default('free').notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  plan: planEnum('plan').default('free').notNull(),
  maxSites: integer('max_sites').default(1).notNull(),
  maxScansPerMonth: integer('max_scans_per_month').default(10).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orgMembers = pgTable('org_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: varchar('role', { length: 50 }).default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// ─── Sites ───

export const sites = pgTable('sites', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  url: text('url').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  platform: platformEnum('platform').default('custom'),
  platformCredentials: jsonb('platform_credentials'),
  gscConnected: boolean('gsc_connected').default(false),
  gaConnected: boolean('ga_connected').default(false),
  autoFix: boolean('auto_fix').default(false),
  scanSchedule: varchar('scan_schedule', { length: 50 }).default('weekly'),
  lastScanAt: timestamp('last_scan_at'),
  seoScore: integer('seo_score'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orgIdx: index('sites_org_idx').on(table.orgId),
  urlIdx: index('sites_url_idx').on(table.url),
}));

// ─── Scans ───

export const scans = pgTable('scans', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  status: scanStatusEnum('status').default('queued').notNull(),
  triggeredBy: uuid('triggered_by').references(() => users.id),
  pagesScanned: integer('pages_scanned').default(0),
  totalPages: integer('total_pages'),
  issuesFound: integer('issues_found').default(0),
  issuesFixed: integer('issues_fixed').default(0),
  seoScoreBefore: integer('seo_score_before'),
  seoScoreAfter: integer('seo_score_after'),
  crawlDataUrl: text('crawl_data_url'),
  reportUrl: text('report_url'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  metadata: jsonb('metadata'),
}, (table) => ({
  siteIdx: index('scans_site_idx').on(table.siteId),
  statusIdx: index('scans_status_idx').on(table.status),
}));

// ─── Pages (crawled) ───

export const pages = pgTable('pages', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  scanId: uuid('scan_id').references(() => scans.id).notNull(),
  url: text('url').notNull(),
  statusCode: integer('status_code'),
  title: text('title'),
  metaDescription: text('meta_description'),
  h1: text('h1'),
  canonicalUrl: text('canonical_url'),
  wordCount: integer('word_count'),
  loadTime: real('load_time'),
  lcp: real('lcp'),
  fid: real('fid'),
  cls: real('cls'),
  inp: real('inp'),
  ttfb: real('ttfb'),
  hasSchemaMarkup: boolean('has_schema_markup').default(false),
  schemaTypes: jsonb('schema_types'),
  internalLinks: integer('internal_links'),
  externalLinks: integer('external_links'),
  brokenLinks: jsonb('broken_links'),
  images: jsonb('images'),
  headings: jsonb('headings'),
  screenshotUrl: text('screenshot_url'),
  rawHtml: text('raw_html'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  siteIdx: index('pages_site_idx').on(table.siteId),
  scanIdx: index('pages_scan_idx').on(table.scanId),
  urlIdx: index('pages_url_idx').on(table.url),
}));

// ─── Issues ───

export const issues = pgTable('issues', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  scanId: uuid('scan_id').references(() => scans.id).notNull(),
  pageId: uuid('page_id').references(() => pages.id),
  category: issueCategoryEnum('category').notNull(),
  severity: issueSeverityEnum('severity').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  pageUrl: text('page_url'),
  currentValue: text('current_value'),
  suggestedValue: text('suggested_value'),
  ruleId: varchar('rule_id', { length: 100 }),
  fixable: boolean('fixable').default(false),
  fixStatus: fixStatusEnum('fix_status').default('suggested'),
  fixedAt: timestamp('fixed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  siteIdx: index('issues_site_idx').on(table.siteId),
  scanIdx: index('issues_scan_idx').on(table.scanId),
  severityIdx: index('issues_severity_idx').on(table.severity),
  categoryIdx: index('issues_category_idx').on(table.category),
}));

// ─── Fixes ───

export const fixes = pgTable('fixes', {
  id: uuid('id').defaultRandom().primaryKey(),
  issueId: uuid('issue_id').references(() => issues.id).notNull(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  fixType: varchar('fix_type', { length: 100 }).notNull(),
  beforeValue: text('before_value'),
  afterValue: text('after_value'),
  status: fixStatusEnum('status').default('suggested').notNull(),
  appliedBy: uuid('applied_by').references(() => users.id),
  appliedAt: timestamp('applied_at'),
  revertedAt: timestamp('reverted_at'),
  aiConfidence: real('ai_confidence'),
  aiReasoning: text('ai_reasoning'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Agent Activity Logs ───

export const agentLogs = pgTable('agent_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  scanId: uuid('scan_id').references(() => scans.id).notNull(),
  agentType: agentTypeEnum('agent_type').notNull(),
  action: varchar('action', { length: 255 }).notNull(),
  details: jsonb('details'),
  durationMs: integer('duration_ms'),
  tokensUsed: integer('tokens_used'),
  cost: real('cost'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  scanIdx: index('agent_logs_scan_idx').on(table.scanId),
}));

// ─── Reports ───

export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  scanId: uuid('scan_id').references(() => scans.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  pdfUrl: text('pdf_url'),
  jsonData: jsonb('json_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── SEO Score History (for trend charts) ───

export const seoScoreHistory = pgTable('seo_score_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  score: integer('score').notNull(),
  technicalScore: integer('technical_score'),
  contentScore: integer('content_score'),
  performanceScore: integer('performance_score'),
  linkScore: integer('link_score'),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
}, (table) => ({
  siteTimeIdx: index('score_history_site_time_idx').on(table.siteId, table.recordedAt),
}));

// ─── Competitors ───

export const competitors = pgTable('competitors', {
  id: uuid('id').defaultRandom().primaryKey(),
  siteId: uuid('site_id').references(() => sites.id).notNull(),
  url: text('url').notNull(),
  name: varchar('name', { length: 255 }),
  lastAnalyzedAt: timestamp('last_analyzed_at'),
  seoScore: integer('seo_score'),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── SEO Knowledge Base (for RAG) ───

export const seoKnowledge = pgTable('seo_knowledge', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  source: varchar('source', { length: 255 }),
  category: varchar('category', { length: 100 }),
  // pgvector column for embeddings
  // embedding: vector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ─── Relations ───

export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(organizations),
}));

export const sitesRelations = relations(sites, ({ one, many }) => ({
  organization: one(organizations, { fields: [sites.orgId], references: [organizations.id] }),
  scans: many(scans),
  issues: many(issues),
  competitors: many(competitors),
  scoreHistory: many(seoScoreHistory),
}));

export const scansRelations = relations(scans, ({ one, many }) => ({
  site: one(sites, { fields: [scans.siteId], references: [sites.id] }),
  pages: many(pages),
  issues: many(issues),
  agentLogs: many(agentLogs),
}));
```

---

## 4. tRPC API Structure

```
trpc/
├── router.ts                    # Root: merges all sub-routers
├── context.ts                   # Auth session + DB + Redis
└── routers/
    ├── site.ts
    │   ├── list                 # query: paginated site list
    │   ├── getById              # query: site + latest scan
    │   ├── create               # mutation: add new site
    │   ├── update               # mutation: edit site settings
    │   ├── delete               # mutation: remove site
    │   └── getStats             # query: aggregate stats
    │
    ├── scan.ts
    │   ├── trigger              # mutation: start new scan → Trigger.dev job
    │   ├── getStatus            # query: scan status + progress
    │   ├── list                 # query: scan history for site
    │   ├── getResults           # query: scan results (pages, issues)
    │   └── onProgress           # subscription (SSE): real-time scan progress
    │
    ├── issue.ts
    │   ├── list                 # query: paginated, filterable issue list
    │   ├── getById              # query: issue + fix suggestions
    │   ├── bySeverity           # query: grouped counts by severity
    │   ├── byCategory           # query: grouped counts by category
    │   └── bulkUpdateStatus     # mutation: approve/dismiss multiple issues
    │
    ├── fix.ts
    │   ├── suggest              # mutation: AI-generate fix for issue
    │   ├── apply                # mutation: apply fix to platform
    │   ├── applyBulk            # mutation: apply multiple fixes
    │   ├── revert               # mutation: revert applied fix
    │   └── onFixProgress        # subscription (SSE): fix application progress
    │
    ├── report.ts
    │   ├── generate             # mutation: generate PDF report
    │   ├── list                 # query: report history
    │   └── download             # query: signed URL for PDF
    │
    ├── agent.ts
    │   ├── getLogs              # query: agent activity logs
    │   ├── getStatus            # query: current agent states
    │   └── onActivity           # subscription (SSE): live agent activity
    │
    ├── billing.ts
    │   ├── getSubscription      # query: current plan details
    │   ├── createCheckout       # mutation: Stripe checkout session
    │   ├── createPortal         # mutation: Stripe billing portal
    │   └── getUsage             # query: scans used / remaining
    │
    └── integration.ts
        ├── connect              # mutation: OAuth flow for platform
        ├── disconnect           # mutation: remove connection
        ├── list                 # query: connected platforms
        └── test                 # mutation: test connection health
```

---

## 5. AI Agent Pipeline (LangGraph)

```
                    ┌──────────────┐
                    │  START       │
                    │  (site URL)  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ CRAWL NODE   │
                    │ (Crawlee +   │
                    │  Playwright) │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼─────┐ ┌───▼────┐ ┌────▼─────┐
       │ TECHNICAL  │ │CONTENT │ │PERFORMANCE│
       │ AUDIT      │ │AUDIT   │ │AUDIT      │
       │ (parallel) │ │(parallel)│ │(parallel) │
       └──────┬─────┘ └───┬────┘ └────┬─────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼───────┐
                    │ MERGE &      │
                    │ PRIORITIZE   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ FIX          │
                    │ GENERATOR    │──── generates fixes via LLM
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
              ┌─────│ HUMAN GATE   │
              │     │ (auto_fix?)  │
              │     └──────┬───────┘
              │            │ yes
              │     ┌──────▼───────┐
              │     │ FIX APPLIER  │──── platform API calls
              │     └──────┬───────┘
              │            │
              └────────────┤
                           │
                    ┌──────▼───────┐
                    │ VERIFICATION │──── re-crawl affected pages
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │ REPORT       │──── compile PDF + dashboard data
                    │ BUILDER      │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    END       │
                    └──────────────┘
```

State checkpointed to PostgreSQL at every node transition. If any node fails, the pipeline resumes from the last checkpoint.

---

## 6. SSE Real-Time Event Types

```typescript
type ScanProgressEvent = {
  type: 'scan.progress';
  scanId: string;
  phase: 'crawling' | 'analyzing' | 'fixing' | 'reporting';
  pagesScanned: number;
  totalPages: number;
  currentUrl: string;
};

type AgentActivityEvent = {
  type: 'agent.activity';
  scanId: string;
  agentType: 'crawler' | 'technical' | 'content' | 'fixer' | 'performance';
  action: string;
  details: string;
  timestamp: string;
};

type FixAppliedEvent = {
  type: 'fix.applied';
  fixId: string;
  issueId: string;
  status: 'success' | 'failed';
  beforeValue: string;
  afterValue: string;
};

type ScoreUpdateEvent = {
  type: 'score.update';
  siteId: string;
  oldScore: number;
  newScore: number;
  breakdown: {
    technical: number;
    content: number;
    performance: number;
    links: number;
  };
};
```

---

## 7. Dashboard Pages (UX Specification)

### 7.1 Dashboard Overview (`/`)
- **KPI Cards:** Total sites, Average SEO score, Issues found this month, Fixes applied
- **Score Trend Chart:** Line chart (Recharts) showing 30-day SEO score trend per site
- **Recent Scans:** Table of last 5 scans with status badges
- **Agent Activity Feed:** Live SSE-powered activity timeline
- **Quick Actions:** "Add Site", "Run Scan", "View Reports"

### 7.2 Site Detail (`/sites/[siteId]`)
- **Score Ring:** Animated circular progress (SEO score out of 100)
- **Score Breakdown:** 4 sub-scores (Technical, Content, Performance, Links)
- **Issue Summary:** Bar chart by severity (critical/high/medium/low)
- **Latest Scan:** Status + pages crawled + issues found
- **Quick Fix Button:** "Auto-fix all approved issues"

### 7.3 Issues (`/sites/[siteId]/issues`)
- **Filter Bar:** Severity, Category, Fix status, Page URL search
- **Data Table:** TanStack Table with server-side pagination, sorting
- **Inline Fix Preview:** Expand row → see current vs suggested value
- **Bulk Actions:** Select multiple → Approve / Dismiss / Apply fixes
- **Export:** CSV download of filtered issues

### 7.4 AI Fixes (`/sites/[siteId]/fixes`)
- **Fix Queue:** List of suggested fixes with AI confidence score
- **Before/After Diff:** Side-by-side comparison
- **One-Click Apply:** Apply single fix with loading state + SSE progress
- **Auto-Fix Toggle:** Enable automatic fix application for approved types
- **Revert Button:** Undo applied fix (platform API revert)

### 7.5 Reports (`/sites/[siteId]/reports`)
- **Report List:** Downloadable PDF reports per scan
- **Report Preview:** Embedded PDF viewer or HTML preview
- **Schedule:** Configure auto-report generation (weekly/monthly)
- **Shareable Link:** Public report URL for clients

### 7.6 Settings (`/settings`)
- **Profile:** Name, email, avatar
- **Billing:** Stripe customer portal embed, plan details, usage meter
- **Team:** Invite members, manage roles (owner/admin/member)
- **Integrations:** OAuth connect buttons for Shopify, WordPress, Webflow, GSC, GA
- **Notifications:** Email preferences for scan completion, new issues, etc.
