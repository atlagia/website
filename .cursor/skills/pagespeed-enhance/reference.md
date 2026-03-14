# PageSpeed Enhance — Reference

This document supports the [pagespeed-enhance](SKILL.md) skill with the full checklist, WebP vs AVIF guidance, and implementation notes aligned with Google PageSpeed Insights and Core Web Vitals.

---

## Core Web Vitals (Targets)

| Metric | Target | Notes |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5 s | Hero image, font, main content; optimize above-the-fold first. |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | Reduce JS execution, break up long tasks, defer non-critical scripts. |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | Set width/height on images; reserve space for dynamic content. |
| **FCP** (First Contentful Paint) | ≤ 1.8 s | Reduce render-blocking; inline critical CSS; preload LCP resource. |
| **TBT** (Total Blocking Time) | < 200 ms | Defer JS; minimize main-thread work. |
| **TTI** (Time to Interactive) | ≤ 3.8 s | Reduce JS execution and request chains. |
| **Speed Index** | < 3.4 s | Fast first paint and progressive loading. |

---

## PageSpeed Opportunities (Fix Order)

1. **Serve images in next-gen formats** — WebP and/or AVIF; see section below.
2. **Defer offscreen images** — `loading="lazy"` for below-the-fold; never lazy-load LCP image.
3. **Eliminate render-blocking resources** — Inline critical CSS; load non-critical CSS/JS with defer or media="print" + onload.
4. **Remove unused CSS** — Purge or split CSS so main page loads only what it needs.
5. **Reduce server response time (TTFB)** — Optimize server/CDN; cache; avoid blocking work in layout.
6. **Reduce JavaScript execution time** — Defer non-critical JS; code-split; minimize main-thread work.
7. **Ensure text remains visible during webfont load** — `font-display: swap` (or optional); preload primary font if LCP-critical.
8. **Preload key requests** — LCP image and critical font; preconnect to fonts/CDN.
9. **Avoid chaining critical requests** — Shallow critical path; no script that loads another before first paint.
10. **Minify CSS** — Build should minify; ensure production CSS is minified.
11. **Minify JavaScript** — Build should minify; ensure production JS is minified.
12. **Avoid enormous network payloads** — Next-gen images, minification, tree-shaking, code-splitting.
13. **Enable text compression** — Brotli or GZIP for HTML/CSS/JS (server/CDN).
14. **Serve static assets with efficient cache policy** — Long cache for immutable assets (e.g. hashed filenames).

---

## PageSpeed Diagnostics (Address)

1. **Reduce impact of third-party code** — Defer analytics and non-critical third-party scripts.
2. **Avoid long main-thread tasks** — Split work; defer; avoid heavy sync in layout.
3. **Properly size images** — width/height on img; srcset/sizes for responsive; serve appropriately sized sources.
4. **Avoid excessive DOM size** — Simplify markup; avoid deeply nested or redundant nodes.

---

## WebP vs AVIF — Decision Guide

| Factor | WebP | AVIF |
|--------|------|------|
| **Compression** | 25–40% smaller than JPEG at similar quality | Often 20–50% smaller than WebP |
| **Browser support** | Very wide (all modern browsers) | ~93%+ in 2025 (Chrome, Firefox, Safari 16+, Edge) |
| **Decode speed** | Fast | Can be slower on low-end devices |
| **Tooling** | Mature (sharp, ImageMagick, CDN) | Good (sharp, libavif); less universal in CDNs |

**Recommendation:**

- **If you can generate and serve both:** Use `<picture>` with `<source type="image/avif">` first, then `<source type="image/webp">`, then `<img src="fallback.jpg">`. Maximizes savings for AVIF-capable browsers while keeping WebP and legacy fallback.
- **If the project only has a WebP pipeline (e.g. scripts/optimize-and-upload-image-seo.mjs):** **Keep WebP.** Ensure all key images (hero, above-the-fold) are WebP. Do not remove WebP. Optionally add a separate AVIF pipeline later (e.g. sharp `.avif()` output, upload to CDN, use in `<picture>`).
- **Do not** switch to AVIF-only and drop WebP — legacy and some environments handle WebP better. Either WebP-only or AVIF+WebP.

**Example `<picture>` (AVIF + WebP + fallback):**

```html
<picture>
  <source type="image/avif" srcset="hero.avif" />
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="..." width="1920" height="1080" loading="eager" />
</picture>
```

For **LCP image:** use `loading="eager"` (or omit); do not lazy-load. For offscreen images use `loading="lazy"`.

---

## Theme-Level Implementation Notes

