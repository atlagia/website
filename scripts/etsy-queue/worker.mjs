#!/usr/bin/env node
/**
 * BullMQ worker: processes etsy-import jobs by spawning etsy-process-one.mjs.
 * Job ID = `{target}--{listingId}` — BullMQ deduplicates by ID automatically.
 *
 * Usage: node scripts/etsy-queue/worker.mjs [--concurrency 3]
 */
import { Worker } from 'bullmq';
import { resolve } from 'path';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { QUEUE_NAME, createRedisConnection } from './queue.mjs';

const ROOT = resolve(import.meta.dirname, '../..');

const concurrencyArg = process.argv.indexOf('--concurrency');
const CONCURRENCY = concurrencyArg >= 0 ? parseInt(process.argv[concurrencyArg + 1], 10) || 3 : 3;

function runAsync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { ...opts, encoding: 'utf8' });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', reject);
    child.on('close', (code) => {
      resolve({ stdout: stdout.trim(), stderr, status: code });
    });
  });
}

async function processJob(job) {
  const { target, listingId, siteName, prefix } = job.data;
  const listingPath = `data/etsy-to-shopify/${target}/listings/${listingId}.json`;
  const absPath = resolve(ROOT, listingPath);

  if (!existsSync(absPath)) {
    throw new Error(`Listing JSON not found: ${listingPath}`);
  }

  await job.updateProgress({ step: 'enhance', listingId });

  const args = [
    resolve(ROOT, 'scripts/etsy-process-one.mjs'),
    target,
    listingPath,
    '--site-name', siteName || target.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    '--prefix', prefix || `${target}/etsy`,
  ];

  const result = await runAsync('node', args, {
    cwd: ROOT,
    timeout: 300_000,
  });

  if (result.status !== 0) {
    const errMsg = (result.stderr || result.stdout || 'Process failed').slice(0, 500);
    throw new Error(errMsg);
  }

  let product;
  try {
    product = JSON.parse(result.stdout.trim());
  } catch {
    throw new Error(`Invalid JSON from etsy-process-one: ${result.stdout.slice(0, 200)}`);
  }

  await job.updateProgress({ step: 'done', listingId, product });
  return product;
}

const worker = new Worker(QUEUE_NAME, processJob, {
  connection: createRedisConnection(),
  concurrency: CONCURRENCY,
  lockDuration: 300_000,
  lockRenewTime: 60_000,
});

worker.on('completed', (job, result) => {
  console.log(`[done]  ${job.id} → ${result.handle || result.title}`);
});

worker.on('failed', (job, err) => {
  console.error(`[fail]  ${job?.id} → ${err.message.slice(0, 150)}`);
});

worker.on('error', (err) => {
  console.error('[worker-error]', err.message);
});

console.log(`Worker started (concurrency=${CONCURRENCY}). Waiting for jobs on "${QUEUE_NAME}"...`);
