'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { Button } from '@/components/ui/button';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { catalogHref } from '@/lib/data/navigation';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/cart/constants';
import { useCartStore } from '@/lib/cart/store';

type Props = { categories: CategoryWithCount[] };

export function CartPageClient({ categories }: Props) {
  const { items, removeItem, updateQuantity, total, count } = useCartStore();
  const cartTotal = total();
  const cartCount = count();

  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h1 className="font-display text-3xl text-white md:text-4xl">Shopping cart</h1>

        {cartCount === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-slate-400">No compounds in cart yet.</p>
            <Button href={catalogHref('/products')} className="mt-6">
              Browse catalog
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-lab-surface/50">
              <ul className="divide-y divide-white/10">
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.variantId}`}
                    className="grid gap-4 p-5 md:grid-cols-[1fr_auto_auto]"
                  >
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                        {item.thumbnailUrl ? (
                          <Image src={item.thumbnailUrl} alt="" fill className="object-cover" sizes="80px" />
                        ) : null}
                      </div>
                      <div>
                        <Link
                          href={catalogHref(`/products/${item.slug}`)}
                          className="font-display text-white hover:text-lab-primary"
                        >
                          {item.name}
                        </Link>
                        {item.variantLabel ? (
                          <p className="mt-1 font-mono text-[10px] text-slate-500">{item.variantLabel}</p>
                        ) : null}
                        <p className="mt-1 text-sm text-slate-400">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-10 w-10 rounded-lg border border-white/10 text-slate-300"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] text-center font-mono">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-10 w-10 rounded-lg border border-white/10 text-slate-300"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                      <span className="font-display text-lg text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        className="text-xs text-lab-rose"
                        onClick={() => removeItem(item.productId, item.variantId)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="h-fit rounded-2xl border border-white/10 bg-lab-elevated/50 p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-lg text-white">Order summary</h2>
              <div className="mt-4 flex justify-between text-sm text-slate-400">
                <span>Subtotal ({cartCount} items)</span>
                <span className="text-white">${cartTotal.toFixed(2)}</span>
              </div>
              {cartTotal < FREE_SHIPPING_THRESHOLD && (
                <p className="mt-3 text-xs text-lab-energy">
                  Free standard shipping on orders ${FREE_SHIPPING_THRESHOLD}+
                </p>
              )}
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="flex justify-between font-display text-xl text-white">
                  <span>Total</span>
                  <span className="text-lab-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <Button href={catalogHref('/checkout')} fullWidth size="lg" className="mt-6">
                Proceed to checkout
              </Button>
            </aside>
          </div>
        )}
      </main>
    </StorefrontChrome>
  );
}
