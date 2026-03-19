---
name: seo-ranking-audit
description: Comprehensive SEO audit based on Google's 200 ranking factors. Covers domain, page-level, site-level, backlink, user interaction, social signals, brand signals, and webspam factors. Runs automated + manual checks via MCP browser, produces scored audit report with priority fixes. Use when the user asks for "SEO ranking audit", "ranking factors check", "full SEO audit", "why isn't my site ranking", or "website ranking analysis".
---

# SEO Ranking Audit — Google's 200 Factors

Audit a website against Google's 200 confirmed and suspected ranking factors, organized into 10 categories. Produces a scored report with severity levels and priority fixes.

## 10 Ranking Categories

| # | Category | Weight | Factors |
|---|----------|--------|---------|
| 1 | **Domain Factors** | Medium | Age, keyword in TLD, registration length, history, ccTLD |
| 2 | **Page-Level Factors** | Critical | Title tags, meta, H1-H3, content length, keywords, speed, images, freshness, internal links, layout |
| 3 | **Site-Level Factors** | High | Unique content, contact page, trust/authority, architecture, sitemap, SSL, mobile, breadcrumbs |
| 4 | **Backlink Factors** | Critical | Referring domains, authority, anchor text, link diversity, contextual links, relevance, velocity |
| 5 | **User Interactions** | High | CTR, bounce rate, dwell time, direct traffic, returning visitors |
| 6 | **Special Algorithm Rules** | Medium | Freshness, geo-targeting, search diversity, brand preference |
| 7 | **Social Signals** | Low-Medium | Twitter, Facebook, Pinterest, Google+, social authority |
| 8 | **Brand Signals** | Medium | Brand searches, mentions, social presence, LinkedIn, reviews |
| 9 | **On-Site WebSpam** | Critical (negative) | Over-optimization, cloaking, thin content, keyword stuffing, popups |
| 10 | **Off-Page WebSpam** | Critical (negative) | Unnatural links, penguin penalty, toxic anchors, link schemes |

## Audit Workflow

### Phase 1: Automated Technical Scan

Run the audit script to check factors that can be measured programmatically:

```bash
node .cursor/skills/seo-ranking-audit/scripts/seo-ranking-audit.mjs <target-website> [--url https://example.com]
```

The script checks:
- Title tags (presence, length, keyword position)
- Meta descriptions (presence, length <=160)
- H1/H2/H3 structure and keyword usage
- Content length per page
- Image optimization (alt text, filenames)
- Internal link structure and broken links
- Page speed indicators (HTML size, resource count)
- SSL certificate
- Mobile viewport meta
- Canonical tags
- Sitemap.xml and robots.txt
- Schema.org/structured data
- Duplicate meta information
- URL structure (length, keywords, depth)
- Breadcrumb navigation

### Phase 2: MCP Browser Verification

Use `cursor-ide-browser` to visually verify:

1. **Navigate** to each key page (homepage, product, collection, blog)
2. **Screenshot** and check:
   - Content visible above the fold (no excessive ads)
   - Mobile responsiveness
   - Page layout / user-friendliness
   - Popup / interstitial behavior
   - Navigation usability
3. **Measure** perceived load time
4. **Check** structured data rendering (rich snippets)

### Phase 3: Backlink & Authority Analysis

Requires external tools (Semrush, Ahrefs, Moz) or MCP `semrush_scrape`:

- Number of referring domains
- Domain authority / trust rank
- Anchor text distribution (branded vs keyword vs generic)
- Link diversity (IP classes, domain types)
- Toxic link detection
- Link velocity trend
- .edu / .gov links
- Competitor link comparison

### Phase 4: Content & On-Page Deep Dive

Manual review of top pages:

- **Keyword density** — present but not stuffed (no magic number)
- **LSI keywords** — related terms and semantic coverage
- **Content freshness** — last update dates, update frequency
- **Original content** — no copied/scraped content
- **Supplementary content** — calculators, tools, interactive elements
- **Multimedia** — images, videos, embedded media
- **Outbound link quality** — linking to authoritative, relevant sources
- **Grammar/spelling** — professional quality
- **Reading level** — appropriate for audience

