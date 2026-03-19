#!/usr/bin/env node
/**
 * Update a Shopify product via Admin GraphQL (title, description, SEO, media).
 *
 * Usage:
 *   node scripts/shopify-update-product.mjs <target-website> <productId> [options]
 *
 * Options:
 *   --title "..."          Product title
 *   --description "..."    descriptionHtml
 *   --meta-title "..."     SEO title
 *   --meta-description "..." SEO description
 *   --images '[{"url":"...","alt":"..."},...]'  Replace media (creates new, then deletes old)
 *
 * For images: provide array of {url, alt}. Shopify fetches from URL for new media.
 * Requires: dotenv. Product ID must be gid format (e.g. gid://shopify/Product/123).
 */

import { existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

function usage() {
  console.error('Usage: node scripts/shopify-update-product.mjs <target-website> <productId> [--title "..." ] [--description "..."] [--meta-title "..."] [--meta-description "..."] [--images \'[{"url":"...","alt":"..."}]\']');
  process.exit(1);
}

function getOpt(args, key) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === key && args[i + 1]) return args[i + 1];
  }
  return null;
}

function loadEnv(target) {
  const envFile = `.env.${target}`;
  const envPath = resolve(process.cwd(), envFile);
  if (!existsSync(envPath)) {
    console.error(`Error: ${envFile} not found`);
    process.exit(2);
  }
  const result = dotenv.config({ path: envPath, override: true });
  if (result.error) {
    console.error('Error loading env:', result.error.message);
    process.exit(3);
  }
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  const shop = process.env.PUBLIC_SHOPIFY_SHOP || process.env.SHOPIFY_API_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!token || !shop) {
    console.error('Error: SHOPIFY_ACCESS_TOKEN and PUBLIC_SHOPIFY_SHOP required');
    process.exit(4);
  }
  const baseUrl = shop.includes('://') ? shop : `https://${shop}`;
  return baseUrl.replace(/\/$/, '') + '/admin/api/2024-10/graphql.json';
}

async function graphql(apiUrl, token, query, variables) {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error('GraphQL: ' + JSON.stringify(json.errors));
  return json.data;
}

const PRODUCT_UPDATE = `
mutation ProductUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product { id title }
    userErrors { field message }
  }
}
`;

const PRODUCT_CREATE_MEDIA = `
mutation CreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
  productCreateMedia(media: $media, productId: $productId) {
    media { id }
    mediaUserErrors { field message }
  }
}
`;

const PRODUCT_DELETE_MEDIA = `
mutation DeleteMedia($productId: ID!, $mediaIds: [ID!]!) {
  productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
    deletedMediaIds
    mediaUserErrors { field message }
  }
}
`;

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  const productId = args[1];
  if (!target || !productId) usage();

  const apiUrl = loadEnv(target);
  const token = process.env.SHOPIFY_ACCESS_TOKEN;

  const title = getOpt(args, '--title');
  const description = getOpt(args, '--description');
  const metaTitle = getOpt(args, '--meta-title');
  const metaDescription = getOpt(args, '--meta-description');
  const imagesJson = getOpt(args, '--images');

  const input = { id: productId };
  if (title != null) input.title = title;
  if (description != null) input.descriptionHtml = description;
  if (metaTitle != null || metaDescription != null) {
    input.seo = {};
    if (metaTitle != null) input.seo.title = metaTitle;
    if (metaDescription != null) input.seo.description = metaDescription;
  }

  if (Object.keys(input).length > 1) {
    const data = await graphql(apiUrl, token, PRODUCT_UPDATE, { input });
    const errs = data.productUpdate?.userErrors || [];
    if (errs.length) {
      console.error('ProductUpdate errors:', errs);
      process.exit(5);
    }
  }

  if (imagesJson) {
    let images;
    try {
      images = JSON.parse(imagesJson);
    } catch {
      console.error('Invalid --images JSON');
      process.exit(6);
    }
    if (!Array.isArray(images) || images.length === 0) {
      console.error('--images must be non-empty array');
      process.exit(7);
    }

    const createMediaInput = images.map((img) => ({
      originalSource: img.url,
      alt: img.alt || '',
      mediaContentType: 'IMAGE',
    }));

    const createData = await graphql(apiUrl, token, PRODUCT_CREATE_MEDIA, {
      productId,
      media: createMediaInput,
    });
    const createErrs = createData.productCreateMedia?.mediaUserErrors || [];
    if (createErrs.length) {
      console.error('productCreateMedia errors:', createErrs);
      process.exit(8);
    }

    const productRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: `query { product(id: "${productId}") { media(first:100) { edges { node { ... on MediaImage { id } } } } } }`,
      }),
    });
    const productJson = await productRes.json();
    const mediaEdges = productJson?.data?.product?.media?.edges || [];
    const oldIds = mediaEdges.map((e) => e.node.id).filter(Boolean);
    const newIds = (createData.productCreateMedia?.media || []).map((m) => m.id);
    const toDelete = oldIds.filter((id) => !newIds.includes(id));

    if (toDelete.length > 0) {
      await graphql(apiUrl, token, PRODUCT_DELETE_MEDIA, {
        productId,
        mediaIds: toDelete,
      });
    }
  }

  console.log('OK');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(9);
});
