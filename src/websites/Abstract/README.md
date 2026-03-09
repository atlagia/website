# Abstract Website — Template for New Sites

This folder is a **template/boilerplate** used to create new websites in the ATLAGIACMS project.

## Run Abstract Locally

```bash
npm run dev abstract -- --port 4321
```

Then open `http://localhost:4321/en` or `http://localhost:4321/`.

## How to Create a New Website

1. **Copy** `src/websites/Abstract/` to `src/websites/YourSiteName/`
2. **Create** `.env.YourSiteName` with:
   ```env
   PUBLIC_SITE_NAME=YourSiteName
   THEME=base
   PORT=4321
   ALLOWED_LANGUAGES=en
   ```
3. **Customize** the copied site:
   - `themes/base/data/index_en.json` — homepage sections and copy
   - `themes/base/consts.ts` — site title, meta
   - `themes/base/components/` — add Header, Footer, Welcome, etc. to override defaults
   - `themes/base/styles/` — layout.json, Header.json, etc.
4. **Run** `npm run dev YourSiteName -- --port 4321`

## Structure

```
Abstract/
├── README.md
└── themes/
    └── base/
        ├── theme.json
        ├── theme.mjs
        ├── consts.ts
        ├── data/
        │   └── index_en.json
        ├── page/
        │   └── index.astro
        ├── components/     (optional — falls back to @themes/default)
        └── styles/        (optional)
```

## Fallbacks

Abstract has no local components by default. The homepage imports BaseHead, Header, Footer, Welcome, and EmailSignup from `@themes/default` when not present under `themes/base/components/`. Override only what you need.
