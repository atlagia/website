# Google's 200 Ranking Factors — Complete Reference

All factors from Suchhelden GmbH's comprehensive list, organized by category with audit check methodology and impact level.

**Impact levels:** `Critical` > `High` > `Medium` > `Low` > `Speculative`

---

## 1. Domain Factors (9 factors)

### 1.1 Domain Age
- **Impact:** Low
- **What:** Older domains have slight advantage. Google considers registration date, but difference between 6-month and 1-year domain is minimal (Matt Cutts).
- **Check:** WHOIS lookup for registration date
- **Sources:** Google Webmasters YouTube, Google Patent B2

### 1.2 Keyword in Top-Level Domain
- **Impact:** Medium
- **What:** Keyword in domain signals relevance. Google bolds keywords in domain in SERPs. Example: notebooksbilliger.de for "notebook".
- **Check:** Does domain contain primary keyword?
- **Trend:** Declining importance (Searchmetrics 2015)

### 1.3 Keyword as First Word in Domain
- **Impact:** Medium
- **What:** Sites with keyword as first word in domain have advantage over keyword in middle or end.
- **Check:** Position of keyword in domain name

### 1.4 Domain Registration Length
- **Impact:** Low
- **What:** Domains registered for longer periods signal legitimacy. Google Patent: "Valuable domains are often paid for several years in advance."
- **Check:** WHOIS expiry date vs registration date
- **Sources:** Moz Correlation Study 2015

### 1.5 Keyword in Subdomain
- **Impact:** Low-Medium
- **What:** Keyword in subdomain can improve ranking (Moz 2011).
- **Check:** If using subdomains, does keyword appear?
- **Note:** Searchmetrics 2015: more directories than subdomains in SERPs

### 1.6 Domain History
- **Impact:** Medium
- **What:** Unstable ownership, multiple drops can reset domain history and negate backlinks.
- **Check:** Archive.org history, WHOIS history, ownership changes
- **Signals:** Domain activity, first discovery by Google, link growth over time

### 1.7 Exact Match Domain (EMD)
- **Impact:** Medium (declining)
- **What:** Domain exactly matching search query can give advantage — if quality site. Low-quality EMDs penalized.
- **Check:** Does domain exactly match target keyword?
- **Trend:** EMD filter reduces low-quality exact match domains

### 1.8 Public vs Private WHOIS
- **Impact:** Low-Medium (negative)
- **What:** Hidden WHOIS can signal "something to hide" (Matt Cutts, Pubcon 2006). Multiple privacy-protected domains from same owner = suspicion.
- **Check:** Is WHOIS data publicly visible?

### 1.9 Country-Code TLD
- **Impact:** Medium (geo-specific)
- **What:** ccTLD (.de, .fr, .co.uk) helps rank in that country but limits global ranking.
- **Check:** TLD matches target market? International sites use .com + subdirectories
- **Sources:** Google Webmasters YouTube, Searchmetrics 2015

---

## 2. Page-Level Factors (50 factors)

### 2.10 Keyword in Title Tag
- **Impact:** Critical
- **What:** Second most important on-page element after content. Sends strong relevance signal.
- **Check:** Primary keyword present in `<title>`? Length 50-60 chars?
- **Sources:** Sistrix, Moz, Google Webmasters

### 2.11 Title Tag Starts with Keyword
- **Impact:** High
- **What:** Titles beginning with keyword perform better on average than keyword at end (Moz data).
- **Check:** Keyword position in title tag

### 2.12 Keywords in Description Tag
- **Impact:** Medium
- **What:** Relevance signal + critical for CTR. Not direct ranking factor but influences click-through.
- **Check:** Keywords in meta description? Length <=160 chars?
- **Sources:** Sistrix click probabilities, Google Webmasters

### 2.13 Keyword in H1 Tag
- **Impact:** High
- **What:** H1 = second title tag, provides additional relevance signal.
- **Check:** Exactly one H1 per page? Contains keyword?

### 2.14 Keyword as Most Frequent Word/Phrase
- **Impact:** Medium (declining)
- **What:** If keyword is most frequently used word, sends relevance signal. But holistic topic optimization preferred.
- **Check:** TF analysis of page content
- **Trend:** Searchmetrics 2015: keyword importance declining, holistic topics preferred

### 2.15 Keyword Density
- **Impact:** Medium
- **What:** Helps identify page topic. No magic number. Overuse hurts.
- **Check:** Keyword appears naturally multiple times. Not stuffed.
- **Sources:** karlkratz.de, onpage.org

### 2.16 LSI Keywords in Content
- **Impact:** Medium
- **What:** Latent Semantic Indexing keywords help search engines understand word meaning (e.g., "Apple" computer vs fruit).
- **Check:** Related/semantic terms present in content?
- **Tip:** Check Google's "related searches" for LSI terms

### 2.17 LSI Keywords in Title/Description
- **Impact:** Low-Medium
- **What:** LSI in meta tags helps distinguish synonyms.
- **Check:** Semantic variations in title and description?

### 2.18 Content Length
- **Impact:** High
- **What:** Longer content covers topics more thoroughly. SERPIQ found correlation between length and SERP position.
- **Check:** Word count per page. Aim for 1500+ words on key pages.

