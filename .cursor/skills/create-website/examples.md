# Store Examples, Inspirations & Niche Reference

Use this file when creating a new store. Find the **closest niche match** below and use that store as your starting reference for components, section order, design tokens, and data structure.

---

## Niche Lookup Table

| If the new store is about… | Use as inspiration | Theme to clone from |
|---|---|---|
| F1, motorsport, racing apparel, automotive clothing, car merch | **f1racingapparel** | `bikes` |
| Automotive lifestyle, driver gear, motorcycle apparel, vehicle accessories | **f1racingapparel** | `bikes` |
| Luxury handbags, designer bags, fashion accessories | **RepBag** | `apparel` |
| Luxury sneakers, designer shoes, footwear | **DesignerShoes** | `luxury-sneakers` |
| Luxury watches, jewelry, timepieces | **DesignerWatch** | `luxury-watches` |
| IPTV, streaming, digital subscriptions, OTT platforms | **FastIPTV** | `iptv` |
| Digital gift cards, vouchers, fintech marketplace, gift card store | **GlobalGiftCards** | `digital-marketplace` |
| SaaS, dental, clinic, agency, digital products | **Atlagia / Dentagia** | `saas` |
| Generic e-commerce (no close match) | **Abstract** | `base` |

---

## 1. F1 Racing Apparel — Motorsport / Automotive / Apparel (PRIMARY AUTOMOTIVE REFERENCE)

**Use when:** Building ANY store related to F1, motorsport, racing gear, automotive clothing, car brand apparel, motorsport lifestyle, vehicle accessories, motorcycle gear, driver merch, or any automotive niche. This is the **best and most complete automotive example** in the codebase (34 components, richest section set).

**Store:** `src/websites/f1racingapparel/themes/bikes/`
**Env:** `.env.f1racingapparel` — PORT 7000, PROJECT_TYPE physical, THEME bikes

### Design Direction
- Bold, cinematic, dark-dominant (`#0a0a0a` bg)
- Racing energy: speed lines, high-contrast accents
- Display font: strong sans-serif; body: clean sans
- Accent color: race-inspired (red, yellow, or team-specific)

### Components (34 total — richest apparel store)

| Component | Purpose | Unique to this niche? |
|---|---|---|
| `Welcome.astro` | Hero with video/cinematic imagery | — |
| `StatsBar.astro` | Credentials strip | — |
| `CarBrandsStrip.astro` | Horizontal brand logo marquee (Ferrari, McLaren, etc.) | **Yes** |
| `CategoryGrid.astro` | Collection cards | — |
| `CategoryHighlightBlocks.astro` | Large feature blocks per category | **Yes** |
| `BestSellers.astro` | Product grid | — |
| `SeasonDrop.astro` | Current season/limited edition showcase | **Yes** |
| `ManifestoSection.astro` | Brand philosophy statement | **Yes** |
| `LifestyleSection.astro` | Full-bleed lifestyle imagery | **Yes** |
| `EditorialQuote.astro` | Pull quote / divider | **Yes** |
| `RacingArchive.astro` | Heritage/archive imagery | **Yes** |
| `Banner.astro` | Lifestyle CTA banner | — |
| `Video.astro` | Embedded video block | — |
| `Marquee.astro` | Scrolling text strip | **Yes** |
| `PressStrip.astro` | "As seen in" press logos | **Yes** |
| `FollowStrip.astro` | Social follow bar | **Yes** |
| `ProductShowcase.astro` | New arrivals grid | — |
| `SpecialOffers.astro` | Promo/sale section | — |
| `TrustBadges.astro` | Trust icons | — |
| `FeaturesSection.astro` | USP pillars | — |
| `SocialProof.astro` | Social proof bar | — |
| `FeaturedPosts.astro` | Journal/blog cards | — |
| `FaqSection.astro` | FAQ accordion | — |
| `TestimonialSlider.astro` | Customer quotes | — |
| `EmailSignup.astro` | Newsletter | — |
| `Footer.astro` | Footer | — |

### Section Order Pattern (AIDA mapped)

