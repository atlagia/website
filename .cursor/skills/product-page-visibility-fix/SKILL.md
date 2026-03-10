---
name: product-page-visibility-fix
description: Corrects visibility and contrast on product pages. Identifies background style (light vs dark) per section, ensures text/button contrast, breadcrumb visibility, and theme consistency. Uses MCP browser to check section-by-section, screenshot, identify problems, find related components/styles, and fix them. Use when the user reports "product page text unreadable", "Add to Cart contrast", "breadcrumb missing", or "visibility problems on product page".
---

# Product Page Visibility Fix Skill

Run this skill when product pages have **poor text contrast**, **invisible breadcrumbs**, **low-contrast buttons**, or **theme inconsistencies**. The goal: ensure every product page section has readable content that matches its background.

**Core rule:** Identify the background style of each section → apply the correct content style.
- **Light background** (white, light gray) → **dark text**, dark or accent CTA buttons
- **Dark background** (theme dark: --mra-bg, --mra-surface, --mra-card) → **light text**, light or accent CTA buttons

**Gate rule:** Do NOT proceed to the next section until the current one passes. Fix → re-screenshot → confirm.

---

## Step 0 — Prepare

1. Site dev URL: `http://localhost:<PORT>/en/products/<any-handle>`
2. Dev server running
3. Create a todo list for each product page section

---

## Step 1 — Section-by-Section Roadmap

Use MCP (`cursor-ide-browser`):

1. **Navigate** to a product page (e.g. `http://localhost:<PORT>/en/products/twisted-hotrod-mens-hoodie`)
2. **Scroll** to bring each section into view
3. **Screenshot** (`browser_take_screenshot`)
4. **Identify** background style and content visibility
5. **If problem:** find the component/style file, fix it, wait for HMR, re-screenshot
6. **Repeat** until the full product page is verified

---

## Step 2 — Product Page Section Matrix (Background → Content Style)

| Section | Typical background | Content style | Where to fix |
|---------|--------------------|---------------|--------------|
| **Body / Page wrapper** | Theme-defined | Must match site theme (dark theme → dark bg) | `layout.json` (`bodyClassProduct`), `Layoutp.astro` |
| **Breadcrumb** | Inherits from body | **Light on dark** if theme dark; dark on light if theme light | `products.json` (`breadcrumbList`, `breadcrumbLink`, `breadcrumbCurrent`) |
| **Product info column** (title, price, variants) | Often light in defaults | If dark theme: use **dark bg** (`--mra-surface`) + light text. If light: dark text | `products.json` (`productInfo`, `productTitle`), AddToCart component |
| **Gallery** | Dark contained | Light text for counter; dark borders OK | `products.json` (`galleryBox`, `imageCounter`, `navBtn`) |
| **Add to Cart / Buy Now** | N/A (buttons) | **Solid background** + contrasting text. Dark theme: accent or dark btn + light text. Never faint borders only | AddToCart component, `products.json` |
| **Description / Details cards** | Dark contained | Light text | `products.json` (`descriptionSection`, `descriptionContent`, `detailInfoBox`) |
| **Key Features / Product Specs** | Dark contained | Light text | `KeyFeatures.astro`, `ProductSpecs.astro` |
| **Size Chart / FAQ / Reviews** | Dark contained | Light text | `SizeChart.astro`, `ProductFAQ.astro`, `Reviews.astro` |
| **Related products** | Dark or light | Must match theme. Dark theme: dark cards + light text | `products.json` (`relatedSection`, `relatedCardRoot`, `relatedCardTitle`, `relatedCardPrice`) |

---

## Step 3 — Fix Patterns

### Body / Page background (theme consistency)

- **Problem:** Product page has white/light background while site theme is dark
- **Fix:** In `src/websites/{SiteName}/themes/{theme}/styles/layout.json` add:
  ```json
  {
    "bodyClassProduct": "min-h-screen flex flex-col bg-[var(--mra-bg)] text-[var(--mra-text)]"
  }
  ```
- Or ensure Layoutp uses theme body class for product pages

### Product info column (title, price, Add to Cart)

- **Problem:** Title/price in light text on white background → unreadable
- **Fix:** Ensure `productInfo` has dark background when theme is dark: `bg-[var(--mra-surface)]` or wrap in dark container. Use `text-[var(--mra-text)]` for title, price
- **Problem:** Add to Cart has dark text on yellow → low contrast or theme mismatch
- **Fix:** Use `bg-[var(--mra-accent)] text-white` for primary CTA; or `bg-[var(--mra-text)] text-[var(--mra-bg)]` for dark theme consistency

### Breadcrumb

- **Problem:** Breadcrumb missing or invisible
- **Fix:** Ensure breadcrumb is rendered and uses theme vars: `text-[var(--mra-muted)]` for links, `text-[var(--mra-text)]` for current. On dark bg, these render light
- **Problem:** Breadcrumb on light background with light text
- **Fix:** Use dark text when breadcrumb sits on light bg

### Description / Details sections

- Use `bg-[var(--mra-card)]`, `border-[var(--mra-border)]`, `text-[var(--mra-muted)]` for content
- Headers: `text-[var(--mra-text)]`

### Related products

- Cards: `bg-[var(--mra-card)]`, `border-[var(--mra-border)]`
- Title/price: `text-[var(--mra-text)]`
- Ensure section background matches theme (dark)

---

## Step 4 — Component & Style Location Map

| Item | Path |
|------|------|
| Product page template | `src/pages/[lang]/products/[handle].astro` |
| Layout (body class) | `src/layouts/Layoutp.astro` |
| Product styles (theme) | `src/websites/{SiteName}/themes/{theme}/styles/products/products.json` |
| Layout styles | `src/websites/{SiteName}/themes/{theme}/styles/layout.json` |
| AddToCart | `src/themes/default/components/AddToCart.tsx` or theme override |
| ProductCard (related) | `src/themes/default/components/ProductCard.tsx` or theme override |

**Note:** Product page is core; visibility fixes go in **theme styles** (`products.json`, `layout.json`) or **theme component overrides**. Avoid editing core page logic when possible.

---

## Step 5 — Verification Checklist

For each product page section after fix:

- [ ] **Breadcrumb** visible (Home > Products > Product Name)
- [ ] **Product title** readable
- [ ] **Price** readable
- [ ] **Variant selectors** (color, size) visible and clickable
- [ ] **Add to Cart** button has solid background and contrasting text
- [ ] **Buy Now** button (if present) has solid background and contrasting text
- [ ] **Description** section readable
- [ ] **Details / Key features** readable
- [ ] **Related products** cards match theme; text readable

---

## MCP Commands

| Action | Command |
|--------|---------|
| Navigate | `browser_navigate` url |
| Screenshot | `browser_take_screenshot` |
| Scroll down | `browser_scroll` direction="down" amount=600 |
| DOM snapshot | `browser_snapshot` |

---

## Quick Reference — Common Fixes

1. **White product info on dark theme:** Add `productInfo` background in products.json: `"productInfo": "... bg-[var(--mra-surface)] rounded-xl p-6 ..."`
2. **Breadcrumb invisible:** Ensure `breadcrumbList` uses `text-[var(--mra-muted)]`, `breadcrumbCurrent` uses `text-[var(--mra-text)]`; body must have dark bg for these to show light
3. **Add to Cart yellow + dark text:** Override to `bg-[var(--mra-accent)] text-white` in AddToCart or product page styles
4. **Related products on white:** Add `relatedSection` wrapper with `bg-[var(--mra-bg)]` so cards and text match dark theme
