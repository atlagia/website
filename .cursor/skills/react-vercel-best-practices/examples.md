# React & Vercel Best Practices — Examples

## React

### Props and memoization

**Avoid** — inline object breaks referential equality for memoized children:

```tsx
<MemoChild options={{ page: 1 }} />
```

**Prefer** — stable reference:

```tsx
const options = useMemo(() => ({ page: 1 }), []);
<MemoChild options={options} />
```

### List keys

**Avoid** — index as key when list can reorder:

```tsx
{items.map((item, i) => <Card key={i} item={item} />)}
```

**Prefer** — stable id:

```tsx
{items.map((item) => <Card key={item.id} item={item} />)}
```

### Semantic HTML and accessibility

**Avoid** — clickable div:

```tsx
<div onClick={handleSubmit}>Submit</div>
```

**Prefer** — button with focus style:

```tsx
<button type="button" onClick={handleSubmit} className="focus:ring-2 ...">
  Submit
</button>
```

### Typed props

**Prefer** — explicit interface, exported if public:

```tsx
export interface CardProps {
  title: string;
  onSelect?: (id: string) => void;
}

export function Card({ title, onSelect }: CardProps) {
  return <article>...</article>;
}
```

---

## Vercel

### vercel.json — redirects and rewrites

**Redirect** (e.g. old URL → new URL):

```json
{
  "redirects": [
    { "source": "/old", "destination": "/new", "permanent": true }
  ]
}
```

**Rewrite** (e.g. SPA fallback, proxy; no URL change):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Environment variables

- Set in Vercel: Project → Settings → Environment Variables.
- Or CLI: `vercel env add VARIABLE_NAME`.
- Do not commit `.env` with secrets; use `.env.example` with dummy values only.

### Node version (reproducible builds)

**package.json**:

```json
{
  "engines": {
    "node": "20.x"
  }
}
```
