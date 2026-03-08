import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useCurrencyStore } from '../store/currency';

interface Product {
  id: string;
  title: string;
  handle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
}

interface ReactiveProductCardProps {
  product: Product;
  lang: string;
  content?: {
    badges?: {
      sale?: string;
    };
  };
  /** When true, image uses object-contain so full product is visible (e.g. collection grid) */
  containImage?: boolean;
  cardStyles?: {
    root?: string;
    media?: string;
    noImageWrap?: string;
    noImageText?: string;
    saleBadge?: string;
    content?: string;
    title?: string;
    price?: string;
    comparePrice?: string;
    arrow?: string;
  };
}

export default function ReactiveProductCard({ product, lang, content, containImage = false, cardStyles }: ReactiveProductCardProps) {
  const { currency, rates } = useCurrencyStore();
  const [convertedPrice, setConvertedPrice] = useState(product.price.amount);
  const [convertedComparePrice, setConvertedComparePrice] = useState(product.compareAtPrice?.amount || '');
  const [displayCurrency, setDisplayCurrency] = useState(product.price.currencyCode);

  useEffect(() => {
    const convertPrice = (amount: string, fromCurrency: string, toCurrency: string) => {
      if (fromCurrency === toCurrency) return amount;
      
      // Use the existing currency store structure
      if (rates[fromCurrency] && rates[toCurrency]) {
        const converted = (parseFloat(amount) / rates[fromCurrency]) * rates[toCurrency];
        return converted.toFixed(2);
      }
      return amount;
    };

    const newPrice = convertPrice(product.price.amount, product.price.currencyCode, currency);
    setConvertedPrice(newPrice);
    setDisplayCurrency(currency);

    if (product.compareAtPrice) {
      const newComparePrice = convertPrice(
        product.compareAtPrice.amount, 
        product.compareAtPrice.currencyCode, 
        currency
      );
      setConvertedComparePrice(newComparePrice);
    }
  }, [currency, rates, product.price.amount, product.price.currencyCode, product.compareAtPrice]);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const isOnSale = product.compareAtPrice && parseFloat(convertedComparePrice) > parseFloat(convertedPrice);
  const discountPercentage = isOnSale ? Math.round(((parseFloat(convertedComparePrice) - parseFloat(convertedPrice)) / parseFloat(convertedComparePrice)) * 100) : 0;
  const rootClass = cardStyles?.root || "group product-card flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 border border-neutral-100 hover:border-neutral-200";
  const mediaClass = cardStyles?.media || "relative aspect-[3/4] min-h-[200px] overflow-hidden bg-neutral-50 flex items-center justify-center";
  const noImageWrapClass = cardStyles?.noImageWrap || "w-full h-full flex items-center justify-center bg-neutral-100";
  const noImageTextClass = cardStyles?.noImageText || "text-neutral-400 text-sm";
  const saleBadgeClass = cardStyles?.saleBadge || "absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-sm";
  const contentClass = cardStyles?.content || "flex flex-col flex-grow p-4";
  const titleClass = cardStyles?.title || "text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2 leading-snug mb-2";
  const priceClass = cardStyles?.price || "text-base font-semibold text-neutral-900";
  const comparePriceClass = cardStyles?.comparePrice || "text-sm text-neutral-400 line-through";
  const arrowClass = cardStyles?.arrow || "text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0";

  return (
    <a
      href={`/${lang}/products/${product.handle}`}
      className={rootClass}
    >
      <div className={mediaClass}>
        {product.image?.url ? (
          <img
            src={product.image.url}
            alt={product.image.altText || product.title}
            className={
              containImage
                ? 'max-w-full max-h-full w-auto h-auto object-contain transform group-hover:scale-[1.02] transition-transform duration-500'
                : 'w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500'
            }
            loading="lazy"
          />
        ) : (
          <div className={noImageWrapClass}>
            <span className={noImageTextClass}>No image</span>
          </div>
        )}
        {/* Sale Badge */}
        {isOnSale && (
          <div className={saleBadgeClass}>
            {content?.badges?.sale || 'Sale'} -{discountPercentage}%
          </div>
        )}
      </div>
      <div className={contentClass}>
        <h2 className={titleClass}>
          {product.title}
        </h2>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={priceClass}>
              {formatPrice(convertedPrice, displayCurrency)}
            </span>
            {isOnSale && convertedComparePrice && (
              <span className={comparePriceClass}>
                {formatPrice(convertedComparePrice, displayCurrency)}
              </span>
            )}
          </div>
          <span className={arrowClass}>
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </span>
        </div>
      </div>
    </a>
  );
}
