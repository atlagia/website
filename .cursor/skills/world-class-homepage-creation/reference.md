# Design Intelligence — Reference (Latest Science & Standards)

Elite design knowledge, research-backed principles, and 2024–2026 technical standards applied by subagents. Sources: Lindgaard et al., W3C WCAG 2.2, HTTP Archive, Monotype 2025, conversion research.

---

## First Impression Science

- **50ms window** — Users form lasting visual appeal judgments in 50 milliseconds (Lindgaard et al., Carleton University). First impressions correlate with extended viewing.
- **2.5–15 seconds** — Extended first impression; speed and interaction design continue shaping trust.
- **75% credibility** — Stanford Web Credibility: aesthetic appeal drives perceived trust before content is read.
- **Above the fold** — 57%+ viewing time; hero + credentials bar must answer "What's in it for me?" immediately.
- **F-pattern / Z-pattern** — Users scan along predictable paths; place primary CTA where attention naturally lands.

---

## Visual Hierarchy & Cognitive Load

- **System 1 vs. System 2** — Fast automatic attention vs. slow logical processing; what the eye lands on first gets priority.
- **Attentional blink** — Brain processes limited stimuli per second; hierarchy filters focus and prevents overload.
- **3–5 hierarchy levels** — Limit emphasis; avoid everything competing for attention.
- **Gestalt** — Proximity, similarity, continuity; brains group elements before conscious awareness.
- **Poor hierarchy** — Depletes cognitive resources, increases errors, reduces conversion.

---

## Accessibility Standards (Mandatory)

- **WCAG 2.2** — W3C Recommendation (Dec 2024). Use WCAG 2.2 for maximum applicability.
- **Contrast** — 4.5:1 normal text, 3:1 large text (AA). AAA: 7:1.
- **Focus Not Obscured** — WCAG 2.2 AA: keyboard-focused items must be at least partially visible.
- **Focus Appearance** — AAA: focus indicators ≥3:1 contrast, sufficient size.
- **Colorblind** — 350M+ affected; avoid red/green, blue/purple, green/brown. Use patterns/icons with color.
- **prefers-reduced-motion** — Respect user preference; provide static fallback.
- **EU Accessibility Act 2025** — WCAG 2.1 AA required for commercial digital products in EU.

---

## Color Theory & Tokens

- **Token architecture** — Primitive → semantic → component tokens. Never hardcode HEX in components.
- **60-30-10 rule** — Dominant (60–70%), secondary (30%), accent (10%).
- **Avoid** — Pure black (#000) backgrounds; use deep charcoal. Purple-on-white clichés.
- **2025 palettes** — Organic minimalism (sage, earth tones), digital lavender, modern luxury (rose gold, burgundy), warm neutrals.
- **Color psychology** — Blue: trust; Red: urgency/CTAs; Green: growth; Purple: luxury; Orange: warmth.

---

## Typography (2025 Standards)

- **Fluid typography** — Use CSS `clamp()` instead of static breakpoints.
- **Variable fonts** — Single file for weight/width/style; better Core Web Vitals.
- **Base size** — 16–18px minimum body; 14px deprecated.
- **Display** — 48–72px hero; bold, expressive, personality-driven.
- **Type scale** — Modular scale (1.25, 1.333, 1.5) not random sizes.
- **Weight contrast** — Extremes (100–200 vs. 700–900), not 400 vs. 600.
- **Never use** — Inter, Roboto, Open Sans, Lato, Arial, Space Grotesk.
- **Serif renaissance** — Serif + sans pairing for editorial/luxury.
- **Dark mode** — Slightly heavier weight, softer whites for readability.

---

## Motion & Microinteractions

- **Microinteractions** — 120–200ms; 10–15% conversion uplift (2025 research).
- **Transitions** — 240–400ms for UI state changes.
- **Hero animations** — Up to 700ms; one strong moment over many small ones.
- **Purpose** — Real-time feedback, reduce perceived wait, guide attention.
- **Respect** — `prefers-reduced-motion: reduce` → static fallback.
- **Tools** — CSS transitions, Framer Motion, Lottie; avoid heavy WebGL on critical path.

---

## Performance & Core Web Vitals (2025)

- **LCP** — ≤2.5s. Preload hero image, use WebP/AVIF, `loading="eager"` above fold.
- **INP** — ≤200ms (replaced FID Mar 2024). Break up long tasks, optimize handlers.
- **CLS** — <0.1. Explicit `width`/`height`, `aspect-ratio`, reserve space for dynamic content.
- **Impact** — Good CWV: ~18% conversion lift, 32% engagement, 15% SEO improvement.

---

## Design Systems & Tokens

- **Primitive** — Raw values (e.g. `color-blue-500: #3B82F6`).
- **Semantic** — Purpose (e.g. `color-text-primary`, `color-bg-surface`).
- **Component** — Context-specific (`button-bg`, `card-border`).
- **Naming** — `category-property-variant-state`; avoid vague "blue" or "big-spacing".

---

## Conversion Science (Ecommerce)

- **Benchmarks** — Average 1.8–3%; top 10% >4.7%.
- **Above-fold infographics** — +6% conversion.
- **Sticky add-to-cart** — +5% CVR.
- **Personalization** — Up to 300% uplift when applied well.
- **Trust signals** — Testimonials, security badges near CTAs; +32% conversion potential.
- **Friction** — Unclear shipping, pricing hesitation, sizing confusion drive abandonment.

---

## Luxury & Premium Aesthetics

- **Quiet luxury** — Minimalism, restraint, precision over excess.
- **Typography** — Custom/editorial type (Didot, Bodoni); large-scale headlines.
- **Layout** — Asymmetric grids, editorial thinking, deliberate white space.
- **Imagery** — Cinematic, high-res; every visual serves the narrative.
- **Motion** — Subtle, almost invisible; loading as brand moment.
- **Impact** — +60% engagement, +40% time on site; 70% say site influences brand perception.

---

## Layout Architecture

- **Hero** — Full-bleed, single CTA, strong focal point.
- **Rhythm** — Never two full-bleed adjacent; FULL → contained(1–3) → FULL.
- **Containers** — Max-width 1200–1440px; 24–48px padding.
- **Cards** — 8–16px radius, subtle shadow, hover lift (scale 1.02, 150–200ms).
- **Mobile-first** — 60%+ traffic; large tap targets, fast load.

---

## Sources

- Lindgaard et al., "Attention web designers: 50 milliseconds"
- W3C WCAG 2.2, WAI
- HTTP Archive Web Almanac 2025 (Fonts)
- Monotype 2025 Type Trends
- Stanford Web Credibility Project
- Interaction Design Foundation, NetBramha, Spectta, Shopify CRO research
