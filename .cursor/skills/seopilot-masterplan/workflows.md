# SEOPilot — Automation Workflows & Best Practices

## 1. Primary Scan Workflow

### Trigger
- User clicks "Run Scan" (manual)
- Cron job (scheduled: daily/weekly/monthly per site)
- Site created (initial scan)
- Webhook (post-deploy scan from CI/CD)

### Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: CRAWL                                                   │
│                                                                   │
│ ① Fetch robots.txt → parse rules, extract sitemap URLs           │
│ ② Fetch sitemap.xml → discover all URLs                          │
│ ③ Crawl pages (concurrent, polite delay)                         │
│    For each page:                                                 │
│    - Extract: meta, headings, links, images, schema, CWV         │
│    - Store in `pages` table                                       │
│    - Emit: scan.progress { pagesScanned, totalPages, currentUrl } │
│ ④ HEAD-check external links for broken link detection             │
│                                                                   │
│ SSE Events: scan.progress (every page)                            │
│ DB Updates: scans.status='crawling', scans.pagesScanned++         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ PHASE 2: ANALYZE (parallel)                                      │
│                                                                   │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐ │
│ │ Technical SEO    │ │ Content SEO     │ │ Performance         │ │
│ │ - Meta tags      │ │ - Thin content  │ │ - Core Web Vitals   │ │
│ │ - Headings       │ │ - Duplicates    │ │ - Page weight       │ │
│ │ - Canonicals     │ │ - Keyword use   │ │ - Render-blocking   │ │
│ │ - Schema         │ │ - Readability   │ │ - Image optimization│ │
│ │ - Broken links   │ │ - Alt text      │ │ - DOM size          │ │
│ │ - Redirects      │ │ - Internal links│ │                     │ │
│ │ - Security       │ │                 │ │                     │ │
│ └────────┬────────┘ └────────┬────────┘ └──────────┬──────────┘ │
│          └───────────────────┼──────────────────────┘            │
│                              │                                    │
│ ⑤ Merge all issues, deduplicate, sort by severity                │
│ ⑥ Calculate SEO score (weighted by category)                     │
│ ⑦ Store issues in `issues` table                                 │
│ ⑧ Store score in `seo_score_history`                             │
│                                                                   │
│ SSE Events: agent.activity { agent, action }                      │
│ DB Updates: scans.status='analyzing', issues inserted             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│ PHASE 3: FIX GENERATION                                          │
│                                                                   │
│ ⑨ For each fixable issue:                                        │
│    - LLM generates fix (meta tag, schema, alt text, etc.)        │
│    - Structured output (Zod) ensures valid format                 │
│    - Confidence score (0.0-1.0) attached                          │
│    - Store in `fixes` table with status='suggested'               │
│                                                                   │
│ SSE Events: agent.activity { agent: 'fixer', action }            │
│ DB Updates: fixes inserted                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ AUTO-FIX?   │
                    │ (site.autoFix│
                    │ && confidence│
                    │ > 0.8)      │
                    └──┬──────┬───┘
                  yes  │      │ no
                       │      │
┌──────────────────────▼──┐  │
│ PHASE 4: APPLY           │  │
│                          │  │
│ ⑩ For each approved fix: │  │
│    - Resolve platform    │  │
│    - Call platform API   │  │
│    - Verify applied      │  │
│    - Update fix status   │  │
│                          │  │
│ SSE: fix.applied         │  │
│ DB: fixes.status updated │  │
└──────────┬───────────────┘  │
           │                   │
           └───────────┬───────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│ PHASE 5: REPORT & COMPLETE                                       │
│                                                                   │
│ ⑪ Generate PDF report (executive summary + details)              │
│ ⑫ Upload to R2, store URL in `reports` table                     │
│ ⑬ Update scan status to 'completed'                              │
│ ⑭ Update site.seoScore                                           │
│ ⑮ Emit: score.update { oldScore, newScore, breakdown }           │
│                                                                   │
│ SSE Events: score.update, scan.completed                          │
│ DB Updates: scans.status='completed', sites.seoScore              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Continuous Optimization Loop

```
            ┌────────────────────────────────┐
            │     CONTINUOUS LOOP             │
            │                                │
  ┌─────────▼─────────┐                     │
  │ Scheduled Scan     │ (weekly cron)       │
  │ (re-crawl site)    │                     │
  └─────────┬─────────┘                     │
            │                                │
  ┌─────────▼─────────┐                     │
  │ Compare to Previous│                     │
  │ - New issues?      │                     │
  │ - Fixed issues?    │                     │
  │ - Score changed?   │                     │
  └─────────┬─────────┘                     │
            │                                │
  ┌─────────▼─────────┐                     │
  │ Generate Delta     │                     │
  │ Report             │                     │
  └─────────┬─────────┘                     │
            │                                │
  ┌─────────▼─────────┐     ┌──────────┐   │
  │ Notify User        │────▶│ Email    │   │
  │ (if score dropped  │     │ Webhook  │   │
  │  or critical issue)│     │ In-app   │   │
  └─────────┬─────────┘     └──────────┘   │
            │                                │
            └────────────────────────────────┘
```

