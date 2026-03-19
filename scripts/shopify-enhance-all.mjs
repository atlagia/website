#!/usr/bin/env node
/**
 * Orchestrate shopify-product-enhance: fetch, enhance (Gemini or static), convert images, update.
 * Usage: node scripts/shopify-enhance-all.mjs <target-website> [--limit N] [--use-gemini] [--reset] [--descriptions-file path.json] [--site-name "Site Name"]
 *
 * State: data/shopify-enhance/<target-website>/state.json
 * - queued: product IDs to process
 * - done: product IDs already processed
 * On fetch: new product IDs (not in done) are added to queued. On success: move from queued to done.
 *
 * --use-gemini: Use Gemini for title + description. --reset: clear state and re-queue all.
 */
import { readFileSync, existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { loadRootAndStoreEnv } from './load-root-and-store-env.mjs';

const STATE_DIR = 'data/shopify-enhance';

function getStatePath(target) {
  const dir = resolve(process.cwd(), STATE_DIR, target);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return resolve(dir, 'state.json');
}

function loadState(target) {
  const path = getStatePath(target);
  if (!existsSync(path)) return { queued: [], done: [], lastFetch: null };
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'));
    return {
      queued: Array.isArray(data.queued) ? data.queued : [],
      done: Array.isArray(data.done) ? data.done : [],
      lastFetch: data.lastFetch || null,
    };
  } catch {
    return { queued: [], done: [], lastFetch: null };
  }
}

function saveState(target, state) {
  const path = getStatePath(target);
  writeFileSync(path, JSON.stringify({
    ...state,
    lastUpdated: new Date().toISOString(),
  }, null, 2), 'utf8');
}

function run(cmd, args, input) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    input,
    maxBuffer: 50 * 1024 * 1024,
  });
  return { stdout: r.stdout, stderr: r.stderr, status: r.status };
}

function slugify(s) {
  return (s || '').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product';
}

function truncate(s, len) {
  s = (s || '').replace(/\s+/g, ' ').trim();
  if (s.length <= len) return s;
  return s.slice(0, len - 3) + '...';
}

/** Create enhanced title: primary keyword first, 50–60 chars. */
function enhanceTitle(oldTitle) {
  const s = (oldTitle || '').replace(/\s+/g, ' ').trim();
  if (!s) return 'Digital Product';
  const primary = s.includes(',') ? s.split(',')[0].trim() : s.slice(0, 50).trim();
  if (primary.length >= 50 && primary.length <= 60) return primary;
  if (primary.length > 60) return primary.slice(0, 57) + '...';
  const suffix = primary.length < 50 ? ' – Digital Delivery' : '';
  return truncate(primary + suffix, 60);
}