```
Hero [FULL]                    → ATTENTION
StatsBar [STRIP]               → ATTENTION
CarBrandsStrip [STRIP]         → ATTENTION (unique: brand logos)
CategoryGrid [CONTAINED]       → INTEREST
BestSellers [CONTAINED]        → INTEREST
SeasonDrop [CONTAINED]         → INTEREST (unique: limited edition)
ManifestoSection [CONTAINED]   → DESIRE (unique: brand philosophy)
Banner [FULL]                  → DESIRE
LifestyleSection [FULL]        → DESIRE (unique: cinematic)
EditorialQuote [STRIP]         → DESIRE (divider)
ProductShowcase [CONTAINED]    → INTEREST
TrustBadges [CONTAINED]        → DESIRE
FeaturedPosts [CONTAINED]      → ACTION
TestimonialSlider [CONTAINED]  → ACTION
EmailSignup [CONTAINED]        → ACTION
```

### Key Lessons
- **Brand logo strip** (CarBrandsStrip) builds instant credibility for licensed/inspired apparel
- **Season drop** creates urgency for limited collections
- **Manifesto** replaces generic "About" with emotional brand statement
- **Editorial quote** breaks long contained runs (same role as DividerBlock)
- Unique components make the store feel specialized, not generic

---

## 2. FastIPTV — IPTV / Streaming / Digital Subscriptions

**Use when:** Building stores for IPTV services, streaming platforms, OTT subscriptions, channel packages, media services.

**Store:** `src/websites/FastIPTV/themes/iptv/`
**Env:** `.env.fastiptv` — PORT 4322, PROJECT_TYPE iptv, THEME iptv

### Design Direction
- Dark theme (streaming feel)
- Gradient accents (purple/blue/cyan typical for streaming)
- Display font: modern sans; body: clean sans
- Card-heavy layout (pricing tiers, channel grids)

### Components (12 total — focused, no physical-product components)

| Component | Purpose | Unique to this niche? |
|---|---|---|
| `Welcome.astro` | Hero with streaming preview | — |
| `Features.astro` | Service USPs (4K, channels count, devices) | **Yes** |
| `Channels.astro` | Channel grid / category showcase | **Yes** |
| `VideoDemo.astro` | Service demo video | **Yes** |
| `Pricing.astro` | Subscription tier cards | **Yes** |
| `Devices.astro` | Supported devices showcase | **Yes** |
| `Testimonials.astro` | Customer reviews | — |
| `FAQ.astro` | Common questions | — |
| `CTA.astro` | Final conversion CTA | **Yes** |
| `Footer.astro` | Footer | — |

### Section Order Pattern (AIDA mapped)

```
Welcome [FULL]          → ATTENTION
Features [CONTAINED]    → INTEREST (unique: service USPs)
Channels [CONTAINED]    → INTEREST (unique: content showcase)
VideoDemo [FULL]        → DESIRE (unique: live demo)
Pricing [CONTAINED]     → DESIRE (unique: subscription tiers)
Devices [CONTAINED]     → DESIRE (unique: compatibility)
Testimonials [CONTAINED]→ ACTION
FAQ [CONTAINED]         → ACTION
CTA [FULL]              → ACTION (unique: final push)
```

### Key Lessons
- **No physical-product components** (no cart, no size chart, no shipping)
- `PROJECT_TYPE=iptv` hides physical-only sections (care instructions, size chart)
- **Pricing component** replaces product grid — subscription tiers are the "products"
- **Channels** replaces category grid — content catalog is the discovery mechanism
- **Devices** builds trust by showing platform compatibility
- **CTA at bottom** is a full-bleed final conversion push (not newsletter)
- Fewer sections (9) — digital services need less scrolling than physical goods

---

## 2.5 GlobalGiftCards — Digital Gift Cards / Fintech Marketplace (REFERENCE FOR SIMILAR BUILDS)

**Use when:** Building stores for digital gift cards, vouchers, prepaid codes, fintech marketplaces, or similar digital-product marketplaces. **Clone this theme** when the next website is similar (gift cards, vouchers, digital delivery, fintech SaaS-style).

