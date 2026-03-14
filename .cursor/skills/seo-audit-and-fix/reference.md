# SEO Audit Reference — Google & Best Practices

This document supports the [seo-audit-and-fix](SKILL.md) skill with detailed checklists, scoring, and the latest Google/industry guidelines.

---

## Google Search Essentials (Current)

Google’s official guidance is organized as **Google Search Essentials** (formerly Webmaster Guidelines):

1. **Technical requirements** — Minimum technical bar for pages to appear in search (crawlable, indexable, usable).
2. **Spam policies** — Behaviors that can lower rankings or remove pages (e.g. cloaking, thin content, link spam).
3. **Key best practices** — Actions that improve visibility:
   - **People-first content:** Helpful, reliable content; avoid search-engine-only tricks.
   - **Keywords:** Use terms people search for in important places (titles, headings, alt text, link text).
   - **Crawlability:** Links crawlable so Google can discover other pages.
   - **Search features:** Enable appropriate features (images, video, structured data, JS rendering).
   - **Control:** Use robots/sitemaps to control what is indexed when needed.

**Source:** Google Search Central — Search Essentials (formerly Webmaster Guidelines).

---

## E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

- **Experience:** First-hand use, testing, or real-world proof (e.g. reviews, case studies).
- **Expertise:** Demonstrated knowledge (credentials for YMYL; depth and accuracy for other topics).
- **Authoritativeness:** Recognition as a trusted source (citations, reputation, industry recognition).
- **Trustworthiness:** HTTPS, clear contact, transparent About/editorial, no deceptive practices.

**YMYL (Your Money or Your Life):** Health, finance, legal, safety — require stronger E-E-A-T and accuracy.

---

## Core Web Vitals (Ranking and UX)

| Metric | Target | Focus |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | &lt; 2.5s | Server response, image optimization (e.g. WebP), CDN, reduce render-blocking |
| **INP** (Interaction to Next Paint) | &lt; 200ms | Replace FID (2024). Minimize long tasks, defer non-critical JS, Web Workers |
| **CLS** (Cumulative Layout Shift) | &lt; 0.1 | Reserve space (width/height), preload fonts, avoid injecting content above the fold |

---

## Technical SEO Checklist (Crawlability, Indexing, Performance)

| # | Check | How to verify |
|---|-------|----------------|
| 1 | robots.txt | Does not block important paths; allows crawlers where needed |
| 2 | Sitemap | XML sitemap present; submitted in GSC if applicable |
| 3 | Canonical | Canonical URL on every page; points to preferred version |
| 4 | noindex | No accidental noindex on key pages |
| 5 | Orphan pages | Key pages linked from at least one other page |
| 6 | Internal links | Key content reachable within a few clicks from homepage |
| 7 | HTTPS | Valid certificate; no mixed content |
| 8 | Mobile | Mobile-friendly; primary content not JS-only lazy-load (Google doesn’t scroll) |
| 9 | Core Web Vitals | LCP, INP, CLS within targets (Lighthouse / PageSpeed) |

---

## On-Page Checklist (Per Key Page)

### Title tag (4 points)

| # | Check | Points |
|---|-------|--------|
| 1 | Length 50–60 characters | 1 |
| 2 | Primary keyword in first half | 1 |
| 3 | Ends with brand or "in [context]" | 1 |
| 4 | Compelling hook (value/benefit) | 1 |

**Formula:** `[Topic/Offer]: [What You Get] | [Brand]` or `[Topic] in [Context]`

### Meta description (4 points)

| # | Check | Points |
|---|-------|--------|
| 1 | Length 150–160 characters | 1 |
| 2 | Starts with action word (Learn, Discover, Get — avoid "Master") | 1 |
| 3 | Contains primary keyword | 1 |
| 4 | Promises specific value | 1 |

### Keyword placement (5 points)

| # | Check | Points |
|---|-------|--------|
| 1 | Primary keyword in title | 1 |
| 2 | Primary keyword in meta description | 1 |
| 3 | Primary keyword in first ~100 words | 1 |
| 4 | Keyword in at least one H2 | 1 |
| 5 | Natural reading (no stuffing) | 1 |

### Content structure (6 points)

| # | Check | Points |
|---|-------|--------|
| 1 | Engaging opening (e.g. question or clear value) | 1 |
| 2 | Early example or concrete content in first 200 words | 1 |
| 3 | "What you’ll learn" or clear scope where applicable | 1 |
| 4 | Short paragraphs (2–4 sentences) | 1 |
| 5 | Substantial length for pillar/key pages (e.g. 1,500+ words where relevant) | 1 |
| 6 | Key terms bolded on first mention | 1 |

### Featured snippets (4 points)

| # | Check | Points |
|---|-------|--------|
| 1 | "What is X" has 40–60 word definition after H2 | 1 |
| 2 | At least one H2 phrased as question | 1 |
| 3 | Numbered steps for "How to" content | 1 |
| 4 | Comparison table for "X vs Y" where applicable | 1 |

### Internal linking (4 points)

| # | Check | Points |
|---|-------|--------|
| 1 | 3–5+ internal links in body or related block | 1 |
| 2 | Descriptive anchor text (no "click here") | 1 |
| 3 | Prerequisites/related linked at top where applicable | 1 |
| 4 | Related section with multiple links (e.g. 4 cards) where applicable | 1 |

### Technical on-page (3 points)

| # | Check | Points |
|---|-------|--------|
| 1 | Single H1 per page | 1 |
| 2 | URL slug contains keyword or is readable | 1 |
| 3 | Page is not orphan | 1 |

**Total: 30 points per key page.** Use same interpretation: 27–30 excellent, 23–26 good, 17–22 fair, &lt;17 poor.

