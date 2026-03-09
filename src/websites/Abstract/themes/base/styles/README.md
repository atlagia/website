# Abstract theme styles — full core reference

These JSON and mjs files define **every style parameter** consumed by the core (product handle, collection pages, layouts, Header, Cart, shared components). When creating a new store by cloning Abstract, this folder is the complete template: the agent has full context of all keys and can override only what the new site needs.

| File | Consumed by | Key shapes |
|------|-------------|------------|
| `layout.json` | Layoutc, Layoutp | `bodyClass`, `bodyClassCollection`, `bodyClassProduct`, `themeColor` |
| `Header.json` | Default Header.tsx, CartSidebarWithTrigger, Cart.tsx | `wrapper`, `nav`, `logo`, `mobileButton`, `actions` (search, currency, language, cart), `mobile`, `cart` (sidebar + all cart content keys) |
| `products/products.json` | `[lang]/products/[handle].astro` | `page.*` (all product page classes), `layout` (gallery, sectionsOrder), `luxuryProductStyle` (title, breadcrumb, related) |
| `products/luxury.mjs` | Product handle (breadcrumb, title, related) | `luxuryProductStyle`: title, breadcrumb, description, specs, reviews, related, variants, button, sizeChart, faq |
| `components/luxury.mjs` | ProductSpecs, RecentlyViewed, KeyFeatures, ProductFAQ, Reviews, ProductLoading, ShippingInfo, ProductWarranty, SizeChart | `luxuryComponentStyle`: specs, recentlyViewed, keyFeatures, faq, loading, reviews, shipping, warranty, sizeChart (each with full key set) |
| `collections/collections.json` | `[lang]/collections/index.astro`, `[...collections].astro` | `page.*` (wrapper, main, breadcrumb*, header*, sidebar, mainContent, productGrid, pagination*, etc.) |

Do not remove keys when customizing a new store; override values so the core never receives `undefined` for a class it expects.
