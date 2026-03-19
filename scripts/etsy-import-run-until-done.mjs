#!/usr/bin/env node
/**
 * Run import until no queued items have listing JSON (process all that can be processed).
 * Does not drain: queued items without JSON stay queued for a later scrape + run.
 *
 * Usage: node scripts/etsy-import-run-until-done.mjs <target> [--site-name "..."] [--prefix "..."]
 */
import { spawnSync } from 'child_process';
import { resolve } from 'path';
import { getQueued } from './etsy-import-state.mjs';
import { existsSync } from 'fs';

const target = process.argv[2];
if (!target) {
  console.error('Usage: node scripts/etsy-import-run-until-done.mjs <target> [--site-name "..."] [--prefix "..."]');
  process.exit(1);
}

const baseDir = resolve(process.cwd(), 'data', 'etsy-to-shopify', target);
const args = ['scripts/etsy-import-run.mjs', target];
for (let i = 3; i < process.argv.length; i++) args.push(process.argv[i]);

let totalProcessed = 0;
while (true) {
  const queued = getQueued(target);
  const withJson = queued.filter((q) => existsSync(resolve(baseDir, q.jsonPath || `listings/${q.listingId}.json`)));
  if (withJson.length === 0) break;

  const r = spawnSync('node', args, { encoding: 'utf8', cwd: process.cwd(), maxBuffer: 50 * 1024 * 1024 });
  const out = r.stdout || '';
  let processed = 0;
  try {
    const lastLine = out.trim().split('\n').filter(Boolean).pop();
    if (lastLine && lastLine.startsWith('{')) {
      const j = JSON.parse(lastLine);
      processed = j.processed || 0;
      totalProcessed += processed;
    }
  } catch {}
  if (processed === 0) break;
}

console.log(JSON.stringify({ totalProcessed, message: 'Import run until done finished.' }));
