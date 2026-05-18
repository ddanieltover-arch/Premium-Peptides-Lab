'use client';

import Link from 'next/link';
import type { CustomerOrderSummary } from '@/lib/orders';
import { catalogHref } from '@/lib/data/navigation';
import { orderStatusClass, orderStatusLabel } from '@/lib/orders/status';

type Props = {
  orders: CustomerOrderSummary[];
};

export function OrderHistoryList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-lab-surface/50 p-8 text-center">
        <p className="text-sm text-slate-400">No orders yet for this email.</p>
        <Link
          href={catalogHref('/products')}
          className="mt-4 inline-block font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:text-white"
        >
          Browse catalog →
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={catalogHref(`/orders/${order.id}`)}
            className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-lab-elevated/40 p-5 transition hover:border-lab-primary/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-mono text-sm text-lab-primary group-hover:text-white">
                {order.order_number}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {new Date(order.created_at).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <span
                className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider ${orderStatusClass(order.status)}`}
              >
                {orderStatusLabel(order.status)}
              </span>
              <span className="font-display text-lg text-white tabular-nums">
                ${Number(order.total).toFixed(2)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-lab-primary">
                View →
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
