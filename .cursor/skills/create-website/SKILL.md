---
name: create-website
description: End-to-end roadmap for creating a new website from the Abstract template. Clones folder structure, configures env/theme, creates components, wires up pages and data JSON, then verifies with MCP browser. Use when the user provides a website brief, asks to create a new site, or says "create website" / "new store" / "new site".
---

# Create Website from Abstract Template

Follow this exact sequence when the user provides a website creation brief. Do NOT skip steps. Use MCP browser verification after each visual milestone.

**Process summary (what the template and rules encode):** The Abstract theme now includes a full `styles/` folder with every JSON/mjs key the core uses (layout, Header with full actions and cart content, products page and related cards, components luxury, collections). New stores clone this so they start with a complete param set. Rules below enforce: (1) never remove style keys when customizing; (2) dark theme → all text light via theme CSS variables; (3) header search, currency, language, cart and mobile button must be fully defined in Header.json; (4) Related Products cards via `relatedCard*` in products.json; (5) slide cart chrome and content (empty, items, footer, checkout) via Header.json `cart.*`. Respect these so new stores do not regress.

---

## Phase 0 — Parse the Brief

Extract from the user's instructions before writing any code:

| Field | Example |
|-------|---------|
| **Store name** (PascalCase) | `GlamorBags` |
| **Theme name** (kebab-case) | `luxury-fashion` |
| **Design direction** | luxury / editorial / brutalist / minimal … |
| **Color palette** | CSS variable names + hex values |
| **Typography** | Display font + body font (never Inter/Roboto/Open Sans/Lato/Arial) |
| **Homepage sections** (ordered) | Hero, Featured Collections, Best Sellers, … |
| **Navigation items** | Home, Collections, About, Contact … |
| **Business name / tagline** | RepBags — "Timeless Luxury. Iconic Style." |

Create a todo list from this extraction before proceeding.

---

## Phase 1 — Scaffold (clone Abstract)

### 1.1 Copy the folder

```
src/websites/Abstract/themes/base/  →  src/websites/<StoreName>/themes/<theme-name>/
```

Copy **everything**, including the full `styles/` folder:

- Root: `theme.json`, `theme.mjs`, `consts.ts`, `data/index_en.json`, `page/index.astro`, `components/*`
- **`styles/`** (entire directory):
  - `layout.json`
  - `Header.json`
  - `products/products.json`, `products/luxury.mjs`
  - `components/luxury.mjs`
  - `collections/collections.json`
  - `styles/README.md` (reference for key shapes)

The Abstract theme styles define **every parameter** the core uses. Cloning them gives the new store a complete template; you only override values with the site’s CSS variables and fonts.

### 1.2 Create `.env.<storename>`

Clone `.env.abstract` → `.env.<storename>` (lowercase store name). The new file **must include all parameters** from `.env.abstract`; only override the store-specific ones below.

**Override these (required):**

- `PUBLIC_SITE_NAME=<StoreName>` — Must match folder name exactly (case-sensitive).
- `THEME=<theme-name>`
- `PORT=<next available port>`
- `ALLOWED_LANGUAGES=en` (add if missing)

**Keep every other key from `.env.abstract`** (same values as in Abstract). Full list of params that must be present:

