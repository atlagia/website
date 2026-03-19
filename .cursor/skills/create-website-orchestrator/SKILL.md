---
name: create-website-orchestrator
description: Orchestrates website creation by delegating each phase to specialist subagents. Use when the user provides a website brief and wants the create-website process run with subagents, or says "create website with subagents" / "create site orchestrated". Runs Phase 0 in main agent, then launches create-website-scaffold, create-website-theme, create-website-components, create-website-audit, create-website-styles, product-page-visibility, create-website-verify, and finally homepage-graphics (style-matched images) in sequence, passing context between them.
---

# Create Website — Orchestrator (Subagent-Based)

This skill runs the same workflow as [create-website](../create-website/SKILL.md), but **each phase is handled by a specialist subagent**. You (the main agent) parse the brief, then delegate phases in order and pass context so the next subagent can continue.

**Reference:** For full phase details, rules, and checklists, read `.cursor/skills/create-website/SKILL.md`. This orchestrator only defines *who* does *what* and *how* to hand off.

---

## Phase 0 — You Do This (Main Agent)

1. **Parse the brief** exactly as in create-website Phase 0:
   - Store name (PascalCase), theme name (kebab-case), design direction, palette, typography, homepage sections (ordered), nav items, tagline.
   - Apply AIDA + visual rhythm from [premium-homepage](../premium-homepage/SKILL.md); validate section order.
   - Find closest niche reference from [create-website examples.md](../create-website/examples.md) and note: **referenceStore**, **referenceTheme** (e.g. DesignerWatch, luxury-watches).
2. **Build context payload** for subagents (use this exact shape in every delegation):

```json
{
  "storeName": "<StoreName>",
  "themeName": "<theme-name>",
  "port": "<PORT>",
  "storenameLower": "<storename>",
  "referenceStore": "<ReferenceStore or Abstract>",
  "referenceTheme": "<ref-theme or base>",
  "palette": { "prefix": "<prefix>", "colors": "…" },
  "fonts": { "display": "…", "body": "…" },
  "sections": [ { "type": "…", "…" } ],
  "siteTitle": "…",
  "siteDescription": "…",
  "navItems": [ … ]
}
```

3. Create a **todo list** for: Phase 0 (done), Scaffold, Theme, Components, Audit, Styles, Product page visibility, Verify, Homepage graphics.

---

## Subagent Sequence

Run subagents **one after another** (foreground). Wait for each to finish and capture its summary before starting the next. Pass the **context payload** (updated with any new info from the previous subagent) in every prompt.

| Order | Subagent name | Phase(s) | What to pass |
|-------|----------------|---------|--------------|
| 1 | **create-website-scaffold** | Phase 1 | Context payload. Output: scaffold done, path to theme, dev server confirmed. |
| 2 | **create-website-theme** | Phase 2 + 3 | Context payload + "scaffold done at src/websites/<StoreName>/themes/<themeName>/". Output: theme.mjs, theme.json, consts.ts, BaseHead done; fonts + CSS vars applied. |
| 3 | **create-website-components** | Phase 4 + 5 + 6 | Context payload + "theme and BaseHead done". Output: all components created, page/index.astro wired, data/index_en.json populated; full homepage renders. |
| 4 | **create-website-audit** | Phase 6.5 | Context payload + "homepage renders". Output: AIDA + rhythm audit done, index_en.json reordered if needed, gate passed. |
| 5 | **create-website-styles** | Phase 7 | Context payload + "audit passed". Output: layout, Header, products, components, collections style files overridden with site vars; dark theme + header + cart + related cards complete. |
| 6 | **product-page-visibility** | — | Context payload + "styles done". Product page URL: `http://localhost:<port>/en/products` (subagent opens any product from listing). Output: all elements visible (header, title, variants, price, components, related); fixes applied if needed. |
| 7 | **create-website-verify** | Phase 8 | Context payload + "styles done" + product-page-visibility summary. Output: final MCP verification done; / and /en, scroll, product page and slide cart checked. |
| 8 | **homepage-graphics** | [homepage-graphics](../homepage-graphics/SKILL.md) | Context payload + "verify passed". Run the full homepage-graphics workflow so the new site gets **style-matched homepage images**: graphics-mapper → graphics-prompt-planner → graphics-generator → graphics-replacer. Output: imageSlots mapped, plannedPrompts, generatedPaths (CDN URLs), index_en.json updated, MCP verification. **Prerequisite:** Chrome with remote debugging (e.g. `--remote-debugging-port=9222`) for image generation; if CDP unavailable, report and skip generator or defer to user. |

