---
name: atlagia-ecommerce-frontend
description: Guides frontend work for ATLAGIA CMS e-commerce sites. Merges distinctive design (typography, color, motion), React/Vercel best practices, mandatory MCP verification after UI changes, e-commerce header pattern (bag + slide cart), and theme/style consistency (style JSON files and luxury.mjs per website). Use when building or updating website themes, headers, product/collection pages, or when adding a new website to the project.
---

# ATLAGIA E‑commerce Frontend

Apply this skill when working on website themes, UI components, product/collection pages, or when adding or updating a site in this project.

---

## 1. Design direction (distinctive, not generic)

- **Pick one bold aesthetic** per site: luxury, editorial, brutalist, etc. Execute it consistently.
- **Typography**: Never use Inter, Roboto, Open Sans, Lato, Arial. Use a distinctive display + body pair (e.g. Cormorant Garamond + DM Sans for luxury). State font choice before implementing.
- **Color**: Use CSS variables for the palette. Prefer dominant colors + sharp accents. No timid, evenly spread palettes.
- **Backgrounds**: Add atmosphere (gradients, subtle texture, grain) where it fits the direction.
- **Motion**: One strong moment (e.g. staggered load). Prefer CSS (transforms, opacity, animation-delay). Use Framer Motion in React when needed.
- **Layout**: Use asymmetry, overlap, or grid-breaking where it supports the concept.

---

## 2. React & Vercel

- **Components**: Function components + hooks; `React.memo()` where re-renders are frequent with same props.
- **State**: Keep it close to usage; lift only when siblings need it. Use `useCallback` for handlers to memoized children, `useMemo` for expensive derived values.
- **Data**: Prefer server data (Astro/SSR). Use client components only for interactivity.
- **A11y**: Semantic HTML, `aria-*` when needed, visible focus, stable list `key`, meaningful `alt` on images.
- **Vercel**: Env vars in dashboard/CLI; redirects/rewrites in `vercel.json` when used; Cache-Control for static/API where appropriate.

---

## 3. Mandatory MCP verification

**Strict:** After any change that affects the UI, verify with **cursor-ide-browser** before considering the task done.

1. **After edits** → `browser_navigate` to the relevant URL (e.g. `http://localhost:7005/en`, `http://localhost:7002/en`).
2. **Capture** → `browser_take_screenshot` or `browser_snapshot`.
3. **If wrong or broken** → Fix and repeat.

**Skip MCP only** when the task has no visible output (e.g. backend-only, config-only, docs).

---

## 4. E‑commerce header (bag + slide cart)

Website headers must behave like a **storefront header** (e.g. f1racingapparel):

- **Bag (cart) trigger**: Visible “Bag” (or “Cart”) control with optional item count.
- **Slide cart**: Cart opens as a **sidebar/drawer** from the right (slide-in), not a dropdown. Use the shared cart component so checkout and cart state stay consistent.

**Implementation:**

- Import `CartSidebarWithTrigger` from `@themes/default/components/CartSidebarWithTrigger` (React; use `client:load` in Astro).
- Pass: `triggerClassName`, `label="Bag"`, `showLabel={true}`, `paymentConfig`, `apiEndpoint`, `headerStyles` (from theme `styles/Header.json`), `projectType`.
- Header should also include: logo, main nav, search (if applicable), language switcher, Sign In. Mobile: hamburger with nav + “Bag” and “Sign In” in the drawer.
- Style the trigger and sidebar with the **theme’s CSS variables** (e.g. `--drivon-text`, `--luxury-black`) so the header matches the site.

Reference: `src/websites/f1racingapparel/themes/bikes/components/Header.astro`.

---

## 5. Theme and style files (JSON + luxury.mjs)

When adding or updating a **website** (e.g. under `src/websites/{SiteName}/themes/{Theme}/`), ensure **all** required style assets exist and that **luxury.mjs** matches the website theme.

### 5.1 Required style structure per website theme

Path pattern: `src/websites/{SiteName}/themes/{Theme}/styles/`

| File | Purpose |
|------|--------|
| `layout.json` | Body classes, themeColor. Fallback: `src/styles/default/layout.json` |
| `Header.json` | Header/cart sidebar styling keys (used by Layoutc/Layoutp and cart). |
| `collections/collections.json` or `collections/index.json` | Collection page layout/styles. Fallback: `src/styles/default/collections.json` |
| `products/products.json` | Product page structure. Fallback: `src/styles/default/products.json` |
| `products/luxury.mjs` | Product page luxury styles (title, price, breadcrumb, description, specs, reviews, etc.). **Must use the same CSS variables and tone as the website.** |
| `header/luxury.mjs` | (Optional) Header-specific luxury overrides. |
| `components/luxury.mjs` | Exports `luxuryComponentStyle` for shared components (ProductLoading, Reviews, ProductSpecs, etc.). **Must match the website theme.** |

If the website theme is new, **create** any missing JSON from the defaults in `src/styles/default/` and then customize. If a path is missing (e.g. no `products/luxury.mjs`), **add** it and export the same shape as other themes (see Drivon or RepBag themes).

### 5.2 luxury.mjs must match the website theme

- **products/luxury.mjs**: Export at least `luxuryProductStyle` (and optionally shared product blocks). Use the **site’s** CSS variables (e.g. `--luxury-black`, `--drivon-text`, `--drivon-muted`) and font classes (`font-display`, `font-body`) so product pages look like the rest of the site.
- **components/luxury.mjs**: Export `luxuryComponentStyle` used by ProductLoading, Reviews, ProductSpecs, ProductFAQ, etc. Same variables and typography as the theme.
- Do not reuse a different site’s luxury.mjs without adapting colors and type to the target website.

### 5.4 Dark theme: all text must be light

When the site or product page uses a **dark theme** (dark background, e.g. `--ds-bg: #0a0a0a`): **all text** must be **light** (use theme vars e.g. `--ds-text`, `--ds-muted`). This includes breadcrumb, product title, price, description, component titles, specs, buttons (Add to Cart, Buy Now, Show More). In **products/luxury.mjs** set every text key to `text-[var(--ds-text)]` or `text-[var(--ds-muted)]`; add `text-[var(--ds-text)]` on button primary/secondary. In **products.json** set wrapper to include dark bg (e.g. `bg-[#0a0a0a]`) so `data-theme="dark"` applies; use `bg-[var(--ds-surface)]` for description/content blocks. In **components/luxury.mjs** use theme vars so text is light on dark. Verify with MCP screenshot: no dark-on-dark or low-contrast text.

### 5.3 Import pattern (no change to existing code)

- Layouts/pages try website theme first, then fallback:
  - `@websites/${SITE_NAME}/themes/${THEME}/styles/...`
  - Fallback: `src/styles/default/...` or `@themes/default/...` as applicable.
- Components that need luxury styles: same pattern (website theme `styles/components/luxury.mjs` or theme default).

---

## Checklist (quick)

- [ ] One clear design direction; typography/color/motion consistent.
- [ ] Header includes Bag + slide cart (CartSidebarWithTrigger); styled with theme vars.
- [ ] All theme style JSON files present (layout, Header, collections, products); create from default if missing.
- [ ] products/luxury.mjs and components/luxury.mjs exist and use the **website’s** theme variables and fonts.
- [ ] **Dark theme:** If the site is dark, product page wrapper has dark bg, all text uses light theme vars; description/content blocks use dark surfaces; MCP confirms no dark-on-dark contrast failures.
- [ ] MCP verification done after UI changes (browser_navigate + screenshot/snapshot).
- [ ] React: typed props, semantic HTML, stable keys, no unnecessary `any`.
