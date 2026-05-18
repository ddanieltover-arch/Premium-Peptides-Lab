'use client';

import { computeCartTotals } from '@/lib/cart/totals';
import { useCartStore } from '@/lib/cart/store';
import { cn } from '@/lib/cn';

type Props = {
  showShipping?: boolean;
  size?: 'sm' | 'md';
};

export function OrderTotalsSummary({ showShipping = false, size = 'md' }: Props) {
  const items = useCartStore((s) => s.items);
  const shippingMethod = useCartStore((s) => s.shippingMethod);
  const promo = useCartStore((s) => s.promo);
  const subtotal = useCartStore((s) => s.total());

  const totals = computeCartTotals({ subtotal, shippingMethod, promo });
  const text = size === 'sm' ? 'text-sm' : 'text-sm';

  if (items.length === 0) return null;

  const displayTotal = showShipping ? totals.total : totals.discountedSubtotal;

  return (
    <div className={cn('space-y-2', text, 'text-slate-400')}>
      <Row label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
      {totals.discount > 0 ? (
        <Row
          label={`Discount (${promo?.code})`}
          value={`−$${totals.discount.toFixed(2)}`}
          valueClassName="text-lab-mint"
        />
      ) : null}
      {promo?.freeShipping && totals.discount === 0 ? (
        <Row
          label={`Promo (${promo.code})`}
          value="Free standard shipping"
          valueClassName="text-lab-mint"
        />
      ) : null}
      {showShipping ? (
        <Row
          label="Shipping"
          value={totals.shippingCost === 0 ? 'Free' : `$${totals.shippingCost.toFixed(2)}`}
        />
      ) : null}
      <div className="flex justify-between border-t border-white/10 pt-3 font-display text-lg text-white">
        <span>Total</span>
        <span className="text-lab-primary">${displayTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={cn('text-white', valueClassName)}>{value}</span>
    </div>
  );
}

