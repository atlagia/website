/**
 * Shared enqueue logic: reads shop-data, dedupes, writes listing JSONs, adds BullMQ jobs.
 * Used by both enqueue.mjs (CLI) and server.mjs (API).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getQueue } from './queue.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

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

export default async function enqueueFromFile({ target, shopUrl, siteName, prefix, dataFile }) {
  const raw = JSON.parse(readFileSync(dataFile, 'utf8'));
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
        shopUrl: shopUrl || '',
        siteName: siteName || target.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        prefix: prefix || `${target}/etsy`,
      }, { jobId });
      enqueued++;
    } catch (err) {
      if (err.message.includes('already exists')) {
        skipped++;
      } else {
        throw err;
      }
    }
  }

  return { total: listings.length, enqueued, skipped };
}
