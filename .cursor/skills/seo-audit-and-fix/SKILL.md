---
name: seo-audit-and-fix
description: Orchestrates a full SEO audit and fix by delegating each phase to specialist subagents. Use when the user says "SEO audit", "fix SEO", "optimize for search", "website SEO", or wants "perfect website SEO". Main agent runs Phase 0 only; seo-audit, seo-fix-high, seo-fix-medium-low, pagespeed-enhance (PageSpeed/CWV and Best Practices), seo-image-optimizer (WebP + alt for all images in data), and seo-verify run in sequence. Final result is a verified, SEO- and speed-optimized website.
---

# SEO Audit and Fix (Subagent-Based)

This skill runs a **first full SEO audit** on the target website, **identifies every SEO problem** (data, content, code, technical), then **fixes in priority order** and **verifies** until the site meets current SEO standards. **The process is handled by subagents:** you (main agent) only run Phase 0, then launch the six subagents in order and pass context/outputs between them (including **pagespeed-enhance** for PageSpeed/Core Web Vitals and Best Practices).

**Reference:** Detailed checklists, scoring, Google/industry guidelines, **2026 updates** (CWV 75th percentile, INP, TTFB ≤800 ms, page weight, field vs lab), and **PageSpeed/Best Practices overlap** (HTTPS, third-party cookies, deprecated APIs, image dimensions) are in [reference.md](reference.md). Phase 1–4 instructions below are what each subagent executes; the orchestrator does not perform them itself.

---

## When to Use

- User asks for "SEO audit", "fix SEO", "perfect website SEO", "optimize for search"
- Before or after launching a site; periodic SEO health check

---

## Phase 0 — You Do This (Main Agent Only)

1. **Identify target website:**
   - Store name and theme path (e.g. `src/websites/GlobalGiftCards/themes/digital-marketplace/`)
   - Dev URL: `http://localhost:<PORT>/` and `/en`; ensure dev server is running if subagents will use MCP.
2. **Build context payload** (use this exact shape in every delegation):

```json
{
  "storeName": "<StoreName>",
  "themeName": "<theme-name>",
  "themePath": "src/websites/<StoreName>/themes/<themeName>/",
  "baseUrl": "http://localhost:<PORT>",
  "port": "<PORT>",
  "locale": "en"
}
```

3. Create a **todo list**: Phase 0 (done), seo-audit, seo-fix-high, seo-fix-medium-low, pagespeed-enhance, seo-image-optimizer, seo-verify.
4. **Launch subagents in order.** Wait for each to finish and capture its output before starting the next. Pass the **context payload** plus any previous subagent output (audit report, fix summaries) in each prompt.
5. After **seo-verify** returns success, tell the user the site has achieved "perfect website SEO" and summarize what was fixed (including PageSpeed enhancements). If any subagent fails, report and stop or retry that subagent.

---

## Required Subagents (Sequence)

