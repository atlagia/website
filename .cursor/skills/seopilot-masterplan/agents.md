# SEOPilot — AI Agent System Design

## Overview

Multi-agent system built on **LangGraph** with **Claude 4** (primary) and **GPT-4o** (fallback). The **master coordinator** is the main LangGraph; it invokes **subagents** — each subagent is a LangGraph subgraph with defined state, tools, and memory. The coordinator routes tasks to subagents based on scan phase.

```
┌──────────────────────────────────────────────┐
│         MASTER COORDINATOR (LangGraph)        │
│  Routes tasks → subagents based on scan phase │
│  Maintains global state + checkpoints         │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬─┘
   │      │      │      │      │      │      │
 ┌─┴─┐  ┌─┴─┐ ┌─┴──┐ ┌─┴─┐ ┌─┴─┐ ┌─┴─┐ ┌─┴──┐
 │AUD│  │FIX│ │CONT│ │KEY│ │LNK│ │CMP│ │BKLN│  ← Subagents
 │IT │  │ER │ │ENT │ │WRD│ │ER │ │TR │ │K   │
 └───┘  └───┘ └────┘ └───┘ └───┘ └───┘ └────┘
```

**Terminology:** The **master coordinator** is the single entry point (e.g. `scan.trigger`). Each of the seven boxes above is a **subagent** — a dedicated LangGraph subgraph with its own state, tools, and skills. The coordinator delegates work to subagents and aggregates their outputs.

---

## Subagent 1: SEO Auditor

**Role:** Crawl a website and produce a comprehensive technical + content + performance audit.

| Field | Detail |
|-------|--------|
| **Trigger** | `scan.trigger` mutation, scheduled cron, or site.create (initial scan) |
| **Input** | `{ siteUrl, siteId, scanId, crawlOptions }` |
| **Output** | `{ pages[], issues[], seoScore, scoreBreakdown, siteMetrics }` |
| **Memory** | Previous scan results (for trend comparison). No RAG needed. |
| **LLM Usage** | Minimal — rule-based analysis with LLM for nuanced edge cases only |

### Skills

#### 1.1 crawl-website
- **Description:** Discover and fetch all pages via sitemap + internal link following
- **Input:** `{ url, maxPages, respectRobots, followSitemap }`
- **Output:** `{ pages: CrawledPage[], sitemap: string[], robotsRules: Rule[] }`
- **Logic:** Crawlee adaptive (Cheerio for static, Playwright for JS). Parse sitemap.xml (including index). Follow internal links up to `maxCrawlDepth`. HEAD-check external links.

#### 1.2 analyze-meta-tags
- **Description:** Check title, description, OG, Twitter cards for every page
- **Input:** `CrawledPage[]`
- **Output:** `Issue[]` — missing-title, title-too-long, missing-meta-desc, missing-og-image, etc.
- **Logic:** Rule-based with thresholds (title: 30-60 chars, desc: 70-160 chars). Check for duplicates across pages.

#### 1.3 analyze-headings
- **Description:** Validate H1-H6 structure per page
- **Input:** `CrawledPage[]`
- **Output:** `Issue[]` — missing-h1, multiple-h1, skipped-heading-level, empty-heading
- **Logic:** Exactly 1 H1 per page, no level skipping (H1→H3 without H2).

#### 1.4 detect-broken-links
- **Description:** Verify all internal and external links return 200
- **Input:** `{ internalLinks[], externalLinks[] }`
- **Output:** `Issue[]` — broken-internal-link (critical), broken-external-link (medium)
- **Logic:** Concurrent HEAD requests with timeout. Cache results per domain. Detect redirect chains (>2 hops).

#### 1.5 validate-schema-markup
- **Description:** Extract and validate JSON-LD structured data
- **Input:** `CrawledPage[]`
- **Output:** `Issue[]` — missing-schema, invalid-schema, incomplete-schema
- **Logic:** Parse JSON-LD blocks. Validate against Google's required fields per type (Product, Article, FAQ, Organization, BreadcrumbList). Flag missing required properties.

#### 1.6 measure-core-web-vitals
- **Description:** Measure LCP, CLS, INP, TTFB using Playwright
- **Input:** `{ url, viewport }`
- **Output:** `{ lcp, cls, inp, ttfb, pageWeight, domSize }`
- **Logic:** Playwright loads page, injects Performance Observer, measures metrics. Alternatively use PageSpeed Insights API or CrUX API for field data.

