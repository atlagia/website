# FastIPTV – PageSpeed & deployment

## HTTPS (Best Practices audit)

**PageSpeed may report "Does not use HTTPS" if the site is served over HTTP.**

- **Fix:** Serve the site over **HTTPS** and redirect HTTP → HTTPS (301) at the **host** (e.g. Vercel, Netlify, Cloudflare, or your reverse proxy).
- Ensure `DOMAINE` (or the canonical domain) uses `https://` (e.g. `https://fastiptvstronger.com`). The app uses `Astro.url.origin` for canonical URLs, so the first request must be over HTTPS for canonicals to be HTTPS.
- No code change can “enable” HTTPS; it is a host/SSL configuration.

## Other host-level improvements

- **TTFB:** Use a CDN or edge, and avoid blocking work before the first byte.
- **Text compression:** Enable Brotli or GZIP for HTML/CSS/JS on the host or CDN.
- **Cache policy:** Long cache for immutable assets (e.g. hashed filenames).

## Best Practices – Deprecated APIs (SharedStorage, AttributionReporting)

PageSpeed “Bonnes pratiques” can report **API obsolètes utilisées** from `partytown-sandbox-sw.html`. These come from **Partytown** when it runs Google Analytics or Hotjar in its worker.

- **Fix:** In production, set **`PUBLIC_ALLOW_GA=false`** and **`PUBLIC_ALLOW_HOTJAR=false`** in your host environment (Vercel, Netlify, etc.). When both are disabled, no Partytown scripts run, so no deprecated API warnings.
- If you need GA or Hotjar, keep them enabled and accept the warning, or load analytics via a non-Partytown method (e.g. gtag async in main document) and accept possible `document.write`-related Best Practice notes.

## Theme-level (already done)

- Images: WebP in data where possible; explicit `width`/`height` on `<img>`; `loading="lazy"` for offscreen.
- Analytics: GA and Hotjar run via Partytown when allowed; set `PUBLIC_ALLOW_GA=false` and `PUBLIC_ALLOW_HOTJAR=false` to remove deprecated API warnings (see above).
- Fonts: Non-blocking load with `font-display: swap`.
- LCP: Hero image preloaded when provided.
- YouTube: Privacy-enhanced embed (`youtube-nocookie.com`) with facaded load (iframe only after user clicks play) to avoid cookie/Issues panel warnings on initial load.