| Key | Purpose |
|-----|--------|
| `PORT` | Override with store port |
| `THEME` | Override with theme name |
| `PUBLIC_SITE_NAME` | Override with store name (case-sensitive) |
| `NODE_ENV` | development |
| `HOST` | 0.0.0.0 |
| `PROJECT_TYPE` | digital / physical / iptv etc. |
| `DATA_TYPE` | shopify etc. |
| `PUBLIC_SITE_NAME_ARABIC` | Arabic site name if used |
| `SHOPIFY_API_URL`, `SHOPIFY_ACCESS_TOKEN`, `SHOPIFY_BLOG_ID` | Shopify backend |
| `PUBLIC_SHOPIFY_SHOP`, `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront |
| `DOMAINE` | Production URL |
| `API_ENDPOINT`, `API_KEY` | API config |
| `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` | Supabase |
| `MONGODB_URI`, `REDIS_URL` | Data/Redis |
| `PRODUCTTHEME` | e.g. luxury |
| `PUBLIC_GA_MEASUREMENT_ID`, `PUBLIC_HOTJAR_ID`, `PUBLIC_HOTJAR_VERSION` | Analytics |
| `PUBLIC_VOICEFLOW_PROJECT_ID` | Voiceflow |
| `PUBLIC_BUSINESS_*` | Name, email, phone, address, city, region, country, postal, support hours, support email |
| `PUBLIC_ENABLE_WHATSAPP`, `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_WHATSAPP_DEFAULT_MESSAGE` | WhatsApp |
| `PUBLIC_HAS_CHART_DATA`, `PUBLIC_PAYMENT_METHOD`, `PUBLIC_AI_SUPPORT_TYPE` | Features |
| `GOOGLE_MAPS_API_KEY` | Maps |
| `WOOCOMMERCE_*` | WooCommerce if used |
| `HOODPAY_*` | Hoodpay if used |
| `FormApiBaseUrl`, `PUBLIC_FORM_API_BASE_URL` | Form API |

**Method:** Copy the entire `.env.abstract` file, then replace only `PORT`, `THEME`, `PUBLIC_SITE_NAME`, and add `ALLOWED_LANGUAGES=en` if absent. The user customizes secrets and business details later.

### 1.3 Verify scaffold boots

```bash
npm run dev <storename> -- --port <PORT>
```

MCP: `browser_navigate` → `http://localhost:<PORT>/` — should render the Abstract default page with the new store name in the header. Fix any import errors before continuing.

---

## Phase 2 — Theme Configuration

### 2.1 `theme.mjs` — Design tokens

Define the site's color palette as CSS-variable-ready values and Tailwind tokens:

```js
export default {
  colors: {
    primary: { DEFAULT: '#0a0a0a', foreground: '#faf8f5' },
    accent:  { DEFAULT: '#c9a962', foreground: '#0a0a0a' },
    muted:   { DEFAULT: '#a3a3a3', foreground: '#525252' },
    surface: { DEFAULT: '#111111' },
  },
  borderRadius: { lg: '0.5rem', md: '0.375rem', sm: '0.25rem' },
};
```

### 2.2 `theme.json` — Page list

Add all pages the site needs (homepage, collections, products, about, contact, reviews, privacy, terms, etc.).

### 2.3 `consts.ts` — Site meta

```ts
export const SITE_TITLE = '<Store Name> — <Tagline>';
export const SITE_DESCRIPTION = '<Meta description>';
```

---

## Phase 3 — BaseHead (fonts + CSS variables)

Edit `components/BaseHead.astro`:

1. **Fonts** — Replace Google Fonts link with the chosen display + body pair.
2. **CSS variables** — Define the full palette in `:root {}` inside `<style is:global>`:

```css
:root {
  --<prefix>-bg: #0a0a0a;
  --<prefix>-surface: #111111;
  --<prefix>-text: #faf8f5;
  --<prefix>-muted: #a3a3a3;
  --<prefix>-accent: #c9a962;
  --<prefix>-border: #1a1a1a;
  --font-display: '<Display Font>', serif;
  --font-body: '<Body Font>', sans-serif;
}
```

3. **Global body/heading styles** using the variables.

MCP: `browser_navigate` + `browser_take_screenshot` — confirm fonts load and background color applies.

---

## Phase 4 — Components

Create each component file in `components/`. Build them **one at a time** in section order from the brief. Each component is a standalone `.astro` file.

### Required components (always create):

| Component | File |
|-----------|------|
| BaseHead | `BaseHead.astro` (Phase 3) |
| Header | `Header.astro` |
| Footer | `Footer.astro` |
| Welcome (Hero) | `Welcome.astro` |

### Section components (from brief):

For every section in the homepage brief, create a matching component. Common examples:

