import { getTranslatedProductByHandle as getShopifyProduct } from './shopify';
import { getProductByHandle as getWooProduct } from './woocommerce';
import { getCollectionByHandle as getShopifyCollection, getAllCollections as getShopifyCollections } from './shopify';
import { getCollectionByHandle as getWooCollection, getAllCollections as getWooCollections } from './woocommerce';


export async function getTranslatedProductByHandle(handle: string, lang: string = 'EN') {
  const dataType = import.meta.env.DATA_TYPE?.toLowerCase() || 'shopify';

  try {
    if (dataType === 'shopify') {
      return await getShopifyProduct(handle, lang);
    } else if (dataType === 'woocommerce') {
      const data = await getWooProduct(handle);
      
      return {
        product: {
          id: data.product.id?.toString() || '',
          title: data.product.name || '',
          handle: data.product.slug || '',
          description: data.product.description || '',
          descriptionHtml: data.product.description || '',
          options: data.product.attributes?.map(attr => ({
            name: attr.name || '',
            values: attr.options || []
          })) || [],
          variants: {
            edges: data.product.variations?.length ? 
              data.product.variations.map(variant => ({
                node: {
                  id: variant.id?.toString() || '',
                  title: variant.name || data.product.name || '',
                  price: {
                    amount: variant.price || data.product.price || '0',
                    currencyCode: 'USD'
                  },
                  compareAtPrice: variant.regular_price ? {
                    amount: variant.regular_price || '0',
                    currencyCode: 'USD'
                  } : null,
                  selectedOptions: variant.attributes?.map(attr => ({
                    name: attr.name || '',
                    value: attr.option || ''
                  })) || [],
                  availableForSale: variant.in_stock !== false
                }
              })) : [{
                node: {
                  id: data.product.id?.toString() || '',
                  title: data.product.name || '',
                  price: {
                    amount: data.product.price || '0',
                    currencyCode: 'USD'
                  },
                  compareAtPrice: data.product.regular_price ? {
                    amount: data.product.regular_price || '0',
                    currencyCode: 'USD'
                  } : null,
                  selectedOptions: [],
                  availableForSale: data.product.in_stock !== false
                }
              }]
          },
          images: {
            edges: data.product.images?.map(img => ({
              node: {
                id: img.id?.toString() || '',
                url: img.src || '',
                altText: img.alt || data.product.name || ''
              }
            })) || []
          }
        },
        relatedProducts: (data.relatedProducts || []).map(prod => ({
          node: {
            id: prod.id?.toString() || '',
            title: prod.name || '',
            handle: prod.slug || '',
            description: prod.description || '',
            priceRange: {
              minVariantPrice: {
                amount: prod.price || '0',
                currencyCode: 'USD'
              }
            },
            images: {
              edges: [{
                node: {
                  url: prod.images?.[0]?.src || '',
                  altText: prod.images?.[0]?.alt || prod.name || ''
                }
              }]
            }
          }
        }))
      };
    }
    
    console.error(`Unsupported data type: ${dataType}`);
    return {
      product: null,
      relatedProducts: []
    };
  } catch (error) {
    console.error('Error in getTranslatedProductByHandle:', error);
    return {
      product: null,
      relatedProducts: []
    };
  }
} 


export async function getAllCollections(lang: string = 'EN') {
    const dataType = import.meta.env.DATA_TYPE?.toLowerCase() || 'shopify';
  
    try {
      if (dataType === 'shopify') {
        const collections = await getShopifyCollections(lang);
        return collections || [];
      } else if (dataType === 'woocommerce') {
        const collections = await getWooCollections();
        return collections || [];
      }
      
      console.error(`Unsupported data type: ${dataType}`);
      return [];
    } catch (error) {
      console.error('Error in getAllCollections:', error);
      return [];
    }
}




export async function getCollectionByHandle(handle: string, lang: string = 'EN') {
  const dataType = import.meta.env.DATA_TYPE?.toLowerCase() || 'shopify';

  try {
    if (dataType === 'shopify') {
      const collection = await getShopifyCollection(handle, lang);
      return collection || {
        id: '',
        title: '',
        handle: handle,
        description: '',
        products: { edges: [] }
      };
    } else if (dataType === 'woocommerce') {
      const collection = await getWooCollection(handle);
      return collection || {
        id: '',
        title: '',
        handle: handle,
        description: '',
        products: { edges: [] }
      };
    }
    
    console.error(`Unsupported data type: ${dataType}`);
    return {
      id: '',
      title: '',
      handle: handle,
      description: '',
      products: { edges: [] }
    };
  } catch (error) {
    console.error('Error in getCollectionByHandle:', error);
    return {
      id: '',
      title: '',
      handle: handle,
      description: '',
      products: { edges: [] }
    };
  }
}