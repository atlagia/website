---
name: world-class-homepage-builder
description: Analyses, plans, and builds world-class ecommerce homepages using research-backed section ordering, visual rhythm, AIDA funnel mapping, and conversion science. Use when building a new homepage, enhancing an existing one, auditing homepage sections, sorting homepage order, or when the user asks for a "world-class" or "best practice" homepage.
---

# World-Class Homepage Builder

## Quick Start

When triggered, follow the four phases in order: **Audit → Plan → Build → Verify**.

For each phase, create a todo list and track progress. Use MCP browser to verify visually after Build.

---

## Phase 1: Audit

Read the current homepage (index data JSON + page template). Map every existing section to the taxonomy below. Identify:

1. **Missing must-have sections** (compare against the Section Taxonomy)
2. **Duplicate intent** (two sections serving the same funnel stage)
3. **Visual rhythm violations** (two full-bleed sections adjacent, or four+ contained sections without a break)
4. **Funnel gaps** (AIDA stage with no section)

Output a short gap report before proceeding.

---

## Phase 2: Plan — The AIDA Section Map

Every homepage follows the AIDA funnel. Map sections to stages:

### Stage 1: ATTENTION (Above the fold — first 5 seconds)

| Priority | Section type | Visual weight | Purpose |
|----------|-------------|---------------|---------|
| Required | **Hero** | Full-bleed | Brand statement, primary CTA. Video or cinematic image. |
| Required | **Credentials bar** | Contained strip | Instant trust: 3-5 short stats/badges. |

**Science:** 57% of viewing time is above the fold. Users judge in 50ms. Hero must answer "What's in it for me?" immediately.

### Stage 2: INTEREST (Scroll 1-2 — discover and browse)

| Priority | Section type | Visual weight | Purpose |
|----------|-------------|---------------|---------|
| Required | **Category grid** | Contained grid | 3-6 collection cards. Let users self-select. |
| Required | **Product grid** | Contained grid | Best sellers or featured products with price + CTA. |

**Science:** 93% of consumers say reviews impact decisions. Show star ratings on product cards if available.

### Stage 3: DESIRE (Scroll 3-4 — story, aspiration, proof)

| Priority | Section type | Visual weight | Purpose |
|----------|-------------|---------------|---------|
| Required | **Lifestyle banner** | Full-bleed | Aspirational image + short tagline + CTA. |
| Required | **Brand story / Heritage** | Contained 2-col | Image + text. Builds emotional connection. |
| Recommended | **Featured collection** | Full-bleed | Highlight one collection with strong visual. |
| Required | **Trust badges** | Contained grid | 4-6 icons: shipping, returns, authenticity, secure checkout. |

**Science:** Trust signals near CTAs increase conversion by up to 32%. 86% of buying decisions influenced by visible ratings.

### Stage 4: ACTION (Bottom — convert or capture)

| Priority | Section type | Visual weight | Purpose |
|----------|-------------|---------------|---------|
| Recommended | **Editorial / Journal** | Contained cards | 3 article cards for SEO and authority. |
| Recommended | **Testimonials** | Contained quote | 1-3 customer quotes with attribution. |
| Required | **Newsletter signup** | Contained form | Single field + CTA. Capture non-buyers. |

**Science:** Newsletter at bottom captures engaged scrollers. Testimonials near CTAs boost conversion 12.5%.

---

## Phase 3: Build — Visual Rhythm Rules

### The Alternation Rule

**Never place two full-bleed sections adjacent.** Every full-bleed must be flanked by at least one contained section.

Pattern: `FULL → contained(1-3) → FULL → contained(1+) → FULL → contained(2+)`

### Section Weight Classification

| Weight | Characteristics | Examples |
|--------|----------------|----------|
| **Full-bleed** | Edge-to-edge image/video, overlay text, dark | Hero, Banner, Featured highlight |
| **Contained grid** | Max-width container, cards/columns, structured | Category grid, Products, Trust badges, Journal |
| **Contained strip** | Thin horizontal bar, minimal height | Stats bar, Divider quote |
| **Contained 2-col** | Max-width, image + text side by side | Heritage, Brand story |
| **Contained form** | Centered, single input | Newsletter signup |