---

## 3. Fix Application Workflow

```
fix.apply(issueId)
  │
  ├── Lookup issue → get site → get platform + credentials
  │
  ├── Switch platform:
  │   ├── shopify → Shopify GraphQL mutation
  │   ├── wordpress → WP REST API + Yoast fields
  │   ├── webflow → Webflow Data API
  │   └── custom → Store fix for manual application
  │
  ├── Call platform API with retry (3 attempts, exponential backoff)
  │   ├── Success → Update issue.fixStatus = 'applied'
  │   │           → Emit fix.applied event
  │   │           → Schedule verification (re-crawl page in 5 min)
  │   └── Failure → Update issue.fixStatus = 'failed'
  │               → Log error to agentLogs
  │               → Emit fix.failed event
  │
  └── Verification (5 min later):
      ├── Re-fetch page
      ├── Check if fix is reflected in HTML
      ├── If verified → Mark as confirmed
      └── If not → Alert user, mark as 'needs_review'
```

---

## 4. Keyword Research Workflow

```
keyword.discover(siteId, seedKeywords?)
  │
  ├── Fetch existing rankings from Google Search Console
  │   → Impressions, clicks, CTR, avg position per query
  │
  ├── Expand with Google Suggest API
  │   → Autocomplete suggestions for seed + variations
  │
  ├── (Optional) DataForSEO API
  │   → Search volume, keyword difficulty, CPC
  │
  ├── Embed all keywords (text-embedding-3-small)
  │
  ├── Cluster by semantic similarity (HDBSCAN)
  │   → LLM names each cluster
  │
  ├── Classify intent per keyword
  │   → informational / navigational / transactional / commercial
  │
  ├── Map keywords to existing pages
  │   → Identify: covered, partially covered, not covered (gaps)
  │
  └── Store: keywords table, keyword_rankings table
      → Schedule weekly position tracking
```

---

## 5. Content Generation Workflow

```
content.generate(type, target)
  │
  ├── Research phase:
  │   ├── Analyze top 10 SERP results for target keyword
  │   ├── Extract: word count, headings, topics covered
  │   └── Identify content gaps and unique angles
  │
  ├── Outline phase (LLM):
  │   ├── Generate heading structure (H2-H4)
  │   ├── Define key points per section
  │   └── Plan internal links (from site's page inventory)
  │
  ├── Write phase (LLM):
  │   ├── Generate content section by section
  │   ├── Enforce: keyword density 1-2%, readability grade 8-10
  │   ├── Add internal links naturally
  │   └── Generate FAQ section with schema
  │
  ├── SEO meta phase (LLM):
  │   ├── Title tag (≤60 chars, keyword + compelling)
  │   ├── Meta description (≤160 chars, CTA)
  │   ├── JSON-LD Article schema
  │   └── OG image prompt (if image gen available)
  │
  └── Publish phase:
      ├── Format as HTML
      ├── Push to platform via integration connector
      ├── Submit URL to Google via Indexing API
      └── Schedule follow-up ranking check (7 days)
```

---

## 6. Event-Driven Architecture

### Event Bus (Redis Pub/Sub)

```
Publishers:                     Subscribers:
┌──────────────┐               ┌──────────────────────┐
│ Scan Pipeline │──publish──▶  │ SSE Router           │
│ Fix Worker    │              │  → streams to clients │
│ Report Worker │              ├──────────────────────┤
│ Cron Jobs     │              │ Notification Worker   │
└──────────────┘              │  → email, webhook     │
                               ├──────────────────────┤
                               │ Analytics Worker      │
                               │  → aggregate metrics  │
                               └──────────────────────┘
```

### Event Types

| Event | Payload | Subscribers |
|-------|---------|-------------|
| `scan.started` | `{ scanId, siteId }` | Dashboard, Notifications |
| `scan.progress` | `{ scanId, phase, pagesScanned, totalPages, currentUrl }` | Dashboard progress bar |
| `scan.completed` | `{ scanId, siteId, score, issueCount }` | Dashboard, Notifications, Report generator |
| `scan.failed` | `{ scanId, error }` | Dashboard, Alert system |
| `agent.activity` | `{ scanId, agentType, action, status }` | Dashboard agent feed |
| `fix.suggested` | `{ fixId, issueId, confidence }` | Dashboard fix queue |
| `fix.applied` | `{ fixId, issueId, status, before, after }` | Dashboard, Notifications |
| `fix.failed` | `{ fixId, issueId, error }` | Dashboard, Alert system |
| `score.update` | `{ siteId, oldScore, newScore, breakdown }` | Dashboard score ring, Notifications |
| `report.ready` | `{ reportId, siteId, downloadUrl }` | Dashboard, Email notification |
| `keyword.rank_change` | `{ siteId, keyword, oldPos, newPos }` | Dashboard, Alert (if big drop) |

---

## 7. Job System (Trigger.dev)

### Job Definitions

