export type PromoCodeDef =
  | { code: string; type: 'percent'; value: number; minSubtotal?: number; label?: string }
  | { code: string; type: 'fixed'; value: number; minSubtotal?: number; label?: string }
  | { code: string; type: 'free_shipping'; minSubtotal?: number; label?: string };

export type PromoApplication = {
  code: string;
  label: string;
  discountAmount: number;
  freeShipping: boolean;
};

export type PromoValidation =
  | { ok: true; promo: PromoApplication }
  | { ok: false; message: string };

/** Default research-lab promos — validated again at checkout. */
export const DEFAULT_PROMO_CODES: PromoCodeDef[] = [
  { code: 'RESEARCH10', type: 'percent', value: 10, minSubtotal: 500, label: '10% off orders $500+' },
  { code: 'LAB25', type: 'fixed', value: 25, minSubtotal: 1000, label: '$25 off orders $1000+' },
  { code: 'FREESHIP', type: 'free_shipping', minSubtotal: 400, label: 'Free standard shipping on orders $400+' },
];

function loadPromoDefs(): PromoCodeDef[] {
  const raw = process.env.PROMO_CODES_JSON;
  if (!raw?.trim()) return DEFAULT_PROMO_CODES;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PROMO_CODES;
    return parsed as PromoCodeDef[];
  } catch {
    return DEFAULT_PROMO_CODES;
  }
}

export function getPromoDefinitions(): PromoCodeDef[] {
  return loadPromoDefs();
}

function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

export function validatePromoCode(code: string | null | undefined, subtotal: number): PromoValidation {
  const normalized = normalizeCode(code ?? '');
  if (!normalized) return { ok: false, message: 'Enter a promo code.' };

  const def = getPromoDefinitions().find((p) => normalizeCode(p.code) === normalized);
  if (!def) return { ok: false, message: 'This code is not valid.' };

  const min = def.minSubtotal ?? 0;
  if (subtotal < min) {
    return {
      ok: false,
      message: `Minimum order $${min.toFixed(0)} required for this code.`,
    };
  }

  if (def.type === 'percent') {
    const discountAmount = Math.round(subtotal * (def.value / 100) * 100) / 100;
    return {
      ok: true,
      promo: {
        code: normalized,
        label: def.label ?? `${def.value}% off`,
        discountAmount,
        freeShipping: false,
      },
    };
  }

  if (def.type === 'fixed') {
    const discountAmount = Math.min(subtotal, Math.round(def.value * 100) / 100);
    return {
      ok: true,
      promo: {
        code: normalized,
        label: def.label ?? `$${def.value} off`,
        discountAmount,
        freeShipping: false,
      },
    };
  }

  return {
    ok: true,
    promo: {
      code: normalized,
      label: def.label ?? 'Free standard shipping',
      discountAmount: 0,
      freeShipping: true,
    },
  };
}