### Ideal Order Template (11 sections)

```
1. Hero                    [FULL-BLEED]     ATTENTION
2. Credentials bar         [STRIP]          ATTENTION
3. Category grid           [CONTAINED]      INTEREST
4. Product grid            [CONTAINED]      INTEREST
5. Lifestyle banner        [FULL-BLEED]     DESIRE
6. Brand story / Heritage  [CONTAINED 2COL] DESIRE
7. Featured collection     [FULL-BLEED]     DESIRE
8. Trust badges            [CONTAINED]      DESIRE
9. Editorial / Journal     [CONTAINED]      ACTION
10. Testimonials           [CONTAINED]      ACTION
11. Newsletter signup      [CONTAINED]      ACTION
```

Full-bleed sections: #1, #5, #7 — evenly spaced, each flanked by contained.

### Fewer Sections Variant (8 sections)

If the store has limited content, use this minimum:

```
1. Hero                    [FULL-BLEED]     ATTENTION
2. Credentials bar         [STRIP]          ATTENTION
3. Product grid            [CONTAINED]      INTEREST
4. Lifestyle banner        [FULL-BLEED]     DESIRE
5. Brand story             [CONTAINED 2COL] DESIRE
6. Trust badges            [CONTAINED]      DESIRE
7. Testimonials            [CONTAINED]      ACTION
8. Newsletter signup       [CONTAINED]      ACTION
```

### More Sections Variant (14 sections)

For stores with rich content:

```
1. Hero                    [FULL-BLEED]     ATTENTION
2. Credentials bar         [STRIP]          ATTENTION
3. Category grid           [CONTAINED]      INTEREST
4. Best sellers            [CONTAINED]      INTEREST
5. Lifestyle banner        [FULL-BLEED]     DESIRE
6. Brand story / Heritage  [CONTAINED 2COL] DESIRE
7. Featured collection     [FULL-BLEED]     DESIRE
8. New arrivals            [CONTAINED]      INTEREST/DESIRE
9. Trust badges            [CONTAINED]      DESIRE
10. Editorial / Journal    [CONTAINED]      ACTION
11. Video / Craftsmanship  [FULL-BLEED]     DESIRE
12. FAQ / Values           [CONTAINED]      ACTION
13. Testimonials           [CONTAINED]      ACTION
14. Newsletter signup      [CONTAINED]      ACTION
```

---

## Phase 4: Verify (MCP Browser)

After building, use MCP browser to:

1. **Navigate** to the homepage URL
2. **Screenshot** above the fold — confirm Hero + Credentials bar visible
3. **Scroll section by section** — screenshot each transition
4. **Check visual rhythm** — no two full-bleed adjacent
5. **Check readability** — text contrast, CTA visibility
6. **Check mobile** (if possible) — responsive layout

Only mark complete when all transitions look correct.

---

## Implementation Checklist

When adding/reordering sections in this CMS:

1. **Data file** (`data/index_en.json`): Add/remove/reorder section objects
2. **Page template** (`page/index.astro`): Import component, add render condition
3. **Component** (`components/SectionName.astro`): Create if missing
4. **No core edits**: All changes in `src/websites/{SiteName}/themes/{theme}/`

### Component Creation Checklist

Each new section component must have:
- [ ] Props interface with sensible defaults
- [ ] `--dw-*` or theme CSS variables (not hardcoded colors)
- [ ] `font-display` / `font-body` utility classes
- [ ] `loading="lazy"` and `decoding="async"` on images
- [ ] `aria-label` on sections
- [ ] Responsive grid (mobile → tablet → desktop)
- [ ] Focus-visible styles on interactive elements

---

## Additional Resources

- For detailed research data and statistics, see [research.md](research.md)
- For section component examples, see [examples.md](examples.md)
