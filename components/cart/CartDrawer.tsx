'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { catalogHref } from '@/lib/data/navigation';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/cart/constants';
import { useCartUIStore } from '@/lib/cart/ui-store';
import { useCartStore } from '@/lib/cart/store';

export function CartDrawer() {
  const open = useCartUIStore((s) => s.cartDrawerOpen);
  const setOpen = useCartUIStore((s) => s.setCartDrawerOpen);
  const { items, removeItem, updateQuantity, total, count } = useCartStore();
  const cartTotal = total();
  const cartCount = count();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[400] bg-lab-base/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close cart"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[410] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-lab-surface shadow-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-display text-lg text-white">Cart ({cartCount})</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartCount === 0 ? (
                <p className="text-sm text-slate-500">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-lab-elevated">
                        {item.thumbnailUrl ? (
                          <Image src={item.thumbnailUrl} alt="" fill className="object-cover" sizes="64px" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={catalogHref(`/products/${item.slug}`)}
                          className="line-clamp-2 font-display text-sm text-white hover:text-lab-primary"
                          onClick={() => setOpen(false)}
                        >
                          {item.name}
                        </Link>
                        {item.variantLabel ? (
                          <p className="font-mono text-[10px] text-slate-500">{item.variantLabel}</p>
                        ) : null}
                        <p className="mt-1 text-sm text-slate-400">${item.price.toFixed(2)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            className="h-8 w-8 rounded border border-white/10 text-slate-300"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          >
                            −
                          </button>
                          <span className="min-w-[1.5rem] text-center font-mono text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="h-8 w-8 rounded border border-white/10 text-slate-300"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="ml-auto text-xs text-lab-rose"
                            onClick={() => removeItem(item.productId, item.variantId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-white/10 p-5">
              <div className="mb-2 flex justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span className="font-display text-white">${cartTotal.toFixed(2)}</span>
              </div>
              {cartTotal > 0 && cartTotal < FREE_SHIPPING_THRESHOLD && (
                <p className="mb-4 text-xs text-lab-energy">
                  Add ${(FREE_SHIPPING_THRESHOLD - cartTotal).toFixed(0)} more for free standard shipping
                </p>
              )}
              <Button
                href={catalogHref('/checkout')}
                fullWidth
                size="lg"
                className="mb-2"
                onClick={() => setOpen(false)}
              >
                Checkout
              </Button>
              <Link
                href={catalogHref('/cart')}
                className="block text-center text-sm text-lab-primary hover:text-white"
                onClick={() => setOpen(false)}
              >
                View full cart
              </Link>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