| Section | Component file |
|---------|---------------|
| Featured Collections | `CategoryGrid.astro` |
| Best Sellers | `BestSellers.astro` |
| Brand Story | `BrandStory.astro` |
| Lifestyle Banner | `Banner.astro` |
| New Arrivals | `ProductShowcase.astro` |
| Why Choose Us | `TrustBadges.astro` or `FeaturesSection.astro` |
| Social Gallery | `SocialGallery.astro` |
| Testimonials | `TestimonialSlider.astro` |
| Newsletter | `EmailSignup.astro` |

### Header pattern

The Header **must** include:

- Logo (site name)
- Navigation links
- Language switcher (using `@utils/i18n`)
- Bag / Cart trigger: import `CartSidebarWithTrigger` from `@themes/default/components/CartSidebarWithTrigger`
- Mobile hamburger menu
- Sign In link

Reference: `src/websites/Drivon/themes/bikes/components/Header.astro`

### Component rules

- Use `@utils/i18n` for `getLangFromUrl`, `getLocalizedPath`
- Style with the site's CSS variables (`var(--<prefix>-*)`) — not hardcoded colors
- Use the font classes: `font-display` for headings, `font-body` for text
- Semantic HTML, accessible, no `any` types
- Accept props from `index_en.json` section data

MCP: After creating Header + Welcome, verify in browser before building remaining components.

---

## Phase 5 — Wire up `page/index.astro`

Import **every** component using the same pattern as Drivon:

```astro
const { default: BaseHead } = await import(`../components/BaseHead.astro`);
const { default: Header } = await import(`../components/Header.astro`);
const { default: Welcome } = await import(`../components/Welcome.astro`);
// ... all section components
const { default: Footer } = await import(`../components/Footer.astro`);
```

Render sections by iterating `jsonData.sections` with type-matching:

```astro
{jsonData.sections?.map((section) => (
  <>
    {section.type === 'welcomeSection' && <Welcome ... />}
    {section.type === 'bestSellers' && <BestSellers ... />}
    ...
  </>
))}
```

Keep the `lang` handling: `Astro.props.lang ?? Astro.params?.lang ?? 'en'`

**Never** use TypeScript generics with angle brackets in the template HTML (e.g. `Record<string, unknown>` breaks Astro parsing). Keep type annotations in the frontmatter only.

---

## Phase 6 — `data/index_en.json`

Populate with all sections, matching each `type` field to the component rendering in `index.astro`:

```json
{
  "siteTitle": "<Store Name>",
  "siteDescription": "<Description>",
  "sections": [
    { "type": "welcomeSection", "title": "...", ... },
    { "type": "bestSellers", "title": "...", "products": [...] },
    ...
  ]
}
```

Each section object contains the props that the matching component expects.

MCP: `browser_navigate` + `browser_take_screenshot` — full homepage should render all sections.

---

## Phase 7 — Style Files

Style files are **already present** from the Abstract clone (Phase 1.1). Use them as the base.

**Canonical reference:** `src/websites/Abstract/themes/base/styles/README.md` lists every file and the key shapes the core expects.

| File | Purpose |
|------|---------|
| `layout.json` | `bodyClass`, `bodyClassCollection`, `bodyClassProduct`, `themeColor` |
| `Header.json` | Full header + cart: wrapper, nav, logo, mobileButton, actions (search, currency, language, cart), mobile, **cart** (sidebar + all cart content keys). See "Rules — Slide cart" below. |
| `products/products.json` | All `page.*` keys + `layout` + `luxuryProductStyle`. Includes **relatedCard*** keys for Related Products. |
| `products/luxury.mjs` | Export `luxuryProductStyle`: title, breadcrumb, description, specs, reviews, related, variants, button, sizeChart, faq. Use site `--<prefix>-*` and font classes. |
| `components/luxury.mjs` | Export `luxuryComponentStyle`: specs, recentlyViewed, keyFeatures, faq, loading, reviews, shipping, warranty, sizeChart (each with full key set). Use site variables. |
| `collections/collections.json` | `page.*` keys for collection index and [...collections] (wrapper, main, breadcrumb*, header*, sidebar, mainContent, productGrid, pagination*, etc.) |

**What to do:** Override **values** with the site’s `--<prefix>-*` variables and `font-display` / `font-body`. **Do not remove keys**; the core may read any of them. If the site is dark-themed, follow "Rules — Dark theme" below.

