#!/usr/bin/env node
/**
 * Download product image from URL, convert to WebP, inject title+tags into R2 metadata, upload to CDN.
 * Filename = slug(title) + optional suffix for multiple images. Alt = title + tags (comma-separated).
 *
 * Usage:
 *   node scripts/shopify-convert-upload-product-image.mjs <imageUrl> <productTitle> [--tags "tag1,tag2"] [--prefix "StoreName/products"] [--suffix "2"]
 *
 * Output: CDN URL (stdout). Alt text = productTitle, tag1, tag2
 * Requires: sharp, @aws-sdk/client-s3
 */

import { existsSync } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ENDPOINT_URL = 'https://f3553efcf18c1fa94611c55dbb1d1d12.r2.cloudflarestorage.com';
const R2_ACCESS_KEY_ID = 'f58c13c5af053ee609a7c11b12f27273';
const R2_SECRET_ACCESS_KEY = '3f710b9b306faf7905f90ce3b39882f53a53fd8255d971c6c101e1289ada3987';
const R2_BUCKET_NAME = 'atlagia';
const R2_PUBLIC_URL = 'https://cdn.atlagia.com';

function usage() {
  console.error('Usage: node scripts/shopify-convert-upload-product-image.mjs <imageUrl> <productTitle> [--tags "tag1,tag2"] [--prefix "Store/products"] [--suffix "2"]');
  process.exit(1);
}

function slugify(title) {
  if (!title || typeof title !== 'string') return 'image';
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'image';
}

function parseArgs() {
  const args = process.argv.slice(2);
  const imageUrl = args[0];
  const productTitle = args[1];
  let tags = '';
  let prefix = '';
  let suffix = '';
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--tags' && args[i + 1]) { tags = args[i + 1]; i++; }
    else if (args[i] === '--prefix' && args[i + 1]) { prefix = args[i + 1].replace(/\/$/, ''); i++; }
    else if (args[i] === '--suffix' && args[i + 1]) { suffix = args[i + 1]; i++; }
  }
  return { imageUrl, productTitle, tags, prefix, suffix };
}

/** Build alt: productTitle, tag1, tag2 */
function buildAlt(productTitle, tags) {
  const parts = [productTitle].concat(tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []);
  return parts.join(', ');
}

async function main() {
  const { imageUrl, productTitle, tags, prefix, suffix } = parseArgs();
  if (!imageUrl || !productTitle) usage();

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.error('Error: sharp required. Run: npm install sharp');
    process.exit(3);
  }

  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const webpBuffer = await sharp(buffer)
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  const slug = slugify(productTitle);
  const baseName = suffix ? `${slug}-${suffix}` : slug;
  const objectKey = prefix ? `${prefix}/${baseName}.webp` : `${baseName}.webp`;

  const metadata = {
    title: productTitle,
    ...(tags ? { tags } : {}),
  };

  const client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT_URL,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: objectKey,
      Body: webpBuffer,
      ContentType: 'image/webp',
      Metadata: metadata,
    })
  );

  const publicUrl = `${R2_PUBLIC_URL}/${objectKey}`;
  const alt = buildAlt(productTitle, tags);
  console.log(JSON.stringify({ url: publicUrl, alt }));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(4);
});
