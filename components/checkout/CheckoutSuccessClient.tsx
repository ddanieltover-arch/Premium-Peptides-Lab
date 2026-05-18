'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { liveCatalogHref } from '@/lib/data/navigation';

type Props = {
  orderId?: string;
  orderNumber?: string;
  emailFailed?: boolean;
};

export function CheckoutSuccessClient({ orderId, orderNumber, emailFailed }: Props) {
  const orderRef = orderNumber ?? orderId;
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'unknown' | 'sent' | 'failed' | 'resending'>(
    emailFailed ? 'failed' : 'unknown',
  );
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    if (!orderId) return;
    try {
      const stored = sessionStorage.getItem(`ppl_order_email:${orderId}`);
      if (stored) setCustomerEmail(stored);
    } catch {
      /* ignore */
    }
  }, [orderId]);

  const resendConfirmation = useCallback(async () => {
    if (!orderId || !customerEmail) {
      setEmailMessage('We could not verify your email for this order. Contact support with your PPL reference.');
      setEmailStatus('failed');
      return;
    }

    setEmailStatus('resending');
    setEmailMessage('');
    try {
      const res = await fetch('/api/email/order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, customerEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err =
          typeof (data as { error?: string }).error === 'string'
            ? (data as { error: string }).error
            : 'Could not send confirmation email.';
        throw new Error(err);
      }
      setEmailStatus('sent');
      setEmailMessage(`Confirmation sent to ${customerEmail}. Check spam if it does not arrive within a few minutes.`);
    } catch (e) {
      setEmailStatus('failed');
      setEmailMessage(e instanceof Error ? e.message : 'Could not send confirmation email.');
    }
  }, [orderId, customerEmail]);

  useEffect(() => {
    if (!emailFailed || !orderId || !customerEmail) return;
    void resendConfirmation();
  }, [emailFailed, orderId, customerEmail, resendConfirmation]);

  return (
    <main id="main-content" className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-mint">Order received</p>
      <h1 className="mt-4 font-display text-3xl text-white">Thank you for your order</h1>
      {orderRef ? (
        <p className="mt-4 font-mono text-sm text-slate-400">
          Reference: <span className="text-lab-primary">{orderRef}</span>
        </p>
      ) : null}

      {emailStatus === 'sent' ? (
        <p className="mt-6 text-sm leading-relaxed text-lab-mint">{emailMessage}</p>
      ) : emailStatus === 'failed' || emailStatus === 'resending' ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm leading-relaxed text-amber-200/90">
            {emailStatus === 'resending'
              ? 'Sending confirmation email…'
              : 'Your order was saved, but we could not send a confirmation email automatically. Use the button below to resend, or contact support with your PPL reference.'}
          </p>
          {emailMessage && emailStatus === 'failed' ? (
            <p className="text-xs text-slate-500">{emailMessage}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void resendConfirmation()}
            disabled={emailStatus === 'resending'}
            className="rounded-xl border border-lab-primary/40 bg-lab-primary/15 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:bg-lab-primary/25 disabled:opacity-50"
          >
            {emailStatus === 'resending' ? 'Sending…' : 'Resend confirmation email'}
          </button>
        </div>
      ) : (
        <p className="mt-6 text-sm leading-relaxed text-slate-400">
          A confirmation email has been sent to the address you used at checkout. We will follow up with payment and
          fulfillment details. For lot documentation or order changes, contact our support team with your PPL
          reference.
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {orderId ? (
          <Button href={liveCatalogHref(`/orders/${orderId}`)} size="lg">
            View order
          </Button>
        ) : null}
        <Button href={liveCatalogHref('/products')} variant={orderId ? 'secondary' : undefined} size="lg">
          Continue shopping
        </Button>
        <Link
          href={liveCatalogHref('/account')}
          className="inline-flex items-center text-sm text-lab-primary hover:text-white"
        >
          Account & order history →
        </Link>
        <Link
          href={liveCatalogHref('/contact')}
          className="inline-flex items-center text-sm text-slate-400 hover:text-white"
        >
          Contact support
        </Link>
      </div>
    </main>
  );
}