#### 1.7 check-security-signals
- **Description:** Detect HTTPS issues, mixed content, missing security headers
- **Input:** `CrawledPage[]`
- **Output:** `Issue[]` — mixed-content, missing-hsts, missing-csp
- **Logic:** Check protocol, scan for http:// resources on https pages, check response headers.

---

## Subagent 2: Technical Fixer

**Role:** Generate and apply SEO fixes to the live site via platform APIs.

| Field | Detail |
|-------|--------|
| **Trigger** | After audit completes (auto-fix) or user clicks "Apply" |
| **Input** | `{ issues[], siteId, platform, credentials }` |
| **Output** | `{ appliedFixes[], failedFixes[], newScore }` |
| **Memory** | Previous fixes for this site (avoid re-applying reverted fixes) |
| **LLM Usage** | Heavy — generates optimized meta tags, schema, content |

### Skills

#### 2.1 generate-meta-tags
- **Description:** Write SEO-optimized title and meta description using LLM
- **Input:** `{ pageUrl, currentTitle, currentDescription, pageContent, targetKeywords }`
- **Output:** `{ title: string (≤60 chars), description: string (≤160 chars), confidence: number }`
- **Logic:** Claude prompt with constraints: include primary keyword, compelling CTA, accurate to content. Structured output via Zod.

#### 2.2 generate-schema-markup
- **Description:** Create valid JSON-LD for a page based on its type and content
- **Input:** `{ pageUrl, pageType, pageContent, existingSchema }`
- **Output:** `{ jsonLd: object, schemaType: string, confidence: number }`
- **Logic:** Detect page type (product, article, FAQ, etc.). Generate appropriate schema with all required + recommended fields.

#### 2.3 fix-canonical-issues
- **Description:** Determine and set correct canonical URL
- **Input:** `{ pageUrl, currentCanonical, duplicateUrls[] }`
- **Output:** `{ canonical: string, reason: string }`
- **Logic:** Choose the most authoritative version (HTTPS, non-www, no trailing slash, no query params).

#### 2.4 apply-fix-shopify
- **Description:** Push meta/schema changes to Shopify via GraphQL Admin API
- **Input:** `{ fix, shopifyCredentials }`
- **Output:** `{ success: boolean, error?: string }`
- **Logic:** Map fix type to Shopify mutation (productUpdate, pageUpdate, metafieldSet). Handle rate limits.

#### 2.5 apply-fix-wordpress
- **Description:** Push meta/schema changes to WordPress via REST API
- **Input:** `{ fix, wpCredentials }`
- **Output:** `{ success: boolean, error?: string }`
- **Logic:** Update post/page meta via Yoast SEO REST fields, or wp_postmeta directly.

#### 2.6 apply-fix-webflow
- **Description:** Push SEO changes to Webflow via Data API
- **Input:** `{ fix, webflowCredentials }`
- **Output:** `{ success: boolean, error?: string }`
- **Logic:** Update CMS item SEO fields via Webflow Data API v2.

#### 2.7 verify-fix-applied
- **Description:** Re-crawl page and confirm the fix is live
- **Input:** `{ pageUrl, expectedValue, fixType }`
- **Output:** `{ verified: boolean, actualValue: string }`
- **Logic:** Fetch page, extract the relevant field, compare to expected.

---

## Subagent 3: Content Generator

**Role:** Create and optimize content for SEO using AI.

| Field | Detail |
|-------|--------|
| **Trigger** | On demand (user request), after audit (thin content detected), or scheduled |
| **Input** | `{ siteId, pageUrl?, contentType, targetKeywords }` |
| **Output** | `{ content, metadata, wordCount, readabilityScore }` |
| **Memory** | RAG — site's existing content (pgvector) for consistency and internal linking |
| **LLM Usage** | Heavy — all content generated by LLM |

### Skills

#### 3.1 expand-thin-content
- **Description:** Rewrite pages with <300 words to be comprehensive
- **Input:** `{ pageUrl, currentContent, targetKeywords, competitorContent }`
- **Output:** `{ expandedContent, wordCount, keywordsUsed[] }`

#### 3.2 generate-alt-text
- **Description:** Write descriptive alt text for images
- **Input:** `{ imageUrl, surroundingContext, pageTitle }`
- **Output:** `{ altText: string (≤125 chars) }`

