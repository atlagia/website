# SEO Audit Report: JacketVerse (premium-jackets)

**Scope:** Homepage (/en), /en/collections, product pages, key landing and legal pages  
**Date:** 2025-03-14  
**Theme path:** `src/websites/JacketVerse/themes/premium-jackets/`  
**Base URL:** http://localhost:7025  
**Overall Score:** 18/30 (60%) — ⚠️ Fair

---

## Score Summary

| Category            | Score | Status |
|---------------------|-------|--------|
| Title Tag           | 3/4   | ⚠️     |
| Meta Description    | 2/4   | ⚠️     |
| Keyword Placement   | 5/5   | ✅     |
| Content Structure   | 2/6   | ⚠️     |
| Featured Snippets   | 0/4   | ❌     |
| Internal Linking    | 2/4   | ⚠️     |
| Technical On-Page   | 3/3   | ✅     |
| **Total (on-page)** | **18/30** | **⚠️ Fair** |

**Technical (site-level):** Crawlability ✅ | Indexing ✅ | Core Web Vitals ⚠️ (not measured) | Mobile ✅ | HTTPS N/A (localhost) | Structured data ⚠️ (base present; product/catalog mismatch)

---

## Target Keywords / Intent

**Primary:** jackets, premium jackets, jacket store  
**Secondary:** leather jacket, bomber jacket, denim jacket, winter coats, jacket styles  
**Intent:** Transactional (e-commerce) + navigational (brand)

---

## Issues (with file/URL and severity)

### High

