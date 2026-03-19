#!/usr/bin/env node
/**
 * Find and delete duplicate products in a Shopify store. Duplicates are identified by
 * normalized title (same words, any order) so e.g. "Avirex Men's Yellow Bomber" and
 * "Men's Yellow Avirex Bomber" are treated as the same. Keeps the first product in each
 * group (by GraphQL id order), deletes the rest.
 *
 * Usage: node scripts/shopify-dedupe-products.mjs <target-website> [--dry-run]
 *
 * Requires: .env.<target-website> with SHOPIFY_ACCESS_TOKEN, PUBLIC_SHOPIFY_SHOP.
 */
import { existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

function loadEnv(target) {
  const envPath = resolve(process.cwd(), `.env.${target}`);
  if (!existsSync(envPath)) {
    console.error(`Error: .env.${target} not found`);
    process.exit(2);
  }
  dotenv.config({ path: envPath, override: true });
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  const shop = process.env.PUBLIC_SHOPIFY_SHOP || process.env.SHOPIFY_API_URL?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!token || !shop) {
    console.error('Error: SHOPIFY_ACCESS_TOKEN and PUBLIC_SHOPIFY_SHOP required');
    process.exit(3);
  }
  return { token, apiUrl: `https://${shop.replace(/^https?:\/\//, '')}/admin/api/2024-10/graphql.json` };
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

/** Normalize title for dedupe: lowercase, strip punctuation, sort words. */
function normalizeTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .sort()
    .join(' ');
}

const PRODUCTS_QUERY = `
  query Products($cursor: String) {
    products(first: 250, after: $cursor, query: "status:active") {
      edges { node { id title handle featuredImage { url } } }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const PRODUCT_DELETE = `
  mutation ProductDelete($input: ProductDeleteInput!) {
    productDelete(input: $input) {
      deletedProductId
      userErrors { field message }
    }
  }
`;

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  const dryRun = args.includes('--dry-run');
  if (!target) {
    console.error('Usage: node scripts/shopify-dedupe-products.mjs <target-website> [--dry-run]');
    process.exit(1);
  }

  const { token, apiUrl } = loadEnv(target);
  const products = [];
  let cursor = null;
  do {
    const data = await graphql(apiUrl, token, PRODUCTS_QUERY, { cursor });
    const { edges, pageInfo } = data.products;
    products.push(...edges.map((e) => e.node));
    cursor = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (cursor);

  const byKey = new Map();
  for (const p of products) {
    const key = normalizeTitle(p.title);
    if (!key) continue;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(p);
  }

  const duplicates = [...byKey.entries()].filter(([, list]) => list.length > 1);
  let deleted = 0;
  const toDelete = [];
  for (const [key, list] of duplicates) {
    const sorted = [...list].sort((a, b) => (a.id < b.id ? -1 : 1));
    const keep = sorted[0];
    const remove = sorted.slice(1);
    toDelete.push(...remove);
  }

  if (toDelete.length === 0) {
    console.log(JSON.stringify({ message: 'No duplicate products found.', totalProducts: products.length }));
    return;
  }

  if (dryRun) {
    console.log(JSON.stringify({
      message: 'Dry run: would delete the following duplicates (keeping first per group).',
      wouldDelete: toDelete.length,
      groups: duplicates.map(([key, list]) => ({
        normalizedTitle: key,
        count: list.length,
        keep: list[0].title,
        remove: list.slice(1).map((p) => p.title),
      })),
    }));
    return;
  }

  for (const p of toDelete) {
    const data = await graphql(apiUrl, token, PRODUCT_DELETE, { input: { id: p.id } });
    const errs = data.productDelete?.userErrors || [];
    if (errs.length) {
      console.error(`Failed to delete ${p.id} (${p.title}):`, errs);
      continue;
    }
    deleted++;
    console.warn(`Deleted: ${p.title} (${p.id})`);
  }

  console.log(JSON.stringify({
    deleted,
    totalProducts: products.length,
    duplicateGroups: duplicates.length,
    message: `Removed ${deleted} duplicate product(s).`,
  }));
}

main().catch((e) => {
  console.error(e);
  process.exit(99);
});
