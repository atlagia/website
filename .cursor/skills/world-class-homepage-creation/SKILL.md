---
name: world-class-homepage-creation
description: Plans, designs, and produces world-class homepages using elite design intelligence, AIDA architecture, premium aesthetics, and subagent orchestration. Applies 2024-2026 research (50ms first impression, WCAG 2.2, Core Web Vitals, conversion science). Only plans and replaces graphics that do not match the homepage or that are inconsistent with other images in the same category. Use when the user asks for "world-class homepage", "premium homepage design", "artistic homepage", or "studio-level homepage".
---

# World-Class Homepage Creation (v2026)

Orchestrates a full workflow from design intelligence to a premium, conversion-focused homepage with perfect visual harmony. Based on latest UI/UX research, WCAG 2.2, Core Web Vitals 2025, and conversion science. **Subagents handle each phase**; the main agent runs Phase 0 and delegates in sequence.

**Prerequisites:** [world-class-homepage-builder](../world-class-homepage-builder/SKILL.md), [frontend-design-anthropics](../frontend-design-anthropics/SKILL.md), [homepage-graphics](../homepage-graphics/SKILL.md). Dev server for target site must be running.

---

## Phase 0 — Main Agent

1. **Get target** — `storeName`, `themeName`, `port`, `themePath`, `indexEnPath`, `homepageUrl`.
2. **Build context payload** (same shape as homepage-graphics + create-website):

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

3. **Create todo** for: Phase 0 (done), Design Intelligence, Architecture, Build/Styles, Graphics, Design Verification.

---

## Design Intelligence (Subagents Apply)

Reference: [reference.md](reference.md) for full science and citations. Summary:

### First Impression & Hierarchy

- **50ms** — Users judge visual appeal instantly (Lindgaard). Hero + credentials must deliver value in 2.5 seconds.
- **F/Z pattern** — Place primary CTA where scan path lands.
- **3–5 hierarchy levels** — Avoid cognitive overload; one focus per section.

### Typography (2025)

- **Fluid type** — CSS `clamp()` for responsive scaling.
- **Variable fonts** — Preferred for performance and flexibility.
- **Base 16–18px** — Minimum body; display 48–72px for hero.
- **Never:** Inter, Roboto, Open Sans, Lato, Arial, Space Grotesk.
- **Prefer:** Characterful display + refined body; serif renaissance for luxury.

### Color & Tokens

- **Token architecture** — Primitive → semantic → component.
- **60-30-10** — Dominant, secondary, accent.
- **WCAG 2.2** — 4.5:1 normal text, 3:1 large; test colorblind combos.
- **Avoid** — Pure black backgrounds; purple-on-white clichés.

### Motion & Performance

- **Microinteractions** — 120–200ms; +10–15% conversion.
- **Transitions** — 240–400ms; hero up to 700ms.
- **Respect** — `prefers-reduced-motion`.
- **Core Web Vitals** — LCP ≤2.5s, INP ≤200ms, CLS <0.1.

### Visual Elements

- **Cinematic hero** — Strong focal point, aspirational imagery.
- **Dynamic gradients** — Depth; avoid flat fills.
- **Luxury** — Quiet luxury; restraint, asymmetric grids, editorial whitespace.
- **Mobile-first** — 60%+ traffic; large tap targets.

### Section Architecture (AIDA)

- **ATTENTION:** Hero (full-bleed) + credentials bar (strip).
- **INTEREST:** Category grid + product grid (contained).
- **DESIRE:** Lifestyle banner + brand story + featured collection + trust badges.
- **ACTION:** Editorial + testimonials + newsletter.
- **Rhythm:** Never two full-bleed adjacent; FULL → contained(1–3) → FULL.

---

## Subagent Sequence

Run **one at a time**; pass full context + prior outputs.

