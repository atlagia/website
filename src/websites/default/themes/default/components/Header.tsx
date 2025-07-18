import React, { useEffect, useState } from 'react';
import { ShoppingCart, Globe } from 'lucide-react';
import Cart from './Cart';
import { useCartStore } from '../../../store/cart';
import { useCurrencyStore } from '../../../store/currency';
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
  projectType: string;
  currentPath: string;
  currencies: {
    [key: string]: string;
  };
  styles: any;
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
  };
}

export default function Header({ 
  siteName, 
  menuConfig, 
  languages, 
  projectType, 
  currentPath,
  currencies,
  styles,
  apiEndpoint,
  searchConfig,
  paymentConfig
}: HeaderProps) {
  // Extract initial language and handle path parsing
  const getInitialLanguage = () => {
    const pathParts = currentPath.split('/');
    // Check if path starts with a language code
    const pathLang = pathParts[1];
    
    // If path doesn't start with language code (e.g., /products/...)
    if (!languages[pathLang]) {
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
    
    if (languages[pathLang] && pathLang !== language) {
      setLanguage(pathLang);
    }
  }, [currentPath]);

  // Get current menu items based on language and project type
  const getCurrentMenuItems = () => {
    const langContent = menuConfig[language] || menuConfig.en;
    return langContent[projectType] || langContent.default;
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
      <header className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.nav.wrapper}>
            {/* Mobile Menu Button - Now first item */}
            <div className="flex lg:hidden">
              <button
                className="p-2"
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
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <a href={getHomeUrl()} className={styles.nav.brand}>{siteName}</a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-4">
              {currentMenuItems.items.map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className={styles.nav.menu.item}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className={styles.actions.wrapper}>
              <Search 
                apiEndpoint={searchConfig.apiEndpoint}
                lang={language}
                placeholder={searchConfig.placeholder}
              />

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                  className={styles.actions.currency.button}
                >
                  <span className={styles.actions.currency.text}>{currencies[currency]}</span>
                </button>

                {showCurrencyMenu && (
                  <div className={styles.actions.currency.dropdown}>
                    {Object.entries(currencies).map(([code, symbol]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setShowCurrencyMenu(false);
                        }}
                        className={`${styles.actions.currency.option} ${
                          currency === code ? 'bg-gray-100' : 'hover:bg-gray-50'
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
                  aria-label={`Select language (current: ${languages[language]})`}
                >
                  <Globe size={20} />
                  <span className={styles.actions.language.text}>{languages[language]}</span>
                </button>

                {showLanguageMenu && (
                  <div className={styles.actions.language.dropdown}>
                    {Object.entries(languages).map(([code, name]) => (
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

      {/* Cart Sidebar (unchanged) */}
      <div 
        className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-[100] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Shopping Cart</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close shopping cart"
              >
                ✕
              </button>
            </div>
          </div>
          <Cart 
            onCheckout={() => setIsOpen(false)} 
            apiEndpoint={apiEndpoint}
            paymentConfig={paymentConfig}
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