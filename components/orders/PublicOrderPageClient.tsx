'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import {
  getPublicOrder,
  orderEmailStorageKey,
  type PublicOrderPayload,
} from '@/lib/orders';
import { paymentMethodLabel, shippingMethodLabel } from '@/lib/checkout/paymentMethods';
import { catalogHref } from '@/lib/data/navigation';
import { orderStatusClass, orderStatusLabel } from '@/lib/orders/status';

type Props = {
  orderId: string;
  categories: CategoryWithCount[];
};

export function PublicOrderPageClient({ orderId, categories }: Props) {
  const [email, setEmail] = useState('');
  const [payload, setPayload] = useState<PublicOrderPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (emailToUse: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPublicOrder(orderId, emailToUse);
        if (!data) {
          setPayload(null);
          setError(
            'No order found for that email. Use the same address as checkout, or check your confirmation email.',
          );
          return;
        }
        setPayload(data);
        try {
          sessionStorage.setItem(orderEmailStorageKey(orderId), emailToUse.trim());
        } catch {
          /* ignore */
        }
      } catch (e) {
        setPayload(null);
        setError(e instanceof Error ? e.message : 'Could not load order.');
      } finally {
        setLoading(false);
      }
    },
    [orderId],
  );

  useEffect(() => {
    setPayload(null);
    setError(null);
    setBootstrapping(true);
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem(orderEmailStorageKey(orderId)) || '' : '';
    setEmail(stored);
    if (stored.trim()) {
      void load(stored).finally(() => setBootstrapping(false));
    } else {
      setBootstrapping(false);
    }
  }, [orderId, load]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter the email you used at checkout.');
      return;
    }
    void load(email);
  }

  const addr = payload?.order.shipping_address_json as Record<string, string> | null | undefined;

  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <Link
          href={catalogHref('/account')}
          className="font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:text-white"
        >
          ← Account
        </Link>

        {bootstrapping ? (
          <p className="mt-16 text-center text-sm text-slate-500">Loading order…</p>
        ) : !payload ? (
          <div className="mx-auto mt-12 max-w-md">
            <h1 className="font-display text-2xl text-white">View your order</h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter the checkout email to confirm this order belongs to you.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="order-email" className="block font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Email
                </label>
                <input
                  id="order-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-lab-base/80 px-4 py-3 text-sm text-white outline-none focus:border-lab-primary/50"
                  placeholder="you@institution.edu"
                />
              </div>
              {error ? (
                <p className="text-sm text-red-300" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl border border-lab-primary/50 bg-lab-primary/20 py-3 font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:bg-lab-primary/30 disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Show order'}
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Order</p>
                <h1 className="mt-1 font-display text-3xl text-white">#{payload.order.order_number}</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Placed{' '}
                  {new Date(payload.order.created_at).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <span
                className={`self-start rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider ${orderStatusClass(payload.order.status)}`}
              >
                {orderStatusLabel(payload.order.status)}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-lab-surface/50 p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-lab-primary">Shipping</p>
                {addr ? (
                  <address className="mt-3 text-sm not-italic leading-relaxed text-slate-300">
                    {addr.fullName ? <span className="block font-medium text-white">{addr.fullName}</span> : null}
                    {addr.address ? <span className="block">{addr.address}</span> : null}
                    <span className="block">
                      {[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}
                    </span>
                    {addr.country ? <span className="block">{addr.country}</span> : null}
                  </address>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No address on file.</p>
                )}
                <p className="mt-4 border-t border-white/10 pt-4 text-sm text-slate-400">
                  {shippingMethodLabel(payload.order.shipping_method)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-lab-surface/50 p-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-lab-primary">Payment</p>
                <p className="mt-3 text-sm text-slate-300">
                  {paymentMethodLabel(payload.order.payment_method)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Status:{' '}
                  <span className="font-medium text-slate-300">{payload.order.payment_status}</span>
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <p className="border-b border-white/10 bg-lab-surface/80 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                Items
              </p>
              <ul className="divide-y divide-white/5">
                {payload.items.map((line) => (
                  <li key={line.id} className="flex gap-4 p-5">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-lab-base">
                      {line.product?.thumbnail_url ? (
                        <Image
                          src={line.product.thumbnail_url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs text-slate-600">—</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{line.product?.name ?? 'Product'}</p>
                      <p className="text-sm text-slate-500">Qty {line.quantity}</p>
                    </div>
                    <p className="font-mono text-sm text-white tabular-nums">
                      ${(Number(line.unit_price) * line.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 border-t border-white/10 bg-lab-surface/40 px-5 py-4 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">${Number(payload.order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-white">${Number(payload.order.shipping_cost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 font-display text-base text-white">
                  <span>Total</span>
                  <span className="text-lab-primary">${Number(payload.order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button href={catalogHref('/products')} size="md">
                Continue shopping
              </Button>
              <Button href={catalogHref('/contact')} variant="secondary" size="md">
                Contact support
              </Button>
            </div>
          </div>
        )}
      </main>
    </StorefrontChrome>
  );
}
