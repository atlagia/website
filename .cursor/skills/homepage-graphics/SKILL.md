---
name: homepage-graphics
description: Creates and replaces homepage images for an ATLAGIA website. Maps all image fields from index_en.json, captures style from the live site (MCP cursor-ide-browser), plans prompts per slot, generates images via MCP user-cdp-browser (Google Flow), then updates data with new image paths. Use when the user says "create graphics for website", "generate homepage images", "replace homepage images with AI", or "create images for [store name]".
---

# Homepage Graphics — Skill (Orchestrator + Subagents)

This skill generates new images for a website's homepage and replaces existing image URLs in `index_en.json`. It uses **cursor-ide-browser** MCP for screenshots and style capture, and **user-cdp-browser** MCP for image generation (Google Flow → 2 images per prompt, save to `/Users/mac/Desktop/MCP/graphics/<project_name>/`). Generated images are copied into the project and referenced in data.

**When to use:** User wants to create or replace homepage images for a target website (e.g. MotorRacingApparel, FastIPTV). Dev server for that site should be running.

---

## Phase 0 — You Do This (Main Agent)

1. **Get target website**
   - From user or context: `storeName` (e.g. MotorRacingApparel), `themeName` (e.g. motorsport-apparel), `port` (e.g. 7005).
   - Theme path: `src/websites/<storeName>/themes/<themeName>/`.
   - Data file: `src/websites/<storeName>/themes/<themeName>/data/index_en.json`.

2. **Ensure dev server**
   - Confirm user has run `npm run dev <storename> -- --port <port>` (or start it and note port).

3. **Build context payload** for subagents:

```json
{
  "storeName": "<StoreName>",
  "themeName": "<theme-name>",
  "port": "<PORT>",
  "storenameLower": "<storename>",
  "themePath": "src/websites/<StoreName>/themes/<themeName>/",
  "indexEnPath": "src/websites/<StoreName>/themes/<themeName>/data/index_en.json",
  "homepageUrl": "http://localhost:<PORT>/en",
  "graphicsProjectName": "<storename>-homepage-graphics",
  "r2ObjectKeyPrefix": "generated/<StoreName>/<themeName>"
}
```

4. **Create a todo list** for: Phase 0 (done), Map, Plan, Generate, Replace.

---

## Subagent Sequence

Run subagents **one after another**. Wait for each to finish and pass its output to the next.

| Order | Subagent | What it does | What to pass | What it returns |
|-------|----------|--------------|--------------|-----------------|
| 1 | **graphics-mapper** | Read index_en.json and list all image slots; MCP navigate + full-page screenshots; read theme styles (BaseHead, layout.json, section components) | Context payload | `imageSlots`, `styleContext`, screenshot confirmation |
| 2 | **graphics-prompt-planner** | For each slot, plan a prompt (style-matched, aspect, subject); pass through currentValue | Context + imageSlots + styleContext | `plannedPrompts` (slotId, fieldPath, prompt, orientation, currentValue) |
| 3 | **graphics-generator** | For each planned prompt **one by one** (no parallel): CDP create_nano_banana_pro_photos → get 2 images → **choose the best** of the two → upload chosen to R2 CDN via script (use **different filename** for objectKey when slot’s currentValue is already cdn.atlagia) → publicUrl = CDN link | Context + plannedPrompts | `generatedPaths` (fieldPath, publicUrl) |
| 4 | **graphics-replacer** | Update index_en.json with new URLs; optionally other index_<lang>.json; MCP verify homepage | Context + generatedPaths | Summary + verification result |

**How to invoke:** Use the Task tool (`mcp_task`). If your environment supports custom subagent types, set `subagent_type` to `graphics-mapper`, `graphics-prompt-planner`, `graphics-generator`, or `graphics-replacer`. Otherwise use `subagent_type: generalPurpose` and in `prompt` assign the role explicitly, e.g.: "You are the graphics-mapper specialist. Read and follow .cursor/agents/graphics-mapper.md. Context payload: { ... }. Return imageSlots, styleContext, and screenshot confirmation." Put the full context payload and previous subagent output in each prompt.

---

## Image Field Taxonomy (index_en.json)

When mapping image slots, look for these patterns (recursive in `sections`):

