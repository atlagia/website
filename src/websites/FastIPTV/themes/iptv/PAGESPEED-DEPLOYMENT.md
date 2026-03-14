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

## Theme-level (already done)

- Images: WebP in data where possible; explicit `width`/`height` on `<img>`; `loading="lazy"` for offscreen.
- Analytics: GA and Hotjar run via Partytown (no `document.write()` in main document).
- Fonts: Non-blocking load with `font-display: swap`.
- LCP: Hero image preloaded when provided.