/** Build enhanced description: main body, internal links, FAQ, FAQ schema */
function buildEnhancedDescription(title, oldDescriptionHtml, siteName) {
  const plain = (oldDescriptionHtml || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const excerpt = plain.length > 600 ? plain.slice(0, 597) + '...' : plain;
  const mainBody = excerpt
    ? `<p>${excerpt}</p>`
    : `<p>${title}. Quality digital product available for instant delivery from ${siteName}.</p>`;

  const internalLinks = [
    '<a href="/collections">Browse all categories</a>',
    '<a href="/collections/all">View all products</a>',
  ];

  const linksHtml = `<p><strong>Explore more:</strong> ${internalLinks.join(' &bull; ')}</p>`;

  const faqs = [
    { q: 'How do I receive this product?', a: 'You receive instant digital access via email or download link after purchase.' },
    { q: 'Can I use this for commercial projects?', a: 'Please check the product details and license. Most templates allow personal and commercial use.' },
    { q: 'What format are the files?', a: 'Files are typically PDF or editable Canva templates. Check the product description for specifics.' },
    { q: 'Is there customer support?', a: 'Yes. Contact our support team if you have questions about your purchase.' },
    { q: 'Can I get a refund?', a: 'Due to the digital nature of these products, all sales are final. We recommend reviewing the product details before purchase.' },
  ];

  let faqHtml = '<h2>Frequently Asked Questions</h2>';
  for (const f of faqs) {
    faqHtml += `<details><summary>${f.q}</summary><p>${f.a}</p></details>`;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const schemaHtml = `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;

  return mainBody + linksHtml + faqHtml + schemaHtml;
}

/** Call Gemini script; returns { title, metaTitle, metaDescription, descriptionHtml } or null on failure */
function callGeminiEnhance(oldTitle, oldDescriptionHtml, tags, siteName, envTarget) {
  const tmpPath = resolve(tmpdir(), `desc-${randomBytes(8).toString('hex')}.txt`);
  try {
    writeFileSync(tmpPath, oldDescriptionHtml || '', 'utf8');
    const args = [
      resolve(process.cwd(), 'scripts/shopify-gemini-enhance.mjs'),
      oldTitle,
      '--env-store', envTarget,
      '--description-file', tmpPath,
      '--tags', Array.isArray(tags) ? tags.join(', ') : (tags || ''),
      '--site-name', siteName,
    ];
    const r = run('node', args);
    if (r.status !== 0) return null;
    return JSON.parse(r.stdout.trim());
  } catch {
    return null;
  } finally {
    try { unlinkSync(tmpPath); } catch {}
  }
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  const useGemini = args.includes('--use-gemini');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 && args[limitIdx + 1] ? parseInt(args[limitIdx + 1], 10) : null;
  const descFileIdx = args.indexOf('--descriptions-file');
  const descriptionsFile = descFileIdx >= 0 && args[descFileIdx + 1] ? args[descFileIdx + 1] : null;
  const siteNameIdx = args.indexOf('--site-name');
  const siteName = siteNameIdx >= 0 && args[siteNameIdx + 1] ? args[siteNameIdx + 1] : 'Global Gift Cards';

  const resetState = args.includes('--reset');
  if (!target) {
    console.error('Usage: node scripts/shopify-enhance-all.mjs <target-website> [--limit N] [--use-gemini] [--reset] [--descriptions-file path.json] [--site-name "Site Name"]');
    process.exit(1);
  }

  loadRootAndStoreEnv(target);

  const storeName = target.replace(/^./, (c) => c.toUpperCase());
  const prefix = `${storeName}/products`;

  let state = loadState(target);
  if (resetState) {
    state = { queued: [], done: [], lastFetch: null };
    saveState(target, state);
    console.error('State reset.');
  }

  let descriptionsById = {};
  if (descriptionsFile && existsSync(resolve(process.cwd(), descriptionsFile))) {
    try {
      descriptionsById = JSON.parse(readFileSync(resolve(process.cwd(), descriptionsFile), 'utf8'));
      console.error(`Loaded ${Object.keys(descriptionsById).length} descriptions from ${descriptionsFile}`);
    } catch (e) {
      console.error('Failed to load descriptions file:', e.message);
    }
  }

  // Fetch products
  const fetchArgs = [resolve(process.cwd(), 'scripts/shopify-fetch-products.mjs'), target];
  if (limit) fetchArgs.push('--limit', String(limit));
  const fetchResult = run('node', fetchArgs);
  if (fetchResult.status !== 0) {
    console.error('Fetch failed:', fetchResult.stderr);
    process.exit(2);
  }
  let allProducts;
  try {
    allProducts = JSON.parse(fetchResult.stdout);
  } catch (e) {
    console.error('Invalid products JSON');
    process.exit(3);
  }

  const fetchedIds = new Set(allProducts.map((p) => p.id));
  const doneSet = new Set(state.done);
  const queuedSet = new Set(state.queued);

  for (const id of fetchedIds) {
    if (!doneSet.has(id)) queuedSet.add(id);
  }
  state.queued = [...queuedSet];
  state.lastFetch = new Date().toISOString();
  saveState(target, state);

  const productsToProcess = allProducts.filter((p) => queuedSet.has(p.id));
  if (limit) productsToProcess.length = Math.min(productsToProcess.length, limit);

  console.error(`Queued: ${state.queued.length}, Done: ${state.done.length}. Processing ${productsToProcess.length} products...`);
  let processed = 0;
  let imagesConverted = 0;
  const errors = [];

  for (let i = 0; i < productsToProcess.length; i++) {
    const p = productsToProcess[i];
    const productId = p.id;
    const oldTitle = p.title || 'Product';
    const tags = Array.isArray(p.tags) ? p.tags : [];
    const tagsStr = tags.join(', ');
    const prebuilt = descriptionsById[productId];

    let title, metaTitle, metaDesc, descriptionHtml;
    if (prebuilt) {
      title = prebuilt.title ?? enhanceTitle(oldTitle);
      metaTitle = prebuilt.metaTitle ?? truncate(`${title} | ${siteName}`, 60);
      metaDesc = prebuilt.metaDescription ?? '';
      descriptionHtml = prebuilt.descriptionHtml ?? '';
    } else if (useGemini) {
      const gemini = callGeminiEnhance(oldTitle, p.descriptionHtml, tags, siteName, target);
      if (gemini?.title && gemini?.descriptionHtml) {
        title = truncate(gemini.title, 60);
        metaTitle = truncate(gemini.metaTitle ?? `${title} | ${siteName}`, 60);
        metaDesc = truncate(gemini.metaDescription ?? '', 160);
        descriptionHtml = gemini.descriptionHtml;
      } else {
        if (useGemini) console.error(`  Gemini failed for "${oldTitle.slice(0,40)}...", using static`);
        title = enhanceTitle(oldTitle);
        metaTitle = truncate(`${title} | ${siteName}`, 60);
        const desc = p.descriptionHtml ? p.descriptionHtml.replace(/<[^>]+>/g, ' ').trim() : '';
        metaDesc = truncate(p.seo?.description || desc, 160);
        descriptionHtml = buildEnhancedDescription(oldTitle, p.descriptionHtml, siteName);
      }
    } else {
      title = enhanceTitle(oldTitle);
      metaTitle = truncate(`${title} | ${siteName}`, 60);
      const desc = p.descriptionHtml ? p.descriptionHtml.replace(/<[^>]+>/g, ' ').trim() : '';
      metaDesc = truncate(p.seo?.description || desc, 160);
      descriptionHtml = buildEnhancedDescription(oldTitle, p.descriptionHtml, siteName);
    }

    const mediaEdges = p.media?.edges || [];
    const images = [];

    for (let j = 0; j < mediaEdges.length; j++) {
      const img = mediaEdges[j].node?.image;
      if (!img?.url) continue;
      const suffix = mediaEdges.length > 1 ? String(j + 1) : '';
      const convertArgs = [
        resolve(process.cwd(), 'scripts/shopify-convert-upload-product-image.mjs'),
        img.url,
        title,
        '--tags',
        tagsStr || title,
        '--prefix',
        prefix,
      ];
      if (suffix) convertArgs.push('--suffix', suffix);
      const convertResult = run('node', convertArgs);
      if (convertResult.status !== 0) {
        errors.push({ product: title, image: j + 1, msg: convertResult.stderr });
        continue;
      }
      try {
        const out = JSON.parse(convertResult.stdout.trim());
        images.push({ url: out.url, alt: out.alt });
        imagesConverted++;
      } catch {
        errors.push({ product: title, image: j + 1, msg: 'Invalid convert output' });
      }
    }

    const updateArgs = [
      resolve(process.cwd(), 'scripts/shopify-update-product.mjs'),
      target,
      productId,
      '--title',
      title,
      '--description',
      descriptionHtml,
      '--meta-title',
      metaTitle,
      '--meta-description',
      metaDesc,
    ];
    if (images.length > 0) {
      updateArgs.push('--images', JSON.stringify(images));
    }
    const updateResult = run('node', updateArgs);
    if (updateResult.status !== 0) {
      errors.push({ product: title, msg: updateResult.stderr });
      continue;
    }
    processed++;
    state.queued = state.queued.filter((id) => id !== productId);
    state.done.push(productId);
    saveState(target, state);
    if ((i + 1) % 10 === 0) console.error(`  ${i + 1}/${productsToProcess.length} done (queued: ${state.queued.length}, done: ${state.done.length})`);
  }

  console.error(`\nDone. Processed ${processed}/${productsToProcess.length} products, ${imagesConverted} images converted.`);
  console.error(`State: data/shopify-enhance/${target}/ queued=${state.queued.length} done=${state.done.length}`);
  if (errors.length) {
    console.error(`Errors (${errors.length}):`);
    errors.slice(0, 20).forEach((e) => console.error('  -', e.product, e.msg?.slice(0, 80)));
    if (errors.length > 20) console.error('  ... and', errors.length - 20, 'more');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(99);
});
