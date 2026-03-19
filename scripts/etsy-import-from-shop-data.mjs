#!/usr/bin/env node
/**
 * Ingest output of MCP scrape_etsy_shop_data: write each listing to listings/<id>.json and enqueue all.
 * Use this after calling scrape_etsy_shop_data so all listing data is persisted in one go and the queue
 * is ready for etsy-import-run / etsy-import-run-until-done (no per-listing scrape needed).
 *
 * Usage:
 *   node scripts/etsy-import-from-shop-data.mjs <target> --shop-url "https://www.etsy.com/shop/..." --site-name "JacketVerse" --data-file data/etsy-to-shopify/<target>/shop-data.json
 *   echo '<MCP result JSON>' | node scripts/etsy-import-from-shop-data.mjs <target> --shop-url "..." --site-name "..." [--data-file -]
 *
 * --data-file: path to JSON file. If "-", read from stdin. File can be:
 *   - MCP shape: { result: "<json string>" } where the string is array or { listings: [...] }
 *   - Or direct: { listings: [ { listingId, url, title, description, price, images, variations }, ... ] }
 *   - Or array: [ { listingId, url, ... }, ... ]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { loadState, enqueueListings } from './etsy-import-state.mjs';

const LISTINGS_DIR = 'listings';

function listingIdFromUrl(url) {
  const m = String(url).match(/\/listing\/(\d+)(?:\/|$)/);
  return m ? m[1] : null;
}

function normalizeToListings(raw) {
  let arr = null;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) arr = raw;
  else if (raw && Array.isArray(raw.listings)) arr = raw.listings;
  else if (raw && raw.result != null) {
    const inner = typeof raw.result === 'string' ? JSON.parse(raw.result) : raw.result;
    arr = Array.isArray(inner) ? inner : (inner?.listings || []);
  }
  return arr || [];
}

function listingPayload(item) {
  return {
    title: item.title ?? '',
    description: item.description ?? '',
    price: item.price ?? '',
    images: Array.isArray(item.images) ? item.images : [],
    variations: item.variations ?? {},
  };
}

/** Normalize title for dedupe: same words in any order = same product. */
function normalizeTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');
}

/** Deduplicate listings: same normalized title + same first image URL = same product (keep first by listingId). */
function dedupeListings(listings) {
  const seen = new Map();
  const out = [];
  for (const item of listings) {
    const url = item.url || (item.listingId ? `https://www.etsy.com/listing/${item.listingId}/` : null);
    const listingId = item.listingId || (url ? listingIdFromUrl(url) : null);
    if (!listingId) continue;
    const firstImg = (Array.isArray(item.images) && item.images[0]) ? item.images[0] : '';
    const key = `${normalizeTitle(item.title)}|${firstImg}`;
    if (seen.has(key)) continue;
    seen.set(key, true);
    out.push(item);
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  let shopUrl = '';
  let siteName = '';
  let dataFile = null;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--shop-url' && args[i + 1]) { shopUrl = args[i + 1]; i++; }
    else if (args[i] === '--site-name' && args[i + 1]) { siteName = args[i + 1]; i++; }
    else if (args[i] === '--data-file' && args[i + 1]) { dataFile = args[i + 1]; i++; }
  }

  if (!target) {
    console.error('Usage: node scripts/etsy-import-from-shop-data.mjs <target> --shop-url "<url>" --site-name "<name>" [--data-file <path>]');
    process.exit(1);
  }

  let raw;
  if (dataFile === '-' || (!dataFile && !process.stdin.isTTY)) {
    raw = JSON.parse(readFileSync(0, 'utf8'));
  } else if (dataFile && existsSync(resolve(process.cwd(), dataFile))) {
    raw = JSON.parse(readFileSync(resolve(process.cwd(), dataFile), 'utf8'));
  } else {
    console.error('Provide --data-file <path> or pipe JSON to stdin');
    process.exit(2);
  }

  let listings = normalizeToListings(raw);
  listings = dedupeListings(listings);
  const baseDir = resolve(process.cwd(), 'data', 'etsy-to-shopify', target);
  const listDir = resolve(baseDir, LISTINGS_DIR);
  if (!existsSync(listDir)) mkdirSync(listDir, { recursive: true });

  const urls = [];
  let written = 0;
  for (const item of listings) {
    const url = item.url || (item.listingId ? `https://www.etsy.com/listing/${item.listingId}/` : null);
    const listingId = item.listingId || (url ? listingIdFromUrl(url) : null);
    if (!listingId) continue;
    urls.push(url || `https://www.etsy.com/listing/${listingId}/`);
    const path = resolve(listDir, `${listingId}.json`);
    writeFileSync(path, JSON.stringify(listingPayload(item), null, 0), 'utf8');
    written++;
  }

  enqueueListings(target, urls, { shopUrl, siteName });
  const state = loadState(target);
  console.log(JSON.stringify({
    written,
    enqueued: urls.length,
    totalInState: state.listings.length,
    message: 'Listing JSONs written and queue updated. Run etsy-import-run-until-done to process.',
  }));
}

main();