---

## Phase 8 — Final Verification

MCP full-page check:

1. `browser_navigate` → `http://localhost:<PORT>/`
2. `browser_take_screenshot` — verify hero, all sections, footer
3. `browser_navigate` → `http://localhost:<PORT>/en`
4. `browser_take_screenshot` — same result
5. Scroll check: `browser_scroll` down, screenshot mid-page and bottom
6. Fix any visual issues and re-verify

---

## Execution Order (checklist)

```
Phase 0: Parse brief
  - [ ] Extract store name, theme name, palette, fonts, sections
  - [ ] Create todo list

Phase 1: Scaffold
  - [ ] Copy Abstract → src/websites/<StoreName>/themes/<theme-name>/
  - [ ] Create .env.<storename>
  - [ ] Boot dev server, MCP verify

Phase 2: Theme config
  - [ ] theme.mjs (colors/tokens)
  - [ ] theme.json (pages)
  - [ ] consts.ts (title/description)

Phase 3: BaseHead
  - [ ] Google Fonts link (display + body)
  - [ ] CSS variables in :root
  - [ ] Global styles
  - [ ] MCP verify fonts + colors

Phase 4: Components (one at a time)
  - [ ] Header (with Cart trigger)
  - [ ] Welcome / Hero
  - [ ] MCP verify header + hero
  - [ ] Each section component from brief
  - [ ] Footer

Phase 5: page/index.astro
  - [ ] Import all components
  - [ ] Render sections from jsonData
  - [ ] MCP verify

Phase 6: data/index_en.json
  - [ ] All section data with correct type fields
  - [ ] MCP verify full homepage

Phase 7: Style files
  - [ ] Styles present from Abstract clone (layout, Header, products, components, collections)
  - [ ] Override values with site CSS vars; do not remove keys
  - [ ] If dark theme: all text light (products + components luxury.mjs + products.json); header actions + cart full keys
  - [ ] Related Products: relatedCard* keys in products.json; slide cart: cart.* content keys in Header.json
  - [ ] MCP: product page (breadcrumb, price, description, related cards) and slide cart (open cart, check styling)

Phase 8: Final MCP verification
  - [ ] Root / and /en both work
  - [ ] All sections visible
  - [ ] Screenshot top, middle, bottom
```

---

## Rules to Respect

### Style files — complete param set

- **Source of truth:** `src/websites/Abstract/themes/base/styles/` contains every style key the core uses. See `styles/README.md` there for the map.
- **When customizing:** Override **values** only. Do **not** remove keys; the core can read any key and expects no `undefined` for classes it uses.
- **New stores:** Clone Abstract so the theme already has the full `styles/` folder. Then replace values with the site’s CSS variables and fonts.

### Dark theme — all text light

When the site or product page uses a **dark background** (e.g. `bodyClass` or product `page.wrapper` with dark bg):

- **All text must be light:** breadcrumb, product title, price, description, specs, Key Features, FAQ, buttons (Add to Cart, Buy Now, Show More), Related Products titles/prices.
- Use theme CSS variables everywhere: e.g. `text-[var(--prefix-text)]`, `text-[var(--prefix-muted)]`, `border-[var(--prefix-border)]`, `bg-[var(--prefix-surface)]`. In **products/products.json** set `page.wrapper` to include the dark bg (e.g. `relative bg-[#0a0a0a]`) so `data-theme="dark"` is set.
- **products/luxury.mjs** and **components/luxury.mjs**: every text/key class must use the theme’s light text vars. **products/products.json**: description blocks, detail boxes, related cards use `--prefix-surface`, `--prefix-border`, `--prefix-text`.
- Reference: [atlagia-ecommerce-frontend](../atlagia-ecommerce-frontend/SKILL.md) §5.4; `.cursor/rules/product-page-dark-theme.mdc`. Verify with MCP: no dark-on-dark or low-contrast text.

### Header — search, currency, language, cart

