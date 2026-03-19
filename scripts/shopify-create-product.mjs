#!/usr/bin/env node
/**
 * Create a Shopify product via Admin GraphQL (productCreate + media + productVariantsBulkCreate for price/variants).
 * After create, sets each variant's inventory item to tracked: false (do not track inventory).
 *
 * Usage:
 *   node scripts/shopify-create-product.mjs <target-website> --title "..." [--description "..."] [--meta-title "..."] [--meta-description "..."] [--images '[...]'] [--vendor "..."] [--product-type "..."] [--tags "t1,t2"] [--price "99.99"] [--variants '[{"optionName":"Size","optionValue":"M","price":"99.99"}]']
 *
 * --price: default variant price (required for correct pricing; without it Shopify defaults to 0).
 * --variants: JSON array of { optionName, optionValue, price }. Creates Size (or Option) variants and sets each price.
 * --product-type: Shopify product type/category.
 * --tags: comma-separated or from Gemini (AI-generated tags recommended).
 *
 * Requires: .env.<target-website> with SHOPIFY_ACCESS_TOKEN, PUBLIC_SHOPIFY_SHOP.
 * Requires write_products and write_inventory scopes (inventoryItemUpdate sets tracked: false).
 */
import { existsSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

function getOpt(args, key) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === key && args[i + 1]) return args[i + 1];
  }
  return null;
}

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

const PRODUCT_CREATE = `
mutation ProductCreate($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
  productCreate(product: $product, media: $media) {
    product {
      id title handle
      variants(first: 50) { nodes { id inventoryItem { id } } }
    }
    userErrors { field message }
  }
}
`;

const VARIANTS_BULK_CREATE = `
mutation ProductVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!, $strategy: ProductVariantsBulkCreateStrategy) {
  productVariantsBulkCreate(productId: $productId, variants: $variants, strategy: $strategy) {
    product { id }
    productVariants { id title price inventoryItem { id } }
    userErrors { field message }
  }
}
`;

const INVENTORY_ITEM_UPDATE = `
mutation InventoryItemUpdate($id: ID!, $input: InventoryItemInput!) {
  inventoryItemUpdate(id: $id, input: $input) {
    inventoryItem { id tracked }
    userErrors { message }
  }
}
`;

const PRODUCTS_QUERY = `
  query ProductsByTag($query: String!) {
    products(first: 1, query: $query) {
      edges { node { id title handle } }
    }
  }
`;

