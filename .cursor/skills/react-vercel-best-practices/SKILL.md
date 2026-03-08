---
name: react-vercel-best-practices
description: Applies React and Vercel deployment best practices when building or reviewing React/Next.js code, configuring Vercel, or optimizing for production. Use when working with React components, TypeScript/TSX, Vercel config, serverless functions, or deployment to Vercel.
---

# React & Vercel Best Practices

## When to Apply

Use this skill when:
- Writing or reviewing React/TSX components
- Configuring or deploying to Vercel
- Optimizing React apps for performance or SEO
- Setting up environment variables, rewrites, or serverless on Vercel

---

## React Best Practices

### Components & State

- Prefer **function components** with hooks. Use `React.memo()` for components that re-render often with same props.
- Keep state **close to where it’s used**. Lift state only when multiple siblings need it.
- Use **`useCallback`** for handlers passed to memoized children; **`useMemo`** for expensive derived values, not for trivial computations.
- Avoid **inline object/array literals** in JSX when they are passed as props to memoized components (they break referential equality).

### Data Fetching & Effects

- Prefer **server components / server data** where possible (Next.js App Router, or Astro). Use client components only for interactivity.
- In `useEffect`: specify **dependency arrays** correctly. Clean up subscriptions, timers, and listeners in the return function.
- Avoid **fetching in `useEffect`** when a framework supports server data (e.g. `getServerSideProps`, Server Components, loaders).

### Accessibility & Semantics

- Use **semantic HTML** (`<button>`, `<nav>`, `<main>`, etc.). Use `<div onClick>` only when no semantic element fits.
- Provide **`aria-*`** and **`role`** when semantics are not enough. Ensure **keyboard focus** and visible focus styles.
- **Images**: always set `alt` (empty string `alt=""` for decorative images).

### Performance

- **Code-split** with `React.lazy()` and `Suspense` for heavy or below-the-fold components.
- Avoid **large inline styles**; use CSS modules, Tailwind, or a design system.
- **Lists**: use stable `key` (e.g. id), never array index when list can reorder or mutate.

### TypeScript

- Type **props** with an interface or type. Prefer `interface` for object shapes.
- Avoid **`any`**. Use `unknown` and narrowing, or generic types, when type is uncertain.
- Export **props types** when they are part of the component’s public API.

---

## Vercel Best Practices

### Project Configuration

- Add **`vercel.json`** only when needed (rewrites, headers, redirects, serverless config). Prefer framework defaults when possible.
- Use **Environment Variables** in the Vercel dashboard (or CLI) for per-environment config. Never commit secrets; use **Vercel Env Vars** for Production/Preview/Development.

### Build & Output

- For **Next.js**: use default build; enable **output: 'standalone'** only if required for custom hosting.
- For **static/SSG**: ensure `output` and build command match the framework (e.g. Astro, Vite).
- Set **Node.js version** explicitly in `package.json` (`"engines": { "node": "20.x" }`) or in Vercel project settings for reproducible builds.

### Edge & Serverless

- Prefer **Edge** for simple logic (redirects, A/B, geo). Use **Node serverless** for heavier work or Node-only APIs.
- Keep **serverless function size** small; move large deps to layers or trim unused code.
- **Cold starts**: minimize dependencies and use small handlers. Consider Edge when latency is critical.

### Caching & Headers

- Use **Cache-Control** via headers in `vercel.json` or in response for static/assets and API routes.
- For **ISR** (Next.js): set `revalidate` appropriately; use **On-Demand Revalidation** when content changes are event-driven.

### Redirects & Rewrites

- Put **redirects** in `vercel.json` (`redirects`) for permanent (301) or temporary (307) moves.
- Use **rewrites** for proxying or SPA fallback; avoid redirect loops (rewrite to a path that does not rewrite again).

---

## Checklist (Quick Reference)

**React**
- [ ] Function components + hooks; state colocated
- [ ] Memoization only where it helps (memo/useCallback/useMemo)
- [ ] Semantic HTML and accessible focus/keys
- [ ] Stable list keys; no index when list changes
- [ ] Typed props; no unnecessary `any`

**Vercel**
- [ ] Env vars in dashboard/CLI, not in repo
- [ ] Build command and output match framework
- [ ] Node version set if needed
- [ ] Redirects/rewrites in vercel.json when used
- [ ] Cache headers for static/API where appropriate

---

## Additional Resources

- For concrete good/bad examples, see [examples.md](examples.md).
- **React**: [Thinking in React](https://react.dev/learn/thinking-in-react), [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/).
- **Vercel**: [Project configuration](https://vercel.com/docs/project-configuration), [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs).