### 2.19 Page Speed via HTML
- **Impact:** Critical
- **What:** Confirmed ranking factor. Crawlers assess speed from code and file size. Use PageSpeed Insights.
- **Check:** HTML size, number of requests, TTFB, LCP, CLS, FID/INP
- **Sources:** Backlinko 1M study, Google Support

### 2.20 Page Speed via Chrome
- **Impact:** Critical
- **What:** Google may use Chrome user data for real-world speed metrics (CrUX data).
- **Check:** Core Web Vitals from CrUX/PageSpeed Insights

### 2.21 Duplicate Content
- **Impact:** Critical (negative)
- **What:** Identical or near-identical content on multiple pages reduces visibility. Includes meta information.
- **Check:** No duplicate titles, descriptions, or body content across pages
- **Sources:** Google Support, Sistrix

### 2.22 Canonical Tag (rel=canonical)
- **Impact:** High
- **What:** Prevents duplicate content issues when properly implemented.
- **Check:** Every page has correct canonical URL?

### 2.23 Image Optimization
- **Impact:** Medium
- **What:** Images send relevance signals via filenames, alt text, titles, descriptions, captions.
- **Check:** All images have descriptive alt text? Filenames contain keywords?
- **Sources:** Matt Cutts YouTube, Google

### 2.24 Content Freshness
- **Impact:** High
- **What:** Google Caffeine prefers current content, especially for time-sensitive topics. Displays last update date.
- **Check:** Content recently updated? Publication dates visible?

### 2.25 Content Update Magnitude
- **Impact:** Medium
- **What:** Significance of changes matters. Adding/removing sections > rearranging words.
- **Check:** Updates substantial or just cosmetic?

### 2.26 Content Update Frequency
- **Impact:** Medium
- **What:** How often page is updated (daily, weekly, yearly) affects freshness signal.
- **Check:** CMS last-modified dates, blog post frequency

### 2.27 Keyword Prominence
- **Impact:** Medium
- **What:** Keyword in first 100 words = significant relevance signal.
- **Check:** Primary keyword appears within first 100 words?

### 2.28 Keyword in H2/H3 Tags
- **Impact:** Low
- **What:** Keyword in subheadings = weak relevance signal. Allows including long-tail variations.
- **Check:** Keywords in H2/H3 headings?

### 2.29 Keyword Order Match
- **Impact:** Medium
- **What:** Exact match with search query ranks higher than rearranged keywords. "Weihnachtsgebäck Rezepte" > "Rezepte für Weihnachtsgebäck"
- **Check:** Key pages optimized for exact keyword phrase order?

### 2.30 Number of Outbound Links
- **Impact:** Medium
- **What:** Too many dofollow outbound links can leak PageRank.
- **Check:** Reasonable number of outbound links per page?

### 2.31 Quality of Outbound Links
- **Impact:** Medium
- **What:** Linking to high-authority sites sends trust signals.
- **Check:** Outbound links go to authoritative, relevant sites?

### 2.32 Outbound Link Topic Relevance
- **Impact:** Medium
- **What:** Google may analyze topic of linked pages. Car site linking to movie sites = confusion.
- **Check:** Outbound links topically relevant?

### 2.33 Grammar and Spelling
- **Impact:** Low
- **What:** Quality signal. Google recommends avoiding "sloppily written text with many spelling and grammar errors."
- **Check:** Professional quality writing?

### 2.34 Original Content
- **Impact:** Critical
- **What:** Scraped/copied content won't rank as well as original. May land in supplemental index.
- **Check:** Content passes plagiarism check?

### 2.35 Supplementary Content
- **Impact:** Medium
- **What:** Google Quality Rater guidelines: helpful supplementary content (calculators, converters, interactive tools) = quality indicator.
- **Check:** Does site offer helpful tools/calculators/interactive elements?

### 2.36 Multimedia
- **Impact:** Medium
- **What:** Images, videos, multimedia elements = quality signal per Google Quality Rater 2015.
- **Check:** Pages include relevant images, videos, infographics?

### 2.37 Internal Links Pointing to Page
- **Impact:** High
- **What:** Number of internal links indicates page importance relative to other pages.
- **Check:** Key pages have sufficient internal links? Orphan pages?

### 2.38 Quality of Internal Links
- **Impact:** Medium
- **What:** Internal links from high-authority pages have stronger effect.
- **Check:** Important pages link to key conversion pages?

### 2.39 Broken Links
- **Impact:** Medium (negative)
- **What:** Too many broken links = neglected/abandoned site. Part of quality rating.
- **Check:** Zero 404 errors on internal links?

### 2.40 Reading Level
- **Impact:** Low
- **What:** Controversial whether simple or advanced reading level is better. Should match audience.
- **Check:** Reading level appropriate for target audience?

### 2.41 Affiliate Links
- **Impact:** Low (negative if excessive)
- **What:** Too many affiliate links trigger scrutiny for "thin affiliate site."
- **Check:** Reasonable affiliate link density?

### 2.42 HTML Errors / W3C Validation
- **Impact:** Low
- **What:** Many HTML errors = poor quality signal. W3C validation is weak quality signal.
- **Check:** Major HTML validation errors?

### 2.43 Domain Authority of Host
- **Impact:** Critical
- **What:** Pages on high-authority domains rank higher than low-authority domains, all else equal.
- **Check:** Domain authority score (Moz DA, Ahrefs DR)?

