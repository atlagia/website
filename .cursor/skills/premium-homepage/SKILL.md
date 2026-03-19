---
name: premium-homepage
description: Premium ecommerce homepages. Research-backed AIDA, visual rhythm, conversion science, 2024–2026 design intelligence (WCAG 2.2, CWV, typography, tokens). Two modes — (1) Direct: Audit → Plan → Build → Verify; (2) Orchestrated: subagents (audit, styles, graphics mismatch-only, design verify, final verify). Use for new/enhanced homepages, section audits, or "world-class", "premium", "best practice" homepage.
---

# Premium Homepage

Single skill for designing and delivering premium ecommerce homepages. Integrates **research & reference** (conversion science, trust data, AIDA, design intelligence, WCAG 2.2, CWV) with **two execution modes**:

- **Direct build** — Audit → Plan → Build → Verify (you do all phases).
- **Orchestrated creation** — Phase 0 (you) then subagents: create-website-audit → create-website-styles → graphics-mapper (with slotsToReplace) → graphics-prompt-planner → graphics-generator → graphics-replacer → Design Verification → create-website-verify.

**Prerequisites (orchestrated mode):** [frontend-design-anthropics](../frontend-design-anthropics/SKILL.md), [homepage-graphics](../homepage-graphics/SKILL.md). Dev server for target site must be running.

**Full science & citations:** [research-and-reference.md](research-and-reference.md)  
**Section order examples & anti-patterns:** [examples.md](examples.md)

---

## Mandatory MCP Verification

**Strict:** After any change that affects the homepage UI, verify with **cursor-ide-browser** before considering the task done.

1. **After edits** → `browser_navigate` to the homepage URL (e.g. `http://localhost:<port>/en`).
2. **Capture** → `browser_take_screenshot` or `browser_snapshot`.
3. **If wrong or broken** → Fix and repeat.

Skip MCP only when the task has no visible output (e.g. config-only, docs). Applies to both Direct build (Phase 4) and Orchestrated (after replacer and create-website-verify).

---

## E‑commerce & Theme Alignment

When building or enhancing a site that has (or will have) a full storefront, align with [atlagia-ecommerce-frontend](../atlagia-ecommerce-frontend/SKILL.md):

- **Header:** Bag (cart) trigger + **slide cart** (sidebar/drawer from the right), not a dropdown. Use theme CSS variables for header/cart so it matches the site.
- **Theme style files:** Ensure `layout.json`, `Header.json`, `collections/collections.json` (or `index.json`), `products/products.json`, `products/luxury.mjs`, `components/luxury.mjs` exist under the theme’s `styles/` and use the **site’s** CSS variables and fonts. Create from `src/styles/default/` if missing.
- **Dark theme:** If the site uses a dark background (e.g. `--prefix-bg: #0a0a0a`), **all text** must be light (theme vars e.g. `--prefix-text`, `--prefix-muted`). No dark-on-dark or low-contrast text on product or homepage sections. Verify with MCP screenshot.

---

## Phase 0 — Context (Both Modes)

1. **Get target** — `storeName`, `themeName`, `port`, `themePath`, `indexEnPath`, `homepageUrl`.
2. **Build context payload:**

```json
{
  "storeName": "<StoreName>",
  "themeName": "<theme-name>",
  "port": "<PORT>",
  "storenameLower": "<storename>",
  "themePath": "src/websites/<StoreName>/themes/<themeName>/",
  "indexEnPath": "src/websites/<StoreName>/themes/<themeName>/data/index_en.json",
  "homepageUrl": "http://localhost:<PORT>/en",
  "graphicsProjectName": "<storename>-homepage-graphics"
}
```

3. **Create todo** for the chosen mode (Direct: Audit, Plan, Build, Verify | Orchestrated: Audit, Styles, Graphics, Design Verify, Final Verify).

---

## Design Intelligence (Summary)

Apply these in both Plan and Build (and in subagent briefs when orchestrating). Full detail in [research-and-reference.md](research-and-reference.md).

### First Impression & Hierarchy
- **50ms** — Users judge visual appeal instantly. Hero + credentials must deliver value in 2.5 seconds.
- **F/Z pattern** — Place primary CTA where scan path lands.
- **3–5 hierarchy levels** — One focus per section; avoid cognitive overload.

### Typography
- Fluid type (`clamp()`), variable fonts preferred. Base 16–18px; display 48–72px hero.
- **Never:** Inter, Roboto, Open Sans, Lato, Arial, Space Grotesk. **Prefer:** Characterful display + refined body; serif for luxury.

### Color & Tokens
- Token architecture: primitive → semantic → component. **60-30-10.** WCAG 2.2 contrast. Avoid pure black backgrounds and purple-on-white clichés.

