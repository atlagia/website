#!/usr/bin/env node
/**
 * Fetch Shopify products via Admin GraphQL API.
 * Loads .env.<target-website> for SHOPIFY_ACCESS_TOKEN, PUBLIC_SHOPIFY_SHOP.
 *
 * Usage:
 *   node scripts/shopify-fetch-products.mjs <target-website> [--out products.json] [--limit N]
 *
 * Output: JSON array of products to stdout (or --out file).
 * Requires: dotenv (in package.json).
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

function usage() {
  console.error('Usage: node scripts/shopify-fetch-products.mjs <target-website> [--out products.json] [--limit N]');
  console.error('  target-website: e.g. Drivon, GlobalGiftCards (matches .env.Drivon, .env.GlobalGiftCards)');
  process.exit(1);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const target = args[0];
  let outFile = null;
  let limit = null;
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--out' && args[i + 1]) { outFile = args[i + 1]; i++; }
    else if (args[i] === '--limit' && args[i + 1]) { limit = parseInt(args[i + 1], 10); i++; }
  }
  return { target, outFile, limit };
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
    console.error('Error: SHOPIFY_ACCESS_TOKEN and PUBLIC_SHOPIFY_SHOP (or SHOPIFY_API_URL) required in', envFile);
    process.exit(4);
  }
  const baseUrl = shop.includes('://') ? shop : `https://${shop}`;
  const apiBase = baseUrl.replace(/\/$/, '') + '/admin/api/2024-10/graphql.json';
  return { token, apiBase };
}

const PRODUCTS_QUERY = `
query GetProducts($cursor: String, $first: Int) {
  products(first: $first, after: $cursor) {
    edges {
      cursor
      node {
        id
        title
        handle
        descriptionHtml
        tags
        seo {
          title
          description
        }
        media(first: 50) {
          edges {
            node {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;

async function fetchAllProducts(token, apiBase, limit) {
  const products = [];
  let cursor = null;
  const first = Math.min(250, limit || 250);

  while (true) {
    const variables = { first, cursor };
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY, variables }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Shopify API ${res.status}: ${text}`);
    }
    const json = await res.json();
    if (json.errors) {
      throw new Error('GraphQL errors: ' + JSON.stringify(json.errors));
    }
    const { edges, pageInfo } = json.data.products;
    for (const e of edges) {
      products.push(e.node);
      if (limit && products.length >= limit) break;
    }
    if ((limit && products.length >= limit) || !pageInfo.hasNextPage) break;
    cursor = pageInfo.endCursor;
  }
  return products;
}

async function main() {
  const { target, outFile, limit } = parseArgs();
  if (!target) usage();

  const { token, apiBase } = loadEnv(target);
  const products = await fetchAllProducts(token, apiBase, limit);
  const json = JSON.stringify(products, null, 2);

  if (outFile) {
    writeFileSync(outFile, json);
    console.error(`Wrote ${products.length} products to ${outFile}`);
  } else {
    console.log(json);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(5);
});
