#!/usr/bin/env node
/**
 * Upload a local image file to Cloudflare R2 and output the public CDN URL.
 * Used by homepage-graphics workflow after generating images.
 *
 * Usage:
 *   node scripts/upload-image-to-r2.mjs <localFilePath> [objectKey]
 *
 * If objectKey is omitted, it is derived from the filename only (no prefix).
 * Object keys are stored without a "generated/" prefix on the CDN.
 * Output (stdout): https://cdn.atlagia.com/...
 */

import { readFileSync, existsSync } from 'fs';
import { basename } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 settings — used for all uploads
const R2_ENDPOINT_URL = 'https://f3553efcf18c1fa94611c55dbb1d1d12.r2.cloudflarestorage.com';
const R2_ACCESS_KEY_ID = 'f58c13c5af053ee609a7c11b12f27273';
const R2_SECRET_ACCESS_KEY = '3f710b9b306faf7905f90ce3b39882f53a53fd8255d971c6c101e1289ada3987';
const R2_BUCKET_NAME = 'atlagia';
const R2_PUBLIC_URL = 'https://cdn.atlagia.com';

function usage() {
  console.error('Usage: node scripts/upload-image-to-r2.mjs <localFilePath> [objectKey]');
  console.error('  objectKey: optional, e.g. MotorRacingApparel/motorsport-apparel/hero.png');
  console.error('  If omitted, uses <basename>. Leading "generated/" in objectKey is stripped.');
  process.exit(1);
}

function getContentType(path) {
  const ext = path.replace(/.*\./, '').toLowerCase();
  const mime = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
  };
  return mime[ext] || 'application/octet-stream';
}

async function main() {
  const localPath = process.argv[2];
  let objectKey = process.argv[3];

  if (!localPath) usage();

  if (!existsSync(localPath)) {
    console.error('Error: File not found:', localPath);
    process.exit(2);
  }

  if (!objectKey) objectKey = basename(localPath);
  // Strip leading "generated/" so CDN path has no generated prefix
  if (objectKey.startsWith('generated/')) objectKey = objectKey.slice('generated/'.length);

  const body = readFileSync(localPath);
  const contentType = getContentType(localPath);

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
      Body: body,
      ContentType: contentType,
    })
  );

  const publicUrl = `${R2_PUBLIC_URL}/${objectKey}`;
  console.log(publicUrl);
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(4);
});
