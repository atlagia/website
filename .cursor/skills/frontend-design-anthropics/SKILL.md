---
name: frontend-design-anthropics
description: Guides creation of distinctive, production-grade frontends that avoid generic "AI slop" aesthetics. Covers typography, color and theme, motion, backgrounds, and spatial composition using Anthropic's frontend design principles. Use when building UIs, landing pages, React or Astro components, or when the user asks for frontend design, aesthetics, or to avoid generic AI look.
---

# Frontend Design (Anthropic)

Apply this skill when designing or implementing frontends so outputs are distinctive and context-appropriate, not generic.

## Design direction first

Before coding, pick a **bold aesthetic direction**:

- **Differentiation**: What makes it memorable?
- **Constraints**: Technical and product requirements
- **Tone**: Choose an extreme (brutalist, maximalist, retro-futuristic, luxury, editorial, etc.)
- **Purpose**: What problem does the UI solve?

Choose one clear direction and execute it consistently. Bold works when intentional, not when everything is intense.

---

## Typography

- **Never use**: Inter, Roboto, Open Sans, Lato, Arial, default system fonts.
- **Prefer**: Distinctive, characterful fonts. Pair a display font with a refined body font.
- **Pairing**: High contrast = interesting (e.g. display + monospace, serif + geometric sans). Use weight extremes (100/200 vs 800/900), not 400 vs 600. Size jumps of 3×+ where appropriate.
- **Source**: Load from Google Fonts (or project font stack). State the font choice before implementing.

**Examples by vibe**: Code — JetBrains Mono, Fira Code. Editorial — Playfair Display, Crimson Pro, Fraunces. Technical — IBM Plex, Source Sans 3. Distinctive — Bricolage Grotesque, Obviously, Newsreader. Avoid converging on Space Grotesk every time; vary choices.

---

## Color & theme

- Use **CSS variables** for a cohesive palette.
- Prefer **dominant colors with sharp accents** over timid, evenly spread palettes.
- Draw from **IDE themes and cultural aesthetics** when they fit the product.
- Vary between **light and dark** when appropriate; don’t default to one.

---

## Backgrounds

- Create **atmosphere and depth** instead of flat solid colors.
- Use **gradients**, subtle **textures**, **patterns**, **shadows**, or **grain** where they support the chosen direction.
- Match background treatment to the overall aesthetic.

---

## Motion

- Use **animations** for high-impact moments and micro-interactions.
- **HTML/CSS**: Prefer CSS-only (transforms, opacity, `animation-delay`).
- **React**: Use Motion (e.g. Framer Motion) when available.
- Prioritize **one strong moment** (e.g. page load with staggered reveals) over many small, scattered animations.

---

## Spatial composition

- Use **asymmetry**, **overlap**, **diagonal flow**, or **grid-breaking** where it supports the concept.
- Avoid predictable, template-like layouts that lack context-specific character.

---

## Avoid

- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd schemes (e.g. purple gradients on white)
- Predictable layouts and cookie-cutter component patterns
- Designs that could apply to any product with no clear character

Interpret creatively; make choices that feel designed for the specific context. Vary fonts, themes, and aesthetics across generations.

---

## Optional: lock a theme

When the user or product wants a fixed aesthetic, state it explicitly and keep it consistent:

- **Example (RPG)**: Fantasy-inspired palette, ornate borders, parchment/weathered textures, dramatic lighting, medieval-inspired serif headers.
- **Example (Solarpunk)**: Warm greens/golds/earth tones, organic + technical shapes, nature-inspired patterns, optimistic atmosphere.

For more theme ideas and pairings, see [examples.md](examples.md).
