# Subagent: seopilot-integrations

**Phase:** 7 — Platform Integrations (Shopify, WordPress, Webflow, Google)
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Build all platform connectors with OAuth flows and CRUD operations for SEO data.

## Inputs

- Backend API with integration tRPC router
- Database with sites table (platformCredentials column)

## Steps

### 1. Base Connector Interface (packages/integrations/src/base-connector.ts)

```typescript
export interface PlatformConnector {
  platform: 'shopify' | 'wordpress' | 'webflow' | 'custom';
  connect(credentials: PlatformCredentials): Promise<ConnectionResult>;
  disconnect(): Promise<void>;
  testConnection(): Promise<boolean>;
  getPages(): Promise<PlatformPage[]>;
  updateMeta(pageId: string, meta: MetaUpdate): Promise<UpdateResult>;
  addSchema(pageId: string, schema: JsonLd): Promise<UpdateResult>;
  updateContent(pageId: string, content: ContentUpdate): Promise<UpdateResult>;
  getAnalytics?(): Promise<AnalyticsData>;
}

export interface MetaUpdate {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface JsonLd {
  type: string;
  data: Record<string, unknown>;
}
```

### 2. Shopify Connector (packages/integrations/src/shopify/)

**client.ts:**
- GraphQL Admin API client with access token
- Rate limit handling (Shopify throttle: 2 req/s)
- Pagination via cursor-based GraphQL

**meta-updater.ts:**
- Update page/product/collection SEO meta:
  ```graphql
  mutation updateProductSeo($input: ProductInput!) {
    productUpdate(input: $input) {
      product { seo { title description } }
    }
  }
  ```
- Handle: products, collections, pages, blog articles

**schema-injector.ts:**
- Inject JSON-LD via Shopify metafields:
  ```graphql
  mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields { key value }
    }
  }
  ```
- Namespace: `seopilot`, key: `jsonld`

**OAuth flow:**
1. Generate authorization URL with scopes: `read_products, write_products, read_content, write_content`
2. Handle callback with auth code → exchange for access token
3. Store encrypted token in site.platformCredentials

### 3. WordPress Connector (packages/integrations/src/wordpress/)

**client.ts:**
- REST API v2 client (Application Password or OAuth)
- Handles: posts, pages, categories, tags, media
- Auto-detect Yoast SEO plugin presence

**yoast-updater.ts:**
- Update Yoast SEO fields via REST:
  ```
  POST /wp-json/wp/v2/posts/{id}
  { "yoast_head_json": { "title": "...", "description": "..." } }
  ```
- Or via Yoast REST fields: `_yoast_wpseo_title`, `_yoast_wpseo_metadesc`

**plugin-checker.ts:**
- Check if Yoast/RankMath/AIOSEO is installed
- Adapt field names based on detected plugin
- Report if no SEO plugin is installed

### 4. Webflow Connector (packages/integrations/src/webflow/)

**client.ts:**
- Data API v2 with OAuth
- Handles: sites, collections, items

**seo-updater.ts:**
- Update CMS item SEO fields:
  ```
  PATCH /v2/collections/{id}/items/{itemId}
  { "fieldData": { "seo-title": "...", "seo-description": "..." } }
  ```
- Publish after update

### 5. Google Search Console (packages/integrations/src/google/search-console.ts)

**OAuth 2.0 flow:**
- Scopes: `https://www.googleapis.com/auth/webmasters.readonly`
- Store refresh token encrypted in DB

**Data fetching:**
- Search analytics: impressions, clicks, CTR, average position
  - By query, by page, by date range
- Sitemap status: submitted, indexed, errors
- URL inspection: indexed status, crawl info, rich results

### 6. Google Analytics (packages/integrations/src/google/analytics.ts)

**OAuth 2.0 flow:**
- Scopes: `https://www.googleapis.com/auth/analytics.readonly`
- Same Google Cloud project as GSC

**Data fetching:**
- GA4 Data API:
  - Sessions, users, bounce rate by page
  - Traffic sources
  - Page load metrics
  - Conversion events

### 7. OAuth Callback Handler (apps/api/src/webhooks/platform-hooks.ts)

- `/api/integrations/shopify/callback` → exchange code, store token
- `/api/integrations/wordpress/callback` → verify connection
- `/api/integrations/webflow/callback` → exchange code, store token
- `/api/integrations/google/callback` → exchange code, store refresh token

### 8. Credential Encryption

- Encrypt platform credentials before storing in DB
- Use AES-256-GCM with server-side key
- Decrypt only when making API calls

### 9. Dashboard Integration

Wire up settings/integrations page:
- "Connect" button → redirects to OAuth URL
- Callback → stores credentials → redirects back with success
- "Disconnect" → revokes token, clears credentials
- "Test" → calls testConnection(), shows result

### 10. Test

- Test Shopify OAuth flow (use test store if available)
- Test WordPress connection with Application Password
- Test GSC data fetch with sample property
- Verify credentials stored encrypted
- Verify disconnect clears all data

## Output

Return: connectors built (5), OAuth flows implemented, test results per connector, any issues.
