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

## 2026 updates (SEO & CWV)

- **CWV evaluation:** Google uses the **75th percentile** of real-user (CrUX) data; 75% of page loads must be "Good" for the page to pass. Lab data (Lighthouse/PageSpeed) is indicative; ~68% of sites that pass lab fail in the field — prioritize field data when available.
- **Ranking weight:** Page experience signals (including CWV) carry substantial ranking weight; "Good" CWV is associated with higher CTR. Only ~42–52% of sites pass all three CWV.
- **INP** is the official metric replacing FID (March 2024); target ≤200 ms.
- **Technical benchmarks (2026):** TTFB ≤800 ms; total page weight under ~2 MB where possible; 100% HTTPS sitewide.
- **People-first & E-E-A-T:** Remain the foundation; avoid thin or purely search-engine content; strengthen Experience/Expertise/Authoritativeness/Trust where relevant (especially YMYL).

---

## Speed & Performance (SEO Site Checkup–style)

Issues that commonly fail audits (e.g. SEO Site Checkup, Lighthouse) and hurt rankings:

| Issue | Target | Audit / Fix |
|-------|--------|-------------|
| **URL canonicalization** | One primary URL per page; no duplicate content from variants | Audit: Check canonical tag matches actual page URL; no conflicting www/non-www or trailing-slash duplicates. Fix: Choose primary URL; set canonical to it; add redirects from other variants (server or meta). |
| **Canonical tag correctness** | Canonical must be correct and **dynamic** (not hard-coded wrong) | Audit: Ensure `<link rel="canonical" href="...">` reflects current URL (e.g. /en vs /, lang, query). Fix: Generate canonical from current request (e.g. `canonicalURL` / `Astro.url`); never hard-code a single URL for all pages. |
| **LCP** | ≤ 2.5s | Audit: Measure (Lighthouse/PageSpeed). Fix: Optimize LCP element (hero image: size, format, priority); reduce render-blocking; CDN. |
| **Render-blocking resources** | Eliminate or defer | Audit: Identify CSS/JS that block first paint. Fix: Inline critical CSS; defer non-critical JS (defer/async); load below-fold CSS/JS lazily. |
| **Page load time** | &lt; 5s | Pages &gt;5s can lose ~50% of visitors. Audit: Measure load time. Fix: Images (next-gen, compress), JS (reduce, defer), requests (fewer, combined). |
| **Modern image formats** | WebP / AVIF | Audit: Check if key images use JPEG/PNG only. Fix: Serve WebP or AVIF with fallback (`<picture>` or build step); significantly reduces file size and improves LCP. |
| **JS execution time** | &lt; 3.5s | Long JS execution slows TTI and main thread. Audit: Note if tools report &gt;3.5s. Fix: Code-split; defer non-critical scripts; remove unused JS; optimize bundles. |
| **HTTP request count** | Minimize (e.g. &lt;20 for above-fold) | Many requests slow loading. Audit: Count requests (DevTools). Fix: Bundle JS/CSS; combine small assets; lazy-load below-fold; reduce third-party scripts. |
| **Content size (images)** | Images often 70%+ of page weight | Audit: Report content size by type (image, js, css, html). Fix: Compress images; use WebP/AVIF; responsive `srcset`; lazy-load non-LCP images. |
| **Custom 404 page** | Helpful links and info so users stay on site | Audit: 404 page exists and has links to homepage, key sections, search. Fix: Custom 404 with nav and suggested links (not bare "Not found"). |

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
| 10 | URL canonicalization | One primary URL per page; canonical tag correct; redirects from variants |
| 11 | Canonical tag | Dynamic (not hard-coded); href matches actual page URL |
| 12 | Render-blocking | No or minimal render-blocking CSS/JS (defer/inline critical) |
| 13 | Page load time | &lt; 5s (measure; optimize images, JS, requests) |
| 14 | Custom 404 | Custom 404 page with helpful links to key pages |
| 15 | **&lt;html lang&gt;** | **Root `<html>` has valid `lang` attribute (never empty); fallback e.g. `lang="en"`** |
| 16 | **Heading order** | **Headings sequential (no skip); no heading for non-heading content (e.g. author names → `<p>`)** |

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
- **Format/size:** Prefer **modern formats (WebP, AVIF)** to reduce file size and improve LCP; compress images; if images dominate page weight (e.g. 70%+), prioritize next-gen formats and compression.

**SEO image optimization (seo-image-optimizer step):** Use `scripts/optimize-and-upload-image-seo.mjs` to convert a local image to WebP, inject title and tags into R2 object metadata, and upload to CDN. Object key = prefix + slug(seoTitle) + ".webp". Ensures every image in theme data has alt text; for local sources, re-upload as WebP and update data with new CDN URL.

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

