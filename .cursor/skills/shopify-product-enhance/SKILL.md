---
name: shopify-product-enhance
description: Enhances Shopify products: SEO title/description (Gemini), meta, WebP images, internal links, FAQ + schema. Uses scripts: shopify-gemini-enhance (Gemini API + key rotation), shopify-enhance-all (orchestration). Subagent runs the orchestration. Use when the user says "enhance Shopify products" or provides a target website.
---

# Shopify Product Enhancement

Enhance Shopify products: **Gemini** generates SEO title + description (H1, H2, internal links, FAQ, schema); scripts handle fetch, convert images, update.

## Prerequisites

- Target website (e.g. `globalgiftcards`)
- `.env.<target-website>` with `SHOPIFY_ACCESS_TOKEN`, `PUBLIC_SHOPIFY_SHOP`
- `npm install sharp`

## Two Modes

### 1. Direct Run (Scripts Only)

```bash
# With Gemini (AI-enhanced title + description)
npm run shopify-enhance-all -- globalgiftcards --use-gemini [--limit 10] [--site-name "Global Gift Cards"]

# Static (rule-based, no API)
npm run shopify-enhance-all -- globalgiftcards [--limit 10]
```

### 2. Via Subagent

Main agent launches subagent; subagent runs `shopify-enhance-all.mjs --use-gemini`.

## Scripts

### shopify-gemini-enhance.mjs

Uses **Gemini API** (gemini-2.0-flash) with **API key rotation**: random start, then sequential fallback (key 2 fail → try 3 → ... → wrap to 1). Output: JSON `{ title, metaTitle, metaDescription, descriptionHtml }`.

```bash
node scripts/shopify-gemini-enhance.mjs "<oldTitle>" --description-file path.txt [--tags "t1,t2"] [--site-name "Site"]
```

**Prompt enforces:** H1, H2 (Key Features, What You Get, Internal Links, FAQ), FAQ schema.

### shopify-enhance-all.mjs

Orchestrates: fetch products → for each: enhance (Gemini if `--use-gemini` else static) → convert images → update.

```bash
node scripts/shopify-enhance-all.mjs <target> [--limit N] [--use-gemini] [--site-name "Site"]
```

### shopify-fetch-products.mjs | shopify-convert-upload-product-image.mjs | shopify-update-product.mjs

Fetch products, convert images to WebP, update product via Admin API.

## STRICT Enhancement Rules (SEO Guidelines)

The subagent runs scripts; **Gemini prompt enforces** these. Follow strictly.

### Title
- **MAX 60 characters.** Professional, SEO-optimized. NOT long.
- Primary keyword first. No pipe chains. No keyword stuffing.

### Meta Title (Page Title)
- **MAX 60 characters** (Google limit). Exceeding causes truncation in search.
- Format: `{Primary Keyword} | {Site Name}`. Count characters.

### Meta Description
- **MAX 160 characters.** 150–160 ideal. Keyword, benefit, CTA.

### Description HTML – CRITICAL
- **NO broken links.** Use only safe paths: `/collections`, `/collections/all`, `/pages/contact`. Do NOT invent `/collections/xyz` or `/products/abc`.
- **NO images.** No `<img>`. No placeholder text like "A vibrant image showing..." or "Image of...". Text only.

### Image Alt
- `{enhancedTitle}, {tag1}, {tag2}` (comma-separated).

### Description Structure

1. **H1** – Main headline  
2. **Intro** – 1–2 paragraphs  
3. **H2** Key Features + bullets  
4. **H2** What You Get + list  
5. **H2** Explore – Links only to `/collections` or `/collections/all`; or omit  
6. **H2** FAQ – 3–6 Q&A  
7. **FAQ schema** – JSON-LD at bottom

## Subagent Workflow (Required)

The skill **must run via subagent**. Main agent does NOT run scripts.

### Invocation

Use `mcp_task` with `subagent_type: generalPurpose`. Prompt:

```
You are the shopify-product-enhance specialist. Follow .cursor/agents/shopify-product-enhance.md and .cursor/skills/shopify-product-enhance/SKILL.md.

Context: targetWebsite=globalgiftcards (or user-provided), limit=10 (optional), siteName=Global Gift Cards (optional).

Run:

node scripts/shopify-enhance-all.mjs globalgiftcards --use-gemini [--limit 10] [--site-name "Global Gift Cards"]

STRICT GUIDELINES (enforced by Gemini prompt):
- Title: max 60 chars, professional, SEO, not long
- Meta title: max 60 chars (Google limit)
- Meta description: max 160 chars
- Description: NO broken links, NO images

Report the script output (products processed, images converted, errors).
```

### Subagent Requirements

1. Read `.cursor/agents/shopify-product-enhance.md` and this skill.
2. Run `shopify-enhance-all.mjs --use-gemini` with correct `targetWebsite`, `limit`, `siteName`.
3. Return script output summary.

## Reference

- [Shopify Admin API productUpdate](https://shopify.dev/docs/api/admin-graphql/2024-10/mutations/productupdate)
- [optimize-and-upload-image-seo.mjs](../../scripts/optimize-and-upload-image-seo.mjs) for WebP + R2 upload pattern
