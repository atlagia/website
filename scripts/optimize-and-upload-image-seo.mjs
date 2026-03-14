#!/usr/bin/env node
/**
 * Convert image to WebP, inject title and tags into R2 object metadata, upload to CDN.
 * Used by seo-image-optimizer subagent for SEO image optimization.
 *
 * Usage:
 *   node scripts/optimize-and-upload-image-seo.mjs <localFilePath> <seoTitle> [--tags "tag1,tag2"] [--prefix "StoreName/theme/"]
 *
 * - localFilePath: path to PNG/JPG/JPEG/GIF/WebP
 * - seoTitle: SEO-friendly title; used for object key (slugified) and Metadata.title
 * - --tags: optional comma-separated tags (stored in R2 object Metadata.tags)
 * - --prefix: optional object key prefix (e.g. "FastIPTV/iptv/"); no trailing slash
 *
 * Object key = (prefix ? prefix + '/' : '') + slug(seoTitle) + '.webp'
 * Output (stdout): https://cdn.atlagia.com/...
 *
 * Requires: npm install sharp
 */

import { readFileSync, existsSync } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ENDPOINT_URL = 'https://f3553efcf18c1fa94611c55dbb1d1d12.r2.cloudflarestorage.com';
const R2_ACCESS_KEY_ID = 'f58c13c5af053ee609a7c11b12f27273';
const R2_SECRET_ACCESS_KEY = '3f710b9b306faf7905f90ce3b39882f53a53fd8255d971c6c101e1289ada3987';
const R2_BUCKET_NAME = 'atlagia';
const R2_PUBLIC_URL = 'https://cdn.atlagia.com';

function usage() {
  console.error('Usage: node scripts/optimize-and-upload-image-seo.mjs <localFilePath> <seoTitle> [--tags "tag1,tag2"] [--prefix "StoreName/theme"]');
  console.error('  seoTitle is slugified for the CDN filename (e.g. "Premium Jacket Hero" -> premium-jacket-hero.webp).');
  console.error('  Requires: npm install sharp');
  process.exit(1);
}

/** Slugify for object key: lowercase, replace non-alphanumeric with dash, collapse dashes */
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
  const localPath = args[0];
  const seoTitle = args[1];
  let tags = '';
  let prefix = '';
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--tags' && args[i + 1]) { tags = args[i + 1]; i++; }
    else if (args[i] === '--prefix' && args[i + 1]) { prefix = args[i + 1].replace(/\/$/, ''); i++; }
  }
  return { localPath, seoTitle, tags, prefix };
}

async function main() {
  const { localPath, seoTitle, tags, prefix } = parseArgs();
  if (!localPath || !seoTitle) usage();

  if (!existsSync(localPath)) {
    console.error('Error: File not found:', localPath);
    process.exit(2);
  }

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.error('Error: sharp is required. Run: npm install sharp');
    process.exit(3);
  }

  const slug = slugify(seoTitle);
  const objectKey = prefix ? `${prefix}/${slug}.webp` : `${slug}.webp`;

  const inputBuffer = readFileSync(localPath);
  const webpBuffer = await sharp(inputBuffer)
    .webp({ quality: 85, effort: 4 })
    .toBuffer();

  const metadata = {
    title: seoTitle,
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
  console.log(publicUrl);
}

main().catch((err) => {
  console.error('Optimize/upload failed:', err.message);
  process.exit(4);
});
