# Subagent: Competitor Analyst

**Invoked by:** Master coordinator on demand or monthly scheduled
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Analyze competitor sites and produce comparison, gaps, and recommendations. Reuses SEO Auditor crawl; adds comparison and optional backlink data.

## Inputs

- `siteId`: uuid
- `competitorUrls`: string[] (from site’s competitors table or user input)
- `yourSiteData?`: { pages, issues, score, metrics } (from latest scan)

## Outputs

- `comparison`: { metric, you, competitor, delta }[]
- `gaps`: content/keyword/technical gaps
- `recommendations`: string[] (LLM-generated strategic tips)

## Skills (Implementation Steps)

### 6.1 crawl-competitor

- For each competitorUrl: run same pipeline as SEO Auditor (crawl + analyze). Cap maxPages (e.g. 50).
- Store in `competitors` table or temp: pages[], issues[], score, metrics (avg load time, total pages, etc.).
- Return `{ pages[], issues[], score, metrics }` per competitor.

### 6.2 compare-seo-scores

- Your site: use latest scan (seoScore, scoreBreakdown). Competitors: from 6.1.
- Build comparison table: metric (Overall, Technical, Content, Performance, Links), your value, each competitor value, delta.
- Return `{ comparison: { metric, you, competitor, delta }[] }` (can be multiple rows per competitor).

### 6.3 analyze-content-strategy

- Your pages: titles, word counts, topics (from H1/H2 or keywords). Competitor pages: same.
- Topic extraction: simple (H1 + H2) or LLM. Find: theirTopics[], missingTopics[] (they have, we don’t), contentGaps[] (recommended content to add).
- Return `{ theirTopics[], missingTopics[], contentGaps[] }`.

### 6.4 compare-backlinks

- Requires external API (Ahrefs, Moz, SEMrush). Fetch backlink count, referring domains, domain rating for your domain and each competitor.
- Optional: list of top referring domains. Find exclusive links (they have, we don’t) as opportunities.
- Return `{ yourBacklinks, theirBacklinks, exclusiveLinks[], opportunities[] }`. If no API, return empty or placeholder.

## Persistence

- Save competitor crawl results to `competitors` table (siteId, url, lastAnalyzedAt, seoScore, data JSONB).
- Comparison and recommendations can be stored in a `competitor_reports` table or returned only.

## Reference

- Full skill list: [../agents.md](../agents.md) — Subagent 6: Competitor Analyst
- Reuses: SEO Auditor subagent for 6.1
