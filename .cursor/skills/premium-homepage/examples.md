# Homepage Section Examples

## Example 1: Luxury Watch Store (DesignerWatch)

### Final Section Order (11 sections)

```json
[
  { "type": "welcomeSection",     "weight": "full-bleed",    "funnel": "ATTENTION" },
  { "type": "statsBar",           "weight": "strip",         "funnel": "ATTENTION" },
  { "type": "categoryGrid",       "weight": "contained",     "funnel": "INTEREST" },
  { "type": "bestSellers",        "weight": "contained",     "funnel": "INTEREST" },
  { "type": "bannerSection",      "weight": "full-bleed",    "funnel": "DESIRE" },
  { "type": "heritageBlock",      "weight": "contained-2col","funnel": "DESIRE" },
  { "type": "featuredHighlight",  "weight": "full-bleed",    "funnel": "DESIRE" },
  { "type": "trustBadges",        "weight": "contained",     "funnel": "DESIRE" },
  { "type": "featuredPosts",      "weight": "contained",     "funnel": "ACTION" },
  { "type": "testimonialSlider",  "weight": "contained",     "funnel": "ACTION" },
  { "type": "emailSignupSection", "weight": "contained",     "funnel": "ACTION" }
]
```

### Visual Rhythm Map

```
FULL → strip → contained → contained → FULL → 2col → FULL → contained → contained → contained → contained
  ✓       ✓         ✓           ✓        ✓      ✓       ✓        ✓           ✓           ✓           ✓
```

No two full-bleed adjacent. Each full-bleed flanked by contained.

### Why This Order Works

1. **Hero** grabs attention with video — answers "what is this?" in < 5s
2. **Stats bar** builds instant credibility — thin strip doesn't slow the scroll
3. **Category grid** lets users self-select — browse by interest
4. **Best sellers** shows real products with prices — interest becomes intent
5. **Banner** is an aspirational break — pauses the "shopping" mode
6. **Heritage** tells the brand story — builds emotional connection
7. **Featured collection** re-engages with a specific CTA — "View collection"
8. **Trust badges** reinforces security and quality before lower funnel
9. **Journal** provides content depth and SEO value
10. **Testimonial** is social proof just before the final ask
11. **Newsletter** captures engaged visitors who didn't buy

---

## Example 2: Fashion / Apparel Store (Minimal)

### Section Order (8 sections)

```json
[
  { "type": "hero",           "weight": "full-bleed",     "funnel": "ATTENTION" },
  { "type": "statsBar",       "weight": "strip",          "funnel": "ATTENTION" },
  { "type": "productGrid",    "weight": "contained",      "funnel": "INTEREST" },
  { "type": "banner",         "weight": "full-bleed",     "funnel": "DESIRE" },
  { "type": "aboutBlock",     "weight": "contained-2col", "funnel": "DESIRE" },
  { "type": "trustBadges",    "weight": "contained",      "funnel": "DESIRE" },
  { "type": "testimonials",   "weight": "contained",      "funnel": "ACTION" },
  { "type": "newsletter",     "weight": "contained",      "funnel": "ACTION" }
]
```

---

## Example 3: Rich Content Store (14 sections)

### Section Order

```json
[
  { "type": "hero",               "weight": "full-bleed",     "funnel": "ATTENTION" },
  { "type": "statsBar",           "weight": "strip",          "funnel": "ATTENTION" },
  { "type": "categoryGrid",       "weight": "contained",      "funnel": "INTEREST" },
  { "type": "bestSellers",        "weight": "contained",      "funnel": "INTEREST" },
  { "type": "banner",             "weight": "full-bleed",     "funnel": "DESIRE" },
  { "type": "heritageBlock",      "weight": "contained-2col", "funnel": "DESIRE" },
  { "type": "featuredHighlight",  "weight": "full-bleed",     "funnel": "DESIRE" },
  { "type": "newArrivals",        "weight": "contained",      "funnel": "INTEREST" },
  { "type": "trustBadges",        "weight": "contained",      "funnel": "DESIRE" },
  { "type": "journal",            "weight": "contained",      "funnel": "ACTION" },
  { "type": "videoBlock",         "weight": "full-bleed",     "funnel": "DESIRE" },
  { "type": "faq",                "weight": "contained",      "funnel": "ACTION" },
  { "type": "testimonials",       "weight": "contained",      "funnel": "ACTION" },
  { "type": "newsletter",         "weight": "contained",      "funnel": "ACTION" }
]
```

---

## Anti-Patterns (What NOT to Do)

### Back-to-Back Full-Bleed
```
BAD:  banner [FULL] → featuredHighlight [FULL]
GOOD: banner [FULL] → heritage [CONTAINED] → featuredHighlight [FULL]
```

### Duplicate Intent
```
BAD:  bestSellers + newArrivals + productShowcase (3 product grids)
GOOD: bestSellers + (banner break) + newArrivals (max 2, separated)
```

### Trust Too Late
```
BAD:  ... testimonials → trustBadges → newsletter
GOOD: ... trustBadges → journal → testimonials → newsletter
```
Trust badges should come before testimonials — badges are factual, testimonials are emotional. Facts first.

### No Story Section
```
BAD:  hero → products → products → trust → newsletter
GOOD: hero → products → banner → story → trust → newsletter
```
Brand story builds desire. Without it, the page feels like a catalog, not a brand.