**Technical (site-level):** Crawlability ✅/❌ | Indexing ✅/❌ | Canonical ✅/❌ | Core Web Vitals ✅/❌ | Speed (LCP, render-blocking, page load, JS, requests, images) ✅/❌ | Mobile ✅/❌ | HTTPS ✅/❌ | Structured data ✅/❌ | Custom 404 ✅/❌

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
- [ ] Core Web Vitals in range (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)
- [ ] Speed: no critical render-blocking; page load &lt;5s; canonical correct and dynamic; custom 404 with links; images modern format where possible
- [ ] **Root `<html lang>` present and valid on all pages (never empty; fallback e.g. en)**
- [ ] **Heading order sequential (h1→h2→h3→h4); no heading for author names/bylines**
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
| **Accessibility / i18n** | **Missing `<html lang>`** | **Add `lang` to root `<html>` (e.g. `lang={lang ?? 'en'}`); ensure BaseHead/layout never output empty lang** |
| **Navigation** | **Heading order broken / heading for non-heading** | **Keep headings sequential (h1→h2→h3→h4); use `<p>` or `<span>` for author names, bylines** |
| CWV | High LCP | Optimize main image (size, format, priority); reduce render-blocking |
| CWV | High INP | Reduce long tasks; defer non-critical JS |
| CWV | High CLS | Set dimensions; preload fonts; avoid layout shifts |
| Speed | URL canonicalization | Choose primary URL; set canonical; redirect variants |
| Speed | Canonical hard-coded wrong | Generate canonical from current URL (dynamic); fix BaseHead/layout |
| Speed | Render-blocking resources | Inline critical CSS; defer non-critical JS (async/defer) |
| Speed | Page load &gt;5s | Optimize images (WebP/AVIF, compress), reduce JS, minimize requests |
| Speed | Images not modern format | Serve WebP/AVIF with fallback; compress; responsive srcset |
| Speed | JS execution &gt;3.5s | Code-split; defer scripts; remove unused JS; optimize bundles |
| Speed | Too many HTTP requests | Bundle JS/CSS; lazy-load; reduce third-party scripts |
| Speed | No custom 404 | Add 404 page with helpful links (home, key sections, search) |
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

## PageSpeed / Best Practices overlap and cases solved

SEO audits should align with PageSpeed "Best Practices" (Bonnes pratiques) where they affect crawlability, indexing, accessibility, or UX signals:

- **Internationalization — `<html lang>`:** The root `<html>` element **must have a valid `lang` attribute** (e.g. `lang="en"`). PageSpeed and screen readers rely on it; missing or empty `lang` fails accessibility/internationalization. **Audit:** Check every page/layout that outputs the document root (e.g. `index.astro`, `BaseHead.astro`). **Fix:** Use `lang={lang ?? 'en'}` or `lang={currentLang || 'en'}` so the attribute is never empty or undefined; ensure BaseHead/layout derive lang from URL or params and fallback to `'en'`.
- **Navigation — Heading order:** Headings must be **in sequential descending order** (h1 → h2 → h3 → h4); do not skip levels (e.g. h2 then h4). Do **not** use heading tags for non-heading content (e.g. testimonial author names, bylines, card labels). **Audit:** Flag any `<h4>` without a preceding `<h3>` in the section; flag headings used for names/labels that are not section titles. **Fix:** Use `<p>` or `<span>` with appropriate classes for author names and bylines; reserve headings for section/subsection titles only.
- **HTTPS:** Required for trust and indexing; host must enforce. See theme `PAGESPEED-DEPLOYMENT.md` or pagespeed-enhance reference.
- **Third-party cookies (e.g. YouTube):** Use `https://www.youtube-nocookie.com/embed/{videoId}` for embed URLs. **Facaded embed:** Prefer showing a thumbnail + play button and loading the iframe only on user click; this avoids cookie/Chrome DevTools Issues on initial load and improves Best Practices score.
- **Deprecated APIs (SharedStorage, AttributionReporting):** Often triggered by Partytown running gtag/Hotjar. Optional GA/Hotjar via `PUBLIC_ALLOW_GA`, `PUBLIC_ALLOW_HOTJAR` avoids Partytown when disabled and removes these warnings.
- **Image width/height and aspect ratio:** Explicit dimensions on every `<img>` support CLS and satisfy "appropriate aspect ratios" in PageSpeed; include in image and data/code audit.
- **document.write():** Avoid; use async/defer or Partytown for third-party scripts so Best Practices audit passes.

For full Best Practices checklist and 2026 PageSpeed/CWV context, see `.cursor/skills/pagespeed-enhance/reference.md`.

---

## Summary

1. **Audit** in order: technical (crawl, index, **canonical/canonicalization**, CWV, **speed: LCP, render-blocking, page load, JS execution, HTTP requests, image format/size**, custom 404, mobile, HTTPS) → on-page (title, meta, H1, keyword, content, snippets, links) → images → structured data → data/code that drives meta and headings.
2. **Score** key pages (e.g. 30-point scale); note site-level technical and speed pass/fail.
3. **List issues** with file/URL and severity (high/medium/low).
4. **Fix** high first (canonicalization/canonical correctness, crawlability, indexing, CWV + speed optimizations, critical on-page), then medium/low (content, links, images, schema, custom 404).
5. **Verify** with re-audit and MCP browser if UI changed; confirm "perfect website SEO" outcome.