**How to invoke:** Use the Task tool (mcp_task) with `subagent_type` set to the subagent name (e.g. `create-website-scaffold`) and `prompt` containing:
- The context payload (as JSON or clear key-value).
- For create-website-* subagents: "Full instructions: follow .cursor/skills/create-website/SKILL.md for Phase(s) X."
- For **product-page-visibility**: "Follow .cursor/agents/product-page-visibility.md. Product page URL: http://localhost:<port>/en/products — navigate there, open any product, then run the strict flow (Header → Title → Variants → Price → Components → Related); fix any visibility issue; MCP verify each step. Use theme prefix from context (e.g. --<prefix>-*)."
- For **homepage-graphics**: Use `subagent_type: generalPurpose` (or `homepage-graphics` if available). Prompt: "Run the full homepage-graphics workflow per .cursor/skills/homepage-graphics/SKILL.md for the website just created. From context use storeName, themeName, port, storenameLower; build the graphics context payload (themePath, indexEnPath, homepageUrl, graphicsProjectName, r2ObjectKeyPrefix). Then run in order: graphics-mapper (context) → graphics-prompt-planner (context + imageSlots + styleContext) → graphics-generator (context + plannedPrompts) → graphics-replacer (context + generatedPaths). Prompts must produce images with **no embedded text** (titles/CTAs are in the UI). If Chrome CDP is not available for generation, report and return what was completed (e.g. map + plan only). Return summary and list of CDN URLs written to index_en.json."
- "Return a short summary: what you did, paths touched, and any output the next subagent needs."

---

## Orchestration Rules

1. **You never do Phases 1–8 yourself.** You only run Phase 0 and delegate 1→2→3→4→5→6→7→8 (including product-page-visibility, verify, then homepage-graphics).
2. **One subagent at a time.** Wait for the previous subagent’s result before launching the next. If a subagent reports failure or missing info, fix or supply the info and re-run that subagent before continuing.
3. **Update context between steps.** If a subagent returns e.g. "theme path is …" or "used port 7010", add that to the context you pass to the next subagent.
4. **After create-website-verify succeeds**, launch **homepage-graphics** so the new site gets homepage images that match the created theme (colors, typography, mood). Then tell the user the site is ready with style-matched graphics and suggest running the full [website-audit](../website-audit/SKILL.md) for collections, product pages, and pillar pages.
5. **Critical rules** from create-website still apply: `PUBLIC_SITE_NAME` must match folder name; no core file edits; all work under `src/websites/<StoreName>/`; MCP verification is mandatory (each subagent does its own MCP steps).

---

## Prompt Template for Each Subagent

Use this pattern when calling the Task tool. Replace `{SUBAGENT}`, `{PHASES}`, and `{CONTEXT}`.

```
Context for this task (from orchestrator):
{CONTEXT}

Instructions:
1. Read .cursor/skills/create-website/SKILL.md and execute only Phase(s) {PHASES}.
2. All work must be under src/websites/<StoreName>/ (from context). Do not modify core files.
3. Run any MCP browser verification required for your phase(s).
4. Return a concise summary: what you did, files/paths changed, and any info the next subagent needs (e.g. "dev server running on port 7010", "BaseHead uses --xyz prefix").
```

---

## Checklist (Orchestrator)

- [ ] Phase 0: Parse brief, AIDA/rhythm, niche reference, build context payload, create todo.
- [ ] Launch create-website-scaffold with context; wait; capture summary.
- [ ] Launch create-website-theme with context + scaffold summary; wait; capture summary.
- [ ] Launch create-website-components with context + theme summary; wait; capture summary.
- [ ] Launch create-website-audit with context + components summary; wait; capture summary.
- [ ] Launch create-website-styles with context + audit summary; wait; capture summary.
- [ ] Launch **product-page-visibility** with context + "styles done" + product page URL `http://localhost:<port>/en/products` (subagent opens any product and runs full visibility flow); wait; capture summary.
- [ ] Launch create-website-verify with context + styles summary + product-page-visibility summary; wait; capture summary.
- [ ] If verify passed: launch **homepage-graphics** with context + "verify passed" so homepage images match the created site style (mapper → planner → generator → replacer); wait; capture summary and CDN URLs.
- [ ] Tell user site is ready (with style-matched homepage graphics); suggest website-audit. If any subagent failed: report and stop or retry that subagent.
