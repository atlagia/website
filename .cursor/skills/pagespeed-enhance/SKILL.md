---
name: pagespeed-enhance
description: Runs a PageSpeed-focused speed enhancement on a target website via the pagespeed-enhance subagent. Fixes next-gen images (WebP/AVIF), render-blocking resources, lazy loading, fonts, TTFB/JS/CSS optimization, and caching. Use when the user wants to "fix PageSpeed", "enhance website speed", or "solve all problems in the PageSpeed report".
---

# PageSpeed Enhance (Subagent-Based)

This skill runs **website speed enhancement** to address **Google PageSpeed Insights** opportunities and diagnostics. You (main agent) run Phase 0 and delegate the fixes to the **pagespeed-enhance** subagent.

**Reference:** Full checklist, WebP vs AVIF, implementation notes, **2026 best practices**, **Best Practices audit** (HTTPS, third-party cookies, deprecated APIs, image dimensions), and **cases solved** are in [reference.md](reference.md).

---

## When to Use

- User asks to "fix PageSpeed", "enhance website speed", "solve all problems in the PageSpeed report"
- After a poor PageSpeed or Lighthouse score (e.g. mobile 22/100, failed Core Web Vitals)
- Before or after launch to improve LCP, FCP, TBT, TTI, INP

---

## Phase 0 — You Do This (Main Agent Only)

1. **Identify target website**
   - Store name and theme path (e.g. `src/websites/FastIPTV/themes/iptv/`)
   - Dev URL: `http://localhost:<PORT>/` and `/en`; ensure dev server is running if subagent will use MCP.
2. **Build context payload** (same shape as SEO skill):

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

3. **Optional:** If the user shared a PageSpeed report (screenshot or paste), summarize the main opportunities and diagnostics (e.g. "Serve images in next-gen formats", "Eliminate render-blocking resources", "Defer offscreen images", "Reduce JavaScript execution time") and include that in the prompt.
4. **Launch the pagespeed-enhance subagent** with the context and any report summary. Wait for the result.
5. **After the subagent returns,** tell the user what was fixed and suggest re-running PageSpeed Insights to verify. If the user wants, run MCP browser to confirm LCP/visibility.

---

## How to Invoke the Subagent

Use the Task tool (`mcp_task`) with `subagent_type: pagespeed-enhance` (or `generalPurpose` with the full prompt below).

**Prompt template:**

```
Context for this task (from orchestrator):
{CONTEXT}

Optional – PageSpeed report summary: [paste or summarize key opportunities and diagnostics, e.g. "Mobile 22/100; opportunities: Serve images in next-gen formats (AVIF/WebP), Defer offscreen images, Eliminate render-blocking resources, Remove unused CSS, Reduce TTFB, Reduce JS execution time, Ensure text visible during webfont load, Preload key requests, Minify CSS/JS, Reduce network payloads, Enable text compression, Cache static assets; diagnostics: third-party code impact, long main-thread tasks, properly size images, excessive DOM size."]

Instructions:
1. Read .cursor/agents/pagespeed-enhance.md and .cursor/skills/pagespeed-enhance/reference.md.
2. Fix all PageSpeed opportunities and diagnostics listed in the report (or the standard list in the agent) for the target theme. Target themePath: {themePath}, baseUrl: {baseUrl}.
3. Apply fixes in the order given in the agent: next-gen images (WebP/AVIF), lazy load offscreen images, render-blocking, unused CSS, TTFB/JS, fonts, preload, minification, payloads, compression, caching, third-party, main-thread, image sizing, DOM size.
4. For images: Prefer WebP (or AVIF+WebP via <picture>) per reference.md. All edits under theme path only.
5. Return a concise summary: files changed, what was fixed per opportunity, and any host-level recommendations (TTFB, compression, cache headers).
```

---

## WebP vs AVIF (Quick Reference)

- **AVIF:** Better compression (20–50% smaller than WebP), ~93%+ browser support in 2025. Use when you can generate and serve it.
- **WebP:** Slightly wider support, fast decode, mature tooling. Safe default.
- **Recommendation:** Use **both** via `<picture>` (AVIF first, then WebP, then fallback) when the pipeline can produce both; otherwise **keep WebP** for all key images. Do not remove WebP in favor of AVIF-only. See reference.md for details.

---

## Best Practices audit (quick reference)

If the report flags **Bonnes pratiques**: HTTPS (host config), **third-party cookies** (use `youtube-nocookie.com` for embeds), **deprecated APIs** (disable GA/Hotjar via `PUBLIC_ALLOW_GA=false`, `PUBLIC_ALLOW_HOTJAR=false` to avoid Partytown running gtag), **image width/height** (explicit on every `<img>` + aspect-ratio). See reference.md for full table and cases solved.

---

## Checklist (Orchestrator)

- [ ] Phase 0: Target identified; context payload built; optional PageSpeed summary attached.
- [ ] Launch **pagespeed-enhance** (subagent_type: pagespeed-enhance or generalPurpose) with context + report summary.
- [ ] Capture summary; report to user and suggest re-running PageSpeed to verify.
