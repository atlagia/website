#!/usr/bin/env node
/**
 * Enqueue Etsy listings into BullMQ from shop-data JSON.
 *
 * Usage:
 *   node scripts/etsy-queue/enqueue.mjs <target> --data-file <path> [--shop-url "..."] [--site-name "..."]
 *
 * Also writes individual listing JSONs and updates import-state for backward compat.
 * Job ID = `{target}:{listingId}` — BullMQ auto-dedupes.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { getQueue } from './queue.mjs';

const ROOT = resolve(import.meta.dirname, '../..');

function listingIdFromUrl(url) {
  const m = String(url).match(/\/listing\/(\d+)(?:\/|$)/);
  return m ? m[1] : null;
}

function normalizeTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim()
    .split(' ').filter(Boolean).sort().join(' ');
}

function normalizeToListings(raw) {
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw); } catch { return []; }
  }
  if (Array.isArray(raw)) return raw;
  if (raw?.listings && Array.isArray(raw.listings)) return raw.listings;
  if (raw?.result != null) {
    const inner = typeof raw.result === 'string' ? JSON.parse(raw.result) : raw.result;
    return Array.isArray(inner) ? inner : (inner?.listings || []);
  }
  return [];
}

function dedupeListings(listings) {
  const seen = new Map();
  const out = [];
  for (const item of listings) {
    const url = item.url || (item.listingId ? `https://www.etsy.com/listing/${item.listingId}/` : null);
    const listingId = item.listingId || (url ? listingIdFromUrl(url) : null);
    if (!listingId) continue;
    const firstImg = (Array.isArray(item.images) && item.images[0]) || '';
    const key = `${normalizeTitle(item.title)}|${firstImg}`;
    if (seen.has(key)) continue;
    seen.set(key, true);
    out.push({ ...item, listingId, url: url || `https://www.etsy.com/listing/${listingId}/` });
  }
  return out;
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  let shopUrl = '', siteName = '', dataFile = null, prefix = '';

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--shop-url' && args[i + 1]) { shopUrl = args[++i]; }
    else if (args[i] === '--site-name' && args[i + 1]) { siteName = args[++i]; }
    else if (args[i] === '--data-file' && args[i + 1]) { dataFile = args[++i]; }
    else if (args[i] === '--prefix' && args[i + 1]) { prefix = args[++i]; }
  }

  if (!target || !dataFile) {
    console.error('Usage: node scripts/etsy-queue/enqueue.mjs <target> --data-file <path> [--shop-url "..."] [--site-name "..."]');
    process.exit(1);
  }

  const absDataFile = resolve(ROOT, dataFile);
  if (!existsSync(absDataFile)) {
    console.error(`Data file not found: ${absDataFile}`);
    process.exit(2);
  }

  const raw = JSON.parse(readFileSync(absDataFile, 'utf8'));
  let listings = normalizeToListings(raw);
  listings = dedupeListings(listings);

  const listDir = resolve(ROOT, 'data', 'etsy-to-shopify', target, 'listings');
  if (!existsSync(listDir)) mkdirSync(listDir, { recursive: true });

  const queue = getQueue();
  let enqueued = 0, skipped = 0;

  for (const item of listings) {
    const { listingId } = item;
    const jsonPath = resolve(listDir, `${listingId}.json`);
    writeFileSync(jsonPath, JSON.stringify({
      title: item.title ?? '',
      description: item.description ?? '',
      price: item.price ?? '',
      images: Array.isArray(item.images) ? item.images : [],
      variations: item.variations ?? {},
    }), 'utf8');

    const jobId = `${target}--${listingId}`;
    try {
      await queue.add('process-listing', {
        target,
        listingId,
        shopUrl,
        siteName: siteName || target.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        prefix: prefix || `${target}/etsy`,
      }, { jobId });
      enqueued++;
    } catch (err) {
      if (err.message.includes('Job already exists')) {
        skipped++;
      } else {
        throw err;
      }
    }
  }

  await queue.close();
  console.log(JSON.stringify({
    total: listings.length,
    enqueued,
    skipped,
    message: `${enqueued} jobs added to queue, ${skipped} already existed (deduped by BullMQ).`,
  }));
}

main().catch(e => { console.error(e); process.exit(1); });
