# SEO Audit Report: Drivon (bikes theme)

**Scope:** Homepage (/en), key landing pages, product/collection pages, 404, technical and data/code under `src/websites/Drivon/themes/bikes/`  
**Date:** 2025-03-14  
**Overall Score:** 18/30 (60%) — ⚠️ Good/Fair  

**Note:** Live verification at `http://localhost:4322` was not possible (dev server unreachable). Audit is based on code, data, and theme structure.

---

## Score Summary

| Category            | Score | Status |
|----------------------|-------|--------|
| Title Tag            | 3/4   | ✅     |
| Meta Description     | 2/4   | ⚠️    |
| Keyword Placement    | 3/5   | ⚠️    |
| Content Structure    | 3/6   | ⚠️    |
| Featured Snippets    | 2/4   | ⚠️    |
| Internal Linking     | 3/4   | ✅     |
| Technical On-Page    | 2/3   | ⚠️    |
| **Total (on-page)**  | **18/30** | **⚠️ Good/Fair** |

**Technical (site-level):** Crawlability ⚠️ | Indexing ✅ | Canonical ⚠️ | Core Web Vitals (not measured) | Speed (render-blocking, images) ⚠️ | Mobile (assumed OK) | HTTPS (env-dependent) | Structured data ⚠️ | Custom 404 ⚠️

---

## Target Keywords / Intent

**Primary:** premium automotive lifestyle, driver merchandise, car culture, racing heritage  
**Secondary:** racing hoodies, car culture tees, driver accessories, automotive merchandise  
**Intent:** Transactional / Navigational  

---

## Issues (with file/URL and severity)

### High

- [ ] **Product page title and layout use wrong brand "RidWear".** Location: `src/websites/Drivon/themes/bikes/page/products/[handle].astro` (line 124: `<Layout title={\`${product.title} | RidWear\`}>`). Fix: Use theme layout (Layoutc or theme-specific) with `title={product.title} | Drivon` (or `storeName` from env), pass `lang` for correct html lang and canonical.
- [ ] **Collections index page uses wrong layout and brand "RidWear".** Location: `src/websites/Drivon/themes/bikes/page/collections/index.astro` (line 15–16: `Layout` from `../../../layouts/Layout.astro`, title "Collections | RidWear"). Fix: Use Layoutc (or theme layout) with dynamic title e.g. `Collections | ${storeName}`, pass `lang` and description for SEO.
- [ ] **Canonical and hreflang domains can point to wrong site.** Location: `.env.Drivon` has `DOMAINE=https://streamvista.online/` and `PUBLIC_BUSINESS_NAME=Digivast`. BaseHead uses these for canonical and schema. Fix: Set `DOMAINE` to Drivon production URL (e.g. `https://www.drivon.store` or actual domain) and `PUBLIC_BUSINESS_NAME=Drivon` (or correct legal entity) when deploying Drivon.
- [ ] **Render-blocking Google Fonts.** Location: `src/websites/Drivon/themes/bikes/components/BaseHead.astro` (lines 264–266): `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` blocks first paint. Fix: Preload font URL, use `font-display: swap`, and/or inline critical font CSS; load full stylesheet async or defer.
- [ ] **BaseHead default description is generic and wrong for Drivon.** Location: `src/websites/Drivon/themes/bikes/components/BaseHead.astro` (line 22: `description = "Transform your business with our AI-powered solutions"`). Any page that does not pass `description` will show this. Fix: Change default to `SITE_DESCRIPTION` from consts or `"Premium automotive lifestyle and driver merchandise. Drivon."`; ensure schema default publisher uses `PUBLIC_SITE_NAME` or `PUBLIC_BUSINESS_NAME` consistently for Drivon.

### Medium