- **BaseHead / layout:** Preconnect + preload for LCP image and primary font; fonts with `media="print"` + `onload="this.media='all'"` to avoid render-blocking; ensure `&display=swap` in Google Fonts URL.
- **Images in data:** Prefer WebP (or AVIF) URLs in index_*.json and other theme data; ensure components output `<img width height>` or equivalent and `loading="lazy"` for below-the-fold.
- **Global CSS:** Prefer critical CSS inlined in head; non-critical in a deferred stylesheet or scoped to routes.
- **Analytics (GA, Hotjar):** Load after first paint (e.g. defer, or load in requestIdleCallback) so they don’t block main thread.
- **Host-level (document for user):** TTFB and compression/cache headers are often set on the host (Vercel, Netlify, Cloudflare). If TTFB or “Enable text compression” / “Cache policy” remain red after theme fixes, recommend checking host/CDN settings.

---

## 2026 context (PageSpeed & Core Web Vitals)

- **CWV evaluation:** Google uses the **75th percentile** of real-user data — 75% of page loads must be "Good" to pass.
- **INP** is the official replacement for FID (since 2024); target ≤200 ms.
- **Lab vs field:** ~68% of sites that pass lab tests fail in the field; prioritize real-user (CrUX) data when available.
- **Business impact (2026):** 1s delay ≈ 7% conversion drop, 32% bounce increase; first-page results average ~1.65s load; 53% of mobile users abandon after 3s. Only ~52% of sites pass all three CWV.
- **Page weight:** Keep under ~2 MB where possible; TTFB target ≤800 ms (technical SEO benchmark).

---

## Best Practices audit (Bonnes pratiques)

PageSpeed "Best Practices" can flag:

| Issue | Fix |
|-------|-----|
| **Does not use HTTPS** | Host must serve site over HTTPS and redirect HTTP→HTTPS (301). Not fixable in theme code; document in deployment notes. |
| **Uses third-party cookies** | YouTube embeds set cookies from `www.youtube.com`. Use **privacy-enhanced embed:** `https://www.youtube-nocookie.com/embed/{videoId}` instead of `www.youtube.com/embed/...`. Cookies then deferred until user clicks play. |
| **Deprecated APIs (SharedStorage, AttributionReporting)** | Triggered when **Partytown** runs gtag/Hotjar in its worker; Chrome flags these Privacy Sandbox APIs. **Fix:** Make GA/Hotjar optional via env (e.g. `PUBLIC_ALLOW_GA=false`, `PUBLIC_ALLOW_HOTJAR=false`). When both off, no Partytown scripts run, so no deprecated API warnings from `partytown-sandbox-sw.html`. |
| **Image elements without explicit width/height** | Add `width` and `height` (and optionally `style="aspect-ratio: ..."`) to every `<img>` to avoid CLS and satisfy "appropriate aspect ratios." |
| **Avoid document.write()** | Load third-party scripts via Partytown (worker) or async/defer in main document; avoid snippets that inject with `document.write`. |

---

## Astro / React 2026 (speed)

- **Astro:** Ships zero JS by default; islands isolate interactivity. Prefer static HTML; use `client:visible` (not `client:load`) for below-fold interactivity to avoid unnecessary JS.
- **Hydration:** Avoid `client:load` on every component; use `client:visible` for components only needed when in view.
- **Framework choice in islands:** Preact (~3 KB) vs React (~40 KB) can save significant bytes per interactive island.
- **Streaming (Astro 5+):** Server Islands and streaming improve TTI by rendering shell first, then streaming content.
- **Prefetch / navigation:** Speculation Rules API and View Transitions API improve perceived performance without heavy JS.

---

## Cases solved (FastIPTV and similar)

- **WWW canonicalization:** Middleware 301 redirect from `www.` to non-www (or vice versa) so one canonical host.
- **Best Practices – HTTPS:** Documented that HTTPS is host-level; `PAGESPEED-DEPLOYMENT.md` in theme with host checklist.
- **Best Practices – third-party cookies:** VideoDemo embed URL switched to `youtube-nocookie.com` so YouTube doesn't set cookies until play.
- **Best Practices – deprecated APIs:** `PUBLIC_ALLOW_GA` and `PUBLIC_ALLOW_HOTJAR` env flags; when `false`, GA/Hotjar not loaded, so Partytown doesn't run gtag → no SharedStorage/AttributionReporting warnings.
- **Best Practices – image width/height and aspect ratio:** All theme `<img>`s given explicit `width`, `height`, and `aspect-ratio` (or style) where needed (Channels, movies, ProductCard, Cart).
- **Vulnerable JS:** Updated `@astrojs/node` to ^9.5.4+ to address known advisories.
- **LCP / render-blocking:** Critical CSS inlined in BaseHead; fonts non-blocking (`media="print"` + onload); LCP image preloaded; analytics deferred or optional.
