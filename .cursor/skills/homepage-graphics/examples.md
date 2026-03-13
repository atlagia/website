# Homepage image fields — quick reference

Use when mapping `index_en.json` in graphics-mapper. Not every section type exists on every site; map only what is present.

| Section type          | Field path pattern                    | Example slotId                      |
|-----------------------|----------------------------------------|-------------------------------------|
| welcomeSection        | `sections.0.heroImage`                 | welcomeSection.heroImage            |
| welcomeSection        | `sections.0.backgroundVideo.fallbackImage` | welcomeSection.fallbackImage   |
| categoryGrid          | `sections[N].categories[i].image`      | categoryGrid.categories.0.image     |
| manifestoSection      | `sections[N].image`                    | manifestoSection.image             |
| bannerSection         | `sections[N].backgroundImage`         | bannerSection.backgroundImage      |
| productShowcase       | `sections[N].products[i].image`        | productShowcase.products.0.image   |
| emailSignupSection    | `sections[N].backgroundImage`          | emailSignupSection.backgroundImage |
| testimonialSlider     | `sections[N].testimonials[i].image`    | (if present)                       |
| trustBadges           | usually icons, not photos — skip       | —                                  |

**Skip:** bestSellers / FeaturedPosts when they pull from Shopify/blog (no static image in JSON). **Include:** productShowcase.products[].image when the section has static products in JSON.

**fieldPath** for replacer: dot path into the root object, e.g. `sections.0.heroImage`, `sections.4.categories.2.image`.
