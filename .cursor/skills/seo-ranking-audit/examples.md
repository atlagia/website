# SEO Ranking Audit — Examples & Best Practices

## Example 1: E-Commerce Site Audit Report

```markdown
# SEO Ranking Audit Report — JacketVerse.com
**Date:** 2026-03-14 | **URL:** https://jacketverse.com | **Overall Score:** 52/100

## Executive Summary
JacketVerse has critical issues with page speed (LCP 5.2s), missing meta descriptions on 60% of product pages, and no schema markup. The site has a healthy backlink profile but severely underperforms on page-level and site-level technical factors.

## Scores by Category
| Category | Score | Critical | High | Medium | Low |
|----------|-------|----------|------|--------|-----|
| Domain Factors | 78% | 0 | 0 | 1 | 1 |
| Page-Level Factors | 35% | 4 | 6 | 3 | 2 |
| Site-Level Factors | 55% | 1 | 2 | 3 | 0 |
| Backlink Factors | 72% | 0 | 1 | 2 | 1 |
| User Interactions | 40% | 0 | 2 | 1 | 0 |
| Algorithm Rules | 60% | 0 | 1 | 1 | 0 |
| Social Signals | 30% | 0 | 0 | 2 | 2 |
| Brand Signals | 45% | 0 | 1 | 2 | 1 |
| On-Site Spam | 90% | 0 | 0 | 1 | 0 |
| Off-Page Spam | 95% | 0 | 0 | 0 | 1 |

## P0 Critical Issues
1. **Page Speed — LCP 5.2s** — Main product images unoptimized (3-5MB each). Convert to WebP, add lazy loading, implement CDN.
2. **Missing Canonical Tags** — 120 product pages have no canonical URL. Causes duplicate content with variant URLs.
3. **No SSL on Checkout** — Mixed content warnings on /checkout. Fix all HTTP resources to HTTPS.
4. **Auto-Generated Product Descriptions** — 45 products have templated 2-sentence descriptions. Rewrite with unique, detailed content.

## P1 High Priority
1. **Missing Meta Descriptions** — 180/300 product pages have no meta description. Write unique descriptions <=160 chars with target keywords.
2. **Missing H1 Tags** — Collection pages use H2 as first heading. Change to H1 with collection keyword.
3. **Mobile Usability** — Hamburger menu doesn't close on tap-outside. Product image gallery broken on iOS Safari.
4. **No Sitemap** — sitemap.xml returns 404. Generate and submit to Search Console.
5. **Broken Internal Links** — 23 links to discontinued products return 404. Redirect to parent collection.
6. **Image Alt Text Missing** — 340 product images have no alt text. Add descriptive alt text with product name + attribute.

## P2 Medium Priority
1. **No Schema Markup** — Missing Product, BreadcrumbList, Organization schema. Implement JSON-LD.
2. **No Breadcrumb Navigation** — Users can't navigate back to collections from product pages.
3. **Thin Content Pages** — 15 collection pages have <100 words. Add category descriptions.
4. **Internal Linking** — Blog posts don't link to relevant products. Add contextual product links.
5. **Duplicate Title Tags** — 12 product variants share same title. Make titles unique per variant.

## P3 Low Priority
1. **URL Length** — Some product URLs exceed 100 chars. Shorten slugs.
2. **No Facebook Page** — Create and maintain Facebook business page.
3. **No YouTube Content** — Product video reviews could boost rankings and CTR.
4. **Reading Level** — Product descriptions are very basic. Consider more detailed, authoritative content.
```

---

## Example 2: Local Business Audit Findings

```markdown
# SEO Ranking Audit Report — BakerStreetCafe.de
**Date:** 2026-03-14 | **URL:** https://bakerstreetcafe.de | **Overall Score:** 68/100

## Executive Summary
Strong local signals (Google Business Profile, reviews) but weak technical foundation. No structured data, slow mobile speed, and poor internal linking. Backlink profile is healthy but thin (only 35 referring domains).

## P0 Critical Issues
1. **No HTTPS** — Site served over HTTP. Install SSL certificate immediately.

## P1 High Priority
1. **Mobile Speed** — 4.8s LCP on mobile. Large hero images, render-blocking CSS.
2. **No Title Tags** — 5/12 pages have default CMS title tags ("Page | Baker Street Cafe").
3. **Missing Google Business Profile Optimization** — GBP has wrong hours, no photos, incomplete categories.

## P2 Medium Priority
1. **No Schema.org LocalBusiness Markup** — Add address, hours, phone, geo-coordinates.
2. **No Breadcrumbs** — Implement for menu, events, and about sections.
3. **Only 35 Referring Domains** — Need local link building (local press, food blogs, city directories).
4. **No Blog/Fresh Content** — Static site with no updates since 2024.

## P3 Low Priority
1. **Social Accounts Inactive** — Instagram last posted 6 months ago. Resume posting.
2. **No Reviews Strategy** — Encourage Google reviews from customers.
```

---

## Best Practices by Category

### Domain Factors
- **Do:** Register domain for 3+ years
- **Do:** Use .com for international, ccTLD for local-only
- **Do:** Keep WHOIS information public for business sites
- **Don't:** Buy expired domains hoping to inherit their authority (history resets)
- **Don't:** Use private WHOIS registration unless you have a legitimate reason