- [ ] **404 page has only one link (Back to Home).** Location: `src/websites/Drivon/themes/bikes/page/404.astro`. Fix: Add helpful links to Shop, Collections, Contact (and optionally Search) so users and crawlers can reach key pages; consider `noindex` for 404.
- [ ] **Homepage meta description too short.** Location: `src/websites/Drivon/themes/bikes/data/index_en.json` — `siteDescription`: "Bold, minimal, cinematic. Premium automotive lifestyle and driver merchandise for those who live the culture." (~91 chars). Fix: Expand to 150–160 chars with action word and specific value (e.g. "Discover premium automotive lifestyle and driver merchandise. Shop racing hoodies, car culture tees, and driver essentials. Free shipping over $75. Drivon.").
- [ ] **YouTube embed not using youtube-nocookie.com (Best Practices).** Location: `src/websites/Drivon/themes/bikes/components/Welcome.astro` (lines 31–32, 57–58): `youtubeEmbedUrl` uses `https://www.youtube.com/embed/...`. Fix: Use `https://www.youtube-nocookie.com/embed/${backgroundVideo.videoId}?...` to avoid third-party cookies and improve PageSpeed Best Practices.
- [ ] **Video section iframe (videoUrl) may load YouTube without nocookie.** Location: `src/websites/Drivon/themes/bikes/components/Video.astro` (line 46: `src={videoUrl}`). If data passes a youtube.com URL, use youtube-nocookie.com variant or facaded embed (thumbnail + play button, load iframe on click).
- [ ] **FAQ section has no FAQPage JSON-LD.** Location: Homepage has `faqSection` in `data/index_en.json` and `FaqSection.astro` renders it with H2 + H3 per question, but no `<script type="application/ld+json">` for FAQPage. Fix: Add FAQPage schema in BaseHead when page has FAQ section, or in a layout that wraps FAQ (match visible Q&A content).
- [ ] **Hero fallback image has empty alt.** Location: `src/websites/Drivon/themes/bikes/components/Welcome.astro` (line 92: `alt=""`). Fix: Use descriptive alt (e.g. from section title or "Drivon automotive lifestyle hero background").
- [ ] **BreadcrumbList schema uses raw path segment for first segment.** Location: `src/websites/Drivon/themes/bikes/components/BaseHead.astro` (lines 187–199): For path `/en/racing-hoodies`, first item name becomes "En". Fix: Map known segments (e.g. `en` → "Home" or language name) for friendlier breadcrumb labels.
- [ ] **filter_bikes.astro uses hardcoded `lang="en"`.** Location: `src/websites/Drivon/themes/bikes/page/filter_bikes.astro` (line 38). If this page is ever served under locale routes, lang should come from params with fallback `lang ?? 'en'`.

### Low

- [ ] **No robots.txt in theme or project.** Location: No `robots.txt` in `src/websites/Drivon/themes/bikes` or project root. Fix: Add site-level robots.txt (or ensure build/host serves one) that allows crawlers and points to sitemap if applicable.
- [ ] **Schema default publisher name "Atalsia".** Location: `BaseHead.astro` (line 35: `name: import.meta.env.PUBLIC_BUSINESS_NAME || 'Atalsia'`). When PUBLIC_BUSINESS_NAME is set to Drivon (after env fix), this is resolved; until then, schema shows wrong publisher.
- [ ] **Image dimensions not explicit on key images.** Location: Various components (e.g. CategoryGrid, BestSellers, ProductShowcase) use `<img>` without width/height. Fix: Add width and height (or aspect-ratio) to reduce CLS and satisfy PageSpeed Best Practices.
- [ ] **Debug comments in BaseHead.** Location: `BaseHead.astro` (lines 221–223): HTML comments with "Current URL", "Current Language", "Generated hreflang URLs". Fix: Remove or guard for production to avoid clutter.

---

## Internationalization

- **Root `<html lang>`:** Present and valid on index (index.astro: `lang={lang}`), Layoutc (`lang={lang}` with default `'en'`), demo.astro (`lang={currentLang}`), 404 (`lang={lang}`), filter_bikes (hardcoded `lang="en"`). Layoutc and index get `lang` from params; default is `'en'`, so lang is never empty on those. ✅
- **filter_bikes** does not use locale routing; if it is ever used under `[lang]`, it should receive `lang` and use `lang={lang ?? 'en'}`. ⚠️ (low)

