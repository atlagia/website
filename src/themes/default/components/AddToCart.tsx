import React, { useEffect, useRef, useState } from 'react';
import { ShoppingCart, Loader2, ChevronDown, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../../store/cart';
import { useCurrencyStore } from '../../../store/currency';
import addToCartContent from './addToCartContent.json';

interface Variant {
  id: string;
  title: string;
  image?: {
    id: string;
    altText?: string;
    url?: string;
  };
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
  availableForSale: boolean;
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
}

interface Product {
  id: string;
  title: string;
  variants: Variant[];
  options: {
    name: string;
    values: string[];
  }[];
  image: string;
  images: {
    id: string;
    url: string;
    altText?: string;
  }[];
}

interface AddToCartStyles {
  optionLabel?: string;
  optionButton?: string;
  optionButtonSelected?: string;
  price?: string;
  priceCompare?: string;
  stockStatus?: string;
  quantityLabel?: string;
  quantityWrap?: string;
  quantityInput?: string;
}

interface AddToCartProps {
  product: Product;
  language: string;
  apiEndpoint: string;
  hasChartData?: boolean;
  projectType?: string;
  themeVariant?: 'light' | 'dark';
  addToCartStyles?: AddToCartStyles;
  onCheckout?: () => void;
  paymentConfig: {
    method?: string;
    hoodpay?: {
      apiUrl?: string;
      businessId?: string;
      authToken?: string;
      redirectUrl?: string;
    };
    store?: {
      name?: string;
      domain?: string;
    };
    whatsapp?: {
      number?: string;
      defaultMessage?: string;
    };
  };
}

const colorMap: Record<string, { color: string; border?: boolean }> = {
  'Black': { color: '#000000' },
  'White': { color: '#FFFFFF', border: true },
  'Red': { color: '#FF0000' },
  'Blue': { color: '#0066FF' },
  'Navy': { color: '#000080' },
  'Green': { color: '#008000' },
  'Yellow': { color: '#FFD700' },
  'Orange': { color: '#FFA500' },
  'Purple': { color: '#800080' },
  'Pink': { color: '#FFC0CB' },
  'Brown': { color: '#8B4513' },
  'Gray': { color: '#808080' },
  'Beige': { color: '#F5F5DC', border: true },
  'Burgundy': { color: '#800020' },
  'Olive': { color: '#808000' },
  'Teal': { color: '#008080' },
  'Gold': { color: '#FFD700' },
  'Silver': { color: '#C0C0C0', border: true },
  'Charcoal': { color: '#36454F' },
  'Cream': { color: '#FFFDD0', border: true },
  'Ash': { color: '#B2BEB5' },
  'Royal Blue': { color: '#4169E1' },
  'Safety Green': { color: '#30B21A' },
  'Pale Pink': { color: '#FFE4E1' },
  'Sand': { color: '#C2B280', border: true },
  'Denim Blue': { color: '#1560BD' },
  'Smoke': { color: '#738276' },
  'City Green': { color: '#4E6E58' },
  'Kelly Green': { color: '#4CBB17' },
  'Independence Red': { color: '#B22222' },
  'Green Apple': { color: '#8DB600' },
  'Dark Heather': { color: '#555555' },
  'Sport Grey': { color: '#A8A8A8' },
  'Indigo Blue': { color: '#3F51B5' },
  'Irish Green': { color: '#009E60' },  
  'Light Blue': { color: '#ADD8E6' },
  'Light Pink': { color: '#FFB6C1' },
  'Dark Grey Heather': { color: '#4A4A4A' },
  'Evergreen': { color: '#115740' },
  'Team Purple': { color: '#6B3FA0' },
  'Maroon': { color: '#800000' },
  'Heather Red': { color: '#C26E6E' },
  'True Royal': { color: '#2B4B9B' },
  'Leaf': { color: '#71BC78' },
  'Forest Green': { color: '#228B22' },
  'Royal': { color: '#4169E1' },
  'Sapphire': { color: '#0F52BA' },
  'Tennessee Orange': { color: '#FF8200' },
  'Antique Cherry Red': { color: '#CD5C5C' },
  'Heliconia': { color: '#FF69B4' },
  'Lilac': { color: '#C8A2C8' },
  'Azalea': { color: '#F7C6C7' },
  'Cobalt': { color: '#0047AB' },
  'Garnet': { color: '#733635' },
  'Heather Mint': { color: '#B0E0E6' }, // Example color code
  'Pebble Brown': { color: '#A0522D' }, // Example color code
  'Deep Heather': { color: '#696969' }, // Example color code
  'Aqua': { color: '#00FFFF' },
  'Electric Green': { color: '#00FF00' },
  'Ash Grey': { color: '#B2BEB5' },
  'Ice Grey': { color: '#D3D3D3' },
  'Cornsilk': { color: '#FFF8DC', border: true },
  'Daisy': { color: '#FFFF8D', border: true },
  'Carolina Blue': { color: '#4B9CD3' },
  'Heather Navy': { color: '#34495E' } 
};

const safeAreaStyles = `
  @supports(padding: env(safe-area-inset-bottom)) {
    .h-safe-area-inset-bottom {
      height: env(safe-area-inset-bottom);
    }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = safeAreaStyles;
  document.head.appendChild(style);
}

const defaultAddToCartStyles: AddToCartStyles = {
  optionLabel: 'block text-xs font-medium uppercase tracking-widest text-neutral-500',
  optionButton: 'min-w-[2.75rem] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-100',
  optionButtonSelected: 'min-w-[2.75rem] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 bg-neutral-900 !text-white border-neutral-900',
  price: 'text-3xl font-bold text-neutral-900',
  priceCompare: 'text-xl text-neutral-500 line-through',
  quantityLabel: 'block text-xs font-medium uppercase tracking-widest text-neutral-500',
  quantityInput: 'w-14 text-center text-sm font-medium text-neutral-900 bg-transparent border-0 border-x border-neutral-200 py-2.5 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
};

export default function AddToCart({ 
  product, 
  language, 
  apiEndpoint, 
  hasChartData = false,
  onCheckout,
  projectType: projectTypeProp,
  themeVariant,
  addToCartStyles: addToCartStylesProp,
  paymentConfig 
}: AddToCartProps) {
  const variant = themeVariant ?? 'light';
  const s = { ...defaultAddToCartStyles, ...(addToCartStylesProp ?? {}) };
  // Ensure strong contrast on dark product themes
  if (variant === 'dark') {
    s.price = addToCartStylesProp?.price ?? 'text-3xl font-semibold text-white';
    s.priceCompare = addToCartStylesProp?.priceCompare ?? 'text-xl text-gray-400 line-through';
    s.stockStatus = addToCartStylesProp?.stockStatus ?? 'text-sm font-medium text-emerald-400 uppercase tracking-wide';
  }
  // Selected variant style from theme: dark theme → light bg + dark text; light theme → dark bg + light text
  const optionButtonSelectedClass = variant === 'dark'
    ? 'min-w-[2.75rem] px-4 py-2.5 rounded-lg text-sm font-medium border-2 !bg-white !text-neutral-900 border-neutral-200 shadow-sm'
    : 'min-w-[2.75rem] px-4 py-2.5 rounded-lg text-sm font-medium border-2 !bg-neutral-900 !text-white border-neutral-900';
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = React.useState<Variant | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showStickyButtons, setShowStickyButtons] = React.useState(false);
  const addToCartRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const { currency, convert } = useCurrencyStore();
  const [convertedPrice, setConvertedPrice] = useState<string>('0');

  // Use projectType from props, or from layout (data-project-type on body) when not passed
  const [projectType, setProjectType] = React.useState((projectTypeProp || 'physical').toLowerCase());
  
  // Helper to check if project is physical
  const isPhysical = !['iptv', 'digital', 'degital', 'streaming', 'directory'].includes(projectType);

  useEffect(() => {
    if (projectTypeProp) {
      setProjectType(projectTypeProp.toLowerCase());
      return;
    }
    const fromLayout = typeof document !== 'undefined' && document.body.getAttribute('data-project-type');
    if (fromLayout && fromLayout !== 'default') {
      setProjectType(fromLayout.toLowerCase());
    }
  }, [projectTypeProp]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky buttons when main add to cart is not visible
        setShowStickyButtons(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px' // Adjust this value to control when the sticky buttons appear
      }
    );

    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (product.options.length > 0) {
      const initialOptions: Record<string, string> = {};
      product.options.forEach(option => {
        initialOptions[option.name] = option.values[0];
      });
      setSelectedOptions(initialOptions);
    }
  }, [product.options]);

  React.useEffect(() => {
    console.log('Finding variant with options:', selectedOptions);
    const matchingVariant = product.variants.find(variant =>
      variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      )
    );
    console.log('Found variant:', matchingVariant);
    setSelectedVariant(matchingVariant || null);

    if (matchingVariant?.image) {
      console.log('Variant has image:', matchingVariant.image);
      const matchingImage = product.images.find(img => img.id === matchingVariant.image?.id);
      const imageUrl = matchingImage?.url || matchingVariant.image.url;
      const imageId = matchingImage?.id || matchingVariant.image.id;
      if (imageUrl) {
        console.log('Resolved variant image for gallery sync:', { imageUrl, imageId });
        window.dispatchEvent(new CustomEvent('variantImageChange', {
          detail: {
            imageUrl,
            imageId
          }
        }));
      }
    }
  }, [selectedOptions, product.variants, product.images]);

  // Update price when currency or variant changes
  useEffect(() => {
    if (selectedVariant) {
      const originalAmount = parseFloat(selectedVariant.price.amount);
      const converted = convert(originalAmount, selectedVariant.price.currencyCode, currency);
      setConvertedPrice(converted.toFixed(2));
    }
  }, [selectedVariant, currency]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const handleAddToCart = async () => {
    if (selectedVariant) {
      setIsLoading(true);
      try {
        const qty = isPhysical ? Math.max(1, Math.min(99, quantity)) : 1;
        addItem({
          id: selectedVariant.id,
          title: `${product.title} - ${selectedVariant.selectedOptions.map(opt => opt.value).join(' / ')}`,
          price: parseFloat(selectedVariant.price.amount),
          quantity: qty,
          image: product.image,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBuyNow = async () => {
    try {
      // Ensure selectedVariant exists
      if (!selectedVariant) {
        console.error('No variant selected');
        return;
      }

      const qty = isPhysical ? Math.max(1, Math.min(99, quantity)) : 1;
      // Prepare cart data for checkout
      const checkoutItems = [{
        id: selectedVariant.id,
        title: `${product.title} - ${selectedVariant.selectedOptions.map(opt => opt.value).join(' / ')}`,
        price: parseFloat(selectedVariant.price.amount),
        quantity: qty,
        image: product.image,
      }];

      const totalAmount = checkoutItems[0].price * checkoutItems[0].quantity;

      console.log('🛒 Starting checkout process');
      console.log('Payment Config:', paymentConfig);
      
      // Determine payment method - respects PUBLIC_PAYMENT_METHOD from env
      const method = paymentConfig.method || 'default';

      if (method === 'internal') {
        // Internal checkout - same flow as Cart "Proceed to Checkout"
        const cartData = {
          items: checkoutItems.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          total: totalAmount
        };
        const currentLang = window.location.pathname.split('/')[1] || 'en';
        window.location.href = `/${currentLang}/checkout?total=${totalAmount}&cart=${encodeURIComponent(JSON.stringify(cartData))}`;
      } else if (method === 'hoodpay' && paymentConfig.hoodpay) {
        // Redirect to checkout page with cart total
        const currentLang = window.location.pathname.split('/')[1] || 'en';
        window.location.href = `/${currentLang}/checkout?total=${totalAmount}`;
      } else if (method === 'shopify') {
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
        const encodedCart = encodeURIComponent(JSON.stringify(cartData));
        window.location.href = `https://infinityads.media/payw.php?cart=${encodedCart}`;
      } else if (method === 'infinity') {
        // Infinity payment method
        const cartData = {
          items: checkoutItems.map(item => ({
            title: item.title,
            price: Math.round(item.price * 100),
            currency: 'USD',
            quantity: item.quantity,
            image: item.image
          })),
          total: Math.round(totalAmount * 100)
        };
        const storeName = paymentConfig.store?.name || 'Checkout';
        const storeDomain = paymentConfig.store?.domain || 'localhost';
        const encodedCart = encodeURIComponent(JSON.stringify(cartData));
        window.location.href = `https://pays.myatlagia.store/checkout?cart=${encodedCart}&store=${storeName}&shop_domain=${storeDomain}`;
      } else if (method === 'whatsapp' && paymentConfig.whatsapp?.number) {
        // Order via WhatsApp: pre-filled message with clean product title (no variant, no "Default Title")
        const intro = paymentConfig.whatsapp.defaultMessage || "Hello! I'd like to order:";
        const baseTitle = product.title.replace(/\s*-\s*Default Title\s*$/i, '');
        const message = `${intro}\n\n${baseTitle}${totalAmount ? ` - Total: $${totalAmount.toFixed(2)}` : ''}`;
        const phone = paymentConfig.whatsapp.number.replace(/\D/g, '');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.location.href = url;
      } else {
        // Default fallback - same as Cart
        const productName = checkoutItems[0]?.title || 'cart';
        window.location.href = `https://pays.myatlagia.store/checkout?productname=${encodeURIComponent(productName)}&price=${totalAmount}`;
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
    }
  };

  const getColorStyle = (colorName: string) => {
    const normalizedColorName = Object.keys(colorMap).find(
      key => key.toLowerCase() === colorName.toLowerCase()
    );
    const colorInfo = normalizedColorName ? colorMap[normalizedColorName] : { color: colorName };
    return {
      backgroundColor: colorInfo.color,
      border: colorInfo.border ? '1px solid #e2e8f0' : 'none',
    };
  };

  const scrollToSizeChart = (e: React.MouseEvent) => {
    e.preventDefault();
    const sizeChart = document.querySelector('#size-chart');
    if (sizeChart) {
      sizeChart.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get translations based on language prop
  const translations = addToCartContent[language] || addToCartContent['en'];

  // Set default currency based on language
  useEffect(() => {
    const europeanLanguages = ['fr', 'it', 'de', 'es'];
    if (europeanLanguages.includes(language)) {
      useCurrencyStore.getState().setCurrency('EUR');
    }
  }, [language]);

  const themeClass = variant === 'dark' ? 'add-to-cart-theme-dark' : '';
  const lightThemeStyle = variant === 'light' ? { color: 'rgb(23 23 23)', WebkitTextFillColor: 'rgb(23 23 23)' } as React.CSSProperties : undefined;
  return (
    <div className={`space-y-8 pt-4 ${themeClass}`.trim()} data-theme-variant={variant} style={lightThemeStyle}>
      {/* Options Selection Area */}
      <div className="space-y-8 pb-24 md:pb-0" ref={addToCartRef}>
        {/* Only show options if they're not the default title */}
        {product.options
          .filter(option => !(option.name === 'Title' && option.values.length === 1 && option.values[0] === 'Default Title'))
          .map((option) => (
          <div key={option.name} className="space-y-3">
            <label className={s.optionLabel}>
              {option.name}
            </label>
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                
                if (option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour') {
                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`w-10 h-10 rounded-full relative transition-all duration-200 flex-shrink-0 ${
                        isSelected 
                          ? 'ring-2 ring-offset-2 ring-neutral-900 scale-105 shadow-sm' 
                          : 'hover:scale-105 hover:ring-2 hover:ring-neutral-300 hover:ring-offset-2'
                      }`}
                      style={getColorStyle(value)}
                      title={value}
                      aria-pressed={isSelected}
                    >
                    </button>
                  );
                }

                return (
                  <button
                    key={value}
                    onClick={() => handleOptionChange(option.name, value)}
                    className={isSelected ? optionButtonSelectedClass : s.optionButton}
                    aria-pressed={isSelected}
                    style={isSelected && variant === 'light' ? { color: '#fff', WebkitTextFillColor: '#fff' } : undefined}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {selectedVariant && (
          <div className="flex items-baseline justify-between mb-6">
            <div className="flex items-baseline gap-2">
              <div className={s.price}>
                {currency} {convertedPrice}
              </div>
              {selectedVariant.compareAtPrice && (
                <div className={s.priceCompare}>
                  {currency} {convert(
                    parseFloat(selectedVariant.compareAtPrice.amount),
                    selectedVariant.compareAtPrice.currencyCode,
                    currency
                  ).toFixed(2)}
                </div>
              )}
            </div>
            <span className={s.stockStatus ?? 'text-sm font-medium text-neutral-600 uppercase tracking-wide'}>In Stock</span>
          </div>
        )}

        {/* Quantity - only for physical products (label above input) */}
        {isPhysical && (
          <div className={s.quantityWrap ?? 'flex flex-col gap-3'}>
            <label className={s.quantityLabel ?? 'block text-xs font-medium uppercase tracking-widest text-neutral-500'}>
              Quantity
            </label>
            <div className="inline-flex items-center border-2 border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 self-start">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" strokeWidth={2} />
              </button>
              <input
                type="number"
                min={1}
                max={99}
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!Number.isNaN(v)) setQuantity(Math.max(1, Math.min(99, v)));
                }}
                className={s.quantityInput}
                aria-label="Quantity"
                style={lightThemeStyle}
              />
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(99, q + 1))}
                className="p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
                disabled={quantity >= 99}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        )}

        {/* Size Chart Link - Only show if chart data exists */}
        {hasChartData && (
          <button 
            onClick={scrollToSizeChart}
            className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors gap-1 mb-4"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
              />
            </svg>
            {translations.sizeChart}
            <ChevronDown className="h-4 w-4" />
          </button>
        )}

        {/* Main Add to Cart Buttons */}
        <div className="space-y-3">
          {projectType !== 'iptv' && (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white px-5 py-3.5 rounded-xl text-base font-semibold 
                       hover:bg-gray-800 transition-all duration-200 
                       disabled:bg-neutral-300 disabled:cursor-not-allowed 
                       flex items-center justify-center gap-2 
                       transform hover:scale-[1.01] active:scale-[0.99] shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{translations.processing}</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>{translations.addToCart}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleBuyNow}
            disabled={isLoading}
            className={`w-full px-5 py-3.5 rounded-xl text-base font-semibold 
                     flex items-center justify-center gap-2
                     transform hover:scale-[1.01] active:scale-[0.99] shadow-sm transition-all duration-200 border
                     ${
                       paymentConfig.method === 'whatsapp'
                         ? 'bg-[#25D366] text-black border-[#25D366] hover:bg-[#1ebe57]'
                         : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50 disabled:bg-neutral-300 disabled:cursor-not-allowed'
                     }`}
            style={lightThemeStyle}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{translations.processing}</span>
              </>
            ) : (
              <span>{paymentConfig.method === 'whatsapp' ? 'Subscribe' : projectType === 'iptv' ? 'Subscribe Now' : translations.buyNow}</span>
            )}
          </button>
        </div>
      </div>

      {/* Sticky Buttons Container for Mobile */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 md:hidden z-50 transition-transform duration-300 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] ${
          showStickyButtons ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Sticky Subscribe/Buy Now Button */}
          <button
            onClick={handleBuyNow}
            disabled={isLoading}
            className={`w-full px-5 py-3 rounded-xl text-base font-semibold 
                     flex items-center justify-center gap-2 transition-all duration-200 border
                     ${
                       paymentConfig.method === 'whatsapp'
                         ? 'bg-[#25D366] text-black border-[#25D366] hover:bg-[#1ebe57]'
                         : 'bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50 disabled:bg-neutral-300 disabled:cursor-not-allowed'
                     }`}
            style={lightThemeStyle}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>{translations.processing}</span>
              </>
            ) : (
              <span>{paymentConfig.method === 'whatsapp' ? 'Subscribe' : projectType === 'iptv' ? 'Subscribe Now' : translations.buyNow}</span>
            )}
          </button>

          {/* Additional Info */}
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>{translations.secureTransaction}</span>
          </div>
        </div>

        {/* Safe Area Spacing for Mobile */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
}