### Page-Level Factors
- **Do:** Put primary keyword at the beginning of the title tag
- **Do:** Write unique meta descriptions for every page (<=160 chars)
- **Do:** Use exactly one H1 per page containing the primary keyword
- **Do:** Include keyword in first 100 words of content
- **Do:** Write 1500+ words for important pages (pillar content: 3000+)
- **Do:** Include LSI keywords naturally throughout content
- **Do:** Optimize all images: descriptive filename, alt text, compressed size
- **Do:** Use canonical tags to prevent duplicate content
- **Don't:** Stuff keywords — write naturally for humans first
- **Don't:** Duplicate title tags or meta descriptions across pages
- **Don't:** Leave broken internal links unfixed
- **Don't:** Use auto-generated thin content

### Site-Level Factors
- **Do:** Implement SSL/HTTPS everywhere
- **Do:** Use responsive design (mobile-first)
- **Do:** Create and submit sitemap.xml
- **Do:** Build clear site architecture with breadcrumbs
- **Do:** Include contact page with matching WHOIS information
- **Do:** Have Terms of Service and Privacy Policy
- **Do:** Install Google Analytics and Search Console
- **Don't:** Let uptime drop below 99.5%
- **Don't:** Ignore duplicate meta information across pages

### Backlink Factors
- **Do:** Focus on earning links from topically relevant sites
- **Do:** Maintain diverse link types (editorial, guest, directory, social)
- **Do:** Aim for natural anchor text distribution (60% branded, 20% generic, 15% keyword, 5% URL)
- **Do:** Build links steadily over time (avoid spikes)
- **Do:** Seek contextual in-content links over sidebar/footer
- **Don't:** Buy links or participate in link schemes
- **Don't:** Exchange links excessively
- **Don't:** Build links from bad neighborhoods (link farms, PBNs)
- **Don't:** Over-optimize anchor text with exact-match keywords
- **Don't:** Ignore negative link velocity — it signals declining relevance

### User Interaction Signals
- **Do:** Optimize title tags and meta descriptions for CTR (not just keywords)
- **Do:** Ensure content matches search intent to reduce bounce rate
- **Do:** Improve page speed for better dwell time
- **Do:** Add engaging multimedia to increase time on page
- **Do:** Design clear calls-to-action and internal navigation
- **Don't:** Use misleading titles that increase bounce rate
- **Don't:** Place interstitials that block content immediately

### Social & Brand Signals
- **Do:** Maintain active, legitimate social media accounts
- **Do:** Build brand recognition through consistent naming and quality
- **Do:** Encourage brand searches through offline and online marketing
- **Do:** Get mentioned (even without links) on relevant sites
- **Don't:** Buy fake followers or engagement
- **Don't:** Neglect social accounts (inactive = worse than none)

### Avoiding Penalties
- **Do:** Serve same content to users and Googlebot
- **Do:** Make all affiliate relationships transparent
- **Do:** Use Disavow Tool for toxic backlinks
- **Do:** Respond quickly to manual action notifications
- **Don't:** Cloak content or use sneaky redirects
- **Don't:** Stuff keywords in meta tags, headers, or content
- **Don't:** Hide text or links (CSS, tiny font, white-on-white)
- **Don't:** Generate content automatically without human review
- **Don't:** Place excessive ads above the fold

---

## Scoring Benchmarks

| Score | Rating | Action |
|-------|--------|--------|
| 90-100 | Excellent | Maintain and monitor |
| 75-89 | Good | Address remaining warnings |
| 60-74 | Fair | Fix high-priority issues, plan medium fixes |
| 40-59 | Poor | Urgent attention needed on critical + high items |
| 0-39 | Critical | Full overhaul required |

### Industry Average Scores (approximate)
| Industry | Avg Score |
|----------|-----------|
| Enterprise SaaS | 75-85 |
| E-Commerce | 55-70 |
| Local Business | 40-60 |
| Blog/Content | 60-75 |
| New Startup | 30-45 |

---

## Common Patterns Found in Audits

### Pattern: "Good Content, Bad Technical"
- **Symptoms:** Great content, natural backlinks, but low rankings
- **Cause:** Missing technical basics (speed, mobile, schema, canonicals)
- **Fix:** Technical SEO sprint (usually 2-4 weeks)

### Pattern: "Technical but Thin"
- **Symptoms:** Perfect technical setup but little organic traffic
- **Cause:** Thin content, no topical authority, few backlinks
- **Fix:** Content strategy + link building campaign

### Pattern: "Penalized and Don't Know"
- **Symptoms:** Sudden traffic drop, pages de-indexed
- **Cause:** Algorithm penalty (Panda/Penguin) or manual action
- **Fix:** Check GSC for manual actions, audit link profile, improve content quality

### Pattern: "Over-Optimized"
- **Symptoms:** Ranking for some keywords but stuck/declining
- **Cause:** Too much exact-match anchor text, keyword stuffing, aggressive internal linking
- **Fix:** Diversify anchor text, reduce keyword density, write naturally

### Pattern: "Local Invisible"
- **Symptoms:** Local business not appearing in map pack
- **Cause:** No/poor Google Business Profile, inconsistent NAP, no local links
- **Fix:** GBP optimization, local citation building, review strategy