- Product and collection pages use the **default Header** (React) from the layout, which reads **Header.json**.
- **Header.json** must define full **actions**: `search` (icon, button, form, input), `currency` (wrapper, button, text, dropdown, option, optionActive, optionHover), `language` (same shape), `cart` (button, count). Also **mobileButton** (wrapper, button, iconClose, iconOpen) so the hamburger is themeable.
- For dark headers use e.g. `text-[var(--prefix-text)]` / `hover:text-[var(--prefix-accent)]` for all actions so search, currency, language, and cart icons are clearly visible.

### Related Products cards

- Styled via **products/products.json** `page.relatedCardRoot`, `relatedCardMedia`, `relatedCardNoImageWrap`, `relatedCardNoImageText`, `relatedCardContent`, `relatedCardTitle`, `relatedCardPrice`, `relatedCardComparePrice`, `relatedCardArrow` (and optional `relatedCardSaleBadge`).
- Core builds `relatedCardStyles` from these and passes them to `ReactiveProductCard`. If keys are missing, the component falls back to light-theme classes.
- For dark product pages set e.g. `relatedCardRoot: "… bg-[var(--prefix-surface)] border-[var(--prefix-border)] …"`, `relatedCardTitle: "… text-[var(--prefix-text)]"`, `relatedCardPrice: "… text-[var(--prefix-text)]"`, `relatedCardArrow: "… text-[var(--prefix-muted)] …"` so cards match the dark theme.

### Slide cart

- **Header.json** `cart` is used by the default Header’s cart sidebar and by `CartSidebarWithTrigger`. It must include:
  - **Chrome:** `sidebar`, `container`, `header`, `headerContent`, `iconWrapper`, `icon`, `title`, `closeButton`, `closeIcon`, `overlay`.
  - **Cart content (Cart.tsx):** `emptyWrap`, `emptyIconWrap`, `emptyIcon`, `emptyTitle`, `emptyText`, `itemsWrap`, `itemCard`, `itemImage`, `qtyBadge`, `itemTitle`, `itemPrice`, `itemTotal`, `qtyWrap`, `qtyBtn`, `qtyText`, `qtyIcon`, `removeBtn`, `footerWrap`, `totalLabel`, `totalCount`, `totalAmount`, `checkoutBtn`, `trustWrap`, `trustItem`.
- For dark theme use theme vars for background, borders, and text (e.g. `bg-[var(--prefix-bg)]`, `text-[var(--prefix-text)]`, `checkoutBtn` with accent bg and contrast text). The core must not apply an inline light background when the theme provides `cart.sidebar`; styling is driven only by these keys.

---

## Critical Rules

1. **`PUBLIC_SITE_NAME` must match folder name exactly** (case-sensitive). `Abstract` folder → `PUBLIC_SITE_NAME=Abstract`.
2. **Never use relative dynamic imports with variables** for cross-folder references. Use `@websites/`, `@themes/`, `@utils/`, `@components/`, `@libs/` aliases.
3. **Relative `../components/X.astro` imports** are fine inside the same website theme (same folder).
4. **No TypeScript generics in Astro template markup** — angle brackets break HTML parsing.
5. **Every website must have its own `components/` folder** with at least: BaseHead, Header, Footer, Welcome. The `[lang]/[...slug].astro` router imports from `@websites/<SiteName>/themes/<theme>/page/index.astro` which does `await import('../components/X.astro')`.
6. **Do NOT modify core files** (`src/pages/index.astro`, `src/pages/[lang]/[...slug].astro`, `src/utils/`, `src/lib/`, shared components in `src/themes/default/`). All customization lives inside `src/websites/<StoreName>/`.
7. **MCP verification is mandatory** after each visual milestone (Phases 1, 3, 4-header, 5, 6, 8).
8. Follow [atlagia-ecommerce-frontend](../atlagia-ecommerce-frontend/SKILL.md) for design direction, header pattern, and style file requirements.
9. **After Phase 8**, run the full [website-audit](../website-audit/SKILL.md) to verify homepage sections, collections, product pages, slide cart, and pillar pages. Fix every issue before reporting done.
10. **Style completeness:** Use Abstract theme styles as the template for all JSON/mjs keys. Respect the rules above (dark theme, header actions, Related Products, slide cart) so the new store does not regress.