#### 3.3 generate-blog-post
- **Description:** Write a full SEO-optimized blog post
- **Input:** `{ title, targetKeywords[], outline?, tone, wordCountTarget }`
- **Output:** `{ html, meta: { title, description }, wordCount, internalLinks[] }`

#### 3.4 optimize-existing-content
- **Description:** Improve keyword usage, readability, and structure of existing content
- **Input:** `{ currentContent, targetKeywords, competitorTopContent }`
- **Output:** `{ optimizedContent, changes[], improvementScore }`

#### 3.5 generate-faq-section
- **Description:** Create FAQ based on "People Also Ask" and keyword intent
- **Input:** `{ topic, targetKeywords, existingFaqs? }`
- **Output:** `{ faqs: { question, answer }[], faqSchema: object }`

---

## Subagent 4: Keyword Researcher

**Role:** Discover, analyze, and track keywords relevant to the site.

| Field | Detail |
|-------|--------|
| **Trigger** | On demand, after site creation, or scheduled monthly |
| **Input** | `{ siteUrl, seedKeywords?, industry?, competitors[] }` |
| **Output** | `{ keywords[], clusters[], gaps[], opportunities[] }` |
| **Memory** | Historical keyword data for this site |
| **LLM Usage** | Medium — clustering and intent classification |
| **External APIs** | Google Search Console, DataForSEO (or SEMrush API), Google Suggest |

### Skills

#### 4.1 discover-keywords
- **Description:** Find relevant keywords from seed terms, GSC data, and competitor analysis
- **Input:** `{ seedKeywords[], siteUrl, gscData? }`
- **Output:** `{ keywords: { term, volume, difficulty, cpc, intent }[] }`

#### 4.2 cluster-keywords
- **Description:** Group keywords by topic and intent using embeddings
- **Input:** `{ keywords[] }`
- **Output:** `{ clusters: { name, keywords[], primaryKeyword, intent }[] }`
- **Logic:** Embed keywords with text-embedding-3-small, HDBSCAN clustering, LLM names clusters.

#### 4.3 analyze-serp
- **Description:** Scrape and analyze SERP for a keyword
- **Input:** `{ keyword, location?, device? }`
- **Output:** `{ results[], featuredSnippet?, paa[], relatedSearches[] }`

#### 4.4 find-content-gaps
- **Description:** Compare site's keyword coverage vs competitors
- **Input:** `{ siteKeywords[], competitorKeywords[] }`
- **Output:** `{ gaps: { keyword, competitorRank, ourRank }[], opportunities[] }`

#### 4.5 track-rankings
- **Description:** Monitor keyword positions over time
- **Input:** `{ siteId, keywords[], frequency }`
- **Output:** `{ rankings: { keyword, position, change, url }[] }`
- **Logic:** Use GSC API for position data, or DataForSEO SERP API.

---

## Subagent 5: Internal Linker

**Role:** Optimize internal link structure for SEO authority flow.

| Field | Detail |
|-------|--------|
| **Trigger** | After crawl completes, on demand |
| **Input** | `{ pages[], linkGraph }` |
| **Output** | `{ suggestions: InternalLinkSuggestion[], orphanPages[], hubPages[] }` |
| **Memory** | RAG — page content embeddings for relevance matching |
| **LLM Usage** | Medium — anchor text generation, relevance scoring |

### Skills

#### 5.1 build-link-graph
- **Description:** Map the full internal link structure as a directed graph
- **Input:** `{ pages[] }`
- **Output:** `{ nodes: Page[], edges: Link[], orphans: Page[], hubs: Page[] }`

#### 5.2 find-orphan-pages
- **Description:** Detect pages with zero or very few inbound internal links
- **Input:** `{ linkGraph }`
- **Output:** `{ orphanPages[], suggestedParents[] }`

#### 5.3 suggest-internal-links
- **Description:** Use content similarity to recommend where to add links
- **Input:** `{ sourcePage, allPages[], topN }`
- **Output:** `{ suggestions: { targetUrl, anchorText, relevanceScore, insertionPoint }[] }`
- **Logic:** Embed page content, cosine similarity, LLM generates natural anchor text.

#### 5.4 inject-internal-links
- **Description:** Apply suggested links to the site via platform API
- **Input:** `{ suggestions[], platform, credentials }`
- **Output:** `{ applied[], failed[] }`

---

