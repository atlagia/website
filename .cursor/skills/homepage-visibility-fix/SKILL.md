---
name: homepage-visibility-fix
description: Corrects visibility and contrast on homepage sections. Identifies background style (light vs dark) per section, ensures text/CTA contrast, and aligns all sections with the site theme. Uses MCP browser to check section-by-section, screenshot, identify problems, find components, and fix them. Use when the user reports "text unreadable", "contrast issues", "light text on light background", or "visibility problems" on the homepage.
---

# Homepage Visibility Fix Skill

Run this skill when homepage sections have **poor text contrast** or **visibility issues**. The goal: ensure every section has readable text and CTAs that match its background.

**Core rule:** Identify the background style of each section → apply the correct content style.
- **Light background** (bright image, light overlay, white/gray) → **dark text**, dark or accent CTA buttons
- **Dark background** (dark theme, dark overlay, black/gray-900) → **light text**, light or accent CTA buttons

**Gate rule:** Do NOT proceed to the next section until the current one passes. Fix → re-screenshot → confirm.

---

## Step 0 — Prepare

1. Site dev URL: `http://localhost:<PORT>/en`
2. Dev server running
3. Create a todo list for each homepage section

---

## Step 1 — Section-by-Section Roadmap

Use MCP (`cursor-ide-browser`):

1. **Navigate** to `http://localhost:<PORT>/en`
2. **Scroll** to bring each section into view
3. **Screenshot** (`browser_take_screenshot`)
4. **Identify** background style and content visibility
5. **If problem:** find the component, fix it, wait for HMR, re-screenshot
6. **Repeat** until the full homepage is verified

---

## Step 2 — Section Matrix (Background → Content Style)

| Section | Typical background | Content style | Component |
|---------|--------------------|---------------|-----------|
| **Hero / Welcome** | Full-bleed image, often bright/light | If light overlay → **dark text**, dark CTAs. If dark overlay → light text | `Welcome.astro` |
| **Stats bar** | Dark strip | Light text | `StatsBar.astro` |
| **Marquee** | Dark strip | Light text | `Marquee.astro` |
| **Brand collections** | Dark strip | Light text | `CarBrandsStrip.astro` |
| **Category grid** | Dark contained | Light text | `CategoryGrid.astro` |
| **Best sellers** | Dark contained | Light text | `BestSellers.astro` |
| **Manifesto / Brand story** | Dark 2-col | Light text | `ManifestoSection.astro` |
| **Lifestyle Banner** ("Ride With Passion") | Full-bleed image, often bright | **Strong dark overlay** (≥85% opacity) or dark text. Never light text on bright image | `Banner.astro` |
| **New arrivals** | Dark contained | Light text | `ProductShowcase.astro` |
| **Why Choose / Features** | Dark contained | Light text, **visible icons** (not faint) | `FeaturesSection.astro` |
| **Blog / Editorial** | Dark contained | Light text | `FeaturedPosts.astro` |
| **Social proof / Join the Ride** | Dark contained | Light text, **theme vars** (not hardcoded gray-900) | `SocialProof.astro` |
| **Testimonials** | Dark contained | Light text, visible stars | `TestimonialSlider.astro` |
| **Newsletter** | Dark contained | Light text, visible input + button | `EmailSignup.astro` |
| **Trust badges** | Dark contained | Light text, visible icons | `TrustBadges.astro` |
| **Footer** | Dark | Light text | `Footer.astro` |

---

## Step 3 — Fix Patterns

### Light-background sections (Hero, Banner)

- **Problem:** White/light text on bright image → unreadable
- **Fix options:**
  1. Add a **dark overlay** (e.g. `bg-black/80` or `rgba(0,0,0,0.8)`) so light text reads on dark
  2. Or switch to **dark text** and light/neutral CTAs when overlay is light
  3. Ensure CTA buttons have **solid background** (e.g. `bg-[var(--mra-accent)]` or `bg-black`) and contrasting text

### Dark-background sections

- Use **theme CSS variables**: `--mra-text`, `--mra-muted`, `--mra-accent`, `--mra-surface`, `--mra-card`
- Avoid hardcoded `gray-900`, `text-white` unless they match the theme
- Icons: use `text-[var(--mra-accent)]` or `text-[var(--mra-text)]` so they are visible

### Reference: "Join the Ride" style

- Dark background (`bg-[var(--mra-surface)]` or equivalent)
- Light text (`text-[var(--mra-text)]`)
- Visible stats, icons, and trust elements
- All sections should match this level of contrast and theme consistency

---

## Step 4 — Component Location Map

| Section | Path |
|---------|------|
| Welcome / Hero | `src/websites/{SiteName}/themes/{theme}/components/Welcome.astro` |
| Banner | `src/websites/{SiteName}/themes/{theme}/components/Banner.astro` |
| StatsBar | `.../components/StatsBar.astro` |
| FeaturesSection | `.../components/FeaturesSection.astro` |
| SocialProof | `.../components/SocialProof.astro` |
| ManifestoSection | `.../components/ManifestoSection.astro` |
| TrustBadges | `.../components/TrustBadges.astro` |

---

## Step 5 — Verification Checklist

For each section after fix:

- [ ] Headline/title is **readable** (contrast ratio ≥ 4.5:1)
- [ ] Body text is **readable**
- [ ] CTA buttons are **visible** and **clickable** (solid bg or strong border)
- [ ] Icons/stats are **visible** (not faint)
- [ ] Section uses **theme variables** (no stray hardcoded colors that break theme)

---

## MCP Commands

| Action | Command |
|--------|---------|
| Navigate | `browser_navigate` url |
| Screenshot | `browser_take_screenshot` |
| Scroll down | `browser_scroll` direction="down" amount=600 |
| DOM snapshot | `browser_snapshot` |

---

## Quick Reference — Common Fixes

1. **Welcome hero with light overlay:** Add `.hero-has-bg .hero-title { color: var(--mra-bg); }` and similar for desc, label, CTAs when overlay is light; or replace light overlay with dark overlay.
2. **Banner with bright image:** Increase overlay opacity: `bg-[var(--mra-bg)]/90` or `/95`; or add `backdrop-blur` for readability.
3. **Faint icons in Why Choose:** Change `text-[var(--mra-accent)]/30` to `text-[var(--mra-accent)]` or `text-[var(--mra-text)]`.
4. **SocialProof hardcoded colors:** Replace `bg-gray-900 text-white` with `bg-[var(--mra-surface)] text-[var(--mra-text)]`.