Run these **one after another** (foreground). Invoke with the Task tool (`mcp_task`). If your environment supports custom subagent types, set `subagent_type` to `seo-audit`, `seo-fix-high`, `seo-fix-medium-low`, `pagespeed-enhance`, `seo-image-optimizer`, or `seo-verify` (see .cursor/agents/*.md). Otherwise use `subagent_type: generalPurpose` and the prompt templates in the next section (include context and role in the prompt).

| Order | Subagent (logical name) | Phase | Input | Output |
|-------|--------------------------|-------|--------|--------|
| 1 | **seo-audit** | Phase 1 | Context payload | SEO Audit Report (score, issues with file/URL and severity, Priority Fixes high/medium/low) |
| 2 | **seo-fix-high** | Phase 2 | Context + full audit report | Summary of changes (files touched, what was fixed) |
| 3 | **seo-fix-medium-low** | Phase 3 | Context + audit report + fix-high summary | Summary of changes (files touched, what was fixed) |
| 4 | **pagespeed-enhance** | PageSpeed / CWV | Context + audit report + fix-high + fix-medium-low summaries | Summary: files changed; what was fixed per PageSpeed opportunity (next-gen images, lazy load, render-blocking, fonts, preload, etc.); host-level recommendations |
| 5 | **seo-image-optimizer** | Image optimization | Context + audit report + fix summaries + pagespeed-enhance summary | Summary: alt added/updated for all images; images converted to WebP + metadata + upload (new CDN URLs); data files updated |
| 6 | **seo-verify** | Phase 4 | Context + audit report + all fix summaries (incl. pagespeed-enhance, image-optimizer) | Verification result: pass/fail, "perfect website SEO" or list remaining issues |

---

## Prompt Templates for Each Subagent

Use these when calling `mcp_task`. Replace `{CONTEXT}` with the context payload (and for subagents 2–5, append the audit report and prior fix summaries). Prefer `subagent_type: seo-audit` / `seo-fix-high` / `seo-fix-medium-low` / `seo-verify` if available; else use `subagent_type: generalPurpose` and paste the full prompt below so the subagent knows its role. Ask each subagent to **return a short summary** plus the required output for the next step.

### 1. seo-audit (Phase 1)

```
Context for this task (from orchestrator):
{CONTEXT}

Instructions:
1. Read .cursor/skills/seo-audit-and-fix/SKILL.md (Phase 1–4 Reference section) and reference.md.
2. Run a full SEO audit on the target website. Target themePath: {themePath}, baseUrl: {baseUrl}.
3. Audit in this order: Technical and Speed (crawlability, indexing, URL canonicalization, canonical tag correctness, Core Web Vitals, render-blocking, page load time, JS execution, HTTP requests, image format/size, custom 404, mobile, HTTPS) → **Internationalization (root `<html lang>` present and valid; never empty)** → **Navigation / Accessibility (heading order sequential h1→h2→h3→h4; no heading for non-heading content e.g. author names)** → On-page (title, meta, H1, headings, keyword placement) → Content and E-E-A-T → Featured snippet readiness → Internal linking → Images → Structured data → Data/code (index_en.json, BaseHead, components that output meta/headings). Include PageSpeed Best Practices overlap: deprecated APIs, third-party cookies (YouTube: youtube-nocookie.com, facaded embed), image dimensions (see reference.md).
4. For each area list every issue with location (file or URL) and severity (high/medium/low).
5. Produce an SEO Audit Report using the template in reference.md: overall score (e.g. X/30), score per category, list of issues, and Priority Fixes (high / medium / low).
6. Return the full audit report and a one-paragraph summary. The next subagent will use this report to fix high-priority issues.
```

### 2. seo-fix-high (Phase 2)

```
Context for this task (from orchestrator):
{CONTEXT}

Attached: SEO Audit Report from seo-audit subagent (with issues and Priority Fixes).

Instructions:
1. Read .cursor/skills/seo-audit-and-fix/SKILL.md (Phase 1–4 Reference section) and reference.md.
2. Fix ALL high-priority issues from the audit report, in this order: (0) URL canonicalization and canonical tag (ensure canonical is correct and dynamic, not hard-coded; primary URL + redirects if applicable); (1) Crawlability/indexing (robots.txt, canonicals, noindex, key pages linked); (2) **Internationalization: root `<html lang>` — ensure every page/layout outputs valid `lang` (e.g. `lang={lang ?? 'en'}`); BaseHead/layout fallback to `'en'` when lang is empty;** (3) Core Web Vitals and Speed (LCP, INP, CLS; render-blocking—inline critical CSS, defer non-critical JS; page load—optimize images/JS/requests; JS execution time; HTTP request count; modern image formats WebP/AVIF where possible); (4) Critical on-page (title and meta on homepage/main landing, single H1, keyword in first 100 words and one H2); (5) Custom 404 with helpful links if flagged high; (6) Security/HTTPS if applicable.
3. All edits must be under the theme path: {themePath}. Do not modify core files outside the theme.
4. Return a concise summary: list of files changed and what was fixed. Do not advance to medium/low fixes; the next subagent handles those.
```

### 3. seo-fix-medium-low (Phase 3)

```
Context for this task (from orchestrator):
{CONTEXT}

Attached: SEO Audit Report + seo-fix-high summary (files changed, what was fixed).

Instructions:
1. Read .cursor/skills/seo-audit-and-fix/SKILL.md (Phase 1–4 Reference section) and reference.md.
2. Fix ALL medium- and low-priority issues from the audit report: (1) **Navigation / heading order: ensure headings are sequential (h1→h2→h3→h4); replace heading tags used for non-heading content (e.g. testimonial author names, bylines) with `<p>` or `<span>`;** (2) On-page on remaining pages (title/meta/H1/keyword), (3) Content (definition paragraphs, numbered steps, comparison tables, bold terms, short paragraphs), (4) Internal links (3–5+ per key page, descriptive anchors, orphan pages), (5) Images (alt, responsive; modern format WebP/AVIF and compression where not done in fix-high), (6) Structured data (Organization, WebSite, BreadcrumbList; Product/Article/FAQ by type; validate and match content), (7) Data/code (index_en.json and component logic for titles/descriptions/headings), (8) Custom 404 with helpful links if not yet done, (9) Further speed tweaks (reduce requests, lazy-load below-fold) and **Best Practices (YouTube: youtube-nocookie.com and facaded embed if applicable; deprecated APIs via env)** where applicable.
3. All edits under theme path: {themePath}.
4. Return a concise summary: list of files changed and what was fixed.
```

### 4. pagespeed-enhance (PageSpeed / Core Web Vitals / Best Practices)

```
Context for this task (from orchestrator):
{CONTEXT}

Attached: SEO Audit Report + seo-fix-high summary + seo-fix-medium-low summary.

Instructions:
1. Read .cursor/agents/pagespeed-enhance.md and .cursor/skills/pagespeed-enhance/SKILL.md and reference.md.
2. Run the PageSpeed enhancement workflow for the target theme. Target themePath: {themePath}, baseUrl: {baseUrl}.
3. Fix all PageSpeed opportunities and diagnostics: next-gen images (WebP/AVIF), defer offscreen images, eliminate render-blocking, remove unused CSS, reduce TTFB/JS impact, ensure text visible during webfont load, preload key requests, minify CSS/JS where applicable, reduce payloads, compression/caching (document host-level if needed). Address Best Practices: image width/height and aspect-ratio, third-party cookies (e.g. youtube-nocookie.com for embeds), deprecated APIs (optional GA/Hotjar per env), HTTPS (document). All edits under theme path only.
4. Return a concise summary: list of files changed, what was fixed per opportunity, and any host-level recommendations. The next subagent (seo-image-optimizer) will use this plus the audit report and fix summaries.
```

### 5. seo-image-optimizer (optimize all images in data)

```
Context for this task (from orchestrator):
{CONTEXT}

Attached: SEO Audit Report + seo-fix-high summary + seo-fix-medium-low summary + pagespeed-enhance summary.

Instructions:
1. Read .cursor/agents/seo-image-optimizer.md and .cursor/skills/seo-audit-and-fix/reference.md (Images, Speed & Performance).
2. Scan all theme data under {themePath} (e.g. data/index_en.json, index_*.json) for image fields: heroImage, image, backgroundImage, poster, src, backgroundImages[], sections[].image, etc.
3. Add or complete alt for every image in data (derive from section title, card name, or description); ensure descriptive, SEO-friendly alt text.
4. For each image that has a local file path (or that you can resolve to a local path under the project): run `node scripts/optimize-and-upload-image-seo.mjs <localFilePath> <seoTitle> [--tags "tag1,tag2"] [--prefix "<storeName>/<themeName>"]` to convert to WebP, inject title and tags into R2 object metadata, and upload to CDN (filename = slug of seoTitle). Update data with the new CDN URL. Use storeName and themeName from context for --prefix.
5. For images that are already CDN or external URLs with no local file: only ensure alt is set in data; do not re-upload unless a local path is provided.
6. Return a concise summary: how many images had alt added/updated; how many were converted to WebP and re-uploaded (with new CDN URLs); list of data files changed.
```

### 6. seo-verify (Phase 4)

```
Context for this task (from orchestrator):
{CONTEXT}

Attached: SEO Audit Report + seo-fix-high summary + seo-fix-medium-low summary + pagespeed-enhance summary + seo-image-optimizer summary.

Instructions:
1. Read .cursor/skills/seo-audit-and-fix/SKILL.md (Phase 1–4 Reference section) and reference.md.
2. Re-run the audit checklist on the fixed areas (including **&lt;html lang&gt; and heading order**; PageSpeed/CWV improvements from pagespeed-enhance; image alt and WebP/CDN where seo-image-optimizer ran; run Lighthouse/technical checks where applicable). If UI or visible content changed, use MCP browser (cursor-ide-browser): navigate to baseUrl and key pages (e.g. /en), take screenshots, confirm titles/headings/visibility.
3. Confirm: no new regressions; high and medium priorities addressed; image optimization (alt, WebP) reflected; overall SEO score improved.
4. If all pass: return "Verified: perfect website SEO. [Brief list of what was fixed and current score/status.]" If any issues remain: return "Verification incomplete: [list remaining issues and recommended next steps]."
```

---

## Orchestration Rules

1. **You never do Phases 1–4 yourself.** You only run Phase 0 and delegate **seo-audit → seo-fix-high → seo-fix-medium-low → pagespeed-enhance → seo-image-optimizer → seo-verify** in that order.
2. **One subagent at a time.** Wait for the previous subagent’s result before launching the next. If a subagent reports failure or missing info, supply the info or retry that subagent before continuing.
3. **Update context between steps.** If a subagent returns e.g. "themePath is …" or "port 7010", add that to the context you pass to the next subagent. Always pass the audit report to fix-high, fix-medium-low, pagespeed-enhance, and seo-image-optimizer; pass all fix summaries (including pagespeed-enhance and image-optimizer) to seo-verify.
4. **After seo-verify succeeds**, tell the user the site has achieved perfect website SEO and give a short summary of fixes (including PageSpeed enhancements and image optimization: WebP, alt, CDN). If seo-verify reports remaining issues, either run another fix cycle or report the list to the user.

---

## Phase 1–4 Reference (What Each Subagent Does)

Subagents read the skill and reference for detail. Summary:

- **Phase 1 (seo-audit):** Technical → On-page → Content/E-E-A-T → Snippets → Internal links → Images → Structured data → Data/code. Output: SEO Audit Report (template in reference.md).
- **Phase 2 (seo-fix-high):** Fix URL canonicalization/canonical correctness, crawlability/indexing, Core Web Vitals + speed (LCP, render-blocking, page load, JS execution, HTTP requests, modern images), critical on-page (title, meta, H1, keyword), custom 404 if high, security. No medium/low yet.
- **Phase 3 (seo-fix-medium-low):** Fix remaining on-page, content structure, internal links, images, structured data, data/code.
- **pagespeed-enhance:** Run PageSpeed/Core Web Vitals and Best Practices fixes for the theme (next-gen images, lazy load, render-blocking, fonts, preload, image dimensions, third-party cookies/deprecated APIs per .cursor/skills/pagespeed-enhance). All edits under theme path; return summary for seo-verify.
- **seo-image-optimizer:** Optimize all images in theme data: add/complete alt for every image; for images with local source, convert to WebP, inject title and tags into R2 metadata, upload to CDN (filename = SEO title slug), update data with new URL.
- **Phase 4 (seo-verify):** Re-run checks (including PageSpeed/CWV); MCP browser if needed; confirm "perfect website SEO" or list remaining issues.

**Detailed audit areas (for seo-audit subagent):**

### 1. Technical (Google Search Essentials) and Speed & Performance

- **Crawlability:** `robots.txt` not blocking important paths; internal links present; no critical content behind JS-only (or crawlable).
- **Indexing:** Canonical tags on every page; no accidental `noindex` on key pages; sitemap present and submitted (if applicable).
- **URL canonicalization:** One primary URL per page; canonical tag **correct and dynamic** (not hard-coded for all pages); redirects from www/non-www or trailing-slash variants where needed.
- **Canonical tag:** `href` must match the actual page URL (e.g. /en vs /); generate from current request (e.g. `canonicalURL`), never hard-code a single URL.
- **Core Web Vitals:** LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1 (check with Lighthouse or PageSpeed; note failures).
- **Speed optimizations:** Render-blocking resources (identify and note; fix: inline critical CSS, defer non-critical JS); page load time &lt; 5s; JS execution time &lt; 3.5s; HTTP request count (minimize, e.g. &lt;20 for above-fold); images in modern format (WebP/AVIF) and compressed (images often 70%+ of page weight); custom 404 page with helpful links to key pages.
- **Mobile:** Mobile-friendly; primary content not lazy-loaded only (Google doesn’t scroll).
- **HTTPS / security:** HTTPS, no mixed content; secure headers if applicable.

### 2. On-Page (per key page: homepage, main landing, product/collection if applicable)

- **Title:** 50–60 chars; primary keyword in first half; ends with brand/site or "in [context]"; compelling hook.
- **Meta description:** 150–160 chars; action word; primary keyword; specific value.
- **H1:** Single H1 per page; contains primary keyword.
- **Headings:** Logical H2/H3 (sequential order: no skip from h2 to h4); at least one question-style H2 for snippet targets ("What is…", "How to…"). Do not use heading tags for non-heading content (e.g. author names → use `<p>`).
- **Keyword placement:** Primary keyword in title, description, first ~100 words, and at least one H2; natural, no stuffing.

### 3. Content and E-E-A-T

- **People-first:** Helpful, reliable content; no thin or auto-generated feel.
- **E-E-A-T:** Experience/Expertise/Authoritativeness/Trust signals where relevant (e.g. About, author, clear contact).
- **Structure:** Short paragraphs; key terms bolded on first use; definition paragraphs 40–60 words for "What is" snippets.
- **Length:** Key pages substantial (e.g. 1,500+ words for pillar/concept pages where applicable).

### 4. Featured Snippet Readiness

- "What is X" → 40–60 word definition after H2.
- "How to" → Numbered steps (e.g. `<Steps>` or ordered list).
- "X vs Y" → Comparison table where relevant.
- Code/examples → Code block + short explanation.

### 5. Internal Linking

- 3–5+ internal links on key pages; descriptive anchor text (no "click here").
- Related/concept links in body and/or related section.
- No orphan key pages (linked from at least one other page).

### 6. Images and Media

- Descriptive `alt` text; standard `<img>` (or equivalent) for important images.
- Responsive images (`srcset`/`picture`) where appropriate; avoid lazy-loading primary content only.
- **Modern formats and size:** Prefer WebP/AVIF for key images to reduce weight and improve LCP; compress; if images dominate page size (e.g. 70%+), flag for optimization.

### 7. Structured Data

- JSON-LD where it fits: Organization, WebSite, BreadcrumbList; Product/Article/FAQ etc. by page type.
- Valid (no critical errors); matches visible content; no irrelevant or misleading schema.

### 8. Data and Code (ATLAGIA / theme-specific)

- **Data JSON** (e.g. `index_en.json`, page data): Titles, descriptions, and copy that appear in `<title>`, meta, and headings — check length and keywords.
- **Components:** Any component that outputs `<title>`, `<meta name="description">`, or heading tags — verify they use the right data and lengths.
- **BaseHead / layout:** Canonical, viewport, **root `<html lang>` present and valid (never empty; fallback e.g. `'en'`)**; no duplicate or conflicting meta.

**Output:** One **SEO Audit Report** with overall score (e.g. X/30 or pass/fail per category), list of issues with file/URL and severity, and **Priority Fixes** (high/medium/low). Phase 2–4 fix and verify steps are in the prompt templates above.

---

## Checklist (Orchestrator)

- [ ] Phase 0: Target identified; context payload built; todo created.
- [ ] Launch **seo-audit** (generalPurpose or seo-audit) with context; wait; capture full audit report.
- [ ] Launch **seo-fix-high** (generalPurpose or seo-fix-high) with context + audit report; wait; capture fix summary.
- [ ] Launch **seo-fix-medium-low** (generalPurpose or seo-fix-medium-low) with context + audit report + fix-high summary; wait; capture fix summary.
- [ ] Launch **pagespeed-enhance** (generalPurpose or pagespeed-enhance) with context + audit report + fix-high + fix-medium-low summaries; wait; capture summary (files changed; PageSpeed/CWV and Best Practices fixes; host-level recommendations).
- [ ] Launch **seo-image-optimizer** (generalPurpose or seo-image-optimizer) with context + audit report + fix summaries + pagespeed-enhance summary; wait; capture summary (alt for all images; WebP + metadata + CDN for local images; data files updated).
- [ ] Launch **seo-verify** (generalPurpose or seo-verify) with context + audit report + all fix summaries (including pagespeed-enhance and image-optimizer); wait; capture verification result.
- [ ] If verified: tell user "perfect website SEO" and summarize fixes (including PageSpeed and image optimization). If not: report remaining issues or retry.
- [ ] If any subagent failed: report and stop or retry that subagent before continuing.

---

## Quick Reference (for subagents)

| Area | Key rule |
|------|----------|
| Title | 50–60 chars, keyword early, hook, end with brand/context |
| Meta description | 150–160 chars, action word, keyword, value |
| H1 | One per page, primary keyword |
| Core Web Vitals | LCP &lt; 2.5s, INP &lt; 200ms, CLS &lt; 0.1 |
| Definition snippet | 40–60 words after "What is" H2 |
| Internal links | 3–5+ per key page, descriptive anchors |
| Structured data | JSON-LD valid, matches content, Organization + WebSite + BreadcrumbList |
| Canonical | Correct, dynamic (not hard-coded); primary URL + redirects for variants |
| **&lt;html lang&gt;** | **Root `<html>` has valid `lang` (e.g. lang="en"); never empty; fallback in BaseHead/layout** |
| **Heading order** | **Sequential h1→h2→h3→h4; no heading for author names/bylines (use `<p>`)** |
| Speed | LCP ≤2.5s; no critical render-blocking; page load &lt;5s; modern images; custom 404 with links |
| Best Practices | youtube-nocookie.com; facaded embed preferred; deprecated APIs via env (GA/Hotjar optional) |

Full checklists, scoring, speed/performance table, and report template: [reference.md](reference.md).