**Store:** `src/websites/GlobalGiftCards/themes/digital-marketplace/`
**Env:** `.env.globalgiftcards` — PORT 7011, PROJECT_TYPE digital, THEME digital-marketplace

### Design Direction
- Light fintech / premium SaaS: white bg, subtle gradients, indigo/purple accents
- Plus Jakarta Sans (display) + DM Sans (body)
- CSS prefix: `--ggc-*` (ggc-bg, ggc-accent, ggc-text, ggc-muted, etc.)
- Rounded cards, glassmorphism, modern iconography
- Premium digital marketplace aesthetic

### Components (18 total — gift card / marketplace specific)

| Component | Purpose | Unique to this niche? |
|---|---|---|
| `Welcome.astro` | Centered hero, trust pills, brand tiles | **Yes** (fintech light hero) |
| `CategoryStrip.astro` | Horizontal category quick links | — |
| `PopularCategories.astro` | Brand tiles (PlayStation, Xbox, Netflix, etc.) with colored cards | **Yes** |
| `CategoryGrid.astro` | Full category grid (Gaming, Entertainment, Retail, etc.) | — |
| `BestSellers.astro` | Product grid, instant-delivery badge | — |
| `FeaturedDeals.astro` | Promo banner with glowing card visuals | **Yes** |
| `Banner.astro` | Full-bleed delivery/trust banner | — |
| `BrandStory.astro` | Trust / marketplace quote + image | — |
| `WhyChooseGlobalGiftCards.astro` | USP pillars | **Yes** |
| `ProductShowcase.astro` | New gift cards grid | — |
| `GiftIdeas.astro` | Curated blocks (gamers, travelers, shoppers, movie lovers) | **Yes** |
| `StatsBar.astro` | Trust strip (instant delivery, secure, 24/7) | — |
| `TestimonialSlider.astro` | Customer quotes | — |
| `NewsSection.astro` | Blog/news cards | — |
| `EmailSignup.astro` | Newsletter (glass-style box) | — |
| `Header.astro` | Search, nav, cart, language | — |
| `Footer.astro` | Categories, support, payments, social | — |

### Section Order Pattern (AIDA mapped)

```
Welcome [FULL]                    → ATTENTION (centered, light)
CategoryStrip [STRIP]             → ATTENTION
PopularCategories [CONTAINED]     → INTEREST (brand tiles, 6-col grid)
CategoryGrid [CONTAINED]          → INTEREST
BestSellers [CONTAINED]           → INTEREST
FeaturedDeals [FULL]              → DESIRE (glowing promo)
Banner [FULL]                     → DESIRE
BrandStory [CONTAINED]            → DESIRE
WhyChoose [CONTAINED]             → DESIRE
ProductShowcase [CONTAINED]       → INTEREST
GiftIdeas [CONTAINED]             → DESIRE
StatsBar [STRIP]                  → DESIRE (trust)
TestimonialSlider [CONTAINED]     → ACTION
NewsSection [CONTAINED]           → ACTION
EmailSignup [CONTAINED]           → ACTION
```

### Key Lessons
- **PopularCategories** — brand-name tiles (PlayStation, Xbox, Netflix, etc.) with solid-color backgrounds; clone for any gift-card/voucher marketplace
- **Welcome** — light, centered fintech hero with trust pills and brand tiles (not dark split layout)
- **FeaturedDeals** — gradient + glowing card visuals for promo sections
- **GiftIdeas** — curated blocks for personas (gamers, travelers, etc.)
- PROJECT_TYPE digital; CDN images in index_en.json (homepage-graphics workflow)

---

## 3. DesignerShoes — Luxury Sneakers / Footwear

**Use when:** Building stores for designer sneakers, luxury footwear, shoe boutiques, streetwear kicks.

**Store:** `src/websites/DesignerShoes/themes/luxury-sneakers/`
**Env:** `.env.designershoes` — PORT 7006, THEME luxury-sneakers

### Design Direction
- Luxury dark or light with bold product photography
- Accent: brand-signature (gold, red, or electric)
- Display font: refined serif or strong sans; body: clean sans
- Product-forward: large images, minimal text

### Components (15 total)

