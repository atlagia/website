#!/usr/bin/env node
/**
 * Process queued Etsy listings: run etsy-process-one for each queued item that has listing JSON,
 * then mark done/failed in import-state. Enables resume (only queued are processed).
 *
 * Usage:
 *   node scripts/etsy-import-run.mjs <target> [--limit N] [--site-name "JacketVerse"] [--prefix "JacketVerse/etsy"]
 *
 * Prerequisite: import-state has queued items and listings/<id>.json exist (from scrape_etsy_listing).
 */
import { existsSync } from 'fs';
import { resolve } from 'path';
import { spawnSync } from 'child_process';
import { loadState, getQueued, markDone, markFailed } from './etsy-import-state.mjs';

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  return { stdout: r.stdout?.trim(), stderr: r.stderr, status: r.status };
}

function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  let limit = Infinity;
  let siteName = '';
  let prefix = '';
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) { limit = parseInt(args[i + 1], 10) || Infinity; i++; }
    else if (args[i] === '--site-name' && args[i + 1]) { siteName = args[i + 1]; i++; }
    else if (args[i] === '--prefix' && args[i + 1]) { prefix = args[i + 1]; i++; }
  }

  if (!target) {
    console.error('Usage: node scripts/etsy-import-run.mjs <target> [--limit N] [--site-name "Site"] [--prefix "Store/etsy"]');
    process.exit(1);
  }

  const queued = getQueued(target);
  if (queued.length === 0) {
    console.log(JSON.stringify({ message: 'No queued listings', total: 0, done: 0, failed: 0 }));
    return;
  }

  const baseDir = resolve(process.cwd(), 'data', 'etsy-to-shopify', target);
  const siteNameVal = siteName || target.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const prefixVal = prefix || `${siteNameVal}/etsy`;

  let done = 0;
  let failed = 0;
  const results = [];

  for (let i = 0; i < Math.min(queued.length, limit); i++) {
    const item = queued[i];
    const jsonPath = resolve(baseDir, item.jsonPath || `listings/${item.listingId}.json`);
    if (!existsSync(jsonPath)) {
      console.warn(`Skipping ${item.listingId}: no ${item.jsonPath}`);
      continue;
    }

    const relPath = `data/etsy-to-shopify/${target}/${item.jsonPath || `listings/${item.listingId}.json`}`;
    const runArgs = [target, relPath, '--site-name', siteNameVal, '--prefix', prefixVal];
    const result = run('node', [resolve(process.cwd(), 'scripts/etsy-process-one.mjs'), ...runArgs]);

    if (result.status === 0) {
      try {
        const product = JSON.parse(result.stdout);
        markDone(target, item.listingId, { productId: product.id, handle: product.handle });
        done++;
        results.push({ listingId: item.listingId, status: 'done', productId: product.id, handle: product.handle });
      } catch {
        markFailed(target, item.listingId, 'Invalid process-one output');
        failed++;
        results.push({ listingId: item.listingId, status: 'failed', error: 'Invalid output' });
      }
    } else {
      markFailed(target, item.listingId, result.stderr || result.stdout || 'Process failed');
      failed++;
      results.push({ listingId: item.listingId, status: 'failed', error: (result.stderr || '').slice(0, 200) });
    }
  }

  const state = loadState(target);
  console.log(JSON.stringify({
    processed: done + failed,
    done,
    failed,
    queuedRemaining: state.listings.filter((e) => e.status === 'queued').length,
    results,
  }));
}

main();