| Job | Trigger | Concurrency | Timeout | Retry |
|-----|---------|-------------|---------|-------|
| `crawl-site` | API call | 5 per worker | 5 min | 2x with backoff |
| `analyze-issues` | After crawl | 10 per worker | 2 min | 2x |
| `generate-fixes` | After analyze | 3 per worker | 3 min | 1x |
| `apply-fixes` | User action or auto | 3 per worker | 1 min per fix | 3x with backoff |
| `generate-report` | After scan complete | 5 per worker | 2 min | 2x |
| `scheduled-scan` | Cron (hourly check) | 1 | 30s (dispatch only) | 1x |
| `track-keywords` | Cron (daily) | 2 per worker | 5 min | 2x |
| `competitor-scan` | API call | 2 per worker | 5 min | 1x |

### Retry Strategy

```typescript
const retryConfig = {
  maxAttempts: 3,
  initialDelay: '5s',
  backoffMultiplier: 2,
  maxDelay: '60s',
  retryableErrors: ['NETWORK_ERROR', 'RATE_LIMITED', 'TIMEOUT'],
  nonRetryableErrors: ['AUTH_FAILED', 'NOT_FOUND', 'INVALID_INPUT'],
};
```

### Dead Letter Queue
Failed jobs after all retries go to a dead letter queue. Weekly report of failed jobs sent to admin. Dashboard shows "Failed Jobs" count in system status.

---

## 8. Best Practices

### SEO Accuracy
- **Rule source of truth:** Base rules on Google's official documentation (Search Central), not hearsay
- **Severity calibration:** Critical = blocks indexing/rendering; High = significant traffic impact; Medium = improvement opportunity; Low = nice to have
- **False positive prevention:** For AI-generated fixes, validate format (title ≤60 chars, desc ≤160 chars) before suggesting. Never suggest duplicate content.
- **Penalty avoidance:** Never keyword-stuff (cap density at 2%). Never generate doorway pages. Never manipulate schema with false data.
- **Before/after tracking:** Always record the original value before applying any fix, enabling revert.

### AI Reliability
- **Structured output everywhere:** Use Zod schemas for all LLM responses. Parse and validate before storing.
- **Confidence thresholds:** Only auto-apply fixes with confidence > 0.8. Show low-confidence fixes as "needs review."
- **Human-in-the-loop:** Auto-fix is opt-in per site. Default is "suggest and wait for approval."
- **Hallucination guard:** For content generation, fact-check claims against source material. For meta tags, ensure they match actual page content.
- **Fallback chain:** Claude → GPT-4o → template-based fallback. Never fail silently.

### Scalability
- **Concurrent crawls:** Crawlee handles concurrency natively. Cap at 10 concurrent requests per domain.
- **Database indexing:** All frequently-queried columns indexed (siteId, scanId, severity, category, status).
- **Connection pooling:** Neon serverless driver handles pooling. Set max connections per worker.
- **Page limit by plan:** Free: 50 pages, Starter: 500, Pro: 5000, Enterprise: unlimited.
- **Lazy loading:** Don't store raw HTML in DB by default. Store on R2, reference by URL.
- **Archival:** Scans older than 90 days → move to cold storage. Keep score history indefinitely.

### Cost Optimization (LLM)
- **Batch similar issues:** Instead of 1 LLM call per issue, batch all "missing meta description" issues into 1 call with multiple pages.
- **Cache responses:** Redis cache with 24h TTL for identical inputs (same page content → same fix).
- **Model tiering:** GPT-4o-mini for classification and alt text (~$0.15/1M tokens). Claude for complex content and strategy (~$3/1M tokens).
- **Token budget per scan:** Free: 10K tokens, Starter: 100K, Pro: 500K, Enterprise: 2M.
- **Skip LLM when rule suffices:** Don't use AI for "title too long" (just truncate). Use AI for "write a better title."

### Security
- **SSRF prevention:** Before crawling user-supplied URLs, resolve DNS and block private IP ranges (10.x, 172.16-31.x, 192.168.x, 127.x, ::1).
- **Credential encryption:** Platform OAuth tokens encrypted at rest (AES-256). Decrypted only in worker memory.
- **Rate limiting:** Upstash rate limiter on all mutations (10/min for scan trigger, 100/min for reads).
- **Auth on all routes:** Replace `publicProcedure` with `protectedProcedure` that checks Supabase session.
- **Input sanitization:** Validate and sanitize all user inputs (URLs, names) before processing.
- **Secrets rotation:** API keys and tokens in environment variables, rotatable without redeploy.

### UX
- **Progressive disclosure:** Show score first, then category breakdown, then individual issues on drill-down.
- **Actionable insights:** Every issue shows: what's wrong, why it matters, how to fix it, and a one-click "Apply Fix" button.
- **Noise reduction:** Don't show info-level issues by default. Default filter to critical + high.
- **Score context:** "Your score is 72 — that's better than 65% of sites in your industry" (when benchmark data available).
- **Time-to-value:** First scan should complete in <30 seconds for sites with <50 pages. Show results immediately as they're found (streaming).