| Component | Purpose | Unique to this niche? |
|---|---|---|
| `Welcome.astro` | Hero with hero shoe | — |
| `CategoryGrid.astro` | Collection cards | — |
| `BestSellers.astro` | Product grid | — |
| `BrandStory.astro` | Brand heritage | — |
| `ProductShowcase.astro` | New arrivals | — |
| `LifestyleBanner.astro` | Aspirational imagery | — |
| `WhyChooseDesignerShoes.astro` | USP pillars specific to shoes | **Yes** |
| `SocialGallery.astro` | Instagram/social feed | **Yes** |
| `TrustBadges.astro` | Trust icons | — |
| `Banner.astro` | Lifestyle CTA | — |
| `TestimonialSlider.astro` | Customer quotes | — |
| `EmailSignup.astro` | Newsletter | — |
| `Footer.astro` | Footer | — |

### Section Order Pattern (AIDA mapped)

```
Welcome [FULL]                    → ATTENTION
CategoryGrid [CONTAINED]          → INTEREST
BestSellers [CONTAINED]           → INTEREST
BrandStory [CONTAINED 2COL]       → DESIRE
ProductShowcase [CONTAINED]        → INTEREST
LifestyleBanner [FULL]             → DESIRE
WhyChooseDesignerShoes [CONTAINED] → DESIRE (unique: shoe-specific USPs)
SocialGallery [CONTAINED]          → DESIRE (unique: social feed)
TestimonialSlider [CONTAINED]      → ACTION
EmailSignup [CONTAINED]            → ACTION
```

### Key Lessons
- **SocialGallery** is powerful for sneaker/streetwear brands (Instagram culture)
- **WhyChoose** component is niche-specific — adapt the name and content per store
- Missing credentials strip (statsBar) — recommended to add
- Product photography is king in footwear; hero should be product-focused, not lifestyle

---

## 4. DesignerWatch — Luxury Watches / Jewelry / Timepieces

**Use when:** Building stores for luxury watches, jewelry, fine accessories, high-end collectibles.

**Store:** `src/websites/DesignerWatch/themes/luxury-watches/`
**Env:** `.env.designerwatch` — PORT 7010, THEME luxury-watches

### Design Direction
- Dark luxury (`#0a0a0a` bg, gold `#c9a962` accent)
- Serif display font (Cormorant Garamond) + clean body (DM Sans)
- Cinematic video hero, macro product photography
- Heritage/story-driven (Rolex/Patek/AP inspiration)

### Components (19 total — richest luxury store)

| Component | Purpose | Unique to this niche? |
|---|---|---|
| `Welcome.astro` | Hero with YouTube video bg | — |
| `StatsBar.astro` | Credentials strip | — |
| `CategoryGrid.astro` | Collection cards | — |
| `BestSellers.astro` | Product grid | — |
| `Banner.astro` | Lifestyle CTA | — |
| `HeritageBlock.astro` | Brand story 2-col (image + text + year) | **Yes** |
| `FeaturedHighlight.astro` | Full-bleed featured collection | **Yes** |
| `CraftsmanshipStory.astro` | Craftsmanship narrative | **Yes** |
| `CraftsmanshipVideo.astro` | Full-bleed macro + material features | **Yes** |
| `DividerBlock.astro` | Quote divider between sections | — |
| `ValuesStrip.astro` | 3-pillar values section | — |
| `TrustBadges.astro` | Trust icons (6 with Lucide icons) | — |
| `FeaturedPosts.astro` | Editorial journal | — |
| `TestimonialSlider.astro` | Customer quotes (3 named) | — |
| `EmailSignup.astro` | Newsletter | — |
| `ProductShowcase.astro` | New arrivals | — |
| `Footer.astro` | Footer with boutique + service links | — |

### Section Order Pattern (AIDA mapped — 12 sections, optimized)

