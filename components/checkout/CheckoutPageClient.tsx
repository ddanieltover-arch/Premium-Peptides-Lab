'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { Button } from '@/components/ui/button';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import {
  EXPRESS_SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_COST,
} from '@/lib/cart/constants';
import { PAYMENT_METHOD_IDS, PAYMENT_METHOD_LABELS } from '@/lib/checkout/payment-methods';
import { useCartStore } from '@/lib/cart/store';
import { catalogHref } from '@/lib/data/navigation';
import { cn } from '@/lib/cn';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-lab-base/80 px-4 py-2.5 font-mono text-sm text-white outline-none focus:border-lab-primary/50';

type Props = { categories: CategoryWithCount[] };

export function CheckoutPageClient({ categories }: Props) {
  const router = useRouter();
  const { items, total, clearCart, shippingMethod, setShippingMethod } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const cartTotal = total();
  const shippingCost =
    shippingMethod === 'express'
      ? EXPRESS_SHIPPING_COST
      : cartTotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING_COST;
  const finalTotal = cartTotal + shippingCost;

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          paymentMethod,
          shippingMethod,
          shippingAddress: {
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof (data as { error?: string }).error === 'string'
            ? (data as { error: string }).error
            : 'Checkout failed.',
        );
      }
      const order = (data as { order?: { id: string; orderNumber: string } }).order;
      if (!order?.id) throw new Error('Invalid checkout response.');

      clearCart();
      try {
        sessionStorage.setItem(`ppl_order_email:${order.id}`, formData.email.trim());
      } catch {
        /* ignore */
      }
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(order.id)}&orderNumber=${encodeURIComponent(order.orderNumber)}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-12">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <h1 className="font-display text-2xl text-white">Cart is empty</h1>
            <Button href={catalogHref('/products')} className="mt-6">
              Browse catalog
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
            <div>
              <h1 className="font-display text-3xl text-white">Checkout</h1>
              <p className="mt-2 text-sm text-slate-400">
                Research-use only. Payment instructions follow order placement.
              </p>
              {error ? (
                <p className="mt-4 rounded-xl border border-lab-rose/40 bg-lab-rose/10 px-4 py-3 text-sm text-lab-rose">
                  {error}
                </p>
              ) : null}
              <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                <section>
                  <h2 className="font-display text-lg text-white">Contact</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="md:col-span-2 block text-xs text-slate-500">
                      Email
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                    <label className="block text-xs text-slate-500">
                      First name
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                    <label className="block text-xs text-slate-500">
                      Last name
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                    <label className="md:col-span-2 block text-xs text-slate-500">
                      Phone
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                  </div>
                </section>
                <section>
                  <h2 className="font-display text-lg text-white">Shipping address</h2>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <label className="md:col-span-2 block text-xs text-slate-500">
                      Street
                      <input type="text" name="address" required value={formData.address} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                    <label className="block text-xs text-slate-500">
                      City
                      <input type="text" name="city" required value={formData.city} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                    <label className="block text-xs text-slate-500">
                      State
                      <input type="text" name="state" required value={formData.state} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                    <label className="block text-xs text-slate-500">
                      ZIP
                      <input type="text" name="zip" required value={formData.zip} onChange={handleChange} className={cn(inputClass, 'mt-1')} />
                    </label>
                  </div>
                </section>
                <section>
                  <h2 className="font-display text-lg text-white">Shipping method</h2>
                  <div className="mt-4 space-y-2">
                    {[
                      { id: 'standard' as const, label: 'Standard', note: cartTotal >= FREE_SHIPPING_THRESHOLD ? 'Free' : `$${STANDARD_SHIPPING_COST}` },
                      { id: 'express' as const, label: 'Express', note: `$${EXPRESS_SHIPPING_COST}` },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setShippingMethod(m.id)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition',
                          shippingMethod === m.id
                            ? 'border-lab-primary bg-lab-primary/10 text-white'
                            : 'border-white/10 text-slate-400',
                        )}
                      >
                        <span>{m.label}</span>
                        <span className="font-mono text-xs">{m.note}</span>
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h2 className="font-display text-lg text-white">Payment method</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {PAYMENT_METHOD_IDS.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider',
                          paymentMethod === id
                            ? 'border-lab-primary bg-lab-primary/15 text-lab-primary'
                            : 'border-white/10 text-slate-500',
                        )}
                      >
                        {PAYMENT_METHOD_LABELS[id]}
                      </button>
                    ))}
                  </div>
                </section>
                <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Placing order…' : 'Place order'}
                </Button>
              </form>
            </div>
            <aside className="h-fit rounded-2xl border border-white/10 bg-lab-elevated/50 p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-lg text-white">Order summary</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex justify-between gap-2">
                    <span className="line-clamp-2 text-slate-300">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="shrink-0 text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-display text-xl text-white">
                  <span>Total</span>
                  <span className="text-lab-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
              <Link href={catalogHref('/cart')} className="mt-4 block text-center text-xs text-lab-primary">
                Edit cart
              </Link>
            </aside>
          </div>
        )}
      </main>
    </StorefrontChrome>
  );
}
