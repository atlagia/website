---
name: etsy-to-shopify
description: Scrapes Etsy shop via MCP scrape_etsy_shop_data (one call for all listing data) or fallback scrape_etsy_shop + scrape_etsy_listing; enqueues into BullMQ (Redis-backed, dedup by job ID); worker processes jobs in parallel (concurrency 3) — Gemini/OpenAI enhance, WebP images, Shopify create with variants/price/type/tags. Dashboard at localhost:3333 with Bull Board + custom UI + SSE live updates. Use when the user provides an Etsy shop URL and target Shopify website.
---

# Etsy to Shopify Import

Scrape an Etsy shop, enqueue listings into **BullMQ** (Redis-backed queue), then a worker processes them in parallel: AI-enhance (title, description, meta, product type, tags), convert images to WebP, create products in Shopify with variants, price, and product type. **Dashboard** at `localhost:3333` with live progress, Bull Board, and job management.

## Prerequisites

- **Etsy shop URL** (e.g. `https://www.etsy.com/shop/ShopName`)
- **Target website** (e.g. `jacketverse`) — `.env.<target-website>` with `SHOPIFY_ACCESS_TOKEN`, `PUBLIC_SHOPIFY_SHOP`
- **Redis** running on `localhost:6379` (see `REDIS_URL` in `.env.<target>`)
- **MCP**: user-cdp-browser with **`scrape_etsy_shop_data`** (preferred) or `scrape_etsy_shop` + `scrape_etsy_listing`
- `npm install sharp bullmq @bull-board/api @bull-board/express ioredis express`

## Architecture

```
Etsy Shop → MCP scrape_etsy_shop_data → shop-data.json
          → enqueue.mjs (or API) → BullMQ (Redis)
          → worker.mjs (concurrency 3) → etsy-process-one.mjs per job
          → Gemini/OpenAI enhance → WebP images → Shopify productCreate
          → Dashboard (localhost:3333) with SSE live updates
```

### Key components (`scripts/etsy-queue/`)

| File | Purpose |
|---|---|
| `queue.mjs` | Queue definition, Redis connection (uses `REDIS_URL` or `redis://localhost:6379`) |
| `worker.mjs` | Processes jobs via async spawn of `etsy-process-one.mjs` (concurrency configurable, 5min lock) |
| `enqueue.mjs` | CLI: reads shop-data JSON, dedupes, writes listing JSONs, adds BullMQ jobs |
| `enqueue-fn.mjs` | Shared enqueue logic used by both CLI and API |
| `server.mjs` | Express on port 3333 — Bull Board + custom dashboard + REST API + SSE |
| `views/imports.html` | Dark-themed dashboard with shop cards, progress bar, jobs table, live feed |

### Deduplication

- **BullMQ job ID** = `{target}--{listingId}` — same listing can never be enqueued twice
- **Pre-enqueue**: listings with same normalized title + first image URL are merged (catches Etsy duplicates)
- **Shopify tag**: `etsy-listing-{listingId}` tag checked before create (prevents re-creating existing products)

## Process Overview

### Preferred: BullMQ queue with dashboard

1. **Scrape shop data** — MCP **`scrape_etsy_shop_data`** with shop URL → all listing data in one call.
2. **Save data** — Write result to `data/etsy-to-shopify/<target>/shop-data.json`.
3. **Start services** (if not already running):
   ```bash
   node scripts/etsy-queue/server.mjs          # Dashboard + API on port 3333
   node scripts/etsy-queue/worker.mjs --concurrency 3   # Background worker
   ```
4. **Enqueue via CLI**:
   ```bash
   node scripts/etsy-queue/enqueue.mjs <target> --data-file data/etsy-to-shopify/<target>/shop-data.json --site-name "JacketVerse"
   ```
   **Or enqueue via API**:
   ```bash
   curl -X POST http://localhost:3333/api/imports/start \
     -H "Content-Type: application/json" \
     -d '{"target":"jacketverse","siteName":"JacketVerse","dataFile":"data/etsy-to-shopify/jacketverse/shop-data.json"}'
   ```
   **Or enqueue via the dashboard** at `http://localhost:3333/admin/imports`.
5. **Worker processes automatically** — 3 jobs in parallel, with 3 retries + exponential backoff on failure.
6. **Monitor** at `http://localhost:3333/admin/imports` (custom UI) or `http://localhost:3333/admin/queues` (Bull Board).

### Legacy flow (without BullMQ)

Still supported for backward compatibility:

1. **Persist and enqueue** — `node scripts/etsy-import-from-shop-data.mjs <target> --shop-url "..." --site-name "..." --data-file ...`
2. **Process queue** — `node scripts/etsy-import-run-until-done.mjs <target> --site-name "..." --prefix "..."`

### Fallback: shop URL list + per-listing scrape

If `scrape_etsy_shop_data` is unavailable: (1) `scrape_etsy_shop` → URLs → enqueue. (2) Per-listing `scrape_etsy_listing`. (3) Run import.

## Dashboard & API

### URLs

- **Dashboard**: `http://localhost:3333/admin/imports` — shop cards, progress bar, jobs table, SSE live feed
- **Bull Board**: `http://localhost:3333/admin/queues` — full job management (retry, delete, inspect)

