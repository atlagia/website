# JacketVerse — premium-jackets theme

## Product catalog (Shopify)

Homepage and collections pages load products from the **Shopify Storefront API**. To show jacket-specific products on this site:

- In **.env.jacketverse** (project root), set:
  - `SHOPIFY_API_URL` — Admin API URL of your **jacket store** (e.g. `https://your-jacket-store.myshopify.com`)
  - `PUBLIC_SHOPIFY_SHOP` — same store’s myshopify.com domain
  - `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` / `PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` — tokens for that store

If these point to a different store (e.g. templates, real estate), the homepage and `/collections` will show that store’s products. For JacketVerse, point all `SHOPIFY_*` variables to a Shopify store that sells jackets.

No collection handles are hardcoded in this theme; “Best Selling Jackets” and “Seasonal Collections” use the store’s products (or the `collectionHandle` in `data/index_en.json` for BestSellers when set to a specific handle).