| Order | Subagent | Responsibility | Input | Output |
|-------|----------|----------------|-------|--------|
| 1 | **create-website-audit** | AIDA + rhythm audit; reorder sections | Context + homepageUrl | Section order, gap report |
| 2 | **create-website-styles** | Premium styles; token-based; CWV-conscious | Context + audit | Style overrides done |
| 3 | **graphics-mapper** | Map slots; capture style; MCP screenshot; **identify mismatched slots** | Context | imageSlots, styleContext, slotsToReplace |
| 4 | **graphics-prompt-planner** | **Only for slotsToReplace:** style-matched prompts; no text in image | Context + mapper | plannedPrompts |
| 5 | **graphics-generator** | Generate one-by-one; choose best; R2 CDN | Context + plannedPrompts | generatedPaths |
| 6 | **graphics-replacer** | Update index_en.json; MCP verify | Context + generatedPaths | Summary + verification |
| 7 | **create-website-verify** | Final MCP; /, /en, scroll, product, cart | Context + replacer | Pass/fail, notes |

**Graphics scope rule:** Only plan and replace graphics that (1) **do not match the homepage** (theme, palette, mood), or (2) **do not match other images in the same category** (e.g. one category card that looks out of style vs. the rest). Mapper must output **slotsToReplace** (subset of imageSlots); planner and generator run only for those slots.

**Design Verification (after graphics-replacer):**  
- Compare visuals to theme (color, mood, composition).
- If mismatch: re-plan → regenerate → replace for that slot.
- MCP cursor-ide-browser for screenshots; user-cdp-browser for generation.

---

## When Creating a New Site

Use **create-website-orchestrator** first. Then run this sequence from create-website-audit onward. Full flow includes homepage-graphics and Design Verification.

---

## Graphic Mismatch Detection

**Only plan and replace when:**

1. **Does not match the homepage** — Color conflicts with site palette; style differs (e.g. corporate stock vs. cinematic/luxury); composition generic; imagery contradicts brand or mood.
2. **Does not match others in the same category** — One image in a group (e.g. categoryGrid, popularCategories, giftIdeas) looks inconsistent with the rest (different lighting, style, or tone). Replace the outlier so the category is visually coherent.

**Do not replace** graphics that already match the theme and are consistent with their section. Mapper outputs **slotsToReplace**; planner and generator run only for those slots.

**Fix:** Re-plan with strict style constraints; regenerate; replace; re-verify.

---

## MCP Usage

| Step | Server | Tools |
|------|--------|-------|
| Screenshot, verify | **cursor-ide-browser** | browser_navigate, browser_take_screenshot, browser_snapshot |
| Generate images | **user-cdp-browser** | create_nano_banana_pro_photos (Chrome CDP) |

---

## Orchestration Rules

1. One subagent at a time; wait for output.
2. Pass full context + prior outputs.
3. **Graphics:** Only plan and replace slots that mismatch the homepage or are inconsistent within their category; mapper must output slotsToReplace; planner/generator use that subset only.
4. Design Verification mandatory after graphics-replacer.
5. Final deliverable: premium, harmonious, no off-theme graphics.

---

## Checklist (Orchestrator)

- [ ] Phase 0: Get target, build context, create todo.
- [ ] create-website-audit → capture section order.
- [ ] create-website-styles → capture summary.
- [ ] graphics-mapper → imageSlots, styleContext, **slotsToReplace** (only mismatched or category-inconsistent).
- [ ] graphics-prompt-planner → plannedPrompts **for slotsToReplace only**.
- [ ] graphics-generator → generatedPaths.
- [ ] graphics-replacer → summary.
- [ ] Design Verification: detect mismatches; re-plan/regenerate/replace.
- [ ] create-website-verify → pass/fail.
- [ ] Report: homepage ready, CDN URLs, fixes applied.

---

## Additional Resources

- **Full design science:** [reference.md](reference.md)
- **Design principles:** [frontend-design-anthropics](../frontend-design-anthropics/SKILL.md)
- **Section taxonomy:** [world-class-homepage-builder](../world-class-homepage-builder/SKILL.md)
- **Graphics workflow:** [homepage-graphics](../homepage-graphics/SKILL.md)
