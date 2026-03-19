#!/usr/bin/env node
/**
 * Import dashboard server:
 *  - Bull Board at /admin/queues
 *  - Custom import UI at /admin/imports
 *  - REST API at /api/imports
 *  - SSE at /api/imports/events
 *
 * Usage: node scripts/etsy-queue/server.mjs [--port 3333]
 */
import express from 'express';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueue, QUEUE_NAME, createRedisConnection } from './queue.mjs';
import { QueueEvents } from 'bullmq';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const portIdx = process.argv.indexOf('--port');
const PORT = portIdx >= 0 ? parseInt(process.argv[portIdx + 1], 10) || 3333 : 3333;

const app = express();
app.use(express.json());

// ── Bull Board ──
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullMQAdapter(getQueue())],
  serverAdapter,
});
app.use('/admin/queues', serverAdapter.getRouter());

// ── SSE: live job events ──
const sseClients = new Set();

const queueEvents = new QueueEvents(QUEUE_NAME, {
  connection: createRedisConnection(),
});

function broadcast(event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    res.write(msg);
  }
}

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  let product = {};
  try { product = JSON.parse(returnvalue); } catch {}
  broadcast('completed', { jobId, product });
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  broadcast('failed', { jobId, error: failedReason?.slice(0, 300) });
});

queueEvents.on('progress', ({ jobId, data: progress }) => {
  broadcast('progress', { jobId, progress });
});

queueEvents.on('active', ({ jobId }) => {
  broadcast('active', { jobId });
});

app.get('/api/imports/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

// ── API ──

function parseTarget(jobId) {
  const i = jobId.indexOf('--');
  return i >= 0 ? jobId.slice(0, i) : jobId;
}

app.get('/api/imports/targets', async (_req, res) => {
  const dir = resolve(ROOT, 'data/etsy-to-shopify');
  if (!existsSync(dir)) return res.json([]);
  const targets = readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  res.json(targets);
});

app.get('/api/imports/:target/status', async (req, res) => {
  const { target } = req.params;
  const queue = getQueue();

  const jobCounts = await queue.getJobCounts('active', 'completed', 'failed', 'waiting', 'delayed');

  const stateFile = resolve(ROOT, `data/etsy-to-shopify/${target}/import-state.json`);
  let importState = null;
  if (existsSync(stateFile)) {
    try { importState = JSON.parse(readFileSync(stateFile, 'utf8')); } catch {}
  }

  const targetJobs = {
    total: 0, waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0,
    products: [],
  };

  const allStates = ['completed', 'failed', 'active', 'waiting', 'delayed'];
  for (const state of allStates) {
    const jobs = await queue.getJobs(state, 0, 500);
    for (const job of jobs) {
      if (job.data?.target === target) {
        targetJobs.total++;
        targetJobs[state]++;
        if (state === 'completed' && job.returnvalue) {
          try {
            const product = typeof job.returnvalue === 'string'
              ? JSON.parse(job.returnvalue)
              : job.returnvalue;
            targetJobs.products.push({
              listingId: job.data.listingId,
              productId: product.id,
              handle: product.handle,
              title: product.title,
            });
          } catch {}
        }
      }
    }
  }

  res.json({
    target,
    queueGlobal: jobCounts,
    targetJobs,
    importState: importState ? {
      shopUrl: importState.shopUrl,
      total: importState.listings?.length || 0,
      queued: importState.listings?.filter(l => l.status === 'queued').length || 0,
      done: importState.listings?.filter(l => l.status === 'done').length || 0,
      failed: importState.listings?.filter(l => l.status === 'failed').length || 0,
    } : null,
  });
});

app.post('/api/imports/:target/retry-failed', async (req, res) => {
  const { target } = req.params;
  const queue = getQueue();
  const failed = await queue.getJobs('failed', 0, 1000);
  let retried = 0;
  for (const job of failed) {
    if (job.data?.target === target) {
      await job.retry();
      retried++;
    }
  }
  res.json({ retried });
});

app.post('/api/imports/:target/pause', async (_req, res) => {
  await getQueue().pause();
  res.json({ paused: true });
});

app.post('/api/imports/:target/resume', async (_req, res) => {
  await getQueue().resume();
  res.json({ resumed: true });
});

app.post('/api/imports/start', async (req, res) => {
  const { target, shopUrl, siteName, dataFile, prefix } = req.body;
  if (!target || !dataFile) {
    return res.status(400).json({ error: 'target and dataFile required' });
  }

  const absDataFile = resolve(ROOT, dataFile);
  if (!existsSync(absDataFile)) {
    return res.status(400).json({ error: `Data file not found: ${dataFile}` });
  }

  const { default: enqueueFromFile } = await import('./enqueue-fn.mjs');
  const result = await enqueueFromFile({ target, shopUrl, siteName, prefix, dataFile: absDataFile });
  res.json(result);
});

app.get('/api/imports/:target/jobs', async (req, res) => {
  const { target } = req.params;
  const state = req.query.state || 'all';
  const queue = getQueue();

  const states = state === 'all'
    ? ['completed', 'failed', 'active', 'waiting', 'delayed']
    : [state];

  const jobs = [];
  for (const s of states) {
    const batch = await queue.getJobs(s, 0, 200);
    for (const job of batch) {
      if (job.data?.target === target) {
        let product = null;
        if (s === 'completed' && job.returnvalue) {
          try {
            product = typeof job.returnvalue === 'string'
              ? JSON.parse(job.returnvalue) : job.returnvalue;
          } catch {}
        }
        jobs.push({
          id: job.id,
          listingId: job.data.listingId,
          state: await job.getState(),
          attemptsMade: job.attemptsMade,
          failedReason: job.failedReason?.slice(0, 200),
          product,
          processedOn: job.processedOn,
          finishedOn: job.finishedOn,
        });
      }
    }
  }

  res.json(jobs);
});

app.post('/api/imports/:target/clean', async (req, res) => {
  const queue = getQueue();
  const { state } = req.body;
  if (!['completed', 'failed'].includes(state)) {
    return res.status(400).json({ error: 'state must be completed or failed' });
  }
  const cleaned = await queue.clean(0, 1000, state);
  res.json({ cleaned: cleaned.length });
});

// ── Custom UI page ──
app.get('/admin/imports', (_req, res) => {
  res.sendFile(resolve(__dirname, 'views/imports.html'));
});

// ── Static ──
app.use('/admin/static', express.static(resolve(__dirname, 'views')));

app.listen(PORT, () => {
  console.log(`Import dashboard:  http://localhost:${PORT}/admin/imports`);
  console.log(`Bull Board:        http://localhost:${PORT}/admin/queues`);
  console.log(`API:               http://localhost:${PORT}/api/imports`);
});
