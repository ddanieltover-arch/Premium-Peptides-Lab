'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cart/store';
import { validatePromoCode } from '@/lib/promo/codes';
import { useToastStore } from '@/lib/toast/store';
import { cn } from '@/lib/cn';

const inputClass =
  'flex-1 rounded-xl border border-white/10 bg-lab-base/80 px-3 py-2 font-mono text-sm text-white uppercase outline-none placeholder:normal-case placeholder:text-slate-600 focus:border-lab-primary/50';

type Props = { subtotal: number; compact?: boolean };

export function PromoCodeField({ subtotal, compact }: Props) {
  const promo = useCartStore((s) => s.promo);
  const promoCode = useCartStore((s) => s.promoCode);
  const setPromo = useCartStore((s) => s.setPromo);
  const clearPromo = useCartStore((s) => s.clearPromo);
  const pushToast = useToastStore((s) => s.push);

  const [input, setInput] = useState(promoCode ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!promo) return;
    const check = validatePromoCode(promo.code, subtotal);
    if (!check.ok) clearPromo();
  }, [subtotal, promo, clearPromo]);

  const apply = (e?: FormEvent) => {
    e?.preventDefault();
    setError('');
    const result = validatePromoCode(input, subtotal);
    if (!result.ok) {
      setError(result.message);
      pushToast(result.message, 'error');
      return;
    }
    setPromo(result.promo, input);
    pushToast(`Promo applied: ${result.promo.label}`, 'success');
  };

  const remove = () => {
    clearPromo();
    setInput('');
    setError('');
    pushToast('Promo code removed', 'info');
  };

  return (
    <div className={cn(!compact && 'rounded-2xl border border-white/10 bg-lab-base/40 p-4')}>
      {!compact && (
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Promo code</p>
      )}
      {promo ? (
        <div className={cn('flex flex-wrap items-center justify-between gap-2', !compact && 'mt-3')}>
          <div>
            <p className="font-mono text-xs text-lab-mint">{promo.code}</p>
            <p className="text-xs text-slate-500">{promo.label}</p>
          </div>
          <button type="button" onClick={remove} className="text-xs text-lab-rose hover:underline">
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={apply} className={cn('flex gap-2', compact ? 'mt-0' : 'mt-3')}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. RESEARCH10"
            className={inputClass}
            aria-label="Promo code"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl border border-lab-primary/40 bg-lab-primary/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-lab-primary hover:bg-lab-primary/20"
          >
            Apply
          </button>
        </form>
      )}
      {error && !promo ? <p className="mt-2 text-xs text-lab-rose">{error}</p> : null}
      {!compact && !promo ? (
        <p className="mt-2 text-[10px] text-slate-600">Try RESEARCH10, LAB25, or FREESHIP</p>
      ) : null}
    </div>
  );
}