### Motion & Performance
- Microinteractions 120–200ms; transitions 240–400ms; hero up to 700ms. Respect `prefers-reduced-motion`. **Core Web Vitals:** LCP ≤2.5s, INP ≤200ms, CLS <0.1.

### Section Architecture (AIDA)
- **ATTENTION:** Hero (full-bleed) + credentials bar (strip).
- **INTEREST:** Category grid + product grid (contained).
- **DESIRE:** Lifestyle banner + brand story + featured collection + trust badges.
- **ACTION:** Editorial + testimonials + newsletter.
- **Rhythm:** Never two full-bleed adjacent; FULL → contained(1–3) → FULL.

### Distinctive Design (per site)
- **One bold aesthetic** per site: luxury, editorial, brutalist, etc. Execute it consistently.
- **Backgrounds:** Add atmosphere (gradients, subtle texture, grain) where it fits.
- **Layout:** Asymmetry, overlap, or grid-breaking where it supports the concept. Use theme CSS variables; no hardcoded colors in components.

---

## Mode A: Direct Build (Audit → Plan → Build → Verify)

### Phase 1: Audit

Read current homepage (index data JSON + page template). Map every section to the Section Taxonomy below. Identify:

1. **Missing must-have sections** (vs taxonomy)
2. **Duplicate intent** (two sections same funnel stage)
3. **Visual rhythm violations** (two full-bleed adjacent; four+ contained without break)
4. **Funnel gaps** (AIDA stage with no section)

Output a short gap report before proceeding.

### Phase 2: Plan — AIDA Section Map

Map sections to stages. Use the templates in [examples.md](examples.md) (11-section ideal, 8-section minimum, 14-section rich). Apply:

- **ATTENTION:** Hero (full-bleed), Credentials bar (strip).
- **INTEREST:** Category grid, Product grid (contained).
- **DESIRE:** Lifestyle banner (full-bleed), Brand story (contained 2-col), Featured collection (full-bleed), Trust badges (contained).
- **ACTION:** Editorial/Journal, Testimonials, Newsletter (contained).

**Science:** 57% viewing time above fold; 93% say reviews impact decisions; trust signals near CTAs up to +32% conversion; testimonials near CTAs +12.5%. See [research-and-reference.md](research-and-reference.md).

### Phase 3: Build — Visual Rhythm Rules

- **Alternation:** Never two full-bleed adjacent. Pattern: `FULL → contained(1-3) → FULL → contained(1+) → FULL → contained(2+)`.
- **Weights:** Full-bleed (hero, banner, featured) | Contained grid (categories, products, trust, journal) | Strip (stats bar) | Contained 2-col (heritage) | Contained form (newsletter).

**Implementation:** Edit `data/index_en.json` (add/remove/reorder sections), `page/index.astro` (import + render), create section components in theme. Use theme CSS variables (e.g. `--prefix-bg`, `--prefix-text`), `loading="lazy"`, `decoding="async"`, `aria-label`, responsive grid, focus-visible styles. Each section component: props interface with defaults, `font-display`/`font-body` where applicable, no core file edits—all under `src/websites/<StoreName>/themes/<Theme>/`.

### Phase 4: Verify (MCP Browser)

1. Navigate to homepage URL.
2. Screenshot above the fold (Hero + credentials).
3. Scroll section by section; screenshot transitions.
4. Confirm no two full-bleed adjacent; check readability and CTA visibility.
5. If possible, check mobile layout.

---

## Mode B: Orchestrated Creation (Subagents)

Run **one subagent at a time**; pass full context + prior outputs.

| Order | Subagent | Responsibility | Input | Output |
|-------|----------|----------------|-------|--------|
| 1 | **create-website-audit** | AIDA + rhythm audit; reorder sections | Context + homepageUrl | Section order, gap report |
| 2 | **create-website-styles** | Premium styles; token-based; CWV-conscious | Context + audit | Style overrides done |
| 3 | **graphics-mapper** | Map slots; style context; MCP screenshot; **identify slotsToReplace** | Context | imageSlots, styleContext, **slotsToReplace** |
| 4 | **graphics-prompt-planner** | **Only for slotsToReplace:** style-matched prompts | Context + mapper | plannedPrompts |
| 5 | **graphics-generator** | Generate one-by-one; choose best; R2 CDN | Context + plannedPrompts | generatedPaths |
| 6 | **graphics-replacer** | Update index_en.json; MCP verify | Context + generatedPaths | Summary + verification |
| 7 | **create-website-verify** | Final MCP: /, /en, scroll, product, cart | Context + replacer | Pass/fail, notes |

### Graphics Scope Rule (Orchestrated Mode)

