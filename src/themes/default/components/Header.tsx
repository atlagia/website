import React, { useEffect, useState } from 'react';
import { ShoppingCart, Globe } from 'lucide-react';
import Cart from './Cart';
import { useCartStore } from '@store/cart';
import { useCurrencyStore } from '@store/currency';
import Search from './Search';


interface HeaderProps {
  siteName: string;
  menuConfig: {
    [key: string]: {
      [key: string]: {
        items: Array<{
          label: string;
          href: string;
        }>;
      };
    };
  };
  languages: {
    [key: string]: string;
  };
  allowedLanguages: string[];
  projectType: string;
  currentPath: string;
  currencies: {
    [key: string]: string;
  };
  styles: any;
  headerStyles: any;
  apiEndpoint: string;
  searchConfig: {
    apiEndpoint: string;
    lang: string;
    placeholder: {
      [key: string]: string;
    };
  };
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
  };
}

export default function Header({ 
  siteName, 
  menuConfig, 
  languages, 
  allowedLanguages,
  projectType, 
  currentPath,
  currencies,
  styles,
  headerStyles,
  apiEndpoint,
  searchConfig,
  paymentConfig
}: HeaderProps) {
  // Filter the languages object based on allowed languages passed from server
  const filteredLanguages = Object.fromEntries(
    Object.entries(languages).filter(([code]) => allowedLanguages.includes(code))
  );

  // Extract initial language and handle path parsing
  const getInitialLanguage = () => {
    const pathParts = currentPath.split('/');
    // Check if path starts with a language code
    const pathLang = pathParts[1];
    
    // If path doesn't start with language code (e.g., /products/...) or language is not allowed
    if (!filteredLanguages[pathLang]) {
      return 'en'; // Default to English
    }
    
    return pathLang;
  };

  const { isOpen, setIsOpen, items } = useCartStore();
  const [language, setLanguage] = useState(getInitialLanguage());
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const { currency, setCurrency } = useCurrencyStore();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  // Add new state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update language when URL changes
  useEffect(() => {
    const pathParts = currentPath.split('/');
    const pathLang = pathParts[1];
    
    if (filteredLanguages[pathLang] && pathLang !== language) {
      setLanguage(pathLang);
    }
  }, [currentPath]);

  // Get current menu items based on language (simplified structure)
  const getCurrentMenuItems = () => {
    return menuConfig[language] || menuConfig.en;
  };

  const currentMenuItems = getCurrentMenuItems();

  // Modified language change handler
  const changeLanguage = (newLang: string) => {
    const currentLang = language;
    setLanguage(newLang);
    setShowLanguageMenu(false);
    
    // Handle URL update with proper fallback
    let newPath = currentPath;
    
    // If current path doesn't start with a language code
    if (!currentPath.match(/^\/[a-z]{2}\//)) {
      // Add language code to the beginning
      newPath = `/${newLang}${currentPath}`;
    } else {
      // Replace existing language code
      newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`);
    }
    
    // Update URL
    window.location.href = newPath;
    
    localStorage.setItem('preferred-language', newLang);
  };

  // Get home URL with current language
  const getHomeUrl = () => `/${language}`;

  // Hydrate the store
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <>
      <header className={headerStyles.wrapper}>
        <div className={headerStyles.container}>
          <div className={headerStyles.nav.wrapper}>
            {/* Mobile Menu Button - Only visible on mobile */}
            <div className="flex lg:hidden">
              <button 
                className="p-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <span className="text-2xl">✕</span>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Logo/Brand - Centered on mobile */}
            <div className={headerStyles.logo.wrapper}>
              <a href={getHomeUrl()} className={headerStyles.nav.brand}>{siteName}</a>
            </div>

            {/* Desktop Navigation - Hidden on mobile, visible on desktop */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-4">
              {currentMenuItems.items.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className={headerStyles.actions.wrapper}>
              <Search 
                apiEndpoint={searchConfig.apiEndpoint}
                lang={language}
                placeholder={searchConfig.placeholder}
                searchStyles={{
                  icon: headerStyles.actions.search?.icon,
                  button: "p-2 hover:bg-gray-100 rounded-full",
                  form: "absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50",
                  input: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                }}
              />

              {/* Currency Selector */}
              <div className={headerStyles.actions.currency.wrapper}>
                <button
                  onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                  className={headerStyles.actions.currency.button}
                >
                  <span className={headerStyles.actions.currency.text}>{currencies[currency]}</span>
                </button>

                {showCurrencyMenu && (
                  <div className={headerStyles.actions.currency.dropdown}>
                    {Object.entries(currencies).map(([code, symbol]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setShowCurrencyMenu(false);
                        }}
                        className={`${headerStyles.actions.currency.option} ${
                          currency === code ? headerStyles.actions.currency.optionActive : headerStyles.actions.currency.optionHover
                        }`}
                      >
                        {`${code} (${symbol})`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className={styles.actions.language.button}
                  aria-label={`Select language (current: ${filteredLanguages[language]})`}
                >
                  <Globe size={20} />
                  <span className={styles.actions.language.text}>{filteredLanguages[language]}</span>
                </button>

                {showLanguageMenu && (
                  <div className={styles.actions.language.dropdown}>
                    {Object.entries(filteredLanguages).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={`${styles.actions.language.option} ${
                          language === code ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                        aria-label={`Change language to ${name}`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={styles.actions.cart.button}
                aria-label={`Shopping cart${items.length > 0 ? ` (${items.length} items)` : ''}`}
              >
                <ShoppingCart size={24} />
                {items.length > 0 && (
                  <span className={styles.actions.cart.count}>
                    {items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div
        className={`lg:hidden fixed left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'top-[64px] opacity-100 visible' : 'top-[64px] opacity-0 invisible'
        }`}
        style={{
          maxHeight: isMobileMenuOpen ? '80vh' : '0',
          overflowY: 'auto',
          zIndex: 99
        }}
      >
        <nav className="px-4 py-2">
          {currentMenuItems.items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="block py-3 px-4 text-gray-800 hover:bg-gray-100 border-b border-gray-100 last:border-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[98]"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ top: '64px' }}
        />
      )}

      {/* Cart Sidebar - Enhanced */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-b from-white to-gray-50 shadow-2xl z-[100] transform transition-all duration-300 ease-in-out backdrop-blur-sm ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Enhanced Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Shopping Cart</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 group"
                aria-label="Close shopping cart"
              >
                <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <Cart 
            onCheckout={() => {
              // Explicitly close the cart
              setIsOpen(false);
              // Persist the closed state in localStorage
              if (window.localStorage) {
                const cartStore = JSON.parse(localStorage.getItem('cart-storage') || '{}');
                if (cartStore) {
                  cartStore.state = { ...cartStore.state, isOpen: false };
                  localStorage.setItem('cart-storage', JSON.stringify(cartStore));
                }
              }
            }} 
            apiEndpoint={apiEndpoint}
            paymentConfig={paymentConfig}
            storeName={paymentConfig.store?.name || 'DefaultStore'}
            storeDomain={paymentConfig.store?.domain || 'localhost'}
          />
        </div>
      </div>
      
      {/* Overlay - Update z-index */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}