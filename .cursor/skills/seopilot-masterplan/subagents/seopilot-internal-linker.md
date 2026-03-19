# Subagent: Internal Linker

**Invoked by:** Master coordinator after crawl completes, or on demand
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Optimize internal link structure for SEO. Build link graph, find orphans, suggest internal links from content similarity, optionally inject via platform API. Uses RAG (page embeddings) and medium LLM (anchor text).

## Inputs

- `pages`: CrawledPage[] (from SEO Auditor crawl)
- `linkGraph?`: precomputed (optional)
- `siteId`: uuid
- `platform?`: for inject step

## Outputs

- `suggestions`: { sourceUrl, targetUrl, anchorText, relevanceScore, insertionPoint? }[]
- `orphanPages`: Page[]
- `hubPages`: Page[] (high in-degree)
- `applied?`: { url, success }[] (if inject run)

## Skills (Implementation Steps)

### 5.1 build-link-graph

- From pages: extract internal links (same origin). Build directed graph: nodes = pages (by URL), edges = link from A to B.
- Compute in-degree per node. Orphans = in-degree 0 (or below threshold). Hubs = in-degree above upper percentile.
- Return `{ nodes: Page[], edges: Link[], orphans, hubs }`.

### 5.2 find-orphan-pages

- Use link graph. Orphan = no inbound internal links. Suggest parents: pages that could link to them (same topic from content similarity).
- Return `{ orphanPages[], suggestedParents: { orphan, suggestedParentUrls }[] }`.

### 5.3 suggest-internal-links

- For each page (or a subset): embed page content (title + body snippet). Query pgvector for top N similar pages (exclude self and already linked).
- For each (source, target) pair: LLM generates natural anchor text (1–5 words). Score relevance (cosine similarity or LLM score).
- Return `{ suggestions: { sourceUrl, targetUrl, anchorText, relevanceScore, insertionPoint? }[] }`. insertionPoint can be “after H2: …” or paragraph index.

### 5.4 inject-internal-links

- For each suggestion: call platform API to add link (e.g. WordPress: edit post content; Shopify: metafield or theme; Webflow: CMS field). Depends on platform support for rich text.
- Return `{ applied[], failed[] }`. Emit events per link.

## RAG

- Store page embeddings (title + content) in pgvector. Use for 5.3 similarity search.

## Reference

- Full skill list: [../agents.md](../agents.md) — Subagent 5: Internal Linker