---

## Navigation / Accessibility (heading order)

- **Homepage:** Welcome has one H1; Banner, CategoryGrid, etc. use H2/H3 in order. FaqSection uses H2 (title) then H3 per question — sequential. ✅
- **TestimonialSlider:** Author/role use `<cite>` and `<p>`, not headings — correct. ✅
- **Inner pages (e.g. best-sellers, underground-racing):** Hero H1, then H2 for sections, H3 for subsections/cards — order is sequential. ✅
- No heading used for author names or bylines; no skip (e.g. H2 → H4). ✅

---

## Priority Fixes

### High (do first)

1. **Product page brand and layout** — Current: Title "RidWear", LayoutP, no lang. → Use theme layout (Layoutc or Drivon product layout), title `${product.title} | Drivon`, pass lang and canonical. Impact: Correct branding and SEO on every product page.
2. **Collections index brand and layout** — Current: "Collections | RidWear", generic Layout. → Use Layoutc, title `Collections | Drivon`, pass lang and description. Impact: Key landing page has correct title and indexing.
3. **Env configuration for Drivon** — Current: DOMAINE=streamvista, PUBLIC_BUSINESS_NAME=Digivast. → Set DOMAINE to Drivon production URL and PUBLIC_BUSINESS_NAME to Drivon (or legal entity). Impact: Canonical and hreflang point to correct site; schema publisher correct.
4. **Render-blocking fonts** — Current: Blocking stylesheet for Google Fonts. → Preload + font-display: swap and/or async load. Impact: Better LCP and Core Web Vitals.
5. **BaseHead default description and schema** — Current: Generic AI/default description and Atalsia. → Default description to site-specific (e.g. SITE_DESCRIPTION); ensure publisher uses site name. Impact: No wrong meta/schema when description is omitted.

### Medium

1. **404 helpful links** — Add links to Shop, Collections, Contact (and optionally noindex).
2. **Homepage meta description** — Expand to 150–160 chars with action word and value.
3. **YouTube embeds** — Use youtube-nocookie.com in Welcome.astro and Video.astro (or facaded embed).
4. **FAQPage schema** — Add JSON-LD for FAQ section on homepage (and other pages with FAQ).
5. **Hero fallback image alt** — Descriptive alt in Welcome.astro.
6. **BreadcrumbList labels** — Map segment "en" (and other known segments) to human-readable names.
7. **filter_bikes lang** — Use `lang={lang ?? 'en'}` if page is ever locale-aware.

### Low

1. **robots.txt** — Add or ensure at build/host level; reference sitemap if present.
2. **Image dimensions** — Add width/height (or aspect-ratio) on key images for CLS and Best Practices.
3. **Remove BaseHead debug comments** in production.

---

## Implementation Checklist (after fixes)

- [ ] Title 50–60 chars, keyword, hook
- [ ] Description 150–160 chars, action word, value
- [ ] Single H1, keyword in first 100 words and one H2
- [ ] 3–5+ internal links, descriptive anchors
- [ ] Canonical and env (DOMAINE/PUBLIC_BUSINESS_NAME) correct for Drivon; no wrong noindex; key pages linked
- [ ] Core Web Vitals in range (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1)
- [ ] Speed: no critical render-blocking; page load <5s; canonical correct and dynamic; custom 404 with links; images modern format where possible
- [ ] Root `<html lang>` present and valid on all pages (never empty; fallback en)
- [ ] Heading order sequential (h1→h2→h3→h4); no heading for author names/bylines
- [ ] Structured data valid and matching content (Organization, WebSite, BreadcrumbList; FAQPage where FAQ exists)
- [ ] YouTube: youtube-nocookie.com or facaded embed
- [ ] All fixes verified (re-audit or spot-check; MCP browser when dev server available)
