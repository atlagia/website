---
name: website-audit
description: Post-creation audit roadmap for ATLAGIA CMS websites. Uses MCP browser to systematically verify homepage sections, collections, product pages, slide cart, and pillar pages. Identifies problems and fixes each before advancing. Use when the user says "audit", "verify website", "check website", "QA", or after completing a create-website workflow.
---

# Website Audit Roadmap

Run this audit **after** a website has been created or updated. Each step uses MCP (`cursor-ide-browser`) to verify visually, identify problems, fix them, re-verify, and only then advance to the next step.

**Gate rule:** Do NOT proceed to the next step until the current step passes. If a problem is found, fix it immediately, re-screenshot, and confirm the fix before moving on.

---

## Step 0 — Prepare

1. Determine the site's dev URL: `http://localhost:<PORT>/` and `http://localhost:<PORT>/en`.
2. Ensure the dev server is running (`npm run dev <storename> -- --port <PORT>`).
3. Create a todo list with Steps 1–5 below.

---

## Step 1 — Homepage (all sections)

### 1.1 Navigate and screenshot

```
browser_navigate → http://localhost:<PORT>/en
browser_take_screenshot
```

### 1.2 Verify top of page

- **Header**: logo visible, nav links readable, Bag/Cart trigger present, language switcher works, Sign In visible. No overflow or clipping.
- **Hero / Welcome**: background image loads, headline text is large and legible, CTA button visible and clickable, no text overlap.

### 1.3 Scroll and verify each section

Use `browser_scroll` (down) + `browser_take_screenshot` repeatedly to capture every section:

| Section | Check |
|---------|-------|
| Hero | Image loads, headline readable, CTA present |
| Featured Collections / Category Grid | Cards display, images load, titles visible, hover effect works |
| Trending / Best Sellers | Product cards render (even if empty Shopify data, fallback graceful) |
| Brand Story / Editorial | Image + quote visible, layout balanced |
| New Arrivals / Product Showcase | Cards render, images load |
| Lifestyle Banner | Full-width image loads, text overlay legible |
| Why Choose Us / Trust | Icons or features visible, text readable |
| Social Gallery | Grid of images, hover effect |
| Testimonials | Cards with author, stars, content |
| Newsletter / Email Signup | Input field + button visible and functional |
| Footer | Logo, nav links, legal links, copyright |

### 1.4 Quality checklist for each section

- [ ] Text is **clear and readable** (contrast, size, font loads correctly)
- [ ] Style is **chic and professional** (consistent with design direction)
- [ ] Spacing and padding are **luxurious** (not cramped)
- [ ] Images load (no broken images)
- [ ] Hover effects work where expected
- [ ] Mobile responsive (resize or check mobile viewport if possible)

### 1.5 Fix and re-verify

For **every** problem found: fix the component, wait for HMR, re-screenshot, confirm fix. Only move to Step 2 when all sections pass.

---

## Step 2 — Collections Page

### 2.1 Navigate

```
browser_navigate → http://localhost:<PORT>/en/collections
browser_take_screenshot
```

### 2.2 Verify

- [ ] Page title ("Collections") visible
- [ ] Breadcrumb works (Home > Collections)
- [ ] **Product cards display correctly**: image, title, price visible
- [ ] **Grid layout**: proper columns (2–4 depending on viewport)
- [ ] **Filters sidebar**: color, size, or other filters render and function
- [ ] **Sort dropdown**: "Best Selling", "Price: Low to High", etc.
- [ ] Product count shown
- [ ] Cards are **styled to match theme** (dark bg, correct fonts, proper spacing)
- [ ] Clicking a product card navigates to the product page

### 2.3 Fix and re-verify

Fix any display, style, or functional issues. Re-screenshot after each fix. Do NOT proceed to Step 3 until collections look professional.

---

## Step 3 — Product Page

### 3.1 Navigate to a product

```
browser_navigate → http://localhost:<PORT>/en/products/<any-handle>
browser_take_screenshot
```

Pick any available product (from the collections page or a known handle).

### 3.2 Verify