### REST API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/imports/targets` | List all target stores |
| `POST` | `/api/imports/start` | Enqueue from data file (`{ target, siteName, dataFile }`) |
| `GET` | `/api/imports/:target/status` | Queue stats + product list |
| `GET` | `/api/imports/:target/jobs?state=all` | List jobs (filter: all/active/completed/failed/waiting) |
| `POST` | `/api/imports/:target/retry-failed` | Retry all failed jobs |
| `POST` | `/api/imports/:target/pause` | Pause queue |
| `POST` | `/api/imports/:target/resume` | Resume queue |
| `POST` | `/api/imports/:target/clean` | Clean completed/failed (`{ state }`) |
| `GET` | `/api/imports/events` | SSE stream (completed, failed, active, progress events) |

## Worker Configuration

- **Concurrency**: `--concurrency N` (default 3) — processes N jobs in parallel
- **Lock duration**: 5 minutes — handles long AI enhance + image conversion
- **Retries**: 3 attempts with exponential backoff (10s, 20s, 40s)
- **Async spawn**: Uses non-blocking `spawn()` to keep event loop free for lock renewal

## Product creation (variants, price, type, tags)

- **Variants**: Etsy `variations.Option` mapped to Shopify option "Size" with per-variant price.
- **Price**: From Etsy listing (never 0).
- **Product type**: AI-generated (e.g. "Leather Jacket", "Biker Jacket").
- **Tags**: 10–18 AI-generated tags (category, style, material, occasion, fit, etc.).
- **Inventory tracking**: Disabled (`tracked: false`) for all variants.

## Scripts

### scripts/etsy-queue/ (BullMQ system)

- **server.mjs** — Express server: Bull Board + custom dashboard + API + SSE. Port 3333.
- **worker.mjs** — BullMQ worker: spawns `etsy-process-one.mjs` per job. Async, non-blocking.
- **enqueue.mjs** — CLI: read shop-data, dedupe, write listing JSONs, add BullMQ jobs.
- **enqueue-fn.mjs** — Shared enqueue function (used by CLI and API).

### scripts/ (core pipeline)

- **etsy-process-one.mjs** — One listing: Gemini enhance → images → create product.
- **shopify-create-product.mjs** — Shopify productCreate + variants + inventory disable + dedup by tag.
- **shopify-gemini-enhance.mjs** — AI enhance with Gemini/OpenAI key rotation.
- **shopify-convert-upload-product-image.mjs** — URL → WebP → R2 upload.
- **etsy-import-from-shop-data.mjs** — Legacy: ingest shop data, write listings, enqueue in import-state.
- **etsy-import-run-until-done.mjs** — Legacy: process queued listings sequentially.
- **shopify-dedupe-products.mjs** — Find and delete duplicate products in Shopify.

## STRICT Rules

- **Title**: max 60 chars, professional, SEO.
- **Meta title**: max 60 chars. **Meta description**: max 160 chars.
- **Description**: NO broken links, NO images. Safe paths only.
- **Price**: Always set from Etsy listing (never 0).
- **Variants**: Create from Etsy variations.
- **Product type** and **Tags**: Always set (AI-generated).
- **Inventory tracking**: Always disabled.

## Subagent Workflow

Main agent launches subagent with context: `etsyShopUrl`, `targetWebsite`, `siteName`.

**Subagent (BullMQ flow — preferred):**

1. Call MCP **`scrape_etsy_shop_data`** (server: user-cdp-browser) with `etsyShopUrl` → all listing data.
2. Save result to `data/etsy-to-shopify/<target>/shop-data.json`.
3. Ensure server and worker are running:
   ```bash
   node scripts/etsy-queue/server.mjs &         # Dashboard + API
   node scripts/etsy-queue/worker.mjs --concurrency 3 &  # Worker
   ```
4. Enqueue via CLI:
   ```bash
   node scripts/etsy-queue/enqueue.mjs <target> --data-file data/etsy-to-shopify/<target>/shop-data.json --site-name "<siteName>"
   ```
5. Monitor progress via API: `curl http://localhost:3333/api/imports/<target>/status`
6. Report: total enqueued, completed, failed; dashboard URL for live monitoring.

**Fallback (legacy sequential):** If BullMQ/Redis unavailable: use `etsy-import-from-shop-data.mjs` + `etsy-import-run-until-done.mjs`.

## Invocation (mcp_task)

```
You are the etsy-to-shopify specialist. Follow .cursor/agents/etsy-to-shopify.md and .cursor/skills/etsy-to-shopify/SKILL.md.

Context: etsyShopUrl=https://www.etsy.com/shop/..., targetWebsite=jacketverse, siteName=JacketVerse.

1. Call MCP scrape_etsy_shop_data (user-cdp-browser) with the Etsy shop URL. Save result to data/etsy-to-shopify/<target>/shop-data.json.
2. Ensure BullMQ server and worker are running (check port 3333; start if needed).
3. Enqueue: node scripts/etsy-queue/enqueue.mjs <target> --data-file data/etsy-to-shopify/<target>/shop-data.json --site-name "<siteName>"
4. Monitor: curl http://localhost:3333/api/imports/<target>/status (poll until all done).
5. Report: total enqueued, completed, failed; product handles; dashboard URL http://localhost:3333/admin/imports.
   If scrape_etsy_shop_data unavailable, fall back to scrape_etsy_shop + scrape_etsy_listing, then legacy sequential flow.
```

## Reference

- [reference.md](./reference.md) — data schemas, script details
- [shopify-product-enhance](../shopify-product-enhance/SKILL.md) for Gemini and image rules
- Shopify Admin API: productCreate, productCreateMedia, productVariantsBulkCreate, inventoryItemUpdate
