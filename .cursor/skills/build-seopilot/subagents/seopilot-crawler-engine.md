# Subagent: seopilot-crawler-engine

**Phase:** 3 — SEO Crawler Engine (Crawlee + Playwright)
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Build a production-ready SEO crawler that can scan any website, extract SEO-relevant data from every page, and analyze it for technical/content/performance issues.

## Inputs

- `projectRoot`: Monorepo root
- packages/crawler directory exists from scaffold

## Steps

### 1. Install Dependencies

```bash
cd packages/crawler
npm install crawlee @crawlee/playwright playwright cheerio zod
npm install -D typescript @types/node
```

### 2. SEO Crawler (src/seo-crawler.ts)

Main crawler using Crawlee's adaptive mode:

```typescript
import { PlaywrightCrawler, CheerioCrawler, Configuration } from 'crawlee';

export interface CrawlOptions {
  maxConcurrency?: number;       // default: 10
  maxCrawlDepth?: number;        // default: 5
  maxRequestsPerCrawl?: number;  // default: 500
  followSitemap?: boolean;       // default: true
  respectRobotsTxt?: boolean;    // default: true
  onProgress?: (progress: CrawlProgress) => void;
}

export interface CrawlProgress {
  pagesScanned: number;
  totalDiscovered: number;
  currentUrl: string;
  phase: 'discovering' | 'crawling' | 'analyzing';
}

export interface CrawlResult {
  pages: PageData[];
  siteMetrics: SiteMetrics;
  issues: RawIssue[];
  crawlDuration: number;
}

export async function crawlSite(url: string, options: CrawlOptions): Promise<CrawlResult> {
  // 1. Parse robots.txt
  // 2. Parse sitemap.xml (discover URLs)
  // 3. Initialize Crawlee with request queue
  // 4. Run crawler with extractors on each page
  // 5. Run analyzers on collected data
  // 6. Return results
}
```

### 3. Extractors (src/extractors/)

Each extractor takes a Crawlee Page context and returns structured data.

**meta.ts** — Meta Tag Extractor:
- `<title>` text and length
- `<meta name="description">` content and length
- `<meta name="robots">` directives
- `<link rel="canonical">` href
- Open Graph tags (og:title, og:description, og:image, og:type, og:url)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- `<meta name="viewport">` content
- `<meta charset>`
- hreflang tags

**headings.ts** — Heading Structure:
- All H1-H6 tags with text content
- H1 count (should be exactly 1)
- Heading hierarchy (no skipped levels: H1→H3 without H2)
- Empty headings

**links.ts** — Link Analysis:
- Internal links (same domain) with anchor text
- External links with anchor text and rel attributes
- Broken links (HTTP HEAD check, status codes)
- Redirect chains (301/302 hops)
- Nofollow/noopener/noreferrer attributes
- Orphan page detection (pages not linked from any other page)

**images.ts** — Image Analysis:
- All `<img>` src, alt, width, height
- Missing alt text
- Empty alt text (decorative vs missing)
- Image format (WebP, AVIF, JPEG, PNG, SVG)
- Lazy loading attribute (`loading="lazy"`)
- Image file size (HEAD request for Content-Length)
- `<picture>` and `srcset` usage

**schema.ts** — Structured Data:
- JSON-LD blocks: parse and validate
- Schema.org types detected (Organization, Product, Article, FAQ, BreadcrumbList, etc.)
- Microdata extraction
- RDFa extraction
- Schema validation against Google's requirements

**performance.ts** — Core Web Vitals (Playwright only):
- LCP (Largest Contentful Paint)
- FID/INP (First Input Delay / Interaction to Next Paint)
- CLS (Cumulative Layout Shift)
- TTFB (Time to First Byte)
- Total page weight (HTML + CSS + JS + images + fonts)
- Render-blocking resources
- DOM size (element count)

**accessibility.ts** — Basic A11y:
- Missing form labels
- Missing ARIA roles on interactive elements
- Color contrast ratios (via computed styles)
- Missing lang attribute on `<html>`
- Skip navigation link presence

### 4. Analyzers (src/analyzers/)

Each analyzer takes extracted data and produces structured issues.

**technical-seo.ts:**
- Missing/empty title (critical)
- Title too long (>60 chars) or too short (<30 chars) (medium)
- Missing/empty meta description (high)
- Description too long (>160 chars) (low)
- Duplicate titles across pages (high)
- Duplicate descriptions across pages (medium)
- Missing canonical tag (high)
- Self-referencing canonical (info)
- Canonical pointing to different page (medium)
- Robots noindex on important pages (critical)
- Missing robots.txt (high)
- Missing XML sitemap (high)
- Pages not in sitemap (medium)
- HTTP→HTTPS mixed content (high)
- Redirect chains (>2 hops) (medium)
- 4xx/5xx status codes (critical/high)
- Missing viewport meta (high)
- Missing hreflang (medium, if multilingual)

**content-seo.ts:**
- Thin content (<300 words) (medium)
- Very thin content (<100 words) (high)
- Missing H1 (high)
- Multiple H1s (medium)
- Heading hierarchy violations (low)
- Duplicate content (cosine similarity >0.9) (high)
- Keyword stuffing (density >3%) (medium)
- Missing alt text on images (medium per image)

**link-health.ts:**
- Broken internal links (4xx) (critical)
- Broken external links (4xx/5xx) (medium)
- Orphan pages (no internal links pointing to them) (high)
- Too many links on a page (>100) (low)
- Excessive redirect chains (medium)
- All external links missing rel="noopener" (low)

**speed.ts:**
- LCP > 2.5s (high) / > 4.0s (critical)
- CLS > 0.1 (high) / > 0.25 (critical)
- INP > 200ms (high) / > 500ms (critical)
- TTFB > 800ms (high) / > 1800ms (critical)
- Page weight > 3MB (medium) / > 5MB (high)
- DOM size > 1500 elements (medium)
- Render-blocking resources (medium per resource)
- Unoptimized images (not WebP/AVIF) (medium)
- Missing lazy loading on below-fold images (low)

### 5. Utilities (src/utils/)

**sitemap-parser.ts:**
- Parse sitemap.xml and sitemap index files
- Handle gzipped sitemaps
- Extract URLs with lastmod, changefreq, priority

**robots-parser.ts:**
- Parse robots.txt rules
- Check if URL is allowed/disallowed for specific user agent
- Extract sitemap URLs from robots.txt

**url-utils.ts:**
- URL normalization (trailing slash, protocol, www)
- URL classification (homepage, product, category, blog, etc.)
- Duplicate URL detection
- Domain extraction

### 6. Types & Output Schema

Define Zod schemas for all output types in packages/shared:
- `PageData`: url, statusCode, title, meta, headings, links, images, schema, performance, rawHtml
- `RawIssue`: category, severity, title, description, pageUrl, currentValue, suggestedValue, ruleId, fixable
- `SiteMetrics`: totalPages, avgLoadTime, avgScore, brokenLinkCount, etc.
- `CrawlResult`: pages, siteMetrics, issues, crawlDuration

### 7. Test

Crawl the SEOPilot marketing site (localhost:7026) as a smoke test:

```bash
npx tsx src/test-crawl.ts http://localhost:7026/en
```

Verify: pages discovered, meta extracted, issues identified, no crashes.

## Output

Return: extractor count (7), analyzer count (4), total SEO rules implemented (count), sample crawl page count and issue count, any issues encountered.
