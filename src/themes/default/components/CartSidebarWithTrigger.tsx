import React, { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@store/cart';
import Cart from './Cart';

export interface CartSidebarWithTriggerProps {
  /** ClassName for the trigger button (e.g. F1 theme styles) */
  triggerClassName?: string;
  /** Label next to icon, e.g. "Bag" */
  label?: string;
  /** Show label on desktop (hidden on small screens by default) */
  showLabel?: boolean;
  /** Payment config from env (method, store, hoodpay, etc.) */
  paymentConfig: {
    method: string;
    hoodpay?: { apiUrl: string; businessId: string; authToken: string; redirectUrl: string };
    store?: { name: string; domain: string };
  };
  apiEndpoint: string;
  /** Cart sidebar/header styles from Header.json (optional, for themed sidebar) */
  headerStyles?: { cart?: Record<string, string> };
  /** Project type for "Shopping Cart" vs "Cart" title */
  projectType?: string;
}

export default function CartSidebarWithTrigger({
  triggerClassName = 'flex items-center gap-1.5 p-2 text-[var(--drivon-muted)] hover:text-[var(--drivon-text)] transition-colors',
  label = 'Bag',
  showLabel = true,
  paymentConfig,
  apiEndpoint,
  headerStyles = {},
  projectType = 'physical',
}: CartSidebarWithTriggerProps) {
  const { isOpen, setIsOpen, items } = useCartStore();
  const isPhysical = !['iptv', 'digital', 'degital', 'streaming', 'directory'].includes((projectType || 'physical').toLowerCase());

  useEffect(() => {
    useCartStore.persist?.rehydrate?.();
  }, []);

  // Allow theme headers to open cart from mobile menu (e.g. #mobile-bag-trigger)
  useEffect(() => {
    const openCart = () => {
      setIsOpen(true);
      document.getElementById('mobile-menu-button')?.setAttribute('aria-expanded', 'false');
      document.getElementById('mobile-menu-dropdown')?.classList.add('hidden');
    };
    const el = document.getElementById('mobile-bag-trigger');
    el?.addEventListener('click', openCart);
    const onOpenCart = () => setIsOpen(true);
    window.addEventListener('open-cart', onOpenCart);
    return () => {
      el?.removeEventListener('click', openCart);
      window.removeEventListener('open-cart', onOpenCart);
    };
  }, [setIsOpen]);

  const c = headerStyles?.cart || {};

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClassName}
        aria-label={isPhysical ? `Shopping cart${items.length > 0 ? ` (${items.length} items)` : ''}` : `Cart${items.length > 0 ? ` (${items.length})` : ''}`}
      >
        <span className="relative inline-flex">
          <ShoppingBag className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          {items.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 px-1 flex items-center justify-center rounded-full bg-[var(--drivon-text,#111)] text-[var(--drivon-bg,#fff)] text-[10px] font-medium">
              {items.length}
            </span>
          )}
        </span>
        {showLabel && <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] font-body">{label}</span>}
      </button>

      {/* Cart Sidebar - solid background and explicit positioning when theme used so no transparent strip at viewport edge. */}
      <div
        className={`${c.sidebar ?? 'fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl border-l border-neutral-200 z-[100] transform transition-transform duration-300 ease-in-out'} ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${!isOpen ? 'pointer-events-none' : ''}`}
        style={
          c.sidebar
            ? {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '28rem',
                minHeight: '100vh',
                boxSizing: 'border-box',
              }
            : undefined
        }
      >
        <div className={c.container ?? 'h-full flex flex-col'}>
          <div className={c.header ?? 'p-4 border-b border-neutral-200'}>
            <div className={c.headerContent ?? 'flex justify-between items-center'}>
              <div className="flex items-center gap-3">
                <div className={c.iconWrapper ?? 'w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center'}>
                  <svg className={c.icon ?? 'w-5 h-5 text-white'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h2 className={c.title ?? 'text-lg font-semibold text-neutral-900'}>
                  {isPhysical ? 'Shopping Cart' : 'Cart'}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={c.closeButton ?? 'p-2 hover:bg-neutral-100 rounded-full'}
                aria-label="Close cart"
              >
                <svg className={c.closeIcon ?? 'w-5 h-5 text-neutral-500 hover:text-neutral-700 transition-colors'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <Cart
            cartStyles={c}
            onCheckout={() => {
              setIsOpen(false);
              if (typeof window !== 'undefined' && window.localStorage) {
                try {
                  const cartStore = JSON.parse(localStorage.getItem('cart-storage') || '{}');
                  if (cartStore?.state) {
                    cartStore.state = { ...cartStore.state, isOpen: false };
                    localStorage.setItem('cart-storage', JSON.stringify(cartStore));
                  }
                } catch (_) {}
              }
            }}
            apiEndpoint={apiEndpoint}
            paymentConfig={paymentConfig}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className={c.overlay ?? 'fixed inset-0 z-[90]'}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 90,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
