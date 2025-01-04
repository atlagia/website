import requests
import json
from concurrent.futures import ThreadPoolExecutor
import math
from typing import List

# Shopify credentials - source store
DEST_SHOPIFY_URL = "https://shoeslandly.myshopify.com/admin/api/2023-04/products.json"
DEST_SHOPIFY_API_KEY = "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"

# Shopify credentials - destination store (you'll need to add these)
SOURCE_SHOPIFY_URL = "https://pod-bl2.myshopify.com/admin/api/2023-04/products.json"
SOURCE_SHOPIFY_API_KEY = "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"

def fetch_shopify_products():
    """Fetch all products from source Shopify store with pagination"""
    all_products = []
    limit = 250  # Maximum allowed by Shopify API
    page_info = None
    
    while True:
        try:
            headers = {
                "X-Shopify-Access-Token": SOURCE_SHOPIFY_API_KEY,
                "Content-Type": "application/json"
            }
            
            # Build query parameters
            params = {"limit": limit}
            if page_info:
                params["page_info"] = page_info
            
            response = requests.get(
                SOURCE_SHOPIFY_URL,
                headers=headers,
                params=params
            )
            response.raise_for_status()
            
            products = response.json().get('products', [])
            
            if not products:  # No more products to fetch
                print("No more products found.")
                break
                
            all_products.extend(products)
            print(f"Fetched {len(products)} products (Total: {len(all_products)})")
            
            # Get Link header and parse next page_info
            link_header = response.headers.get('Link', '')
            
            if 'rel="next"' in link_header:
                # Extract page_info from the Link header
                next_link = [l for l in link_header.split(', ') if 'rel="next"' in l][0]
                page_info = next_link.split('page_info=')[1].split('&')[0].split('>')[0]
                print(f"Next page info found: {page_info[:20]}...")
            else:
                print("No next page found. Finished fetching all products.")
                break
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Shopify products: {str(e)}")
            print(f"Response content: {response.text if 'response' in locals() else 'No response'}")
            break
        except IndexError as e:
            print(f"Error parsing pagination info: {str(e)}")
            print(f"Link header: {link_header}")
            break

    print(f"Total products fetched: {len(all_products)}")
    return all_products

def create_shopify_product(product):
    """Create product in destination Shopify store"""
    shopify_payload = {
        "product": {
            "title": product.get("title"),
            "body_html": product.get("body_html"),
            "vendor": product.get("vendor"),
            "product_type": product.get("product_type"),
            "options": product.get("options", []),
            "variants": product.get("variants", []),
            "images": product.get("images", []),
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": DEST_SHOPIFY_API_KEY,
    }
    
    try:
        response = requests.post(
            DEST_SHOPIFY_URL, 
            headers=headers, 
            data=json.dumps(shopify_payload)
        )
        response.raise_for_status()
        print(f"Product {product['title']} migrated successfully with variants.")
    except requests.exceptions.RequestException as e:
        print(f"Error creating product in destination Shopify: {e}")

# Main function
def migrate_products():
    print("Fetching all products from source Shopify store...")
    source_products = fetch_shopify_products()
    total_products = len(source_products)
    print(f"Found {total_products} products. Migrating to destination Shopify store in parallel...")
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(create_shopify_product, source_products)
    
    print("Migration complete.")

if __name__ == "__main__":
    migrate_products()
