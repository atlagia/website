# Subagent: Keyword Researcher

**Invoked by:** Master coordinator on demand, after site creation, or scheduled monthly
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Discover, analyze, and track keywords relevant to the site. Output: keywords, clusters, content gaps, ranking opportunities. Uses GSC, DataForSEO or SEMrush, Google Suggest. Medium LLM (clustering, intent).

## Inputs

- `siteUrl`: string
- `siteId`: uuid
- `seedKeywords?`: string[]
- `industry?`: string
- `competitors?`: string[] (URLs)

## Outputs

- `keywords`: { term, volume?, difficulty?, cpc?, intent }[]
- `clusters`: { name, keywords[], primaryKeyword, intent }[]
- `gaps`: { keyword, competitorRank?, ourRank? }[]
- `opportunities`: { keyword, reason, priority }[]

## Skills (Implementation Steps)

### 4.1 discover-keywords

- Fetch GSC data (queries with impressions/clicks/position) for siteUrl.
- If seedKeywords: call Google Suggest (or DataForSEO) for variations and related.
- Optional: pull competitor keywords via DataForSEO/SEMrush API.
- Deduplicate and merge. Return `{ keywords: { term, volume, difficulty, cpc, intent }[] }`. Intent can be from LLM or heuristic.

### 4.2 cluster-keywords

- Embed all keyword strings (e.g. text-embedding-3-small). Run HDBSCAN (or k-means) for clustering.
- For each cluster: LLM names the cluster and assigns intent (informational, transactional, etc.). Pick primaryKeyword (highest volume or most representative).
- Return `{ clusters: { name, keywords[], primaryKeyword, intent }[] }`.

### 4.3 analyze-serp

- For a given keyword: call DataForSEO SERP API or scrape (respect ToS). Extract: organic results, featured snippet, PAA, related searches.
- Return `{ results[], featuredSnippet?, paa[], relatedSearches[] }`. Used for content gap and on-demand SERP view.

### 4.4 find-content-gaps

- Compare site’s ranking keywords (GSC) vs competitor keywords. Find keywords where competitor ranks and we don’t (or rank lower).
- Return `{ gaps: { keyword, competitorRank, ourRank }[], opportunities[] }` with priority.

### 4.5 track-rankings

- Store keyword list per siteId. On schedule (daily/weekly): fetch positions via GSC API or DataForSEO.
- Persist to `keyword_rankings` table (siteId, keyword, position, url, date).
- Return `{ rankings: { keyword, position, change, url }[] }` for dashboard.

## DB / API

- Tables: `keywords` (siteId, term, volume, difficulty, intent, clusterId), `keyword_rankings` (siteId, keyword, position, url, recordedAt).
- External: Google Search Console API, DataForSEO or SEMrush API (for volume/difficulty/SERP).

## Reference

- Full skill list: [../agents.md](../agents.md) — Subagent 4: Keyword Researcher