### 2.44 PageRank
- **Impact:** High
- **What:** Higher PR pages generally rank better. Toolbar PR discontinued March 2016 but internal PR still used.
- **Check:** Use proxy metrics (Ahrefs URL Rating, Moz Page Authority)

### 2.45 URL Length
- **Impact:** Low
- **What:** Shorter URLs correlate with better rankings.
- **Check:** URLs concise? Under 75 characters?
- **Sources:** Searchmetrics 2015, Moz 2015

### 2.46 URL Path Depth
- **Impact:** Low
- **What:** Pages closer to homepage get slight authority boost.
- **Check:** Key pages within 3 clicks of homepage?

### 2.47 Human Editors
- **Impact:** Speculative
- **What:** Google has patent allowing human influence on search results.
- **Check:** N/A (cannot audit directly)

### 2.48 Page Category
- **Impact:** Medium
- **What:** Category relevance provides ranking boost. Page should match its category topic.
- **Check:** Pages in correct, relevant categories?

### 2.49 WordPress Tags
- **Impact:** Low
- **What:** WordPress-specific relevance signal relating content to each other.
- **Check:** If WordPress: tags used meaningfully?

### 2.50 Keyword in URL
- **Impact:** Low-Medium
- **What:** Small ranking boost. Confirmed relevance signal.
- **Check:** Primary keyword in URL slug?

### 2.51 URL String Categories
- **Impact:** Low
- **What:** Categories in URL path hint at page content. e.g., `/recipes/christmas/cookies`
- **Check:** URL structure reflects site hierarchy?

### 2.52 References and Sources
- **Impact:** Low-Medium
- **What:** Citations may signal quality. Google Rater Guidelines: look for authoritative sources.
- **Check:** Content cites credible sources?

### 2.53 Bulleted/Numbered Lists
- **Impact:** Low
- **What:** Lists break up content for readability. Google may prefer this formatting.
- **Check:** Content uses structured lists where appropriate?

### 2.54 Page Priority in Sitemap
- **Impact:** Low
- **What:** Priority attribute in sitemap.xml may influence crawl priority.
- **Check:** Sitemap priorities set correctly?

### 2.55 Too Many Outbound Links
- **Impact:** Medium (negative)
- **What:** "Some pages have way too many links, obscuring the page and distracting from Main Content."
- **Check:** Pages not overloaded with links?

### 2.56 Quantity of Other Keywords Ranking
- **Impact:** Medium
- **What:** Page ranking for multiple keywords = quality signal.
- **Check:** Key pages ranking for multiple related terms?

### 2.57 Page Age
- **Impact:** Medium
- **What:** Older, regularly updated pages can outperform new ones.
- **Check:** Important pages have publication history?

### 2.58 User-Friendly Layout
- **Impact:** High
- **What:** "The page layout on highest quality pages makes the Main Content immediately visible." — Google Quality Rater
- **Check:** Main content immediately visible? Clean layout?

### 2.59 Parked Domains
- **Impact:** Low (negative)
- **What:** December 2011 update reduced visibility of parked domains.
- **Check:** Site is active with real content?

### 2.60 Useful Content
- **Impact:** Critical
- **What:** Google distinguishes between high-quality and actually useful content.
- **Check:** Content genuinely helps users solve problems?

---

## 3. Site-Level Factors (17 factors)

### 3.61 Content with Value and Unique Insights
- **Impact:** Critical
- **What:** Google hunts sites without useful info, especially affiliate-heavy sites.
- **Check:** Site provides unique value not found elsewhere?

### 3.62 Contact Page
- **Impact:** Medium
- **What:** Google Quality Rater prefers sites with "adequate" contact information matching WHOIS.
- **Check:** Contact page exists with address, phone, email?

### 3.63 Domain Trust / TrustRank
- **Impact:** Critical
- **What:** Measured by how many outbound links go to trustworthy sites. Extremely important factor.
- **Check:** DA/DR scores? Backlink profile quality?

### 3.64 Site Architecture
- **Impact:** High
- **What:** Well-organized site helps Google categorize content thematically.
- **Check:** Clear hierarchy? Logical navigation? Silo structure?

### 3.65 Site Updates / Freshness
- **Impact:** Medium
- **What:** How often new content is added signals currency.
- **Check:** Regular publishing schedule? Recent updates?

### 3.66 Number of Pages
- **Impact:** Low
- **What:** Weak authority signal. Distinguishes from thin affiliate sites.
- **Check:** Site has substantial number of quality pages?

### 3.67 Sitemap Presence
- **Impact:** High
- **What:** Helps search engines index pages more thoroughly.
- **Check:** sitemap.xml exists? Submitted to Search Console?

### 3.68 Website Uptime
- **Impact:** Medium (negative if poor)
- **What:** Extended downtime harms rankings.
- **Check:** Uptime monitoring in place? 99.9%+ uptime?

### 3.69 Server Location
- **Impact:** Medium (geo-specific)
- **What:** Server location affects geo-specific ranking.
- **Check:** Server located near target audience? CDN used?

### 3.70 SSL Certificate
- **Impact:** High
- **What:** Confirmed HTTPS as ranking signal. Google indexes SSL certificates.
- **Check:** Valid SSL? HTTPS everywhere? No mixed content?