| Section type / location | Image-like keys | Notes |
|-------------------------|-----------------|--------|
| `welcomeSection` | `heroImage` | Hero image |
| `welcomeSection.backgroundVideo` | `fallbackImage` | Fallback if video fails |
| `categoryGrid.categories[]` | `image` | Category card image |
| `manifestoSection` | `image` | Side image |
| `bannerSection` | `backgroundImage` | Full-bleed banner bg |
| `productShowcase.products[]` | `image` | Product card image (if static data) |
| `emailSignupSection` | `backgroundImage` | Newsletter section bg |
| Nested `items[]` with `image` or `src` | `image`, `src` | Per-site (e.g. testimonials.image) |

**Slot identifier:** Use a stable id per slot, e.g. `welcomeSection.heroImage`, `welcomeSection.backgroundVideo.fallbackImage`, `categoryGrid.categories.0.image`, `manifestoSection.image`, `bannerSection.backgroundImage`, `productShowcase.products.0.image`, etc. Skip sections that pull images from Shopify/blog (e.g. bestSellers) unless the data is static in JSON.

---

## Image generation rules (graphics-generator)

- **Sequential only:** Generate images **one by one**. Do not run multiple `create_nano_banana_pro_photos` calls in parallel. For each slot: generate → choose best → upload → then proceed to the next slot.
- **Choose the best of two:** After each CDP call you get 2 image paths. Evaluate both (composition, style match to prompt and site, clarity) and **select the best one**. Only that image is uploaded and used.
- **Upload to CDN:** Upload the chosen image to Cloudflare R2 using the project script so the link in data is the public CDN URL.

## Where generated images go (CDN)

- **CDP output:** `create_nano_banana_pro_photos` saves two files to `/Users/mac/Desktop/MCP/graphics/<project_name>/`.
- **Upload script:** `node scripts/upload-image-to-r2.mjs <localFilePath> <objectKey>`  
  - Object key example: `generated/MotorRacingApparel/motorsport-apparel/hero.png`  
  - Script reads R2 credentials from `.env` (or `ENV_FILE` if set): R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL. Add these to your `.env` (see `.env.example`). Run from project root so the script finds `.env`.
- **URL in index_en.json:** Use the **CDN public URL** returned by the script (e.g. `https://cdn.atlagia.com/generated/MotorRacingApparel/motorsport-apparel/hero.png`). This is the link that must be set in the JSON — not a local path.
- **Replacing existing CDN images:** If the slot’s **current image URL already points to CDN atlagia** (e.g. `https://cdn.atlagia.com/...`), the **graphics-generator** must use a **different file name** for the upload object key (e.g. `hero-v2.png`, or base name + short timestamp). That way the new image gets a new URL and does not overwrite the existing object; the replacer then writes the new CDN URL into index_en.json.

---

## MCP Usage Summary

| Step | MCP server | Tools |
|------|------------|--------|
| Screenshot homepage | **cursor-ide-browser** | `browser_navigate`, `browser_take_screenshot`, `browser_scroll` (full-page scroll + multiple screenshots) |
| Generate images | **user-cdp-browser** | `browser_connect` (first), then `create_nano_banana_pro_photos` (prompt, orientation, project_name) |
| Verify after replace | **cursor-ide-browser** | `browser_navigate`, `browser_take_screenshot` |

**CDP note:** Before the first `create_nano_banana_pro_photos` call, the generator (or main agent) must call `browser_connect` with `cdp_url: "http://localhost:9222"` (Chrome with remote debugging).

---

## Orchestration Rules

1. **One subagent at a time.** Wait for the previous result before starting the next.
2. **Pass full context** plus the previous subagent’s output into each task prompt.
3. **Do not run mapper/generator/replacer yourself** when using subagents; only Phase 0 and delegation.
4. **After graphics-replacer:** Tell the user that homepage images were updated; list CDN URLs. Suggest a full homepage audit if needed.

---

## Checklist (Orchestrator)

- [ ] Phase 0: Get storeName, themeName, port; build context payload; create todo.
- [ ] Launch **graphics-mapper** with context; wait; capture imageSlots + styleContext.
- [ ] Launch **graphics-prompt-planner** with context + mapper output; wait; capture plannedPrompts.
- [ ] Launch **graphics-generator** with context + plannedPrompts; wait; capture generatedPaths.
- [ ] Launch **graphics-replacer** with context + generatedPaths; wait; capture summary.
- [ ] Report done: list of replaced images (CDN URLs); suggest audit if needed.
