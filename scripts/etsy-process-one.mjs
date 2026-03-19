#!/usr/bin/env node
/**
 * Process one Etsy listing: enhance (Gemini), convert images to WebP, create product in Shopify.
 *
 * Usage:
 *   node scripts/etsy-process-one.mjs <target-website> <listing-json-path> [--site-name "Site"] [--prefix "StoreName/etsy"]
 *
 * listing-json-path: path to JSON from scrape_etsy_listing { title, description, price, images[], variations[] }
 * Output: JSON { productId, title, handle } or exits non-zero.
 */
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { spawnSync } from 'child_process';
import { resolve } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { loadRootAndStoreEnv } from './load-root-and-store-env.mjs';

function run(cmd, args, input) {
  const r = spawnSync(cmd, args, {
    encoding: 'utf8',
    input,
    maxBuffer: 50 * 1024 * 1024,
  });
  return { stdout: r.stdout?.trim(), stderr: r.stderr, status: r.status };
}

function truncate(s, len) {
  s = (s || '').replace(/\s+/g, ' ').trim();
  return s.length <= len ? s : s.slice(0, len - 3) + '...';
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  const listingPath = args[1];
  let siteName = 'Global Gift Cards';
  let prefix = 'EtsyImport/products';
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--site-name' && args[i + 1]) { siteName = args[i + 1]; i++; }
    else if (args[i] === '--prefix' && args[i + 1]) { prefix = args[i + 1].replace(/\/$/, ''); i++; }
  }

  if (!target || !listingPath || !existsSync(resolve(process.cwd(), listingPath))) {
    console.error('Usage: node scripts/etsy-process-one.mjs <target-website> <listing-json-path> [--site-name "Site"] [--prefix "Store/etsy"]');
    process.exit(1);
  }

  loadRootAndStoreEnv(target);

  const listingId = listingPath.replace(/^.*[/\\]/, '').replace(/\.json$/i, '') || null;

  const listing = JSON.parse(readFileSync(resolve(process.cwd(), listingPath), 'utf8'));
  const oldTitle = listing.title || 'Product';
  const oldDesc = listing.description || '';
  const tagsArr = listing.tags || [];
  const tagsStr = Array.isArray(tagsArr) ? tagsArr.join(', ') : (typeof tagsArr === 'string' ? tagsArr : '');
  const imageUrls = listing.images || [];
  const etsyImages = Array.isArray(imageUrls)
    ? imageUrls.filter((u) => typeof u === 'string' && u.includes('etsystatic') && u.includes('il_794xN'))
    : [];
  if (etsyImages.length === 0) {
    const fallback = (listing.images || []).filter((u) => typeof u === 'string' && u.includes('etsystatic'));
    etsyImages.push(...fallback);
  }
  const listingPrice = listing.price != null ? parseFloat(String(listing.price)) : null;
  const variations = listing.variations || {};
  const optionKey = Object.keys(variations).find((k) => Array.isArray(variations[k]) && variations[k].length > 0);
  const optionRows = optionKey ? variations[optionKey] : [];
  const variantsForCreate = optionRows.map((row) => {
    const name = (row.name || row.optionValue || '').trim();
    const value = name.replace(/\s*\([^)]*\).*$/, '').trim().split(/\s+/)[0] || name || 'Default';
    return { optionName: 'Size', optionValue: value, price: String(row.price != null ? row.price : listingPrice || 0) };
  });

  const tmpDesc = resolve(tmpdir(), `etsy-desc-${randomBytes(8).toString('hex')}.txt`);
  writeFileSync(tmpDesc, oldDesc, 'utf8');
  const geminiArgs = [
    resolve(process.cwd(), 'scripts/shopify-gemini-enhance.mjs'),
    oldTitle,
    '--env-store', target,
    '--description-file', tmpDesc,
    '--tags', tagsStr,
    '--site-name', siteName,
  ];
  const geminiResult = run('node', geminiArgs);
  unlinkSync(tmpDesc);
  if (geminiResult.status !== 0) {
    console.error('Gemini failed:', geminiResult.stderr);
    process.exit(2);
  }
  const enhanced = JSON.parse(geminiResult.stdout);
  const title = truncate(enhanced.title, 60);
  const metaTitle = truncate(enhanced.metaTitle || `${title} | ${siteName}`, 60);
  const metaDesc = truncate(enhanced.metaDescription || '', 160);

  const images = [];
  for (let j = 0; j < etsyImages.length; j++) {
    const url = etsyImages[j];
    const suffix = etsyImages.length > 1 ? String(j + 1) : '';
    const convertArgs = [
      resolve(process.cwd(), 'scripts/shopify-convert-upload-product-image.mjs'),
      url,
      title,
      '--tags', tagsStr || title,
      '--prefix', prefix,
    ];
    if (suffix) convertArgs.push('--suffix', suffix);
    const convertResult = run('node', convertArgs);
    if (convertResult.status !== 0) continue;
    try {
      images.push(JSON.parse(convertResult.stdout));
    } catch {}
  }

  const productType = (enhanced.productType || '').trim().slice(0, 100);
  const enhancedTags = Array.isArray(enhanced.tags) && enhanced.tags.length > 0
    ? enhanced.tags.join(', ')
    : (tagsStr || title);

  const createArgs = [
    resolve(process.cwd(), 'scripts/shopify-create-product.mjs'),
    target,
    '--title', title,
    '--description', enhanced.descriptionHtml || `<p>${oldDesc.slice(0, 500)}</p>`,
    '--meta-title', metaTitle,
    '--meta-description', metaDesc,
    '--tags', enhancedTags,
  ];
  if (listingId) createArgs.push('--etsy-listing-id', listingId);
  if (productType) createArgs.push('--product-type', productType);
  const priceVal = listingPrice != null && !Number.isNaN(listingPrice) ? String(listingPrice) : (variantsForCreate[0]?.price ?? '');
  if (priceVal) createArgs.push('--price', priceVal);
  if (variantsForCreate.length > 0) createArgs.push('--variants', JSON.stringify(variantsForCreate));
  if (images.length > 0) createArgs.push('--images', JSON.stringify(images));
  const createResult = run('node', createArgs);
  if (createResult.status !== 0) {
    console.error('Create product failed:', createResult.stderr);
    process.exit(3);
  }
  const product = JSON.parse(createResult.stdout);
  console.log(JSON.stringify(product));
}

main().catch((e) => {
  console.error(e);
  process.exit(99);
});