### 3.71 Terms of Service / Privacy Pages
- **Impact:** Medium
- **What:** Signal trustworthiness.
- **Check:** ToS and Privacy Policy pages exist?

### 3.72 Duplicate Meta Information
- **Impact:** Medium (negative)
- **What:** Duplicate titles/descriptions across pages reduce visibility.
- **Check:** Every page has unique title + description?

### 3.73 Breadcrumb Navigation
- **Impact:** Medium
- **What:** Tells users and search engines where they are in site hierarchy.
- **Check:** Breadcrumbs on all pages? Schema markup?

### 3.74 Mobile Optimization
- **Impact:** Critical
- **What:** Google's official recommendation. Mobile-unfriendly sites penalized in mobile search. "Mobile-friendly" label in SERPs.
- **Check:** Responsive design? Mobile-friendly test pass?

### 3.75 YouTube
- **Impact:** Medium
- **What:** YouTube videos preferentially ranked. Traffic increased after Panda update.
- **Check:** YouTube presence? Videos embedded on site?

### 3.76 Usability
- **Impact:** High
- **What:** Difficult navigation hurts dwell time, increases bounce rate, reduces pages per session.
- **Check:** Clear navigation? Intuitive UX? Fast interactions?

### 3.77 Google Analytics / Search Console
- **Impact:** Low-Medium
- **What:** May help indexing and provide Google more behavioral data.
- **Check:** GA and GSC installed and configured?

### 3.78 Reviews / Reputation
- **Impact:** Medium
- **What:** Third-party reviews (Yelp, etc.) play role in algorithm.
- **Check:** Positive reviews on major platforms?

---

## 4. Backlink Factors (50 factors)

### 4.79 Linking Domain Age
- **Impact:** Medium
- **What:** Links from old domains more powerful than new domains.
- **Check:** Age distribution of linking domains

### 4.80 Number of Linking Root Domains
- **Impact:** Critical
- **What:** One of the most important factors. Strong correlation with rankings (Moz).
- **Check:** Total unique referring domains

### 4.81 Links from Different IP C-Classes
- **Impact:** High
- **What:** Diverse IP ranges suggest natural link profile. Adjacent IPs may be same owner.
- **Check:** IP diversity in backlink profile

### 4.82 Number of Linking Pages
- **Impact:** High
- **What:** Total linking pages (even from same domain) is ranking factor.
- **Check:** Total backlink count

### 4.83 Alt Tag for Image Links
- **Impact:** Low
- **What:** Alt text = anchor text equivalent for image links.
- **Check:** Image links have descriptive alt text

### 4.84 Authority of Linking Pages
- **Impact:** Critical
- **What:** PageRank/authority of linking page is extremely important.
- **Check:** Average authority of linking pages

### 4.85 Links from .edu/.gov
- **Impact:** Medium-High (debated)
- **What:** Matt Cutts says TLDs don't matter, but SEOs believe .edu/.gov carry extra weight.
- **Check:** Any .edu or .gov referring domains?

### 4.86 Authority of Linking Domain
- **Impact:** Critical
- **What:** PR2 page on PR8 domain (Yale.edu) > PR2 page on PR3 domain.
- **Check:** Domain authority distribution of backlinks

### 4.87 Links from Competitors
- **Impact:** Medium
- **What:** Links from pages ranking for same keywords may be more valuable.
- **Check:** Competitor link overlap

### 4.88 Social Shares of Linking Page
- **Impact:** Low
- **What:** Social shares of the page containing your link may increase its value.
- **Check:** Social engagement of linking pages

### 4.89 Links from Bad Neighborhoods
- **Impact:** High (negative)
- **What:** Links from link farms/spam sites hurt rankings.
- **Check:** Toxic link scan

### 4.90 Guest Posts
- **Impact:** Low-Medium
- **What:** Links in author bios less valuable than contextual in-content links.
- **Check:** Guest post links mostly contextual?

### 4.91 Links to Linking Domain's Homepage
- **Impact:** Low
- **What:** Links to the homepage of the domain linking to you increase that link's value.
- **Check:** Linking domains have strong homepage link profiles?

### 4.92 Nofollow Links
- **Impact:** Low
- **What:** Google officially doesn't follow them, but may in some cases. Natural profiles have some nofollow.
- **Check:** Healthy nofollow/dofollow ratio?

### 4.93 Link Type Diversity
- **Impact:** High
- **What:** Links from single source type (e.g., only forum profiles) = webspam signal. Need variety.
- **Check:** Mix of editorial, guest post, directory, social, etc.?

### 4.94 Sponsored Link Words
- **Impact:** Medium (negative)
- **What:** "Sponsored", "link partner", "sponsored links" near a link reduce its value.
- **Check:** Links free from sponsored language?

### 4.95 Contextual Links
- **Impact:** High
- **What:** Links embedded in content > links on empty pages, sidebars, or footers.
- **Check:** Majority of links are contextual in-content?

### 4.96 Excessive 301 Redirects
- **Impact:** Medium (negative)
- **What:** Links through 301 redirects lose most PageRank (Google Webmaster Help Video).
- **Check:** Redirect chains in backlink profile?

