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
  searchConfig
}: HeaderProps) {
  // Extract initial language from current path
  const getInitialLanguage = () => {
    const pathLang = currentPath.split('/')[1]; // Get language from URL path
    return languages[pathLang] ? pathLang : 'en'; // Fallback to 'en' if invalid
  };

  const { isOpen, setIsOpen, items } = useCartStore();
  const [language, setLanguage] = useState(getInitialLanguage());
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const { currency, setCurrency } = useCurrencyStore();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  // Update language when URL changes
  useEffect(() => {
    const pathLang = currentPath.split('/')[1];
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

  // Handle language change with path update
  const changeLanguage = (newLang: string) => {
    const currentLang = language;
    setLanguage(newLang);
    setShowLanguageMenu(false);
    
    // Update URL to new language
    const newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`);
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
    <header className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.nav.wrapper}>
          <a href={getHomeUrl()} className={styles.nav.brand}>{siteName}</a>
          
          <nav className={styles.nav.menu.wrapper}>
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

          <div className={styles.actions.wrapper}>
            {/* Add Search component here */}
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
          <Cart onCheckout={() => setIsOpen(false)} apiEndpoint={apiEndpoint} />
        </div>
      </div>
      
      {/* Overlay - Update z-index */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[90]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
}