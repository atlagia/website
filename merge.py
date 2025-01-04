import requests
import json
from concurrent.futures import ThreadPoolExecutor
import math
from typing import List

# WooCommerce credentials
WC_URL = "https://stylab.store/wp-json/wc/v3/products"
WC_CONSUMER_KEY = "ck_c39e2cce36966834becca914f89717f8675e17a0"
WC_CONSUMER_SECRET = "cs_7adab250a67a6c4489e9ff81de566cb4cba2571b"

# Shopify credentials
SHOPIFY_URL = "https://shoeslandly.myshopify.com/admin/api/2023-04/products.json"
SHOPIFY_API_KEY = "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"

# Fetch products from WooCommerce
def fetch_woocommerce_products():
    all_products = []
    page = 1
    per_page = 100  # WooCommerce max per page

    while True:
        try:
            response = requests.get(
                WC_URL,
                auth=(WC_CONSUMER_KEY, WC_CONSUMER_SECRET),
                params={'page': page, 'per_page': per_page}
            )
            response.raise_for_status()
            products = response.json()
            
            if not products:  # No more products
                break
                
            all_products.extend(products)
            page += 1
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching WooCommerce products page {page}: {e}")
            break

    return all_products

def create_shoe_variants(base_price: float) -> List[dict]:
    """Create variants for EU shoe sizes 35-47"""
    eu_sizes = range(35, 48)  # 35 to 47 inclusive
    variants = []
    
    for size in eu_sizes:
        variants.append({
            "option1": str(size),  # Size as string
            "price": str(base_price),
            "inventory_management": "shopify",
            "inventory_quantity": 10,
        })
    
    return variants

def create_shopify_product(product):
    # Get base price from WooCommerce product
    base_price = float(product.get("price", 0))
    
    shopify_payload = {
        "product": {
            "title": product.get("name"),
            "body_html": product.get("description"),
            "vendor": product.get("brand", "Stylab"),
            "product_type": product.get("categories")[0].get("name") if product.get("categories") else "Uncategorized",
            "options": [
                {
                    "name": "Size",
                    "values": [str(size) for size in range(35, 48)]
                }
            ],
            "variants": create_shoe_variants(base_price),
            "images": [{"src": img["src"]} for img in product.get("images", [])],
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_API_KEY,
    }
    
    try:
        response = requests.post(
            SHOPIFY_URL, 
            headers=headers, 
            data=json.dumps(shopify_payload)
        )
        response.raise_for_status()
        print(f"Product {product['name']} migrated successfully with variants.")
    except requests.exceptions.RequestException as e:
        print(f"Error creating product in Shopify: {e}")

# Main function
def migrate_products():
    print("Fetching all products from WooCommerce...")
    wc_products = fetch_woocommerce_products()
    total_products = len(wc_products)
    print(f"Found {total_products} products. Migrating to Shopify in parallel...")
    
    # Process products in parallel batches of 10
    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(create_shopify_product, wc_products)
    
    print("Migration complete.")

if __name__ == "__main__":
    migrate_products()