### 4.97 Backlink Anchor Text
- **Impact:** High
- **What:** "Anchors often provide more accurate descriptions of web pages than the pages themselves." Still strong signal, though less than before.
- **Check:** Anchor text distribution — branded, keyword, generic, URL?

### 4.98 Internal Link Anchor Text
- **Impact:** Medium
- **What:** Another relevance signal. Over-optimization can be harmful.
- **Check:** Internal anchors descriptive but natural?

### 4.99 Link Title
- **Impact:** Low
- **What:** Hover text on links = weak relevance signal.
- **Check:** Links have title attributes?

### 4.100 Link Position on Page
- **Impact:** Medium
- **What:** Content-embedded links > footer/sidebar links.
- **Check:** Where are links placed on linking pages?

### 4.101 Links from Country-Specific Domains
- **Impact:** Medium
- **What:** Links from .de, .fr etc. help rank in those countries.
- **Check:** Country distribution of backlinks matches target markets?

### 4.102 Link Position in Content
- **Impact:** Low-Medium
- **What:** Links at beginning of content slightly more weight than at end.
- **Check:** High-value links placed early in content?

### 4.103 Linking Page Relevance
- **Impact:** Critical
- **What:** Link from same/similar niche is far more valuable than unrelated site.
- **Check:** Topical relevance of linking pages

### 4.104 Page-Level Relevance (Hilltop)
- **Impact:** High
- **What:** Hilltop Algorithm: links from topically related expert pages weigh much more.
- **Check:** Links from topic authorities?

### 4.105 Surrounding Text Sentiment
- **Impact:** Medium
- **What:** Links surrounded by positive text may have higher value than those in negative reviews.
- **Check:** Context of link placement

### 4.106 Keyword in Linking Page Title
- **Impact:** Medium
- **What:** Extra attention to links from pages with same keyword in title.
- **Check:** Linking page titles contain your target keywords?

### 4.107 Positive Link Velocity
- **Impact:** High
- **What:** Steady growth of new links = rising popularity.
- **Check:** Link acquisition trend — steady growth?

### 4.108 Negative Link Velocity
- **Impact:** High (negative)
- **What:** Declining link acquisition = decreasing popularity, hurts rankings.
- **Check:** Are you losing links faster than gaining?

### 4.109 Links from Hub Pages
- **Impact:** High
- **What:** Links from recognized authority/hub pages ("best resources" on topic) get special attention.
- **Check:** Any links from known resource/hub pages?

### 4.110 Backlink Age
- **Impact:** Medium
- **What:** Google Patent: old links have higher impact than new links.
- **Check:** Backlink profile includes established old links?

### 4.111 Links from Authority Sites
- **Impact:** Critical
- **What:** Authority site link passes more juice than small niche site link.
- **Check:** Links from recognized authority sites?

### 4.112 Links from Wikipedia
- **Impact:** Medium
- **What:** Although nofollow, Wikipedia links may confer extra trust.
- **Check:** Wikipedia citations?

### 4.113 Co-Occurrences
- **Impact:** Medium
- **What:** Words surrounding backlinks help Google understand page topic.
- **Check:** Link context contains relevant terms?

### 4.114 Links from Real Sites vs Splogs
- **Impact:** High
- **What:** Google values links from genuine websites over spam blogs. Uses user interaction and brand signals to distinguish.
- **Check:** Backlinks from legitimate sites?

### 4.115 Natural Link Profile
- **Impact:** Critical
- **What:** Natural profiles rank higher and survive algorithm updates.
- **Check:** Link profile looks organic? No patterns?

### 4.116 Reciprocal Links
- **Impact:** Medium (negative if excessive)
- **What:** Excessive link exchange = link scheme to avoid.
- **Check:** Low reciprocal link ratio?

### 4.117 User-Generated Content Links
- **Impact:** Low
- **What:** Google distinguishes author links from UGC links (e.g., WordPress.com official vs random blog).
- **Check:** UGC links not dominant in profile?

### 4.118 Links from 301 Redirects
- **Impact:** Medium
- **What:** May lose some link juice vs direct links. Matt Cutts says 301 ≈ direct link.
- **Check:** Significant redirected backlinks?

### 4.119 Schema.org Microformats
- **Impact:** Medium
- **What:** Sites with microformats may rank above those without. Could be direct boost or higher CTR.
- **Check:** Schema.org markup implemented?

### 4.120 TrustRank of Linking Site
- **Impact:** Critical
- **What:** Trust passed from linking site is crucial.
- **Check:** TrustRank/trust flow of linking domains

### 4.121 DMOZ Listing
- **Impact:** Low (deprecated)
- **What:** DMOZ-listed sites may get extra trust. DMOZ is now closed.
- **Check:** N/A (historical)

### 4.122 Outgoing Links on Linking Page
- **Impact:** Medium
- **What:** Link from page with hundreds of links passes less PR than page with few links.
- **Check:** Link pages have reasonable outbound link counts?

### 4.123 Forum Profile Links
- **Impact:** Low
- **What:** Forum profile links significantly devalued due to spam.
- **Check:** Not relying on forum profile links?

### 4.124 Content Length of Linking Page
- **Impact:** Medium
- **What:** Link from 1000-word article > link from 25-word snippet.
- **Check:** Linking pages have substantial content?

