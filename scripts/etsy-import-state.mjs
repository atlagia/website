#!/usr/bin/env node
/**
 * Etsy import queue state: track scraped listing URLs and move queued → done/failed.
 * Enables resume: process only queued items and skip already-done.
 *
 * Usage (as module or CLI):
 *   node scripts/etsy-import-state.mjs <target> enqueue --shop-url "..." --site-name "..." < listing-urls.txt
 *   node scripts/etsy-import-state.mjs <target> get-queued
 *   node scripts/etsy-import-state.mjs <target> mark-done <listingId> <productId> <handle>
 *   node scripts/etsy-import-state.mjs <target> mark-failed <listingId> <error>
 *   node scripts/etsy-import-state.mjs <target> status
 *
 * State file: data/etsy-to-shopify/<target>/import-state.json
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const LISTINGS_DIR = 'listings';

function statePath(target) {
  return resolve(process.cwd(), 'data', 'etsy-to-shopify', target, 'import-state.json');
}

function listingIdFromUrl(url) {
  const m = String(url).match(/\/listing\/(\d+)(?:\/|$)/);
  return m ? m[1] : null;
}

function defaultState() {
  return {
    shopUrl: '',
    targetWebsite: '',
    siteName: '',
    scrapedAt: null,
    lastProcessedAt: null,
    listings: [],
  };
}

export function loadState(target) {
  const path = statePath(target);
  if (!existsSync(path)) return { ...defaultState(), targetWebsite: target };
  try {
    const raw = readFileSync(path, 'utf8');
    const data = JSON.parse(raw);
    return { ...defaultState(), ...data, targetWebsite: target };
  } catch {
    return { ...defaultState(), targetWebsite: target };
  }
}

export function saveState(target, state) {
  const dir = resolve(process.cwd(), 'data', 'etsy-to-shopify', target);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const path = statePath(target);
  writeFileSync(path, JSON.stringify(state, null, 2), 'utf8');
}

/**
 * Add or merge listing URLs into state. New URLs get status "queued".
 * listingUrls: string[]
 * options: { shopUrl, siteName }
 */
export function enqueueListings(target, listingUrls, options = {}) {
  const state = loadState(target);
  if (options.shopUrl) state.shopUrl = options.shopUrl;
  if (options.siteName) state.siteName = options.siteName;
  state.scrapedAt = state.scrapedAt || new Date().toISOString();

  const byId = new Map(state.listings.map((e) => [e.listingId, e]));

  for (const url of listingUrls) {
    const id = listingIdFromUrl(url);
    if (!id) continue;
    if (byId.has(id)) continue;
    byId.set(id, {
      url,
      listingId: id,
      status: 'queued',
      jsonPath: `${LISTINGS_DIR}/${id}.json`,
      productId: null,
      handle: null,
      error: null,
      processedAt: null,
    });
  }

  state.listings = Array.from(byId.values());
  saveState(target, state);
  return state;
}

/**
 * Get all listings with status "queued".
 */
export function getQueued(target) {
  const state = loadState(target);
  return state.listings.filter((e) => e.status === 'queued');
}

/**
 * Mark a listing as done (product created).
 */
export function markDone(target, listingId, { productId, handle }) {
  const state = loadState(target);
  const item = state.listings.find((e) => e.listingId === listingId);
  if (item) {
    item.status = 'done';
    item.productId = productId ?? item.productId;
    item.handle = handle ?? item.handle;
    item.error = null;
    item.processedAt = new Date().toISOString();
  }
  state.lastProcessedAt = new Date().toISOString();
  saveState(target, state);
}

/**
 * Mark a listing as failed.
 */
export function markFailed(target, listingId, error) {
  const state = loadState(target);
  const item = state.listings.find((e) => e.listingId === listingId);
  if (item) {
    item.status = 'failed';
    item.error = String(error).slice(0, 500);
    item.processedAt = new Date().toISOString();
  }
  state.lastProcessedAt = new Date().toISOString();
  saveState(target, state);
}

/**
 * Mark all queued listings that have no JSON file as failed (scrape failed or not run).
 * Use so the queue can reach 0 and the run "completes"; failed items can be retried later by re-enqueueing.
 */
export function drainQueuedWithoutData(target, errorMessage = 'No listing data (scrape failed or not run)') {
  const state = loadState(target);
  const baseDir = resolve(process.cwd(), 'data', 'etsy-to-shopify', target);
  let count = 0;
  for (const item of state.listings) {
    if (item.status !== 'queued') continue;
    const jsonPath = resolve(baseDir, item.jsonPath || `listings/${item.listingId}.json`);
    if (!existsSync(jsonPath)) {
      item.status = 'failed';
      item.error = errorMessage.slice(0, 500);
      item.processedAt = new Date().toISOString();
      count++;
    }
  }
  state.lastProcessedAt = new Date().toISOString();
  saveState(target, state);
  return count;
}