---

## Structured Data (JSON-LD)

- **Format:** JSON-LD in `<script type="application/ld+json">`.
- **Context:** `@context`: `https://schema.org`.
- **Foundation:** Organization + WebSite (with `url`, `name`, optional `potentialAction` SearchAction).
- **Navigation:** BreadcrumbList on inner pages.
- **By type:** Product (+ AggregateRating) for e‑commerce; Article/BlogPosting for articles; FAQPage where appropriate; LocalBusiness for local.
- **Rules:** Validate (e.g. Rich Results Test); match visible content; no irrelevant or misleading types.
- **Avoid:** FAQPage for content that isn’t real Q&A; schema for content not visible to users.

---

## Images

- Use standard `<img>` (or framework equivalent) for important images.
- **Alt:** Descriptive, concise; include keyword only when natural.
- **Responsive:** `srcset` / `picture` where it helps (e.g. different sizes/formats).
- **Lazy-load:** Do not lazy-load primary above-the-fold content only (Google may not trigger it).
- **Format/size:** Prefer modern formats (e.g. WebP); optimize for LCP.

---

## SEO Audit Report Template

Use this to document the full audit (Phase 1).

```markdown
# SEO Audit Report: [Site / Theme Name]

**Scope:** [e.g. Homepage, /en, product/collection pages]
**Date:** YYYY-MM-DD
**Overall Score:** XX/30 (XX%) — ✅ Excellent | ⚠️ Good/Fair | ❌ Poor

---

## Score Summary

| Category            | Score | Status |
|---------------------|-------|--------|
| Title Tag           | X/4   | ✅/⚠️/❌ |
| Meta Description    | X/4   | ✅/⚠️/❌ |
| Keyword Placement   | X/5   | ✅/⚠️/❌ |
| Content Structure   | X/6   | ✅/⚠️/❌ |
| Featured Snippets   | X/4   | ✅/⚠️/❌ |
| Internal Linking    | X/4   | ✅/⚠️/❌ |
| Technical On-Page   | X/3   | ✅/⚠️/❌ |
| **Total (on-page)** | **X/30** | **STATUS** |

**Technical (site-level):** Crawlability ✅/❌ | Indexing ✅/❌ | Core Web Vitals ✅/❌ | Mobile ✅/❌ | HTTPS ✅/❌ | Structured data ✅/❌

---

## Target Keywords / Intent

**Primary:** [keyword]
**Secondary:** [keyword 2], [keyword 3]
**Intent:** Informational / Transactional / Navigational

---

## Issues (with file/URL and severity)

### High
- [ ] [Issue]. Location: [file or URL]. Fix: [brief recommendation]
- …

### Medium
- [ ] …

### Low
- [ ] …

---

## Priority Fixes

### High (do first)
1. [Issue] — [Current] → [Recommended]. Impact: [why it matters]
2. …

### Medium
1. …

### Low
1. …

---

## Implementation Checklist (after fixes)

- [ ] Title 50–60 chars, keyword, hook
- [ ] Description 150–160 chars, action word, value
- [ ] Single H1, keyword in first 100 words and one H2
- [ ] 3–5+ internal links, descriptive anchors
- [ ] Canonical, no wrong noindex, key pages linked
- [ ] Core Web Vitals in range
- [ ] Structured data valid and matching content
- [ ] All fixes verified (re-audit or spot-check)
```

---

## Common Issues and Fixes

| Area | Issue | Fix |
|------|--------|-----|
| Title | Too short/long | Target 50–60 chars; add keyword and hook or trim |
| Title | No keyword / no hook | Put primary keyword in first half; add benefit phrase |
| Meta | Too short/long | Target 150–160 chars; expand with specifics or trim |
| Meta | "Master" / vague | Use "Learn"/"Discover"/"Get"; list specific topics |
| Content | No question hook | Open with "How…?" or "Why…?" or clear value |
| Content | Long paragraphs | Break into 2–4 sentences |
| Content | No bolded terms | Bold key concepts on first mention |
| Snippet | No 40–60 word definition | Add definition paragraph after "What is X" H2 |
| Snippet | No numbered steps | Use ordered list or Steps component for "How to" |
| Links | No internal links / bad anchors | Add 3–5 links; use descriptive anchor text |
| Technical | Multiple H1s | Keep one H1; use H2 for sections |
| Technical | Orphan page | Add links from related pages or nav |
| Technical | Slug missing keyword | Use readable, keyword-rich slug (hyphens, lowercase) |
| CWV | High LCP | Optimize main image (size, format, priority); reduce render-blocking |
| CWV | High INP | Reduce long tasks; defer non-critical JS |
| CWV | High CLS | Set dimensions; preload fonts; avoid layout shifts |
| Schema | Invalid / irrelevant | Validate; match visible content; use correct types |

---

## Quick Character/Word Counts

| Element | Ideal |
|--------|--------|
| Title | 50–60 characters |
| Meta description | 150–160 characters |
| Definition paragraph (snippet) | 40–60 words |
| Keyword density | Do not exceed ~3–4 exact phrase per 1,000 words; use variations naturally |

---

## Summary

1. **Audit** in order: technical (crawl, index, CWV, mobile, HTTPS) → on-page (title, meta, H1, keyword, content, snippets, links) → images → structured data → data/code that drives meta and headings.
2. **Score** key pages (e.g. 30-point scale); note site-level technical pass/fail.
3. **List issues** with file/URL and severity (high/medium/low).
4. **Fix** high first (crawlability, indexing, CWV, critical on-page), then medium/low (content, links, schema).
5. **Verify** with re-audit and MCP browser if UI changed; confirm "perfect website SEO" outcome.