### 4.125 Quality of Linking Content
- **Impact:** High
- **What:** Well-written content with multimedia passes more value than poorly written content.
- **Check:** Linking pages are quality content?

### 4.126 Sitewide Links
- **Impact:** Low
- **What:** Matt Cutts confirmed sitewide links compressed to single link.
- **Check:** Not relying on sitewide links for link count?

---

## 5. User Interactions (8 factors)

### 5.127 Organic CTR for Keyword
- **Impact:** High
- **What:** High CTR pages may get SERP boost for that keyword.
- **Check:** CTR in Search Console above average for position?

### 5.128 Organic CTR for All Keywords
- **Impact:** Medium
- **What:** Overall CTR = user interaction signal for the site.
- **Check:** Site-wide CTR trends

### 5.129 Bounce Rate
- **Impact:** Medium
- **What:** High bounce = users "quality testing" pages negatively.
- **Check:** Bounce rate reasonable? Below industry average?

### 5.130 Direct Traffic
- **Impact:** High
- **What:** Google uses Chrome data. Sites with high direct traffic = quality sites.
- **Check:** Significant direct traffic volume?

### 5.131 Returning Traffic
- **Impact:** Medium
- **What:** Repeat visitors = quality signal.
- **Check:** Good returning visitor ratio?

### 5.132 Blocked Sites (Chrome)
- **Impact:** Low (deprecated)
- **What:** Formerly used by Panda. Feature discontinued.
- **Check:** N/A