/**
 * Set all failed listings back to queued (clear error, processedAt). Use to retry failed.
 */
export function requeueFailed(target) {
  const state = loadState(target);
  let count = 0;
  for (const item of state.listings) {
    if (item.status === 'failed') {
      item.status = 'queued';
      item.error = null;
      item.processedAt = null;
      count++;
    }
  }
  saveState(target, state);
  return count;
}

function cli() {
  const args = process.argv.slice(2);
  const target = args[0];
  const cmd = args[1];

  if (!target || !cmd) {
    console.error('Usage: etsy-import-state.mjs <target> enqueue|get-queued|mark-done|mark-failed|status [args...]');
    process.exit(1);
  }

  if (cmd === 'enqueue') {
    const idx = args.indexOf('--shop-url');
    const shopUrl = idx >= 0 && args[idx + 1] ? args[idx + 1] : '';
    const idx2 = args.indexOf('--site-name');
    const siteName = idx2 >= 0 && args[idx2 + 1] ? args[idx2 + 1] : '';
    const idx3 = args.indexOf('--urls-file');
    const urlsFilePath = idx3 >= 0 && args[idx3 + 1] ? resolve(process.cwd(), args[idx3 + 1]) : null;

    let allUrls = [];
    if (urlsFilePath && existsSync(urlsFilePath)) {
      const content = readFileSync(urlsFilePath, 'utf8').trim();
      try {
        const parsed = JSON.parse(content);
        allUrls = Array.isArray(parsed) ? parsed : (parsed.listings || []).map((u) => (typeof u === 'string' ? u : u.url));
      } catch {
        allUrls = content.split(/\n/).map((l) => l.trim()).filter(Boolean);
      }
    }
    if (allUrls.length === 0) {
      const skip = (a) => a === '--shop-url' || a === '--site-name' || a === '--urls-file' || a.startsWith('--')
        || (idx >= 0 && a === args[idx + 1]) || (idx2 >= 0 && a === args[idx2 + 1]) || (idx3 >= 0 && a === args[idx3 + 1]);
      allUrls = args.slice(2).filter((a) => !skip(a));
    }
    if (allUrls.length === 0) {
      console.error('Provide listing URLs via --urls-file <path> (JSON array or newline-separated) or as extra args');
      process.exit(2);
    }
    enqueueListings(target, allUrls, { shopUrl, siteName });
    console.log(JSON.stringify(loadState(target)));
    return;
  }

  if (cmd === 'get-queued') {
    const queued = getQueued(target);
    console.log(JSON.stringify(queued));
    return;
  }

  if (cmd === 'mark-done') {
    const listingId = args[2];
    const productId = args[3];
    const handle = args[4];
    if (!listingId) {
      console.error('Usage: etsy-import-state.mjs <target> mark-done <listingId> <productId> <handle>');
      process.exit(2);
    }
    markDone(target, listingId, { productId, handle });
    console.log('ok');
    return;
  }

  if (cmd === 'mark-failed') {
    const listingId = args[2];
    const error = args.slice(3).join(' ') || 'Unknown error';
    if (!listingId) {
      console.error('Usage: etsy-import-state.mjs <target> mark-failed <listingId> <error>');
      process.exit(2);
    }
    markFailed(target, listingId, error);
    console.log('ok');
    return;
  }

  if (cmd === 'status') {
    const state = loadState(target);
    const queued = state.listings.filter((e) => e.status === 'queued').length;
    const done = state.listings.filter((e) => e.status === 'done').length;
    const failed = state.listings.filter((e) => e.status === 'failed').length;
    console.log(JSON.stringify({
      shopUrl: state.shopUrl,
      scrapedAt: state.scrapedAt,
      total: state.listings.length,
      queued,
      done,
      failed,
    }));
    return;
  }

  if (cmd === 'drain') {
    const msg = args[2] ? args.slice(2).join(' ') : 'No listing data (scrape failed or not run)';
    const count = drainQueuedWithoutData(target, msg);
    console.log(JSON.stringify({ drained: count }));
    return;
  }

  if (cmd === 'requeue-failed') {
    const count = requeueFailed(target);
    console.log(JSON.stringify({ requeued: count }));
    return;
  }

  console.error('Unknown command:', cmd);
  process.exit(1);
}

if (process.argv[1]?.includes('etsy-import-state')) {
  cli();
}