**Only plan and replace graphics that:**
1. **Do not match the homepage** — Wrong palette, style, or mood; generic composition; contradicts brand.
2. **Do not match others in the same category** — One image in a group (e.g. categoryGrid) inconsistent with the rest (lighting, style, tone). Replace the outlier.

Mapper must output **slotsToReplace** (subset of imageSlots). Planner and generator run only for those slots. Do not replace graphics that already match theme and section.

### Design Verification (After graphics-replacer)

- Compare visuals to theme (color, mood, composition).
- If mismatch: re-plan → regenerate → replace for that slot.
- Use MCP cursor-ide-browser for screenshots; user-cdp-browser for generation.

**When creating a new site:** Use [create-website-orchestrator](../create-website-orchestrator/SKILL.md). The orchestrator runs Phase 0 (brief + AIDA/rhythm from this skill) then subagents in order: create-website-scaffold → create-website-theme → create-website-components → **create-website-audit** (AIDA + rhythm audit from this skill) → create-website-styles → product-page-visibility → create-website-verify → homepage-graphics. You never run Phases 1–8 yourself; you delegate. Context payload must include `storeName`, `themeName`, `port`, `themePath`, `sections` (ordered), `palette`, `fonts`, `siteTitle`, `siteDescription`, `navItems`, and after scaffold `referenceStore`/`referenceTheme`. For **existing sites**, run this premium-homepage orchestrated sequence from create-website-audit onward (audit → styles → graphics → design verify → create-website-verify).

---

## Section Taxonomy (Quick Reference)

| AIDA | Section type | Weight | Purpose |
|------|--------------|--------|---------|
| ATTENTION | Hero | Full-bleed | Brand statement, primary CTA |
| ATTENTION | Credentials bar | Strip | 3–5 stats/badges |
| INTEREST | Category grid | Contained | 3–6 collection cards |
| INTEREST | Product grid | Contained | Best sellers / featured + price + CTA |
| DESIRE | Lifestyle banner | Full-bleed | Aspirational image + tagline + CTA |
| DESIRE | Brand story / Heritage | Contained 2-col | Image + text |
| DESIRE | Featured collection | Full-bleed | One collection highlight |
| DESIRE | Trust badges | Contained | 4–6 icons |
| ACTION | Editorial / Journal | Contained | 3 article cards |
| ACTION | Testimonials | Contained | 1–3 quotes |
| ACTION | Newsletter signup | Contained | Single field + CTA |

---

## Anti-Patterns (What NOT to Do)

- **Back-to-back full-bleed** — Insert a contained section between two full-bleed.
- **Duplicate intent** — Max two product-style grids, separated (e.g. by banner).
- **Trust too late** — Trust badges before testimonials.
- **No story section** — Include brand story/heritage for desire stage.

See [examples.md](examples.md) for full examples and anti-patterns.

---

## MCP Usage

| Step | Server | Tools |
|------|--------|-------|
| Screenshot, verify | **cursor-ide-browser** | browser_navigate, browser_take_screenshot, browser_snapshot, browser_scroll |
| Generate images (orchestrated) | **user-cdp-browser** | create_nano_banana_pro_photos (Chrome CDP) |

---

## Checklist

**Direct build:**  
- [ ] Phase 0: Context + todo.  
- [ ] Audit: gap report.  
- [ ] Plan: AIDA map + rhythm.  
- [ ] Build: index_en.json + page + components (theme vars, lazy load, aria-label).  
- [ ] Verify: MCP section-by-section (browser_navigate → screenshot/snapshot; fix if broken).

**Orchestrated:**  
- [ ] Phase 0: Context + todo.  
- [ ] create-website-audit → section order.  
- [ ] create-website-styles → summary.  
- [ ] graphics-mapper → imageSlots, styleContext, **slotsToReplace**.  
- [ ] graphics-prompt-planner (slotsToReplace only) → plannedPrompts.  
- [ ] graphics-generator → generatedPaths.  
- [ ] graphics-replacer → summary.  
- [ ] Design Verification; re-plan/regenerate if mismatch.  
- [ ] create-website-verify → pass/fail.  
- [ ] Report: CDN URLs, fixes applied.

---

## Additional Resources

- **Research & reference (full):** [research-and-reference.md](research-and-reference.md)
- **Section examples & anti-patterns:** [examples.md](examples.md)
- **Design principles:** [frontend-design-anthropics](../frontend-design-anthropics/SKILL.md)
- **E‑commerce frontend (header, theme files, dark theme):** [atlagia-ecommerce-frontend](../atlagia-ecommerce-frontend/SKILL.md)
- **Full site creation with subagents:** [create-website-orchestrator](../create-website-orchestrator/SKILL.md)
- **Graphics workflow:** [homepage-graphics](../homepage-graphics/SKILL.md)