- [ ] **Wrong product catalog on homepage and collections.** Homepage and /en/collections show non-jacket products (Airbnb templates, Real Estate, Wedding signs, Shopify themes). Location: live site (http://localhost:7025/en, http://localhost:7025/en/collections). Fix: Point store/catalog to jacket-specific products (Shopify/backend or collection handles) so "Best Selling Jackets", "Seasonal Collections", and "New Arrivals" show jacket products only.
- [ ] **Product page title uses wrong brand (RidWear).** Location: `page/products/[handle].astro` line 124: `title={\`${product.title} | RidWear\`}`. Fix: Use JacketVerse (or `SITE_TITLE` from consts), e.g. `${product.title} | JacketVerse`.
- [ ] **Meta description too short (homepage).** Current length ~89 characters. Location: `consts.ts` — `SITE_DESCRIPTION`. Fix: Expand to 150–160 chars with action word, primary keyword, and specific value (e.g. "Shop premium jackets at JacketVerse. Discover leather, bomber, denim, puffer, and trench coats for every season. Free shipping on orders over $75. | JacketVerse").
- [ ] **Title tag slightly short (homepage).** Current "JacketVerse — Every Jacket. Every Style." is 41 characters. Location: `consts.ts`. Fix: Consider 50–60 chars and ensure primary keyword in first half; e.g. "Premium Jackets for Every Style | JacketVerse" or extend current with "Shop Now".
- [ ] **Canonical/hreflang domain fallback is wrong brand.** BaseHead uses `import.meta.env.DOMAINE || 'https://www.drivon.store'`. Location: `components/BaseHead.astro` (e.g. lines 69, 134). Fix: Set `DOMAINE` in .env for JacketVerse production URL; avoid drivon.store as default for this site.
- [ ] **Publisher/schema default is wrong.** BaseHead schema uses `import.meta.env.PUBLIC_BUSINESS_NAME || 'Atalsia'`. Location: `components/BaseHead.astro`. Fix: Ensure .env has `PUBLIC_BUSINESS_NAME=JacketVerse` (or correct brand) for this site.

### Medium

- [ ] **Multiple pages use "Drivon" in fallback or body copy.** Location: Many pages in `page/*.astro` use `jsonData.siteTitle || 'Drivon'` or "Drivon" in descriptions (account, cookies, privacy, terms, shipping, size-chart, etc.). Data files: `data/about/about_*.json`, `data/contact/contact_*.json` reference Drivon. Fix: Replace fallbacks with "JacketVerse"; update about/contact copy to jacket brand.
- [ ] **Footer.tsx hardcodes RidWear.** Location: `components/Footer.tsx` — "RidWear" in heading and copyright. Fix: Use site name from env or consts (JacketVerse).
- [ ] **Footer navigation is racing/drivon-focused, not jacket-focused.** Location: `data/footer/footer_en.json` — links like "Racing Hoodies", "Car Culture Tees", "Driver Accessories", "Racing Legends". Fix: Replace with jacket-relevant links (e.g. Leather Jackets, Bomber Jackets, Winter Coats, Size Guide, Shipping).
- [ ] **Theme collections index uses wrong brand and layout.** Location: `page/collections/index.astro` — title "Collections | RidWear", uses default Layout. Fix: Use theme BaseHead/Header/Footer and title "Collections | JacketVerse" (or from consts).
- [ ] **Many inner pages use --drivon-* CSS variables.** Location: Dozens of files reference `--drivon-bg`, `--drivon-text`, `--drivon-muted`. Theme uses `--jv-*`. Fix: Replace with `--jv-*` equivalents so styling and contrast are consistent.
- [ ] **No featured-snippet–ready content.** Homepage has no "What is X" 40–60 word definition, no question-style H2, no numbered steps or comparison table. Location: Homepage sections (index_en.json, Welcome, etc.). Fix: Add an intro or FAQ block with definition and question H2s where relevant.
- [ ] **Hero image has empty alt.** Location: `components/Welcome.astro` — hero `<img alt="">`. Acceptable if purely decorative; otherwise add short descriptive alt (e.g. "JacketVerse hero: premium jackets for every style").
- [ ] **Blog/featured posts are off-topic.** "Fashion Inspiration Blog" shows ADHD/TS/emotional content, not jacket/fashion. Location: Blog API or content source. Fix: Ensure blog feed is jacket/fashion/outdoor style content or hide until aligned.
- [ ] **data/index/index_en.json (index subfolder) is generic.** Location: `data/index/index_en.json` — "Index" title, "racing enthusiasts" copy. Fix: Either use for a real "index" route with jacket copy or remove/repurpose so it doesn’t leak into meta or headings.

### Low

- [ ] **Structured data:** Product pages may not output Product schema (theme product page uses default layout). Location: Product page layout/BaseHead. Fix: Add Product JSON-LD on product pages with name, image, price, availability.
- [ ] **404 and 404 title fallback.** Location: `page/404.astro` — `jsonData.siteTitle || 'DriverApparel'`. Fix: Use "JacketVerse" or consts.
- [ ] **index_fr.json / index_it.json siteTitle still Drivon.** Location: `data/index_fr.json`, `data/index_it.json`. Fix: Set siteTitle to JacketVerse (and locale-appropriate tagline).
- [ ] **Social links in footer point to drivon.** Location: `data/footer/footer_en.json` — facebook.com/drivon, instagram.com/drivon, etc. Fix: Update to JacketVerse social URLs or remove until configured.
- [ ] **.env.jacketverse:** `PUBLIC_BUSINESS_NAME=Digivast`. Location: Project root .env.jacketverse. Fix: Set to JacketVerse for this site.

---

## Priority Fixes

### High (do first)

1. **Product catalog mismatch** — Homepage and collections show non-jacket products. Impact: User and search relevance; E-E-A-T; possible thin/irrelevant content signals. Fix: Configure catalog/collections so jacket-specific products are shown.
2. **Product page title brand** — Change `RidWear` to JacketVerse in `page/products/[handle].astro`. Impact: Correct brand in SERP and tabs.
3. **Homepage meta description** — Expand to 150–160 chars in `consts.ts`. Impact: Better CTR and snippet quality.
4. **Homepage title length** — Bring to 50–60 chars in `consts.ts`. Impact: Optimal display and keyword placement in SERPs.
5. **Canonical/domain default** — Set DOMAINE (and avoid drivon default) for JacketVerse in BaseHead/env. Impact: Correct canonical and hreflang in production.
6. **Schema publisher** — Set PUBLIC_BUSINESS_NAME=JacketVerse so Organization/WebSite schema is correct. Impact: Brand and rich result accuracy.

### Medium

1. **Drivon → JacketVerse** — Replace all "Drivon" fallbacks and body copy in theme pages and data (about, contact, legal, account, etc.). Impact: Consistent brand and trust.
2. **Footer.tsx RidWear** — Use JacketVerse (or site name from env). Impact: Correct footer branding.
3. **Footer nav and description** — Update footer JSON to jacket-focused links and description. Impact: Internal linking and relevance.
4. **Theme collections page** — Use theme layout and "Collections | JacketVerse" title. Impact: Consistent branding and crawlability.
5. **--drivon-* CSS** — Replace with --jv-* in all theme components. Impact: Theming and accessibility consistency.
6. **Featured snippet readiness** — Add one block with "What are premium jackets?" (or similar) and 40–60 word definition plus question H2s. Impact: Snippet eligibility.
7. **Blog/featured posts** — Align with jacket/fashion or hide section until ready. Impact: Content relevance and E-E-A-T.

### Low

1. **Product schema** — Add Product JSON-LD on product pages. Impact: Rich results and clarity for Google.
2. **404 title fallback** — Use JacketVerse. Impact: Minor brand consistency.
3. **index_fr / index_it siteTitle** — Set to JacketVerse. Impact: Correct multi-language titles.
4. **Footer social URLs** — Point to JacketVerse profiles or remove. Impact: Correct attribution.
5. **.env.jacketverse PUBLIC_BUSINESS_NAME** — Set to JacketVerse. Impact: Correct schema and branding when env is loaded.

---

## Implementation Checklist (after fixes)

- [ ] Title 50–60 chars, keyword, hook
- [ ] Description 150–160 chars, action word, value
- [ ] Single H1, keyword in first 100 words and one H2
- [ ] 3–5+ internal links, descriptive anchors (footer and body)
- [ ] Canonical, no wrong noindex, key pages linked
- [ ] Core Web Vitals in range (measure in production)
- [ ] Structured data valid and matching content (Organization, WebSite, BreadcrumbList; Product on product pages)
- [ ] Catalog shows jacket products on homepage and collections
- [ ] All brand references JacketVerse (no Drivon, RidWear, Atalsia in theme)
- [ ] All fixes verified (re-audit or spot-check)

---

## Technical Notes

- **robots.txt:** Project-level `src/pages/robots.txt.ts` allows `/` and lists sitemaps; Disallow for /api/, /admin/, etc. ✅
- **Sitemaps:** Project-level sitemap index and lang-specific page/product/collection sitemaps exist. ✅
- **Canonical:** BaseHead sets canonical and hreflang; domain must be set per site. ⚠️
- **Core Web Vitals:** Not measured this audit; recommend Lighthouse/PageSpeed on production. ⚠️
- **MCP verification:** Homepage and /en/collections checked via cursor-ide-browser; title and H1 confirmed; product listings confirmed wrong (non-jacket). ✅
