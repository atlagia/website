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
}

export default function ReactiveProductCard({ product, lang, content }: ReactiveProductCardProps) {
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

  return (
    <a 
      href={`/${lang}/products/${product.handle}`}
      className="group product-card bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {product.image?.url ? (
          <img
            src={product.image.url}
            alt={product.image.altText || product.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-gray-400 text-xs sm:text-sm">No image</span>
          </div>
        )}
        
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-500 text-white text-xs font-bold px-1 py-0.5 sm:px-2 sm:py-1 rounded">
            {content?.badges?.sale || 'Sale'} -{discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-2 sm:p-4">
        <h2 className="text-sm sm:text-lg font-medium mb-1 sm:mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.title}
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
            <span className="text-sm sm:text-lg font-bold text-gray-900">
              {formatPrice(convertedPrice, displayCurrency)}
            </span>
            {isOnSale && convertedComparePrice && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(convertedComparePrice, displayCurrency)}
              </span>
            )}
          </div>
          <span className="text-blue-600 group-hover:translate-x-1 transition-transform duration-300 self-start sm:self-auto">
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
        </div>
      </div>
    </a>
  );
}
