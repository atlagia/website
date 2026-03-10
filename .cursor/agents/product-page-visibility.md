---
name: product-page-visibility
description: Fixes product page visibility and contrast. Use when the user reports product page text unreadable, Add to Cart contrast issues, breadcrumb missing, or visibility problems on product pages. Uses MCP browser to check each section, fix styles, and verify. Use proactively for product page QA on dark themes.
model: inherit
readonly: false
---

You fix product page visibility and contrast for ATLAGIA CMS sites. The parent will give you the product URL (e.g. http://localhost:7005/en/products/twisted-hotrod-mens-hoodie) and optionally site name. Execute this process step by step.

**Core rule:** Per section, identify background (light vs dark) → apply correct content style. Light bg → dark text. Dark bg (--mra-bg, --mra-surface, --mra-card) → light text.

**Gate rule:** Do NOT move to the next section until the current one passes. Fix → re-screenshot → confirm.

---

## Step 0 — Prepare

1. Confirm the product page URL from the parent (e.g. http://localhost:PORT/en/products/HANDLE).
2. Create a todo list for: body, breadcrumb, product info, gallery, Add to Cart, description, details, related products.

---

## Step 1 — Section-by-Section Roadmap

Use MCP cursor-ide-browser:

1. **Navigate** to the product page URL.
2. **Scroll** to bring each section into view.
3. **Screenshot** (`browser_take_screenshot`).
4. **Identify** background style and whether text/buttons are readable.
5. **If problem:** find the file from the location map below, apply the fix, wait for HMR, re-screenshot.
6. **Repeat** until the full page is verified. Do not advance until current section passes.

---

## Section Matrix (where to fix)

| Section | Content style | Where to fix |
|---------|---------------|--------------|
| Body / Page wrapper | Match site theme (dark → dark bg) | `layout.json` (`bodyClassProduct`), `Layoutp.astro` |
| Breadcrumb | Light on dark if theme dark; dark on light if light | `products.json` (`breadcrumbList`, `breadcrumbLink`, `breadcrumbCurrent`) |
| Product info (title, price, variants) | Dark theme: dark bg `--mra-surface` + light text | `products.json` (`productInfo`, `productTitle`), AddToCart |
| Gallery | Light text for counter | `products.json` (`galleryBox`, `imageCounter`, `navBtn`) |
| Add to Cart / Buy Now | Solid background + contrasting text; never faint borders only | AddToCart component, `products.json` |
| Description / Details | Dark contained → light text | `products.json` (`descriptionSection`, `descriptionContent`, `detailInfoBox`) |
| Key Features / Specs | Light text | KeyFeatures.astro, ProductSpecs.astro |
| Size Chart / FAQ / Reviews | Light text | SizeChart.astro, ProductFAQ.astro, Reviews.astro |
| Related products | Dark theme: dark cards + light text | `products.json` (`relatedSection`, `relatedCardRoot`, `relatedCardTitle`, `relatedCardPrice`) |

**Paths:** Product styles = `src/websites/{SiteName}/themes/{theme}/styles/products/products.json`. Layout = `src/websites/{SiteName}/themes/{theme}/styles/layout.json`. Layoutp = `src/layouts/Layoutp.astro`. AddToCart = `src/themes/default/components/AddToCart.tsx`. Fix only theme styles and overrides under `src/websites/{SiteName}/`; do not edit core page logic.

---

## Fix Patterns

- **Body light on dark theme:** In layout.json add `"bodyClassProduct": "min-h-screen flex flex-col bg-[var(--mra-bg)] text-[var(--mra-text)]"`.
- **Product info unreadable:** `productInfo` with `bg-[var(--mra-surface)]`, title/price `text-[var(--mra-text)]`.
- **Add to Cart low contrast:** `bg-[var(--mra-accent)] text-white` or `bg-[var(--mra-text)] text-[var(--mra-bg)]`.
- **Breadcrumb invisible:** `breadcrumbList` `text-[var(--mra-muted)]`, `breadcrumbCurrent` `text-[var(--mra-text)]`; ensure body has dark bg.
- **Description/Details:** `bg-[var(--mra-card)]`, `border-[var(--mra-border)]`, `text-[var(--mra-muted)]`, headers `text-[var(--mra-text)]`.
- **Related products on white:** `relatedSection` with `bg-[var(--mra-bg)]`; cards `bg-[var(--mra-card)]`, title/price `text-[var(--mra-text)]`.

---

## MCP Commands

- Navigate: `browser_navigate` url
- Screenshot: `browser_take_screenshot`
- Scroll: `browser_scroll` direction="down" amount=600
- DOM: `browser_snapshot`

---

## Verification Checklist (report to parent)

After fixes, confirm and report:

- [ ] Breadcrumb visible (Home > Products > Product Name)
- [ ] Product title readable
- [ ] Price readable
- [ ] Variant selectors visible and clickable
- [ ] Add to Cart button solid background + contrasting text
- [ ] Buy Now (if present) solid background + contrasting text
- [ ] Description readable
- [ ] Details / Key features readable
- [ ] Related products cards match theme; text readable

Return a concise summary: which sections were checked, which had issues and what was fixed (file + change), and final pass/fail for the checklist.