## Subagent 6: Competitor Analyst

**Role:** Analyze competitor sites and identify strategic advantages.

| Field | Detail |
|-------|--------|
| **Trigger** | On demand, or monthly scheduled |
| **Input** | `{ siteId, competitorUrls[] }` |
| **Output** | `{ comparison, gaps, recommendations }` |
| **Memory** | Historical competitor data |
| **LLM Usage** | Medium — strategic recommendations |

### Skills

#### 6.1 crawl-competitor
- **Description:** Run SEO Auditor crawl on competitor site
- **Input:** `{ competitorUrl, maxPages }`
- **Output:** `{ pages[], issues[], score, metrics }`

#### 6.2 compare-seo-scores
- **Description:** Side-by-side comparison of your site vs competitors
- **Input:** `{ yourSite, competitors[] }`
- **Output:** `{ comparison: { metric, you, competitor, delta }[] }`

#### 6.3 analyze-content-strategy
- **Description:** Compare content depth, topics, and keyword coverage
- **Input:** `{ yourPages[], competitorPages[] }`
- **Output:** `{ theirTopics[], missingTopics[], contentGaps[] }`

#### 6.4 compare-backlinks
- **Description:** Compare backlink profiles (requires external API)
- **Input:** `{ yourDomain, competitorDomain }`
- **Output:** `{ yourBacklinks, theirBacklinks, exclusiveLinks[], opportunities[] }`

---

## Subagent 7: Backlink Strategist

**Role:** Audit backlinks, detect toxic links, and generate outreach strategies.

| Field | Detail |
|-------|--------|
| **Trigger** | On demand, monthly scheduled |
| **Input** | `{ siteId, domain }` |
| **Output** | `{ profile, toxicLinks[], opportunities[], outreachTemplates[] }` |
| **Memory** | Historical backlink data, outreach history |
| **LLM Usage** | Medium — outreach email generation |
| **External APIs** | Ahrefs/Moz/SEMrush API, or Majestic |

### Skills

#### 7.1 audit-backlinks
- **Description:** Analyze current backlink profile
- **Input:** `{ domain }`
- **Output:** `{ totalBacklinks, referringDomains, domainRating, topLinks[] }`

#### 7.2 detect-toxic-links
- **Description:** Identify spammy/harmful backlinks
- **Input:** `{ backlinks[] }`
- **Output:** `{ toxicLinks[], disavowFile: string }`

#### 7.3 find-link-opportunities
- **Description:** Discover sites to target for link building
- **Input:** `{ domain, competitorBacklinks[], industry }`
- **Output:** `{ opportunities: { site, contactEmail?, relevance, dr }[] }`

#### 7.4 generate-outreach-email
- **Description:** AI-write personalized outreach emails for link requests
- **Input:** `{ targetSite, yourSite, linkContext }`
- **Output:** `{ subject, body, followUpBody }`

---

## Orchestration: Master Graph

The master coordinator invokes subagents in sequence or parallel:

```
START
  │
  ├─→ Subagent: SEO Auditor ──→ Subagent: Technical Fixer ──→ Verify
  │   (crawl + audit)            (generate + apply)
  │
  ├─→ Subagent: Content Generator ─→ Apply Content
  │   (if thin content)
  │
  ├─→ Subagent: Internal Linker ──→ Apply Links
  │   (after crawl data)
  │
  ├─→ Report Builder ────→ END
  │
  └─→ (Optional parallel)
      ├─→ Subagent: Keyword Researcher
      ├─→ Subagent: Competitor Analyst
      └─→ Subagent: Backlink Strategist
```

State is checkpointed to PostgreSQL after every node. On failure, the graph resumes from the last successful checkpoint. Each subagent emits SSE events for real-time dashboard updates.

---

## LLM Cost Optimization

| Strategy | Implementation |
|----------|---------------|
| Rule-first, LLM-second | SEO Auditor subagent uses rule-based checks; LLM only for nuanced analysis |
| Structured output | Zod schemas for all LLM responses, reducing retries |
| Caching | Cache LLM responses for identical inputs (Redis, 24h TTL) |
| Model tiering | Claude for complex (fix generation, content), GPT-4o-mini for simple (alt text, classification) |
| Token budgets | Set max_tokens per subagent per scan; alert if approaching limit |
| Batch processing | Batch similar issues for single LLM call (e.g., all missing meta descriptions) |