/** Parse --tags: comma-separated string or JSON array string. */
function parseTags(tagsStr) {
  if (!tagsStr) return [];
  const trimmed = tagsStr.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed);
      return Array.isArray(arr) ? arr.map((t) => String(t).trim()).filter(Boolean) : [];
    } catch {
      return trimmed.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }
  return trimmed.split(',').map((t) => t.trim()).filter(Boolean);
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  const title = getOpt(args, '--title');
  const description = getOpt(args, '--description');
  const metaTitle = getOpt(args, '--meta-title');
  const metaDescription = getOpt(args, '--meta-description');
  const imagesJson = getOpt(args, '--images');
  const vendor = getOpt(args, '--vendor');
  const productType = getOpt(args, '--product-type');
  const tagsStr = getOpt(args, '--tags');
  const priceStr = getOpt(args, '--price');
  const variantsJson = getOpt(args, '--variants');
  const etsyListingId = getOpt(args, '--etsy-listing-id');

  if (!target || !title) {
    console.error('Usage: node scripts/shopify-create-product.mjs <target-website> --title "..." [--description "..."] [--meta-title "..."] [--meta-description "..."] [--images \'[...]\'] [--vendor "..."] [--product-type "..."] [--tags "t1,t2"] [--price "99.99"] [--variants \'[...]\']');
    process.exit(1);
  }

  const { token, apiUrl } = loadEnv(target);

  if (etsyListingId) {
    const tag = `etsy-listing-${etsyListingId}`;
    const queryData = await graphql(apiUrl, token, PRODUCTS_QUERY, { query: `tag:${tag}` });
    const edges = queryData.products?.edges || [];
    if (edges.length > 0) {
      const node = edges[0].node;
      console.log(JSON.stringify({ id: node.id, title: node.title, handle: node.handle }));
      return;
    }
  }

  const tags = parseTags(tagsStr);
  if (etsyListingId) {
    const tag = `etsy-listing-${etsyListingId}`;
    if (!tags.includes(tag)) tags.push(tag);
  }
  const productInput = {
    title: title.slice(0, 255),
    status: 'ACTIVE',
    ...(description != null && { descriptionHtml: description }),
    ...(metaTitle != null || metaDescription != null
      ? { seo: { ...(metaTitle && { title: metaTitle.slice(0, 70) }), ...(metaDescription && { description: metaDescription.slice(0, 320) }) } }
      : {}),
    ...(vendor && { vendor }),
    ...(productType && { productType }),
    ...(tags.length > 0 && { tags }),
  };

  let variantsInput = [];
  let optionName = 'Size';
  try {
    if (variantsJson) {
      const v = JSON.parse(variantsJson);
      if (Array.isArray(v) && v.length > 0) {
        variantsInput = v;
        if (v[0] && v[0].optionName) optionName = String(v[0].optionName);
      }
    }
  } catch (e) {
    console.error('Invalid --variants JSON');
    process.exit(4);
  }

  const hasOptions = variantsInput.length > 0;
  if (hasOptions) {
    const uniqueValues = [...new Set(variantsInput.map((x) => (x.optionValue || x.name || '').trim()).filter(Boolean))];
    if (uniqueValues.length > 0) {
      productInput.productOptions = [
        { name: optionName, values: uniqueValues.map((val) => ({ name: val })) },
      ];
    }
  }

  let mediaInput = [];
  if (imagesJson) {
    try {
      const imgs = JSON.parse(imagesJson);
      if (Array.isArray(imgs) && imgs.length > 0) {
        mediaInput = imgs.slice(0, 250).map((img) => ({
          originalSource: img.url,
          alt: (img.alt || '').slice(0, 512),
          mediaContentType: 'IMAGE',
        }));
      }
    } catch (e) {
      console.error('Invalid --images JSON');
      process.exit(5);
    }
  }

  const createData = await graphql(apiUrl, token, PRODUCT_CREATE, {
    product: productInput,
    media: mediaInput,
  });

  const errs = createData.productCreate?.userErrors || [];
  if (errs.length) {
    console.error('productCreate errors:', errs);
    process.exit(6);
  }

  const product = createData.productCreate?.product;
  if (!product) {
    console.error('productCreate returned no product');
    process.exit(7);
  }

  const price = priceStr != null && priceStr !== '' ? parseFloat(priceStr) : (variantsInput[0]?.price != null ? parseFloat(variantsInput[0].price) : null);
  const shouldSetPrices = price != null && !Number.isNaN(price) && (hasOptions || price > 0);

  let inventoryItemIds = [];
  if (shouldSetPrices) {
    let bulkVariants;
    if (hasOptions) {
      bulkVariants = variantsInput.map((v) => ({
        optionValues: [{ optionName, name: (v.optionValue || v.name || '').trim() || 'Default' }],
        price: parseFloat(v.price) || price,
      }));
    } else {
      bulkVariants = [{ price }];
    }

    const bulkData = await graphql(apiUrl, token, VARIANTS_BULK_CREATE, {
      productId: product.id,
      variants: bulkVariants,
      strategy: 'REMOVE_STANDALONE_VARIANT',
    });

    const bulkErrs = bulkData.productVariantsBulkCreate?.userErrors || [];
    if (bulkErrs.length) {
      console.error('productVariantsBulkCreate errors:', bulkErrs);
      process.exit(8);
    }
    const pvs = bulkData.productVariantsBulkCreate?.productVariants || [];
    inventoryItemIds = pvs.map((v) => v.inventoryItem?.id).filter(Boolean);
  } else {
    const nodes = product.variants?.nodes || [];
    inventoryItemIds = nodes.map((v) => v.inventoryItem?.id).filter(Boolean);
  }

  for (const invId of inventoryItemIds) {
    const updateData = await graphql(apiUrl, token, INVENTORY_ITEM_UPDATE, {
      id: invId,
      input: { tracked: false },
    });
    const errs = updateData.inventoryItemUpdate?.userErrors || [];
    if (errs.length) console.error('inventoryItemUpdate errors:', errs);
  }

  console.log(JSON.stringify({ id: product.id, title: product.title, handle: product.handle }));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(6);
});
