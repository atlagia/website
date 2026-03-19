# Etsy to Shopify — Reference

## Architecture

```
Etsy Shop → MCP scrape_etsy_shop_data → shop-data.json
          → enqueue.mjs / API → BullMQ Queue (Redis)
          → worker.mjs (concurrency 3, async spawn) → etsy-process-one.mjs per job
          → Gemini/OpenAI enhance → WebP → Shopify productCreate
          → Dashboard (localhost:3333): Bull Board + custom UI + SSE
```

## Flow (preferred: BullMQ + scrape_etsy_shop_data)

1. **Etsy shop URL** → MCP **`scrape_etsy_shop_data`** → all listing data in one response
2. **Save** → `data/etsy-to-shopify/<target>/shop-data.json`
3. **Start services** → `node scripts/etsy-queue/server.mjs` (port 3333) + `node scripts/etsy-queue/worker.mjs --concurrency 3`
4. **Enqueue** → `node scripts/etsy-queue/enqueue.mjs <target> --data-file ... --site-name "..."` or API `POST /api/imports/start`
5. **Worker processes** → 3 jobs in parallel, async spawn, 5min lock, 3 retries with exponential backoff
6. **Monitor** → Dashboard at `http://localhost:3333/admin/imports` or API `GET /api/imports/<target>/status`

## Flow (legacy sequential — without BullMQ)

1. **Ingest** → `etsy-import-from-shop-data.mjs` writes listings and enqueues in import-state
2. **Process** → `etsy-import-run-until-done.mjs` runs `etsy-process-one.mjs` per queued listing sequentially

## Flow (fallback: shop + per-listing scrape)

1. **Etsy shop URL** → MCP `scrape_etsy_shop` → listing URLs → enqueue
2. **Each listing URL** → MCP `scrape_etsy_listing` → save to `listings/<id>.json`
3. **Process** → via BullMQ or legacy sequential

## Deduplication (3 layers)

1. **BullMQ job ID** = `{target}--{listingId}` — BullMQ rejects duplicate job IDs
2. **Pre-enqueue dedup** — normalized title + first image URL → same product from different listing IDs
3. **Shopify tag check** — `etsy-listing-{listingId}` tag queried before create; skip if exists

## Etsy Listing Schema (from scrape_etsy_shop_data item)

- `title`, `description`, `price`
- `images`: array of image URLs (filter to `i.etsystatic.com`)
- `variations`: e.g. `{ Option: [ { name, price }, ... ] }`
- `listingId`, `url`

## BullMQ Queue System (`scripts/etsy-queue/`)

### queue.mjs
- Queue name: `etsy-import`
- Redis: `REDIS_URL` env var or `redis://localhost:6379`
- Default job options: 3 attempts, exponential backoff (10s base), keep 500 completed / 1000 failed

### worker.mjs
- Concurrency: configurable via `--concurrency N` (default 3)
- Lock duration: 300s (5 min) — handles long AI + image + Shopify calls
- Lock renew: every 60s
- Async `spawn()` — non-blocking, keeps event loop free for lock renewal
- Each job spawns: `node scripts/etsy-process-one.mjs <target> <listingPath> --site-name "..." --prefix "..."`

### enqueue.mjs / enqueue-fn.mjs
- Reads shop-data JSON (array, `{ listings: [...] }`, or MCP shape `{ result: "..." }`)
- Deduplicates by normalized title + first image URL
- Writes individual `listings/<listingId>.json` files
- Adds BullMQ jobs with ID `{target}--{listingId}`

### server.mjs
- Express on port 3333 (configurable via `--port`)
- **Bull Board** at `/admin/queues` — full queue inspection
- **Custom dashboard** at `/admin/imports` — shop cards, progress, jobs table, SSE feed
- **REST API** at `/api/imports/...`:
  - `GET /api/imports/targets` — list targets
  - `POST /api/imports/start` — enqueue from data file
  - `GET /api/imports/:target/status` — queue stats + products
  - `GET /api/imports/:target/jobs?state=all` — list jobs
  - `POST /api/imports/:target/retry-failed` — retry failed
  - `POST /api/imports/:target/pause` / `resume` — pause/resume
  - `POST /api/imports/:target/clean` — clean completed/failed
  - `GET /api/imports/events` — SSE stream

## Core Pipeline Scripts (`scripts/`)

- **etsy-process-one.mjs** — One listing JSON → Gemini enhance → convert images → create product
- **shopify-create-product.mjs** — Shopify productCreate + media + variants + inventory disable + dedup tag check
- **shopify-gemini-enhance.mjs** — AI enhance: Gemini (11 keys) + OpenAI (gpt-3.5-turbo) rotation
- **shopify-convert-upload-product-image.mjs** — URL → WebP → R2 (metadata: title, tags)
- **etsy-import-from-shop-data.mjs** — Legacy ingest: write listings, enqueue in import-state
- **etsy-import-run-until-done.mjs** — Legacy: process queued listings sequentially
- **etsy-import-state.mjs** — Legacy: state management (enqueue, mark-done, mark-failed, status)
- **shopify-dedupe-products.mjs** — Find and delete duplicate products in Shopify

## Data Folder

```
data/etsy-to-shopify/<target>/
  shop-data.json          — saved MCP scrape_etsy_shop_data output
  shop-data-<shopname>.json — per-shop data files
  listings/<listingId>.json — individual listing data
  import-state.json       — legacy queue state (still updated for compat)
```

## MCP

- Server: user-cdp-browser
- Tools: **`scrape_etsy_shop_data`** (preferred), `scrape_etsy_shop`, `scrape_etsy_listing`
