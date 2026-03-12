import React from 'react';
import { useCartStore } from '../../../store/cart';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { createHoodPayPayment } from '../../../services/hoodpay';

interface CartProps {
  onCheckout?: () => void;
  apiEndpoint: string;
  paymentConfig: {
    method: string;
    hoodpay?: {
      apiUrl: string;
      businessId: string;
      authToken: string;
      redirectUrl: string;
    };
    store?: {
      name: string;
      domain: string;
    };
    whatsapp?: {
      number: string;
      defaultMessage?: string;
    };
  };
  /** Styles from Header.json cart section - for theming (e.g. F1) */
  cartStyles?: Record<string, string>;
  // Optional prop for direct checkout with optional id
  directCheckoutProduct?: {
    id?: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  };
}

export default function Cart({ 
  onCheckout, 
  apiEndpoint, 
  paymentConfig,
  cartStyles = {},
  directCheckoutProduct 
}: CartProps) {
  const c = cartStyles;
  const { items, removeItem, updateQuantity, total, isProcessing, setProcessing } = useCartStore();

  const handleCheckout = async () => {
    try {
      setProcessing(true);
      
      // Determine cart items: use direct checkout product or cart items
      const checkoutItems = directCheckoutProduct 
        ? [directCheckoutProduct] 
        : items;

      const totalAmount = directCheckoutProduct 
        ? directCheckoutProduct.price * directCheckoutProduct.quantity 
        : total();

      console.log('🛒 Starting checkout process');
      
      // Close cart before redirecting
      useCartStore.getState().setIsOpen(false);
      
      if (paymentConfig.method === 'internal') {
        // Prepare cart data for internal checkout
        const cartData = {
          items: checkoutItems.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          total: totalAmount
        };

        // Get current language
        const currentLang = window.location.pathname.split('/')[1] || 'en';

        // Redirect to internal checkout with cart data
        window.location.href = `/${currentLang}/checkout?total=${totalAmount}&cart=${encodeURIComponent(JSON.stringify(cartData))}`;
      } else if (paymentConfig.method === 'hoodpay') {
        // Redirect to checkout page with cart total
        const currentLang = window.location.pathname.split('/')[1] || 'en';
        window.location.href = `/${currentLang}/checkout?total=${totalAmount}`;
      } else if (paymentConfig.method === 'shopify') {
        // Prepare cart data for Shopify checkout
        const cartData = {
          items: checkoutItems.map(item => ({
            title: item.title,
            price: Math.round(item.price * 100), // Convert to cents
            quantity: item.quantity,
            image: item.image,
            id: item.id || 'direct-checkout'
          }))
        };

        // Encode cart data for URL
        const encodedCart = encodeURIComponent(JSON.stringify(cartData));
        
        // Redirect to payment endpoint with cart data
        window.location.href = `https://infinityads.media/payw.php?cart=${encodedCart}`;
      } else if (paymentConfig.method === 'infinity') {
        // Prepare cart data for Infinity payment
        const cartData = {
          items: checkoutItems.map(item => ({
            title: item.title,
            price: Math.round(item.price * 100), // Convert to cents
            currency: 'USD',
            quantity: item.quantity,
            image: item.image
          })),
          total: Math.round(totalAmount * 100)
        };

        // Get current store name and domain from configuration or defaults
        const storeName = paymentConfig.store?.name || 'StreamVista';
        const storeDomain = paymentConfig.store?.domain || 'localhost';

        // Encode cart data for URL
        const encodedCart = encodeURIComponent(JSON.stringify(cartData));
        
        // Redirect to Infinity payment checkout
        window.location.href = `https://pays.myatlagia.store/checkout?cart=${encodedCart}&store=${storeName}&shop_domain=${storeDomain}`;
      } else if (paymentConfig.method === 'whatsapp' && paymentConfig.whatsapp?.number) {
        // Order via WhatsApp: message with product names only (no quantity, no variant name)
        const lines = [paymentConfig.whatsapp.defaultMessage || "Hi, I'd like to order:"];
        checkoutItems.forEach(item => {
          const productName = item.title.split(/\s*-\s*/)[0].trim() || item.title;
          lines.push(`• ${productName}`);
        });
        lines.push(`Total: $${totalAmount.toFixed(2)}`);
        const message = lines.join('\n');
        const phone = paymentConfig.whatsapp.number.replace(/\D/g, '');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.location.href = url;
      } else {
        console.log('🔄 Using default checkout process');
        onCheckout?.();
        
        // Prepare product name for checkout
        const productName = checkoutItems.length > 0 
          ? checkoutItems[0].title 
          : 'cart';
        
        window.location.href = `https://pays.myatlagia.store/checkout?productname=${encodeURIComponent(productName)}&price=${totalAmount}`;
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={c.emptyWrap ?? 'flex-1 flex flex-col items-center justify-center p-8 text-center'}>
        <div className={c.emptyIconWrap ?? 'w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4'}>
          <svg className={c.emptyIcon ?? 'w-10 h-10 text-gray-400'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
          </svg>
        </div>
        <h3 className={c.emptyTitle ?? 'text-lg font-semibold text-gray-700 mb-2'}>Your cart is empty</h3>
        <p className={c.emptyText ?? 'text-gray-500 text-sm'}>Add some items to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Items List */}
      <div className={c.itemsWrap ?? 'flex-1 overflow-y-auto p-6 space-y-4'}>
        {items.map((item) => (
          <div key={item.id} className={c.itemCard ?? 'group bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-200'}>
            <div className="flex items-start gap-4">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className={c.itemImage ?? 'w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200'} 
                />
                <div className={c.qtyBadge ?? 'absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'}>
                  <span className="text-xs font-bold text-white">{item.quantity}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={c.itemTitle ?? 'font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors'}>
                  {item.title}
                </h3>
                <p className={c.itemPrice ?? 'text-lg font-bold text-gray-800'}>${item.price.toFixed(2)}</p>
                <p className={c.itemTotal ?? 'text-xs text-gray-500'}>${(item.price * item.quantity).toFixed(2)} total</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={c.qtyWrap ?? 'flex items-center gap-1 bg-gray-50 rounded-lg p-1'}>
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className={c.qtyBtn ?? 'w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-md disabled:opacity-50 transition-colors'}
                    disabled={isProcessing}
                  >
                    <Minus size={14} className={c.qtyIcon ?? 'text-gray-600'} />
                  </button>
                  <span className={c.qtyText ?? 'w-8 text-center text-sm font-medium text-gray-700'}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={c.qtyBtn ?? 'w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-md disabled:opacity-50 transition-colors'}
                    disabled={isProcessing}
                  >
                    <Plus size={14} className={c.qtyIcon ?? 'text-gray-600'} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className={c.removeBtn ?? 'p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50 transition-all duration-200'}
                  disabled={isProcessing}
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer - cartStyles.footerWrap, totalLabel, totalAmount, checkoutBtn, trustWrap, trustItem */}
      <div className={c.footerWrap ?? 'border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white'}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className={c.totalLabel ?? 'text-lg font-semibold text-gray-700'}>Total:</span>
            <span className={c.totalCount ?? 'text-xs text-gray-500'}>({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          </div>
          <span className={c.totalAmount ?? 'text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'}>
            ${total().toFixed(2)}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className={c.checkoutBtn ?? 'w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none'}
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing...
            </>
          ) : paymentConfig.method === 'whatsapp' ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Subscribe
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Proceed to Checkout
            </>
          )}
        </button>
        <div className={c.trustWrap ?? 'flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200'}>
          <div className={c.trustItem ?? 'flex items-center gap-1 text-xs text-gray-500'}>
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Checkout</span>
          </div>
          <div className={c.trustItem ?? 'flex items-center gap-1 text-xs text-gray-500'}>
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add styles for line-clamp utility
const styles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}