# Subagent: seopilot-scaffold

**Phase:** 1 — Monorepo Scaffold
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Create the Turborepo monorepo with all workspace packages, configure TypeScript, install dependencies for all apps, and verify both dev servers boot.

## Inputs

- `projectRoot`: Absolute path where monorepo will be created
- `port.web`: 3000 (Next.js dashboard)
- `port.api`: 4000 (Hono API server)

## Steps

### 1. Initialize Turborepo

```bash
cd {projectRoot}/..
npx create-turbo@latest seopilot --example basic
cd seopilot
```

### 2. Create Workspace Structure

```
apps/
  web/          # Next.js 16
  api/          # Hono.js
packages/
  shared/       # Zod schemas, types, constants
  crawler/      # Crawlee + Playwright
  agents/       # LangGraph AI agents
  integrations/ # Platform connectors (Shopify, WP, etc.)
workers/        # Trigger.dev job definitions
```

### 3. Initialize apps/web (Next.js 16)

```bash
cd apps
npx create-next-app@latest web --typescript --tailwind --app --src-dir --import-alias "@/*"
cd web
npx shadcn@latest init -d
npx shadcn@latest add sidebar table card chart button input dialog sheet badge separator dropdown-menu avatar progress tabs command popover select textarea toast tooltip scroll-area
npm install @tanstack/react-query @tanstack/react-table @trpc/client @trpc/react-query recharts next-themes zod
```

### 4. Initialize apps/api (Hono.js)

```bash
mkdir -p apps/api/src
cd apps/api
# Create package.json
npm init -y
npm install hono @hono/node-server drizzle-orm @neondatabase/serverless @trpc/server zod better-auth stripe @upstash/redis @upstash/ratelimit @aws-sdk/client-s3 dotenv
npm install -D drizzle-kit typescript @types/node tsx
```

Create `apps/api/src/index.ts`:
```typescript
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors({ origin: 'http://localhost:3000', credentials: true }));

app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

serve({ fetch: app.fetch, port: 4000 }, (info) => {
  console.log(`SEOPilot API running on http://localhost:${info.port}`);
});

export default app;
```

### 5. Initialize packages/shared

```bash
mkdir -p packages/shared/src/{schemas,types,constants}
```

Create `packages/shared/src/index.ts` with re-exports.

### 6. Initialize remaining packages

Create package.json and src/index.ts for: packages/crawler, packages/agents, packages/integrations, workers/

### 7. Configure turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "dependsOn": ["build"] },
    "db:generate": { "cache": false },
    "db:migrate": { "cache": false }
  }
}
```

### 8. Configure TypeScript

Base `tsconfig.json` at root, extended by each app/package. Path aliases:
- `@seopilot/shared` → packages/shared
- `@seopilot/crawler` → packages/crawler
- `@seopilot/agents` → packages/agents
- `@seopilot/integrations` → packages/integrations

### 9. Create .env.example

```bash
# Database (Neon)
DATABASE_URL=postgresql://user:pass@host/seopilot

# Auth (Better Auth)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=seopilot

# AI
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Trigger.dev
TRIGGER_API_KEY=
TRIGGER_API_URL=

# Google (OAuth for GSC/GA)
GOOGLE_GSC_CLIENT_ID=
GOOGLE_GSC_CLIENT_SECRET=

# App
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 10. Verify

```bash
turbo dev
# web → http://localhost:3000
# api → http://localhost:4000/health
```

MCP: Navigate to both URLs and confirm response.

## Output

Return: project path, all packages created, both servers confirmed, any issues encountered.
