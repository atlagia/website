# Shopify Product Enhancement — Reference

## Flow

- **Main agent**: Launches subagent.
- **Subagent**: Runs `shopify-enhance-all.mjs --use-gemini`. No manual loop.
- **shopify-enhance-all**: Fetches products, for each calls **shopify-gemini-enhance** (Gemini) → convert images → update product.
- **shopify-gemini-enhance**: Gemini API with key rotation. Generates title + description (H1, H2, FAQ, schema).

## State (Queued / Done)

- **Folder**: `data/shopify-enhance/<target-website>/state.json`
- **queued**: Product IDs to process. New IDs from fetch are added here (if not already done).
- **done**: Product IDs completed. On success, ID moves from queued → done.
- **--reset**: Clear state and re-queue all products.

## SEO Guidelines

- **Enhanced title**: New from old title; primary keyword first; 50–60 chars.
- **Enhanced description**: New from old title + old description.
- **Meta title**: `{Enhanced Title} | {Site Name}`, max 60 chars.
- **Meta description**: 150–160 chars, keyword-rich.

## Description Structure (Subagent-Generated)

1. **Main body** — From title + old description; SEO-focused
2. **Internal links** — 2–5 links to collections/products
3. **FAQ** — 3–6 Q&A at bottom
4. **FAQ schema** — JSON-LD at very bottom

```html
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Q","acceptedAnswer":{"@type":"Answer","text":"A"}}]}
</script>
```

## Env Mapping

| Env var | Required | Notes |
|---------|----------|-------|
| SHOPIFY_ACCESS_TOKEN | Yes | Admin API token |
| PUBLIC_SHOPIFY_SHOP | Yes | e.g. drivende.myshopify.com |
| SHOPIFY_API_URL | No | Falls back to https://${PUBLIC_SHOPIFY_SHOP} |

## Script Dependencies

- `dotenv` — load .env.<target>
- `sharp` — image conversion
- `@aws-sdk/client-s3` — R2 upload

## R2 Object Metadata

- `title`: product title
- `tags`: comma-separated product tags

## STRICT Rules

- **Title**: max 60 chars, professional, SEO, not long
- **Meta title**: max 60 chars (Google limit)
- **Meta description**: max 160 chars
- **Description**: NO broken links, NO images. Safe paths only: /collections, /collections/all

## Alt Text

`{productTitle}, {tag1}, {tag2}` — comma-separated.

## Shopify Admin API

- GraphQL: `https://{shop}/admin/api/2024-10/graphql.json`
- Auth: `X-Shopify-Access-Token`
- Mutations: `productUpdate`, `productCreateMedia`, `productDeleteMedia`
