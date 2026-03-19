# Subagent: SEO Auditor

**Invoked by:** Master coordinator (LangGraph) on `scan.trigger`, scheduled cron, or site.create (initial scan)
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Crawl a website and produce a comprehensive technical + content + performance audit. Output: pages, issues, SEO score, score breakdown, site metrics. Rule-based analysis with minimal LLM (only for nuanced edge cases).

## Inputs

- `siteUrl`: string
- `siteId`: uuid
- `scanId`: uuid
- `crawlOptions`: `{ maxPages?, respectRobots?, followSitemap?, maxCrawlDepth? }`

## Outputs

- `pages`: CrawledPage[]
- `issues`: Issue[]
- `seoScore`: number (0–100)
- `scoreBreakdown`: `{ technical, content, performance, links }`
- `siteMetrics`: `{ totalPages, avgLoadTime, brokenLinkCount, ... }`

## Skills (Implementation Steps)

### 1.1 crawl-website

- Parse robots.txt; extract sitemap URLs.
- Fetch sitemap.xml (support sitemap index); discover URLs.
- Crawl with Crawlee adaptive (CheerioCrawler for static, PlaywrightCrawler for JS).
- Per page: extract meta, headings, links, images, schema, CWV (if Playwright).
- HEAD-check external links (concurrent, timeout); detect redirect chains (>2 hops).
- Emit `scan.progress` per page. Store pages in DB.

### 1.2 analyze-meta-tags

- For each page: check title (missing, <30, >60 chars), meta description (missing, <70, >160), OG tags, Twitter cards.
- Check duplicate titles/descriptions across pages.
- Output `Issue[]` with ruleId: missing-title, title-too-long, missing-meta-desc, etc.

### 1.3 analyze-headings

- Per page: exactly 1 H1; no skipped levels (H1→H3 without H2); no empty headings.
- Output `Issue[]`: missing-h1, multiple-h1, skipped-heading-level, empty-heading.

### 1.4 detect-broken-links

- From crawl data: internal and external link lists.
- Concurrent HEAD requests; cache per domain. Flag 4xx/5xx and redirect chains.
- Output `Issue[]`: broken-internal-link (critical), broken-external-link (medium).

### 1.5 validate-schema-markup

- Parse JSON-LD from each page. Validate against Google required fields per type (Product, Article, FAQ, Organization, BreadcrumbList).
- Output `Issue[]`: missing-schema, invalid-schema, incomplete-schema.

### 1.6 measure-core-web-vitals

- Playwright: load page, inject Performance Observer; measure LCP, CLS, INP, TTFB. Option: PageSpeed Insights API or CrUX.
- Store in pages table: lcp, cls, inp, ttfb, pageWeight, domSize.

### 1.7 check-security-signals

- Check protocol (HTTPS). Scan for http:// resources on https pages (mixed content).
- Check response headers: HSTS, CSP. Output `Issue[]`: mixed-content, missing-hsts, missing-csp.

### Merge and score

- Merge all issues; deduplicate (same page + same ruleId). Sort by severity.
- Compute `seoScore` with weighted deductions (see `apps/api/src/workers/analyze.ts` pattern). Compute `scoreBreakdown` by category.
- Insert issues into `issues` table; insert score into `seo_score_history`.

## Reference

- Full skill list: [../agents.md](../agents.md) — Subagent 1: SEO Auditor
- Crawler spec: `.cursor/skills/build-seopilot/subagents/seopilot-crawler-engine.md`
- Pipeline: `apps/api/src/workers/scan-pipeline.ts`