### Phase 5: Social & Brand Signals

Check presence and activity:

- Facebook page (exists? likes? active?)
- Twitter account (followers? engagement?)
- LinkedIn company page (employees listed?)
- Pinterest (pins to site?)
- Brand name searches in Google
- Brand mentions without links (co-citations)
- News mentions
- Reviews on third-party sites
- Google Business Profile

### Phase 6: WebSpam Check

Verify the site is clean:

- No cloaking or sneaky redirects
- No hidden text or links
- No keyword stuffing (content, meta tags, headers)
- No excessive affiliate links
- No auto-generated content
- No doorway pages
- Healthy link profile (no link farms, PBNs)
- No manual actions in Search Console
- Clean IP reputation

## Scoring System

Each factor is scored:

| Score | Meaning |
|-------|---------|
| **Pass** (green) | Factor is well-optimized |
| **Warning** (yellow) | Factor needs improvement but not critical |
| **Fail** (red) | Factor is missing or poorly implemented |
| **N/A** | Factor cannot be checked or not applicable |

### Category Scores

Each category gets a percentage score: `(pass_count / total_applicable) * 100`

### Overall Score

Weighted average of all categories:
- Domain (5%) + Page-Level (25%) + Site-Level (15%) + Backlinks (25%) + User Interaction (10%) + Algorithm Rules (5%) + Social (5%) + Brand (5%) + On-Site Spam (2.5%) + Off-Page Spam (2.5%)

### Priority Classification

| Severity | Criteria |
|----------|----------|
| **P0 Critical** | Blocks indexing or causes penalties (cloaking, no SSL, manual actions) |
| **P1 High** | Major ranking impact (missing titles, no mobile, slow speed, thin content) |
| **P2 Medium** | Moderate impact (missing alt text, poor internal linking, no schema) |
| **P3 Low** | Minor optimization (meta description length, URL structure, social presence) |

## Subagent

The `seo-ranking-audit` subagent runs the full audit autonomously.

**Launch:**
```
Task(subagent_type="generalPurpose", description="SEO ranking audit", prompt="...")
```

**Subagent receives:** `targetWebsite`, `siteUrl`, optional `focusAreas` (e.g. ["backlinks", "page-level"])

**Subagent workflow:**
1. Read this skill: `.cursor/skills/seo-ranking-audit/SKILL.md`
2. Read reference: `.cursor/skills/seo-ranking-audit/reference.md`
3. Run audit script: `node .cursor/skills/seo-ranking-audit/scripts/seo-ranking-audit.mjs <target>`
4. Use MCP browser for visual checks
5. Compile scored report with priority fixes
6. Save report to `src/websites/<target>/SEO-RANKING-AUDIT.md`

## Output: Audit Report Format

```markdown
# SEO Ranking Audit Report — [Site Name]
**Date:** YYYY-MM-DD | **URL:** https://... | **Overall Score:** XX/100

## Executive Summary
[2-3 sentences on biggest issues and wins]

## Scores by Category
| Category | Score | Issues |
|----------|-------|--------|
| Domain Factors | 80% | 1 warning |
| Page-Level | 45% | 8 fails, 3 warnings |
| ... | ... | ... |

## P0 Critical Issues
1. [Issue] — [What's wrong] — [How to fix]

## P1 High Priority
1. ...

## P2 Medium Priority
1. ...

## P3 Low Priority
1. ...

## Detailed Findings
### 1. Domain Factors
- [x] Domain age: OK (registered 2019)
- [ ] Keyword in domain: FAIL — no relevant keyword
...
```

## Additional Resources

- For the complete list of all 200 factors with details, see [reference.md](reference.md)
- For example audit reports and best practices, see [examples.md](examples.md)