### 5.133 Chrome Bookmarks
- **Impact:** Low-Medium
- **What:** Frequently bookmarked sites may get boost.
- **Check:** N/A (can't measure directly)

### 5.134 Comment Count
- **Impact:** Low
- **What:** Many comments = user interaction and quality signal.
- **Check:** Active comment sections on blog content?

### 5.135 Google Toolbar Data
- **Impact:** Low
- **What:** Google may use toolbar data beyond speed and malware.
- **Check:** N/A

### 5.136 Dwell Time
- **Impact:** High
- **What:** "Long clicks" vs "short clicks." More time on page from SERP = quality signal.
- **Check:** Average session duration from search?

---

## 6. Special Algorithm Rules (19 factors)

### 6.137 Freshness for Time-Sensitive Queries
- **Impact:** High
- **What:** Fresh content boosted for news/trending queries.
- **Check:** Time-sensitive content updated frequently?

### 6.138 Search Result Diversity
- **Impact:** Medium
- **What:** Google adds diversity for ambiguous keywords.
- **Check:** N/A (algorithmic)

### 6.139 User Browsing History
- **Impact:** Medium
- **What:** Frequently visited sites get personal ranking boost.
- **Check:** N/A (personalization)

### 6.140 User Search History
- **Impact:** Medium
- **What:** Previous searches influence future results.
- **Check:** N/A (personalization)

### 6.141 Safe Search
- **Impact:** Low
- **What:** Profane/explicit content filtered when SafeSearch active.
- **Check:** No inappropriate content?

### 6.142 Google+ Circles
- **Impact:** Low (deprecated)
- **What:** Google+ is shut down.
- **Check:** N/A

### 6.143 DMCA Complaints
- **Impact:** High (negative)
- **What:** Many DMCA complaints = ranking penalty.
- **Check:** No copyright violations?

### 6.144 Geo-Targeting
- **Impact:** High
- **What:** Local IP + ccTLD preferred for geo-specific results.
- **Check:** Proper geo-targeting configured?

### 6.145 Domain Diversity
- **Impact:** Medium
- **What:** Bigfoot Update (2012) added more domain diversity to SERPs.
- **Check:** N/A (algorithmic)

### 6.146 Shopping Searches
- **Impact:** Medium
- **What:** Different results for shopping-related queries.
- **Check:** Product schema + Google Merchant Center configured?

### 6.147 Local Searches
- **Impact:** High
- **What:** Google local results above organic. Google Business Profile critical.
- **Check:** Google Business Profile claimed and optimized?

### 6.148 Brand Preference (Vince Update)
- **Impact:** High
- **What:** Big brands boosted for short, competitive keywords.
- **Check:** N/A (algorithmic)

### 6.149 Shopping Results in SERP
- **Impact:** Medium
- **What:** Google Shopping results appear in organic SERPs.
- **Check:** Google Merchant Center active?

### 6.150 Image Search Results
- **Impact:** Medium
- **What:** Image-heavy search terms show image carousel in SERPs.
- **Check:** Images optimized for image search?

### 6.151 Easter Egg Results
- **Impact:** None (fun)
- **What:** Special results for certain keywords.
- **Check:** N/A

### 6.152 Brand Dominance
- **Impact:** Medium
- **What:** Brand-related keywords show multiple results from same domain.
- **Check:** Strong brand identity established?

### 6.153 Google News Box
- **Impact:** Medium
- **What:** Certain keywords trigger news box.
- **Check:** News-worthy content? Google News inclusion?

### 6.154 Big Brand Preference
- **Impact:** High
- **What:** Large brands get SERP preference for competitive terms.
- **Check:** Brand building strategy?

### 6.155 Google Shopping in SERP
- **Impact:** Medium
- **What:** Shopping results in organic SERPs.
- **Check:** Product data feeds configured?

---

## 7. Social Signals (9 factors)

### 7.156 Tweet Count
- **Impact:** Low-Medium
- **What:** Number of tweets linking to page may influence ranking.
- **Check:** Content being shared on Twitter?

### 7.157 Twitter Account Authority
- **Impact:** Medium
- **What:** Tweets from old accounts with many followers > new accounts.
- **Check:** Brand Twitter account established with real followers?

### 7.158 Facebook Likes Count
- **Impact:** Low
- **What:** Google can't see most FB data but may count public likes.
- **Check:** Facebook page engagement?

### 7.159 Facebook Shares
- **Impact:** Low-Medium
- **What:** Shares > Likes (more similar to backlinks).
- **Check:** Content getting Facebook shares?

### 7.160 Facebook Account Authority
- **Impact:** Low-Medium
- **What:** Shares from popular pages carry more weight.
- **Check:** Brand FB page authority?

### 7.161 Pinterest Pins
- **Impact:** Low
- **What:** Pinterest data is public. Pins may be social signal.
- **Check:** Visual content pinned on Pinterest?

### 7.162 Votes on Social Sharing Platforms
- **Impact:** Low
- **What:** Reddit upvotes, StumbleUpon, Digg may count.
- **Check:** Content shared on Reddit/forums?

### 7.163 Google+ (deprecated)
- **Impact:** None
- **Check:** N/A

### 7.164 Social Signal Relevance
- **Impact:** Low-Medium
- **What:** Google considers relevance of sharing account and surrounding text.
- **Check:** Social shares from relevant accounts?

---

## 8. Brand Signals (13 factors)

### 8.165 Brand Name in Anchor Text
- **Impact:** High
- **What:** Simple but strong brand signal. Searchmetrics 2015: more brand-character domains in top 30.
- **Check:** Natural branded anchor text in backlink profile?

### 8.166 Branded Searches
- **Impact:** High
- **What:** Users searching for your brand tells Google you're a brand.
- **Check:** Search volume for brand name?

### 8.167 Facebook Page with Likes
- **Impact:** Medium
- **What:** Brands have Facebook pages with significant likes.
- **Check:** Facebook page exists with real engagement?

### 8.168 Twitter with Followers
- **Impact:** Medium
- **What:** Twitter account with many followers = popular brand.
- **Check:** Active Twitter with real followers?

### 8.169 LinkedIn / Xing Company Page
- **Impact:** Low-Medium
- **What:** Most known brands have LinkedIn/Xing presence.
- **Check:** LinkedIn company page exists?

### 8.170 Listed Employees on LinkedIn
- **Impact:** Low
- **What:** Multiple profiles listing same employer = brand signal (Rand Fishkin).
- **Check:** Employees list company on LinkedIn?

### 8.171 Social Media Account Legitimacy
- **Impact:** Medium
- **What:** 10k followers with 2 posts ≠ 10k followers with thousands of posts and engagement.
- **Check:** Social accounts show genuine activity?

### 8.172 Brand Mentions (Unlinked)
- **Impact:** Medium
- **What:** Google values unlinked brand mentions as brand signal. Searchmetrics 2015 confirms increasing role.
- **Check:** Brand mentioned on relevant sites without links?

### 8.173 Brand Mentions on News Sites
- **Impact:** High
- **What:** Big brands frequently mentioned on news sites.
- **Check:** Press coverage and news mentions?

### 8.174 RSS Subscribers
- **Impact:** Low (declining relevance)
- **What:** High RSS subscriber count = brand signal (Feedburner owned by Google).
- **Check:** N/A (RSS declining)

### 8.175 Local Listing / Google Business Profile
- **Impact:** High
- **What:** Real businesses have physical locations. Google checks geo-information.
- **Check:** Google Business Profile claimed? Accurate NAP?

### 8.176 Tax-Paying Business
- **Impact:** Medium
- **What:** Moz reports Google checks if site is connected to registered business.
- **Check:** Business legally registered?

### 8.177 Known Authorship
- **Impact:** Medium
- **What:** Google likely identifies renowned content producers and boosts them.
- **Check:** Author bios established? E-E-A-T signals?

---

## 9. On-Site WebSpam Factors (10 factors)

### 9.178 Panda Penalty
- **Impact:** Critical (negative)
- **What:** Low-quality content / content farms get visibility reduction.
- **Check:** All pages have substantial, unique content?

### 9.179 Links to Bad Neighborhoods
- **Impact:** High (negative)
- **What:** Linking to spam/scam sites hurts ranking.
- **Check:** No outbound links to suspicious sites?

### 9.180 Cloaking / Sneaky Redirects
- **Impact:** Critical (negative)
- **What:** Can lead to de-indexing.
- **Check:** Same content served to users and Googlebot?

### 9.181 Popups / Intrusive Ads
- **Impact:** Medium (negative)
- **What:** Google Quality Rater: popups and intrusive ads = low quality signal.
- **Check:** No intrusive interstitials on mobile?

### 9.182 Over-Optimization (Site)
- **Impact:** High (negative)
- **What:** Keyword-stuffed headers, excessive keyword decoration.
- **Check:** Natural keyword usage? No stuffing?

### 9.183 Over-Optimization (Page)
- **Impact:** High (negative)
- **What:** Penguin looks at individual pages and keywords.
- **Check:** No single page over-optimized for one term?

### 9.184 Ads Above the Fold
- **Impact:** Medium (negative)
- **What:** Page Layout Algorithm penalizes too much ads, not enough content above fold.
- **Check:** Main content visible without scrolling?

### 9.185 Hidden Affiliate Links
- **Impact:** High (negative)
- **What:** Hiding affiliates + cloaking = penalty risk.
- **Check:** All affiliate links transparent?

### 9.186 Affiliate-Heavy Sites
- **Impact:** Medium (negative)
- **What:** Sites heavily monetized via affiliates get extra scrutiny.
- **Check:** Site provides value beyond affiliate links?

### 9.187 Auto-Generated Content
- **Impact:** Critical (negative)
- **What:** Computer-generated content can lead to penalty or de-indexing.
- **Check:** All content human-written or human-reviewed?

### 9.188 PageRank Sculpting
- **Impact:** Medium (negative)
- **What:** Excessive nofollow on internal links to hoard PageRank = gaming signal.
- **Check:** Natural internal nofollow usage?

### 9.189 Spam-Flagged IP
- **Impact:** High (negative)
- **What:** Spam-flagged server IP harms all sites on server.
- **Check:** IP blacklist check?

### 9.190 Meta Tag Spamming
- **Impact:** High (negative)
- **What:** Keyword-stuffed meta tags trigger penalty.
- **Check:** Meta tags natural and within length limits?

---

## 10. Off-Page WebSpam Factors (13 factors)

### 10.191 Unnatural Link Spike
- **Impact:** Critical (negative)
- **What:** Sudden massive increase in links = fake links.
- **Check:** Link velocity graph smooth?

### 10.192 Penguin Penalty
- **Impact:** Critical (negative)
- **What:** Sites hit by Penguin have dramatically reduced visibility.
- **Check:** No Penguin penalty indicators?

### 10.193 Low-Quality Link Profile
- **Impact:** Critical (negative)
- **What:** High percentage of blog comment links, forum profiles, etc. = spam signal.
- **Check:** Link type distribution healthy?

### 10.194 Linking Domain Relevance
- **Impact:** High (negative if irrelevant)
- **What:** Many links from unrelated domains = Penguin suspicion.
- **Check:** Linking domains topically relevant?

### 10.195 Unnatural Link Warnings
- **Impact:** Critical (negative)
- **What:** Google Webmaster Tools warnings about unnatural links usually precede ranking drops.
- **Check:** No GSC manual action warnings?

### 10.196 Links from Same C-Class IPs
- **Impact:** Medium (negative)
- **What:** Unnatural number of links from same IP range = blog network.
- **Check:** No suspicious IP clustering?

### 10.197 Toxic Anchor Text
- **Impact:** High (negative)
- **What:** Spammy anchor text = spam or hacked site signal.
- **Check:** No toxic/adult/pharma anchor text?

### 10.198 Manual Penalty
- **Impact:** Critical (negative)
- **What:** Google issues manual penalties (e.g., Interflora case).
- **Check:** No manual actions in Search Console?

### 10.199 Selling Links
- **Impact:** High (negative)
- **What:** Selling links can reduce PageRank and visibility.
- **Check:** Not selling/buying links?

### 10.200 Google Sandbox
- **Impact:** Medium (negative, temporary)
- **What:** New sites with rapid link growth may be sandboxed.
- **Check:** If new site, expect initial limited visibility

### 10.201 Google Dance
- **Impact:** Low
- **What:** Temporary ranking shuffles. Google may test if sites try to game rankings.
- **Check:** N/A (temporary)

### 10.202 Disavow Tool
- **Impact:** Medium (remedial)
- **What:** Can remove penalties from negative SEO by disavowing toxic links.
- **Check:** Disavow file maintained if needed?

### 10.203 Reconsideration Request
- **Impact:** Medium (remedial)
- **What:** Can lift manual penalties.
- **Check:** If penalized, file reconsideration after fixing issues

---

## Quick Audit Checklist

### Must-Pass (P0/P1)
- [ ] SSL/HTTPS active
- [ ] Mobile responsive
- [ ] Title tags with keywords (50-60 chars)
- [ ] Unique meta descriptions (<=160 chars)
- [ ] One H1 per page with keyword
- [ ] Page speed < 3s (LCP < 2.5s)
- [ ] No duplicate content
- [ ] Original, valuable content (1500+ words on key pages)
- [ ] Sitemap.xml submitted
- [ ] No broken links (internal)
- [ ] Canonical tags on all pages
- [ ] No manual actions in GSC
- [ ] Natural backlink profile
- [ ] No cloaking or hidden content

### Should-Pass (P2)
- [ ] Alt text on all images
- [ ] Breadcrumb navigation
- [ ] Schema.org markup
- [ ] Internal linking structure
- [ ] Contact page with real info
- [ ] ToS / Privacy pages
- [ ] Clean HTML (minimal errors)
- [ ] Short, keyword-rich URLs
- [ ] Content update frequency
- [ ] LSI keywords in content

### Nice-to-Have (P3)
- [ ] Social media presence
- [ ] YouTube content
- [ ] Google Business Profile
- [ ] Brand search volume
- [ ] Diverse link types
- [ ] Author bios / E-E-A-T
- [ ] RSS feed
- [ ] LinkedIn company page
