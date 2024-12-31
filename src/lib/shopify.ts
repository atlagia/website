import { createClient } from 'redis';
import { getRedisClient, getCachedData as getRedisData, setCachedData as setRedisData } from './redis';
import { connectToDatabase } from './mongodb';
import { invalidatePageCache } from './cache';

const domain = import.meta.env.PUBLIC_SHOPIFY_SHOP;
const storefrontAccessToken = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Add store identifier to Redis key prefix
const getStorePrefix = () => {
  const domain = import.meta.env.PUBLIC_SHOPIFY_SHOP?.split('.')[0] || '';
  return `store_${domain}_`;
};

// Add new background sync function at the top of the file
async function backgroundSyncProducts() {
  console.log('🔄 [BACKGROUND] Starting products sync');
  try {
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');
    await fetchAndSaveAllProducts(collection);
    
    // Invalidate page cache after sync
    await invalidatePageCache('*/products/*');
    
    console.log('✅ [BACKGROUND] Products sync completed');
  } catch (error) {
    console.error('❌ [BACKGROUND] Products sync failed:', error);
  }
}

export async function shopifyFetch({ query, variables }) {
  const endpoint = `https://${domain}/api/2024-01/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    return {
      status: result.status,
      body: await result.json(),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 500,
      error: 'Error receiving data',
    };
  }
}

function shouldRefreshCache(lastUpdated: Date): boolean {
  const now = new Date();
  const lastUpdateDay = lastUpdated.getUTCDate();
  const currentDay = now.getUTCDate();
  
  // If it's a different day and we're past midnight GMT
  return lastUpdateDay !== currentDay && now.getUTCHours() >= 0;
}

// Update the Redis helper function to include store prefix
async function fetchFromShopifyWithRedis(redisKey: string, fetchFunction: () => Promise<any>, cacheDuration = 3600) {
  try {
    const prefixedKey = `${getStorePrefix()}${redisKey}`;
    
    // Try Redis first with prefixed key
    const redisCache = await getRedisData(prefixedKey);
    if (redisCache) {
      console.log('🚀 [REDIS CACHE HIT] Data retrieved');
      return redisCache;
    }
    
    // Fetch from Shopify
    console.log('🔄 [SHOPIFY API] Direct fetch');
    const data = await fetchFunction();
    
    // Cache in Redis with prefixed key
    console.log('💾 [REDIS] Caching Shopify response');
    await setRedisData(prefixedKey, data, cacheDuration);
    
    return data;
  } catch (error) {
    console.error('❌ [ERROR] Error in Shopify/Redis operation:', error);
    throw error;
  }
}

// Update getAllProducts to handle batched products
export async function getAllProducts() {
  const redisKey = `${getStorePrefix()}shopify_all_products`;
  const redisCache = await getRedisData(redisKey);
  
  if (redisCache) {
    console.log('🚀 [REDIS CACHE HIT] Retrieved products from Redis');
    return redisCache;
  }
  console.log('📛 [REDIS CACHE MISS] Products not found in Redis');

  try {
    // Try MongoDB
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');

    // Add this check before the existing MongoDB query
    const hasData = await collection.countDocuments({ type: 'products_cache' });
    if (!hasData) {
      console.log('📢 [MONGODB] Empty collection detected, triggering background sync');
      backgroundSyncProducts().catch(console.error);
      
      // Proceed with Shopify fetch and Redis cache
      const products = await fetchAndSaveAllProducts(null);
      await setRedisData(redisKey, products, 3600);
      return products;
    }

    try {
      console.log('🔍 [MONGODB] Attempting to fetch products...');
      
      // Get metadata from the main document
      const metadata = await collection.findOne(
        { type: 'products_cache' },
        { projection: { totalProducts: 1, totalBatches: 1, lastUpdated: 1 } }
      );

      if (!metadata) {
        console.log('📛 [MONGODB CACHE MISS] No metadata found');
        const products = await fetchAndSaveAllProducts(collection);
        await setRedisData(redisKey, products, 3600);
        return products;
      }

      // Check if cache needs refresh
      if (shouldRefreshCache(new Date(metadata.lastUpdated))) {
        console.log('⏰ Cache expired, triggering refresh');
        backgroundSyncProducts().catch(console.error);
      }

      // Fetch all batches and combine them
      let allProducts = [];
      for (let i = 0; i < metadata.totalBatches; i++) {
        const batchKey = i === 0 ? 
          { type: 'products_cache' } : 
          { type: `products_cache_${i}` };

        const batchData = await collection.findOne(
          batchKey,
          { 
            projection: { 
              'products.node': {
                id: 1,
                title: 1,
                handle: 1,
                description: 1,
                priceRange: 1,
                'images.edges': { $slice: 1 }
              }
            }
          }
        );

        if (batchData?.products) {
          allProducts = [...allProducts, ...batchData.products];
          console.log(`✅ [MONGODB] Retrieved batch ${i + 1}/${metadata.totalBatches}`);
        }
      }

      if (allProducts.length > 0) {
        console.log('💾 [REDIS] Caching combined results');
        await setRedisData(redisKey, allProducts, 3600);
        console.log(`✅ [MONGODB CACHE HIT] Retrieved ${allProducts.length} products total`);
        return allProducts;
      }

      console.log('📛 [MONGODB CACHE MISS] No products found in batches');
      const products = await fetchAndSaveAllProducts(collection);
      await setRedisData(redisKey, products, 3600);
      return products;

    } catch (error) {
      console.error('❌ [ERROR] Error fetching products:', error);
      throw error;
    }
  } catch (mongoError) {
    console.error('❌ [MONGODB ERROR] Falling back to Shopify:', mongoError);
    
    // Fallback to Shopify with Redis caching
    return fetchFromShopifyWithRedis('shopify_all_products', async () => {
      const products = await fetchAndSaveAllProducts(null); // Pass null to skip MongoDB save
      return products;
    });
  }
}

// Update fetchAndSaveAllProducts to handle batched saves
async function fetchAndSaveAllProducts(collection: any | null) {
  let hasNextPage = true;
  let cursor = null;
  let allProducts = [];

  while (hasNextPage) {
    const query = `
      query Products${cursor ? '($cursor: String!)' : ''} {
        products(first: 250${cursor ? ', after: $cursor' : ''}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              seo {
                  title
                  description
                }
              images(first: 100) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 100) {
                edges {
                  node {
                    id
                    title
                    image {
                        id
                        altText
                    }
                    selectedOptions {
                      name
                      value
                    }
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              options {
                name
                values
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const variables = cursor ? { cursor } : {};
    const response = await shopifyFetch({ query, variables });

    if (!response.body?.data?.products?.edges) {
      throw new Error('Invalid response from Shopify');
    }

    const { edges, pageInfo } = response.body.data.products;
    allProducts = [...allProducts, ...edges];
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;

    console.log(`📦 Batch retrieved: ${edges.length} products (Total: ${allProducts.length})`);
  }

  // Only save to MongoDB if collection is provided
  if (collection) {
    try {
      console.log('💾 Saving all products to MongoDB cache');
      const BATCH_SIZE = 1000;
      const totalProducts = allProducts.length;
      const batches = Math.ceil(totalProducts / BATCH_SIZE);

      // Delete existing batches
      await collection.deleteMany({
        $or: [
          { type: 'products_cache' },
          { type: { $regex: /^products_cache_\d+$/ } }
        ]
      });

      // Save products in batches
      for (let i = 0; i < batches; i++) {
        const start = i * BATCH_SIZE;
        const end = Math.min(start + BATCH_SIZE, totalProducts);
        const batchProducts = allProducts.slice(start, end);
        
        const documentKey = i === 0 ? 
          { type: 'products_cache' } : 
          { type: `products_cache_${i}` };

        await collection.updateOne(
          documentKey,
          { 
            $set: {
              products: batchProducts,
              lastUpdated: new Date(),
              lastFetchStatus: 'success',
              productCount: batchProducts.length,
              batchIndex: i,
              totalBatches: batches,
              totalProducts: totalProducts
            }
          },
          { upsert: true }
        );
        console.log(`✅ Saved batch ${i + 1}/${batches} (${batchProducts.length} products)`);
      }
      
      console.log('✅ All product batches saved successfully');
    } catch (error) {
      console.error('❌ [MONGODB ERROR] Failed to save cache:', error);
      // Continue without MongoDB cache
    }
  }

  return allProducts;
}

export async function refreshProductCache() {
  const now = new Date();
  if (now.getUTCHours() !== 0) {
    console.log('⏰ Manual refresh only allowed at 00:00 GMT');
    return null;
  }

  console.log('🔄 Manual cache refresh triggered during allowed window');
  const client = await connectToDatabase();
  const dbName = getStoreName();
  const collection = client.db(dbName).collection('products');
  
  try {
    console.log('🗑️ Invalidating current cache...');
    await collection.updateOne(
      { type: 'products_cache' },
      { $set: { lastUpdated: new Date(0) } }
    );
    
    console.log('🔄 Fetching fresh data...');
    const result = await getAllProducts();
    
    // Invalidate all product page caches
    await invalidatePageCache('products/*');
    
    console.log('✅ Product cache refreshed and page cache invalidated');
    return result;
  } catch (error) {
    console.error('❌ Error refreshing cache:', error);
    throw error;
  }
}

// Query declaration
const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      seo {
          title
          description
      }
      images(first: 100) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
      options {
        name
        values
      }
    }
    products(first: 4) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

// Update getProductByHandle to handle batched products
export async function getProductByHandle(handle: string) {
  try {
    const redisKey = `${getStorePrefix()}shopify_product_${handle}`;
    const redisCache = await getRedisData(redisKey);
    
    if (redisCache) {
      console.log('🚀 [REDIS CACHE HIT] Product found');
      return redisCache;
    }
    console.log('📛 [REDIS CACHE MISS] Product not found');

    try {
      // Try MongoDB
      const client = await connectToDatabase();
      const dbName = getStoreName();
      const collection = client.db(dbName).collection('products');

      // Add background sync trigger
      const hasData = await collection.countDocuments({ type: 'products_cache' });
      if (!hasData) {
        console.log('📢 [MONGODB] Empty collection detected, triggering background sync');
        backgroundSyncProducts().catch(console.error);
        
        // Proceed with Shopify fetch and Redis cache
        const response = await shopifyFetch({ 
          query: PRODUCT_BY_HANDLE_QUERY, 
          variables: { handle } 
        });
        const result = {
          product: response?.body?.data?.product,
          relatedProducts: response?.body?.data?.products?.edges || []
        };
        await setRedisData(redisKey, result, 3600);
        return result;
      }

      const cachedProduct = await getProductFromCache(handle);
      if (cachedProduct) {
        console.log('✅ [MONGODB CACHE HIT] Product found');
        const result = {
          product: cachedProduct,
          relatedProducts: await getRelatedProducts()
        };
        console.log('💾 [REDIS] Caching MongoDB result');
        await setRedisData(redisKey, result, 3600);
        return result;
      }
      console.log('📛 [MONGODB CACHE MISS] Product not found');

      // Fallback to Shopify
      console.log('🔄 [SHOPIFY API] Fetching product directly');
      const response = await shopifyFetch({ 
        query: PRODUCT_BY_HANDLE_QUERY, 
        variables: { handle } 
      });

      const product = response?.body?.data?.product;
      const relatedProducts = response?.body?.data?.products?.edges || [];

      if (!product) {
        throw new Error('Product not found in Shopify');
      }

      console.log('💾 [MONGODB] Saving new product to cache');
      await saveProductToMongo(product);

      const result = { product, relatedProducts };
      console.log('💾 [REDIS] Caching Shopify response');
      await setRedisData(redisKey, result, 3600);
      
      return result;
    } catch (mongoError) {
      console.error('❌ [MONGODB ERROR] Falling back to Shopify:', mongoError);
      
      // Fallback to Shopify with Redis caching
      return fetchFromShopifyWithRedis(redisKey, async () => {
        const response = await shopifyFetch({ 
          query: PRODUCT_BY_HANDLE_QUERY, 
          variables: { handle } 
        });

        const product = response?.body?.data?.product;
        const relatedProducts = response?.body?.data?.products?.edges || [];

        if (!product) {
          throw new Error('Product not found in Shopify');
        }

        return { product, relatedProducts };
      });
    }
  } catch (error) {
    console.error('❌ [ERROR] Error fetching product:', {
      handle,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// Helper function to get related products
async function getRelatedProducts() {
  const client = await connectToDatabase();
  const dbName = getStoreName();
  const collection = client.db(dbName).collection('products');
  const relatedProducts = await collection.findOne(
    { type: 'products_cache' },
    { 
      projection: { 
        products: { 
          $slice: 4
        }
      }
    }
  );
  return relatedProducts?.products || [];
}

// Update saveProductToMongo to handle the processed data
async function saveProductToMongo(product) {
  const client = await connectToDatabase();
  const dbName = getStoreName();
  const collection = client.db(dbName).collection('products');
  
  await collection.updateOne(
    { type: 'products_cache' },
    { 
      $push: { 
        products: {
          node: {
            ...product,
            images: {
              edges: product.processedImages.map(img => ({
                node: {
                  id: img.id,
                  url: img.url,
                  altText: img.altText
                }
              }))
            }
          }
        }
      },
      $set: {
        lastUpdated: new Date()
      }
    },
    { upsert: true }
  );
  console.log('✅ New product saved to MongoDB cache with processed images');
}

export async function getProductFromCache(handle: string) {
  try {
    console.log('🔍 Checking MongoDB for product:', handle);
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products');
    
    // Get metadata first to know how many batches to check
    const metadata = await collection.findOne(
      { type: 'products_cache' },
      { projection: { totalBatches: 1, lastUpdated: 1 } }
    );

    if (!metadata?.totalBatches) {
      console.log('❌ No metadata found in cache');
      return null;
    }

    // Check each batch for the product
    for (let i = 0; i < metadata.totalBatches; i++) {
      const batchKey = i === 0 ? 
        { type: 'products_cache' } : 
        { type: `products_cache_${i}` };

      // Use projection to only fetch the specific product
      const cachedData = await collection.findOne(
        batchKey,
        { 
          projection: {
            products: {
              $elemMatch: { 'node.handle': handle }
            }
          }
        }
      );

      if (cachedData?.products?.[0]?.node) {
        console.log(`✅ Found product in batch ${i + 1}`);
        return cachedData.products[0].node;
      }
    }

    console.log('❌ Product not found in any batch');
    return null;
  } catch (error) {
    console.error('❌ Error accessing cache:', error);
    return null;
  }
}

// Add index for faster queries
export async function createIndexes() {
  const client = await connectToDatabase();
  const dbName = getStoreName();
  const collection = client.db(dbName).collection('products');
  
  await collection.createIndex({ type: 1 });
  await collection.createIndex({ 'products.node.handle': 1 });
  console.log('✅ Indexes created');
}

// Update getPaginatedProducts with fallback
export async function getPaginatedProducts(page: number = 1, limit: number = 20) {
  const redisKey = `${getStorePrefix()}shopify_paginated_products_${page}_${limit}`;
  
  try {
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved page ${page} from Redis`);
      return redisCache;
    }
    console.log(`📛 [REDIS CACHE MISS] Page ${page} not found in Redis`);

    try {
      // Try MongoDB
      const client = await connectToDatabase();
      const dbName = getStoreName();
      const collection = client.db(dbName).collection('products');

      // Add background sync trigger
      const hasData = await collection.countDocuments({ type: 'products_cache' });
      if (!hasData) {
        console.log('📢 [MONGODB] Empty collection detected, triggering background sync');
        backgroundSyncProducts().catch(console.error);
        
        // Proceed with Shopify fetch and Redis cache
        const allProducts = await fetchAndSaveAllProducts(null);
        const start = (page - 1) * limit;
        const paginatedProducts = allProducts.slice(start, start + limit);
        
        const result = {
          products: paginatedProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(allProducts.length / limit),
            totalProducts: allProducts.length,
            hasNextPage: start + limit < allProducts.length,
            hasPreviousPage: page > 1
          }
        };
        
        await setRedisData(redisKey, result, 3600);
        return result;
      }

      try {
        console.log(`🔍 [MONGODB] Attempting to fetch page ${page}...`);
        
        // Get total count first
        const totalCount = await collection.findOne(
          { type: 'products_cache' },
          { projection: { productCount: 1 } }
        );

        const skip = (page - 1) * limit;
        
        const cacheData = await collection.findOne(
          { type: 'products_cache' },
          { 
            projection: { 
              products: {
                $slice: [skip, limit]
              }
            }
          }
        );

        if (!cacheData?.products) {
          console.log('📛 [MONGODB CACHE MISS] Fetching from Shopify API');
          await fetchAndSaveAllProducts(collection);
          
          // Retry MongoDB query after fetching from Shopify
          const freshData = await collection.findOne(
            { type: 'products_cache' },
            { 
              projection: { 
                products: {
                  $slice: [skip, limit]
                }
              }
            }
          );

          const totalProducts = totalCount?.productCount || freshData.products.length;
          const totalPages = Math.ceil(totalProducts / limit);

          const result = {
            products: freshData.products,
            pagination: {
              currentPage: page,
              totalPages,
              totalProducts,
              hasNextPage: page < totalPages,
              hasPreviousPage: page > 1
            }
          };

          console.log('💾 [REDIS] Caching Shopify response');
          await setRedisData(redisKey, result, 3600); // Cache for 1 hour
          
          console.log(`✅ [SHOPIFY] Retrieved page ${page} (${freshData.products.length} items)`);
          return result;
        }

        const totalProducts = totalCount?.productCount || cacheData.products.length;
        const totalPages = Math.ceil(totalProducts / limit);

        const result = {
          products: cacheData.products,
          pagination: {
            currentPage: page,
            totalPages,
            totalProducts,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
          }
        };

        console.log('💾 [REDIS] Caching MongoDB result');
        await setRedisData(redisKey, result, 3600); // Cache for 1 hour

        console.log(`✅ [MONGODB CACHE HIT] Retrieved page ${page} (${cacheData.products.length} items)`);
        return result;

      } catch (error) {
        console.error('❌ [ERROR] Error fetching paginated products:', error);
        throw error;
      }
    } catch (mongoError) {
      console.error('❌ [MONGODB ERROR] Falling back to Shopify:', mongoError);
      
      // Fallback to Shopify with Redis caching
      return fetchFromShopifyWithRedis(redisKey, async () => {
        const allProducts = await fetchAndSaveAllProducts(null);
        const start = (page - 1) * limit;
        const paginatedProducts = allProducts.slice(start, start + limit);
        
        return {
          products: paginatedProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(allProducts.length / limit),
            totalProducts: allProducts.length,
            hasNextPage: start + limit < allProducts.length,
            hasPreviousPage: page > 1
          }
        };
      });
    }
  } catch (error) {
    console.error('❌ [ERROR] Error fetching paginated products:', error);
    throw error;
  }
}

// Update saveTranslatedProductsToMongo to handle large product sets
async function saveTranslatedProductsToMongo(collection: any, products: any[], language: string) {
  try {
    const BATCH_SIZE = 700; // Maximum products per document
    const totalProducts = products.length;
    const batches = Math.ceil(totalProducts / BATCH_SIZE);

    console.log(`💾 [MONGODB] Saving ${totalProducts} products for ${language} in ${batches} batches`);

    // Delete existing documents for this language
    await collection.deleteMany({ 
      language: language.toUpperCase(),
      batchIndex: { $exists: true }
    });

    // Save products in batches
    for (let i = 0; i < batches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, totalProducts);
      const batchProducts = products.slice(start, end);
      
      const documentKey = i === 0 ? 
        { language: language.toUpperCase() } : 
        { language: `${language.toUpperCase()}_${i}` };

      await collection.updateOne(
        documentKey,
        { 
          $set: {
            products: batchProducts,
            lastUpdated: new Date(),
            productCount: batchProducts.length,
            batchIndex: i,
            totalBatches: batches,
            totalProducts: totalProducts
          }
        },
        { upsert: true }
      );

      console.log(`✅ [MONGODB] Saved batch ${i + 1}/${batches} for ${language}`);
    }

    console.log(`✅ [MONGODB] Successfully saved all ${totalProducts} products in ${batches} batches`);
  } catch (mongoError) {
    console.error('❌ [MONGODB] Error saving cache:', mongoError);
    throw mongoError;
  }
}

// Update getPaginatedTranslatedProducts to handle batched products
export async function getPaginatedTranslatedProducts(page: number = 1, limit: number = 20, language: string = 'EN') {
  try {
    const redisKey = `${getStorePrefix()}translated_products_${language.toLowerCase()}_page_${page}_limit_${limit}`;
    console.log(`🔄 Starting product fetch for language: ${language}, page: ${page}`);
    
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved ${language} products page ${page}`);
      return redisCache;
    }

    // Try MongoDB
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products_language');

    // Get metadata from the main language document
    const metadata = await collection.findOne(
      { language: language.toUpperCase() },
      { projection: { totalProducts: 1, totalBatches: 1 } }
    );

    if (metadata?.totalProducts) {
      const BATCH_SIZE = 1000;
      const start = (page - 1) * limit;
      const batchIndex = Math.floor(start / BATCH_SIZE);
      const batchOffset = start % BATCH_SIZE;

      // Determine which document to query
      const documentKey = batchIndex === 0 ? 
        { language: language.toUpperCase() } : 
        { language: `${language.toUpperCase()}_${batchIndex}` };

      const cachedData = await collection.findOne(documentKey);

      if (cachedData?.products) {
        const paginatedProducts = cachedData.products
          .slice(batchOffset, batchOffset + limit);

        const result = {
          products: paginatedProducts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(metadata.totalProducts / limit),
            totalProducts: metadata.totalProducts,
            hasNextPage: start + limit < metadata.totalProducts,
            hasPreviousPage: page > 1
          }
        };

        // Cache in Redis
        await setRedisData(redisKey, result, 3600);
        return result;
      }
    }

    // If no cache exists, fetch ALL products
    console.log(`📛 [MONGODB] No cache found for ${language}, fetching ALL from Shopify`);

    let allProducts = [];
    let hasNextPage = true;
    let endCursor = null;
    let pageCount = 1;

    // Keep fetching until we get ALL products
    while (hasNextPage) {
      const query = `
        query Products${endCursor ? '($cursor: String!)' : ''} @inContext(language: ${language.toUpperCase()}) {
          products(first: 250${endCursor ? ', after: $cursor' : ''}) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                handle
                description
                descriptionHtml
                seo {
                  title
                  description
                }
                images(first: 100) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
                }
                variants(first: 100) {
                  edges {
                    node {
                      id
                      title
                      image {
                        id
                      }
                      selectedOptions {
                        name
                        value
                      }
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
                options {
                  name
                  values
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `;

      const variables = endCursor ? { cursor: endCursor } : {};
      const response = await shopifyFetch({ query, variables });

      if (!response.body?.data?.products?.edges) {
        throw new Error('Invalid response from Shopify');
      }

      const { edges, pageInfo } = response.body.data.products;
      
      // If it's not English, fetch English variants for each product
      if (language.toUpperCase() !== 'EN') {
        console.log(`🔄 Fetching English variants for ${edges.length} products (Batch ${pageCount})`);
        for (const edge of edges) {
          if (!edge.node.variants?.edges || edge.node.variants.edges.length === 0) {
            try {
              const enQuery = `
                query ProductByHandle($handle: String!) {
                  product(handle: "${edge.node.handle}") {
                    seo {
                      title
                      description
                    }
                    variants(first: 100) {
                      edges {
                        node {
                          id
                          title
                          selectedOptions {
                            name
                            value
                          }
                          price {
                            amount
                            currencyCode
                          }
                          compareAtPrice {
                            amount
                            currencyCode
                          }
                          availableForSale
                        }
                      }
                    }
                    options {
                      name
                      values
                    }
                  }
                }
              `;
              const enResponse = await shopifyFetch({ query: enQuery });
              if (enResponse?.body?.data?.product?.variants) {
                edge.node.variants = enResponse.body.data.product.variants;
                edge.node.options = enResponse.body.data.product.options;
                console.log(`✅ Added English variants for ${edge.node.handle}`);
              }
            } catch (error) {
              console.error(`❌ Failed to fetch English variants for ${edge.node.handle}:`, error);
            }
          }
        }
      }

      allProducts = [...allProducts, ...edges];
      hasNextPage = pageInfo.hasNextPage;
      endCursor = pageInfo.endCursor;
      pageCount++;
      
      console.log(`📦 Fetched batch ${pageCount - 1} (Total products: ${allProducts.length})`);
    }

    // Save ALL products to MongoDB using the updated helper function
    try {
      await saveTranslatedProductsToMongo(collection, allProducts, language);
    } catch (mongoError) {
      console.error('❌ [MONGODB] Failed to save products:', mongoError);
      // Continue execution even if MongoDB save fails
    }

    // Calculate pagination for requested page
    const start = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(start, start + limit);
    
    const result = {
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allProducts.length / limit),
        totalProducts: allProducts.length,
        hasNextPage: start + limit < allProducts.length,
        hasPreviousPage: page > 1
      }
    };

    // Cache in Redis
    await setRedisData(redisKey, result, 3600);
    
    return result;

  } catch (error) {
    console.error(`❌ [ERROR] Error fetching translated products for ${language}:`, error);
    throw error;
  }
}

// Add a function to refresh language-specific cache
export async function refreshLanguageCache(language: string) {
  try {
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products_language');
    
    console.log(`🔄 Refreshing cache for language: ${language}`);
    
    // Delete existing cache for this language
    await collection.deleteOne({ language: language.toUpperCase() });
    
    // Fetch fresh data
    return getPaginatedTranslatedProducts(1, 20, language);
  } catch (error) {
    console.error(`❌ Error refreshing ${language} cache:`, error);
    throw error;
  }
}

// Add a function to check cache age and refresh if needed
export async function checkAndRefreshLanguageCache(language: string) {
  try {
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products_language');
    
    const cacheData = await collection.findOne({ language: language.toUpperCase() });
    
    if (!cacheData) return false;
    
    const cacheAge = new Date().getTime() - new Date(cacheData.lastUpdated).getTime();
    const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 hours
    
    if (cacheAge > MAX_CACHE_AGE) {
      console.log(`⏰ Cache for ${language} is older than 24 hours, refreshing...`);
      await refreshLanguageCache(language);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error checking cache age for ${language}:`, error);
    return false;
  }
}

// Query declaration for translated products
const TRANSLATED_PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) @inContext(language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      images(first: 100) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
      options {
        name
        values
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
    products(first: 4) {
      edges {
        node {
          id
          title
          handle
          description
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

// Update getTranslatedProductByHandle to use store prefix
export async function getTranslatedProductByHandle(handle: string, language: string = 'EN') {
  try {
    const redisKey = `${getStorePrefix()}product_${language.toLowerCase()}_${handle}`;
    console.log(`🔍 [REDIS] Checking cache for ${redisKey}`);

    // Try Redis first
    const cachedProduct = await getRedisData(redisKey);
    if (cachedProduct) {
      console.log(`✅ [REDIS] Cache hit for ${language} product: ${handle}`);
      return cachedProduct;
    }
    console.log(`📛 [REDIS] Cache miss for ${language} product: ${handle}`);

    // Try MongoDB
    console.log(`🔍 [MONGODB] Looking for product ${handle} in ${language}`);
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products_language');

    // Get metadata first to know how many batches to check
    const metadata = await collection.findOne(
      { language: language.toUpperCase() },
      { projection: { totalBatches: 1, lastUpdated: 1 } }
    );

    if (metadata?.totalBatches) {
      // Check each batch for the product
      for (let i = 0; i < metadata.totalBatches; i++) {
        const batchKey = i === 0 ? 
          { language: language.toUpperCase() } : 
          { language: `${language.toUpperCase()}_${i}` };

        // Use projection to only fetch the specific product
        const cachedData = await collection.findOne(
          batchKey,
          { 
            projection: {
              products: {
                $elemMatch: { 'node.handle': handle }
              }
            }
          }
        );

        if (cachedData?.products?.[0]?.node) {
          console.log(`✅ [MONGODB] Found product in batch ${i + 1}`);
          
          const result = {
            product: cachedData.products[0].node,
            relatedProducts: await getRelatedTranslatedProducts(language)
          };

          // Cache in Redis
          console.log(`💾 [REDIS] Caching ${language} product: ${handle}`);
          await setRedisData(redisKey, result, 3600); // Cache for 1 hour

          return result;
        }
      }
    }

    console.log(`⚠️ [MONGODB] No ${language} version found for ${handle}`);
    
    // If not English, try English version
    if (language.toUpperCase() !== 'EN') {
      console.log('↩️ Falling back to English version');
      const englishVersion = await getProductByHandle(handle);
      
      // Cache the English fallback
      await setRedisData(redisKey, englishVersion, 3600);
      
      return englishVersion;
    }

    // If still not found, fetch from Shopify
    console.log('🔄 [SHOPIFY] Fetching product directly');
    const response = await shopifyFetch({ 
      query: TRANSLATED_PRODUCT_QUERY, 
      variables: { 
        handle,
        language: language.toUpperCase()
      } 
    });

    const product = response?.body?.data?.product;
    const relatedProducts = response?.body?.data?.products?.edges || [];

    if (!product) {
      throw new Error(`Product ${handle} not found in any language`);
    }

    const result = { product, relatedProducts };

    // Cache the result
    await setRedisData(redisKey, result, 3600);

    return result;

  } catch (error) {
    console.error(`❌ [ERROR] Failed to fetch ${language} product:`, {
      handle,
      error: error.message,
      stack: error.stack
    });

    // If not English and error occurs, try English version
    if (language.toUpperCase() !== 'EN') {
      console.log('↩️ Error occurred, falling back to English version');
      return getProductByHandle(handle);
    }

    throw error;
  }
}

// Helper function to get related translated products
async function getRelatedTranslatedProducts(language: string) {
  const client = await connectToDatabase();
  const dbName = getStoreName();
  const collection = client.db(dbName).collection('products_language');
  
  // Get first batch (main document) and take first 4 products
  const relatedProducts = await collection.findOne(
    { language: language.toUpperCase() },
    { 
      projection: { 
        products: { 
          $slice: 4
        }
      }
    }
  );
  
  return relatedProducts?.products || [];
}

// Add new function to fetch all collections
export async function getAllCollections(language: string = 'EN') {
  try {
    // Define Redis key for this specific language
    const redisKey = `${getStorePrefix()}shopify_collections_${language.toLowerCase()}`;
    
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log('🚀 [REDIS CACHE HIT] Retrieved collections from cache');
      return redisCache;
    }
    console.log('📛 [REDIS CACHE MISS] Collections not found');

    // Define the Shopify GraphQL query
    const query = `
      query Collections @inContext(language: ${language}) {
        collections(first: 250) {
          edges {
            node {
              id
              title
              handle
              description
              image {
                url
                altText
              }
              products(first: 1) {
                edges {
                  node {
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Fetch from Shopify using the existing helper function
    return fetchFromShopifyWithRedis(redisKey, async () => {
      console.log('🔄 [SHOPIFY API] Fetching collections');
      const response = await shopifyFetch({ query, variables: {} });

      if (!response.body?.data?.collections?.edges) {
        throw new Error('Invalid response from Shopify');
      }

      const collections = response.body.data.collections.edges;
      console.log(`✅ [SHOPIFY] Retrieved ${collections.length} collections`);
      
      return collections;
    }, 3600); // Cache for 1 hour

  } catch (error) {
    console.error('❌ [ERROR] Error fetching collections:', {
      language,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function getCollectionByHandle(handle: string, language: string = 'EN') {
  try {
    const query = `
      query CollectionDetails($handle: String!, $language: LanguageCode!)
      @inContext(language: $language) {
        collection(handle: $handle) {
          id
          title
          handle
          description
          seo {
            title
            description
          }
          image {
            url
            altText
          }
          products(first: 250) {
            edges {
              node {
                id
                title
                handle
                description
                seo {
                  title
                  description
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Try Redis first
    const redisKey = `${getStorePrefix()}collection_${handle}_${language.toLowerCase()}`;
    const cachedData = await getRedisData(redisKey);
    
    if (cachedData) {
      console.log('🚀 [REDIS] Retrieved collection from cache');
      return cachedData;
    }

    // Fetch from Shopify
    console.log('🔄 [SHOPIFY] Fetching collection');
    const response = await shopifyFetch({ 
      query, 
      variables: { 
        handle,
        language 
      } 
    });

    if (response.body?.data?.collection) {
      const collection = response.body.data.collection;
      
      // Cache in Redis
      await setRedisData(redisKey, collection, 3600); // Cache for 1 hour
      
      return collection;
    }

    // If collection not found, try MongoDB
    console.log(`⚠️ [SHOPIFY] Collection ${handle} not found, falling back to MongoDB products`);
    
    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products_language');

    // Find all products for the specified language
    const products = await collection
      .findOne({ language: language.toUpperCase() });

    if (products?.products) {
      console.log(`✅ [MONGODB] Found ${products.products.length} products`);
      
      // Format the response to match Shopify's structure
      const formattedResponse = {
        id: `fallback_${handle}`,
        title: handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        handle: handle,
        description: `All products from ${handle}`,
        seo: {
          title: `All Products - ${handle}`,
          description: `Browse our complete collection of products`
        },
        image: products.products[0]?.node?.images?.edges?.[0]?.node || null,
        products: {
          edges: products.products
        }
      };

      // Cache the fallback response
      await setRedisData(redisKey, formattedResponse, 3600);

      return formattedResponse;
    }

    throw new Error('Collection not found and no fallback products available');

  } catch (error) {
    console.error('❌ Error fetching collection:', {
      handle,
      language,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function getAllTranslatedProducts(language: string = 'EN') {
  try {
    const redisKey = `${getStorePrefix()}all_translated_products_${language.toLowerCase()}`;
    console.log(`🔄 Starting product fetch for language: ${language}`);
    
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log(`🚀 [REDIS CACHE HIT] Retrieved all ${language} products`);
      return redisCache;
    }
    console.log(`📛 [REDIS CACHE MISS] ${language} products not found`);
    
    try {
      // Try MongoDB
      const client = await connectToDatabase();
      const dbName = getStoreName();
      const collection = client.db(dbName).collection('products_language');

      // Check if we have cached data for this language
      const cachedData = await collection.findOne(
        { language: language.toUpperCase() }
      );
      
      if (cachedData?.products) {
        console.log(`✅ [MONGODB] Found cached products for ${language}`);
        
        // Cache in Redis
        console.log(`💾 [REDIS] Caching ${language} products`);
        await setRedisData(redisKey, cachedData.products, 3600); // Cache for 1 hour
        
        return cachedData.products;
      }

      // If no cache exists, fetch from Shopify
      console.log(`📛 [CACHE MISS] No cached data found for ${language}, fetching from Shopify`);
      
      // Use the existing getPaginatedTranslatedProducts to fetch all products
      const allProducts = await getPaginatedTranslatedProducts(1, 1000, language);
      
      if (allProducts?.products) {
        // Cache in Redis
        console.log(`💾 [REDIS] Caching ${language} products`);
        await setRedisData(redisKey, allProducts.products, 3600); // Cache for 1 hour
        
        return allProducts.products;
      }
      
      throw new Error(`No products found for language: ${language}`);

    } catch (mongoError) {
      console.error('❌ [MONGODB] Error:', mongoError);
      
      // If MongoDB fails, try fetching directly from Shopify
      const allProducts = await getPaginatedTranslatedProducts(1, 1000, language);
      
      if (allProducts?.products) {
        // Cache in Redis even if MongoDB failed
        console.log(`💾 [REDIS] Caching ${language} products (MongoDB fallback)`);
        await setRedisData(redisKey, allProducts.products, 3600);
        
        return allProducts.products;
      }
      
      throw mongoError;
    }

  } catch (error) {
    console.error(`❌ [ERROR] Error fetching translated products for ${language}:`, error);
    throw error;
  }
}

// Add this helper function at the top of the file (after imports)
const getStoreName = () => {
  const domain = import.meta.env.PUBLIC_SHOPIFY_SHOP?.split('.')[0] || 'default';
  return `shopify_${domain}_cache`;
};

// Add this query constant at the top with your other queries
const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!) {
    collection(handle: $handle) {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Add this new function to fetch collection products
export async function getCollectionProducts(collectionHandle: string) {
  const redisKey = `${getStorePrefix()}shopify_collection_${collectionHandle}`;
  const redisCache = await getRedisData(redisKey);
  
  if (redisCache) {
    console.log('🚀 [REDIS CACHE HIT] Retrieved collection products from Redis');
    return redisCache;
  }
  
  try {
    const response = await shopifyFetch({
      query: COLLECTION_PRODUCTS_QUERY,
      variables: { handle: collectionHandle }
    });

    if (!response.body?.data?.collection?.products?.edges) {
      throw new Error('Invalid response from Shopify');
    }

    const products = response.body.data.collection.products.edges;
    
    // Cache the results
    await setRedisData(redisKey, products, 3600);
    
    return products;
  } catch (error) {
    console.error('Error fetching collection products:', error);
    throw error;
  }
}

// Add this function after your existing functions
export async function searchProducts(query: string, language: string = 'EN') {
  try {
    console.log('🔍 [SEARCH] Starting search for:', query);
    
    const redisKey = `${getStorePrefix()}search_${language.toLowerCase()}_${query.toLowerCase()}`;
    
    // Try Redis first
    const redisCache = await getRedisData(redisKey);
    if (redisCache) {
      console.log('🚀 [REDIS CACHE HIT] Returning cached results');
      return redisCache;
    }

    const client = await connectToDatabase();
    const dbName = getStoreName();
    const collection = client.db(dbName).collection('products_language');

    // Get the main language document with a limit on products
    const mainDoc = await collection.findOne(
      { language: language.toUpperCase() },
      { 
        projection: {
          products: {
            $filter: {
              input: "$products",
              as: "product",
              cond: {
                $or: [
                  { $regexMatch: { input: "$$product.node.title", regex: query, options: "i" } },
                  { $regexMatch: { input: "$$product.node.vendor", regex: query, options: "i" } }
                ]
              }
            }
          },
          totalBatches: 1
        }
      }
    );

    let allResults = mainDoc?.products || [];
    
    // If we need more results and there are more batches, check them
    if (allResults.length < 20 && mainDoc?.totalBatches > 1) {
      // Search additional batches in parallel
      const batchPromises = Array.from({ length: mainDoc.totalBatches - 1 }, async (_, i) => {
        const batchNum = i + 1;
        const batchDoc = await collection.findOne(
          { language: `${language.toUpperCase()}_${batchNum}` },
          {
            projection: {
              products: {
                $filter: {
                  input: "$products",
                  as: "product",
                  cond: {
                    $or: [
                      { $regexMatch: { input: "$$product.node.title", regex: query, options: "i" } },
                      { $regexMatch: { input: "$$product.node.vendor", regex: query, options: "i" } }
                    ]
                  }
                }
              }
            }
          }
        );
        return batchDoc?.products || [];
      });

      // Wait for all batch searches to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Combine results
      allResults = [
        ...allResults,
        ...batchResults.flat()
      ].slice(0, 20); // Limit to 20 results
    }

    if (allResults.length > 0) {
      console.log(`✅ [SEARCH] Found ${allResults.length} results`);
      
      // Cache results
      try {
        await setRedisData(redisKey, allResults, 1800);
      } catch (cacheError) {
        console.warn('⚠️ [REDIS] Caching error:', cacheError);
      }
      
      return allResults;
    }

    // If no results and not English, try English
    if (language.toUpperCase() !== 'EN') {
      console.log('↩️ Falling back to English search');
      return searchProducts(query, 'EN');
    }

    return [];

  } catch (error) {
    console.error('❌ [SEARCH ERROR]', {
      message: error.message,
      query,
      language
    });
    return language.toUpperCase() !== 'EN' ? searchProducts(query, 'EN') : [];
  }
}






