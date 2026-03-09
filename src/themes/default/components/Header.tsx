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

// Default header structure so website themes can provide minimal Header.json (e.g. only wrapper, nav, cart)
const DEFAULT_HEADER_STYLES = {
  wrapper: 'bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  nav: {
    wrapper: 'flex items-center justify-between h-16',
    brand: 'text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors',
    menu: { desktop: 'hidden lg:flex lg:items-center lg:space-x-4', item: 'text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors' }
  },
  logo: { wrapper: 'flex-1 lg:flex-none text-center lg:text-left' },
  mobileButton: { wrapper: 'flex lg:hidden', button: 'p-2', iconClose: 'text-2xl', iconOpen: 'w-6 h-6' },
  actions: {
    wrapper: 'flex items-center space-x-4',
    search: { icon: 'text-gray-700' },
    currency: {
      wrapper: 'relative',
      button: 'flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors',
      text: 'font-medium',
      dropdown: 'absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50',
      option: 'block w-full text-left px-4 py-2 text-sm text-gray-700 transition-colors',
      optionActive: 'bg-gray-100',
      optionHover: 'hover:bg-gray-50'
    },
    language: {
      wrapper: 'relative',
      button: 'flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors',
      text: 'hidden sm:block',
      dropdown: 'absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50',
      option: 'block w-full text-left px-4 py-2 text-sm text-gray-700 transition-colors',
      optionActive: 'bg-gray-100',
      optionHover: 'hover:bg-gray-50'
    },
    cart: { button: 'relative p-2 text-gray-700 hover:text-gray-900 transition-colors', count: 'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center' }
  },
  mobile: {
    menu: { wrapper: 'lg:hidden fixed left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out', nav: 'px-4 py-2', item: 'block py-3 px-4 text-gray-800 hover:bg-gray-100 border-b border-gray-100 last:border-0' },
    backdrop: 'lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[98]'
  },
  cart: {
    sidebar: 'fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl border-l border-gray-200 z-[100] transform transition-transform duration-300 ease-in-out',
    container: 'h-full flex flex-col',
    header: 'p-4 border-b border-gray-200',
    headerContent: 'flex justify-between items-center',
    iconWrapper: 'w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center',
    icon: 'w-5 h-5 text-white',
    title: 'text-lg font-semibold text-neutral-900',
    closeButton: 'p-2 hover:bg-gray-100 rounded-full',
    overlay: 'fixed inset-0 bg-black bg-opacity-50 z-[90]'
  }
};

function mergeHeaderStyles(theme: Record<string, unknown> | undefined): typeof DEFAULT_HEADER_STYLES {
  if (!theme || typeof theme !== 'object') return DEFAULT_HEADER_STYLES as typeof DEFAULT_HEADER_STYLES;
  const deepMerge = (target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> => {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      const s = source[key];
      const t = out[key];
      if (s != null && typeof s === 'object' && !Array.isArray(s) && t != null && typeof t === 'object' && !Array.isArray(t)) {
        out[key] = deepMerge(t as Record<string, unknown>, s as Record<string, unknown>);
      } else if (s !== undefined) {
        out[key] = s;
      }
    }
    return out;
  };
  return deepMerge(DEFAULT_HEADER_STYLES as unknown as Record<string, unknown>, theme as Record<string, unknown>) as typeof DEFAULT_HEADER_STYLES;
}

export default function Header({ 
  siteName, 
  menuConfig, 
  languages, 
  allowedLanguages,
  projectType: projectTypeProp, 
  currentPath,
  currencies,
  styles: stylesProp,
  headerStyles: headerStylesProp,
  apiEndpoint,
  searchConfig,
  paymentConfig
}: HeaderProps) {
  const headerStyles = mergeHeaderStyles(headerStylesProp);
  const styles = mergeHeaderStyles(stylesProp ?? headerStylesProp);
  // Use projectType from props or from layout (data-project-type on body)
  const [projectType, setProjectType] = useState((projectTypeProp || 'physical').toLowerCase());
  
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
            <div className={headerStyles.mobileButton?.wrapper ?? 'flex lg:hidden'}>
              <button 
                className={headerStyles.mobileButton?.button ?? 'p-2 text-neutral-600 hover:text-neutral-900 transition-colors'}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <span className={headerStyles.mobileButton?.iconClose ?? 'text-2xl'}>✕</span>
                ) : (
                  <svg className={headerStyles.mobileButton?.iconOpen ?? 'w-6 h-6'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <nav className={headerStyles.nav?.menu?.desktop || 'hidden lg:flex lg:items-center lg:space-x-4'}>
              {currentMenuItems.items.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className={headerStyles.nav?.menu?.item || 'text-neutral-600 hover:text-neutral-900 px-3 py-2 rounded-md text-sm font-medium transition-colors'}
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
                  button: headerStyles.actions.search?.button ?? "p-2 hover:bg-neutral-100 rounded-full transition-colors",
                  form: headerStyles.actions.search?.form ?? "absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-200 p-4 z-50",
                  input: headerStyles.actions.search?.input ?? "w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-400"
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
                          language === code ? (styles.actions.language.optionActive ?? 'bg-neutral-100') : (styles.actions.language.optionHover ?? 'hover:bg-neutral-50')
                        }`}
                        aria-label={`Change language to ${name}`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Button - label adapts by projectType */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={styles.actions.cart.button}
                aria-label={isPhysical ? `Shopping cart${items.length > 0 ? ` (${items.length} items)` : ''}` : `Cart${items.length > 0 ? ` (${items.length})` : ''}`}
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
        className={`lg:hidden fixed left-0 right-0 bg-white shadow-lg border-b border-neutral-200 transition-all duration-300 ease-in-out ${
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
              className="block py-3 px-4 text-neutral-800 hover:bg-neutral-50 border-b border-neutral-100 last:border-0 transition-colors"
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

      {/* Cart Sidebar - styles from headerStyles.cart (website/theme) */}
      <div 
        className={`${headerStyles?.cart?.sidebar ?? 'fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl border-l border-neutral-200 z-[100] transform transition-all duration-300 ease-in-out'} ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className={headerStyles?.cart?.container ?? 'h-full flex flex-col'}>
          <div className={headerStyles?.cart?.header ?? 'p-4 border-b border-neutral-200'}>
            <div className={headerStyles?.cart?.headerContent ?? 'flex justify-between items-center'}>
              <div className="flex items-center gap-3">
                <div className={headerStyles?.cart?.iconWrapper ?? 'w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center'}>
                  <svg className={headerStyles?.cart?.icon ?? 'w-5 h-5 text-white'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h2 className={headerStyles?.cart?.title ?? 'text-lg font-semibold text-neutral-900'}>
                  {isPhysical ? 'Shopping Cart' : 'Cart'}
                </h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className={headerStyles?.cart?.closeButton ?? 'p-2 hover:bg-neutral-100 rounded-full'}
                aria-label="Close cart"
              >
                <svg className="w-5 h-5 text-neutral-500 hover:text-neutral-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <Cart
            cartStyles={headerStyles?.cart} 
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
      
      {/* Cart overlay - styles from headerStyles.cart */}
      {isOpen && (
        <div 
          className={headerStyles?.cart?.overlay ?? 'fixed inset-0 bg-black bg-opacity-50 z-[90]'}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}