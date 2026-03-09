# Examples

## E-commerce header (bag + slide cart)

**Reference:** `src/websites/f1racingapparel/themes/bikes/components/Header.astro`

- Announcement bar (optional) → main header bar → logo, center nav, right: Search, Language, **CartSidebarWithTrigger** (label "Bag", showLabel true), Sign In, mobile menu.
- Mobile drawer includes “Bag” button that opens the same slide cart (use same cart component / store).

```astro
import CartSidebarWithTrigger from '@themes/default/components/CartSidebarWithTrigger';
// ...
<CartSidebarWithTrigger
  client:load
  triggerClassName="..."
  label="Bag"
  showLabel={true}
  paymentConfig={paymentConfig}
  apiEndpoint={apiEndpoint}
  headerStyles={headerStyles}
  projectType={import.meta.env.PROJECT_TYPE || 'physical'}
/>
```

## Theme style structure (minimal)

```
src/websites/MySite/themes/mytheme/
├── styles/
│   ├── layout.json
│   ├── Header.json
│   ├── collections/
│   │   └── collections.json   # or index.json
│   ├── products/
│   │   ├── products.json
│   │   └── luxury.mjs         # must match site theme
│   ├── header/
│   │   └── luxury.mjs         # optional
│   └── components/
│       └── luxury.mjs         # must match site theme
```

## luxury.mjs (products) – match theme

Use the **website’s** CSS variables (e.g. RepBag: `--luxury-black`, `--luxury-ivory`, `--font-display`; Drivon: `--drivon-text`, `--drivon-muted`).

```js
// products/luxury.mjs – example shape
export const luxuryProductStyle = {
  title: "font-display text-3xl font-semibold text-[var(--luxury-black)] ...",
  price: "font-body text-2xl text-[var(--luxury-text)] ...",
  breadcrumb: { link: "...", current: "..." },
  description: { title: "...", content: "..." },
  specs: { title: "...", label: "...", value: "..." },
  reviews: { title: "...", author: "...", date: "...", content: "..." },
  related: { title: "..." },
  // ...
};
export const luxuryComponentStyle = { /* used by ProductSpecs, etc. */ };
```

## MCP verification

1. Change hero or header on RepBag → `browser_navigate` to `http://localhost:7005/en` → `browser_take_screenshot`.
2. Change product styles → open a product URL → screenshot.
3. Fix any regression and re-run navigate + screenshot until correct.