```
Hero [FULL]                      → ATTENTION
StatsBar [STRIP]                 → ATTENTION
CategoryGrid [CONTAINED]         → INTEREST
BestSellers [CONTAINED]          → INTEREST
Banner [FULL]                    → DESIRE
HeritageBlock [CONTAINED 2COL]   → DESIRE (unique: brand story + year)
FeaturedHighlight [FULL]         → DESIRE (unique: collection CTA)
TrustBadges [CONTAINED]          → DESIRE
CraftsmanshipVideo [FULL]        → DESIRE (unique: macro + materials)
FeaturedPosts [CONTAINED]        → ACTION
TestimonialSlider [CONTAINED]    → ACTION
EmailSignup [CONTAINED]          → ACTION
```

### Key Lessons
- **Heritage/story is central** — not optional for luxury. HeritageBlock with "year" prop adds gravitas
- **CraftsmanshipVideo** with material features (904L Steel, Sapphire Crystal, etc.) builds tangible desire
- **FeaturedHighlight** spotlights a single collection — powerful for luxury where one hero product drives traffic
- 4 full-bleed sections (Hero, Banner, Highlight, Craftsmanship) — evenly distributed, each flanked by contained
- Footer includes **boutique locator** and **service** links (luxury must-have)
- Testimonials have **named authors with cities** (research: increases credibility significantly)

---

## 5. RepBag — Luxury Handbags / Fashion Accessories

**Use when:** Building stores for handbags, purses, wallets, leather goods, fashion accessories.

**Store:** `src/websites/RepBag/themes/apparel/`
**Env:** `.env.repbag` — THEME apparel

### Components (31 total)
Similar to f1racingapparel (cloned from bikes theme) but with fashion-specific additions:
- `BrandStory.astro`, `DiscoverMore.astro`, `EditorialSection.astro`, `LifestyleBanner.astro`, `SocialGallery.astro`, `ViewAllCta.astro`, `WhyChooseRepBags.astro`

### Key Lessons
- **EditorialSection** works for luxury fashion (magazine-style layout)
- **DiscoverMore** and **ViewAllCta** drive deeper browsing
- **SocialGallery** for Instagram-driven fashion brands

---

## 6. Drivon — Automotive Lifestyle (secondary reference)

**Note:** For automotive niches, **always use f1racingapparel first** — it is the most complete automotive store (34 components vs Drivon's 26). Drivon is a secondary reference only if you need specific components not in f1racingapparel.

**Store:** `src/websites/Drivon/themes/bikes/`
**Env:** `.env.Drivon` — THEME bikes

### Components only in Drivon (not in f1racingapparel)
- `CategoryHighlightBlocks.astro` — Large featured category blocks (different from grid)
- These can be copied into f1racingapparel-based stores if needed

---

## Component Reuse Guide

When creating a new store, reuse these proven components across niches:

### Universal (every store needs these)
- `BaseHead.astro`, `Header.astro`, `Footer.astro`, `Welcome.astro`
- `CategoryGrid.astro`, `BestSellers.astro` (or `ProductShowcase.astro`)
- `TrustBadges.astro`, `TestimonialSlider.astro`, `EmailSignup.astro`

### Recommended (most stores benefit from)
- `StatsBar.astro` — instant credibility above fold
- `Banner.astro` — aspirational lifestyle break
- `FeaturedPosts.astro` — SEO + authority

### Niche-specific (clone and rename for new stores)
| Component pattern | Niches that use it |
|---|---|
| BrandStory / HeritageBlock | Luxury (watches, shoes, bags, jewelry) |
| CraftsmanshipVideo | Luxury + artisan products |
| Pricing tiers | IPTV, SaaS, subscriptions |
| Channels / Features | Streaming, digital services |
| Devices | IPTV, software, apps |
| SocialGallery | Sneakers, streetwear, fashion |
| CarBrandsStrip / PressStrip | Automotive, licensed merch |
| SeasonDrop | Fashion, seasonal products |
| ManifestoSection | Lifestyle brands with strong identity |

---

## Env Configuration Quick Reference

| Niche | PROJECT_TYPE | DATA_TYPE | PRODUCTTHEME |
|---|---|---|---|
| Physical goods (apparel, watches, shoes, bags) | `physical` | `shopify` | `luxury` |
| IPTV / streaming | `iptv` | `shopify` | `luxury` |
| SaaS / digital | `digital` | `shopify` | `luxury` |