- [ ] **Product title** displays (correct font, size, color)
- [ ] **Price** visible and formatted correctly
- [ ] **Product images** / gallery: main image loads, thumbnails work, navigation arrows function
- [ ] **Description section**: expandable, formatted HTML renders correctly
- [ ] **Variant selectors** (size, color): visible and clickable
- [ ] **Add to Cart button**: visible, styled, clickable
- [ ] **Buy Now button** (if present): styled consistently
- [ ] **Breadcrumb**: Home > Products > Product Name; if dark theme, breadcrumb text is **light** (readable on dark background)
- [ ] **Price and title**: visible; if dark theme, **light** text
- [ ] **Product specs / details**: if present, styled and readable; if dark theme, cards and text use **dark backgrounds + light text**
- [ ] **Description block**: if dark theme, background is dark (e.g. surface/border vars), body text is **light**
- [ ] **Add to Cart / Buy Now**: if dark theme, button text is **light** (no dark text on dark buttons)
- [ ] **Reviews section**: renders (even if empty)
- [ ] **Related products**: grid at bottom if available
- [ ] Overall style matches theme (uses site CSS variables, fonts, dark/light scheme); **no dark-on-dark or low-contrast text**

### 3.3 Scroll full page

```
browser_scroll direction="down" amount=500
browser_take_screenshot
```

Repeat to capture description, specs, reviews, related products.

### 3.4 Fix and re-verify

Fix any product page issues before proceeding.

---

## Step 4 — Slide Cart

### 4.1 Add a product to cart

From the product page:

```
browser_click on "Add to Cart" button
browser_wait 2
browser_take_screenshot
```

### 4.2 Verify slide cart

- [ ] Cart **slides in from the right** (sidebar/drawer)
- [ ] Cart **overlay** dims the background
- [ ] **Product info** in cart: image thumbnail, name, price, quantity
- [ ] **Quantity controls** (+/−) visible and functional
- [ ] **Remove item** button works
- [ ] **Cart total** displayed correctly
- [ ] **Proceed to Checkout** / **Buy Now** button visible and styled
- [ ] **Close button** (X) works — cart closes
- [ ] Cart sidebar **styled with theme variables** (background, borders, text colors match site)
- [ ] Item count badge on header Bag icon updates

### 4.3 Test close and reopen

```
browser_click on close button
browser_take_screenshot (cart should be hidden)
browser_click on "Bag" in header
browser_take_screenshot (cart should reopen with item)
```

### 4.4 Fix and re-verify

Fix any cart styling, functionality, or display issues.

---

## Step 5 — Pillar Pages

Check all static/pillar pages the site defines (about, contact, blog, privacy, terms, etc.).

### 5.1 For each page

```
browser_navigate → http://localhost:<PORT>/en/about
browser_take_screenshot
```

Repeat for: `/en/contact`, `/en/blog`, `/en/privacy`, `/en/terms`, and any other pages in `theme.json`.

### 5.2 Verify each

- [ ] Page loads without errors (no 500, no "undefined" text)
- [ ] Header and footer render correctly (same as homepage)
- [ ] Content area has proper styling (headings, text, spacing)
- [ ] Page uses theme CSS variables and fonts consistently
- [ ] Links work (internal nav, footer links)

### 5.3 Fix and re-verify

Fix any broken or unstyled pillar pages.

---

## Final Report

After all 5 steps pass, summarize:

```
Audit complete for <SiteName> at http://localhost:<PORT>/

Step 1 — Homepage: ✅ All <N> sections verified
Step 2 — Collections: ✅ Product grid, filters, cards
Step 3 — Product page: ✅ Gallery, info, description, related
Step 4 — Slide cart: ✅ Add/remove, totals, checkout button
Step 5 — Pillar pages: ✅ <list of pages checked>

Issues found and fixed: <count>
Remaining known issues: <count or "none">
```

---

## Quick Reference — MCP Commands

| Action | Command |
|--------|---------|
| Open page | `browser_navigate` url |
| Screenshot | `browser_take_screenshot` |
| DOM snapshot | `browser_snapshot` |
| Scroll down | `browser_scroll` direction="down" amount=500 |
| Click element | `browser_click` ref |
| Type text | `browser_type` ref text |
| Wait | `browser_wait` seconds |
