export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'credit-card': 'Credit card',
  bitcoin: 'Bitcoin',
  'apple-cash': 'Apple Cash',
  chime: 'Chime',
  cashapp: 'Cash App',
  zelle: 'Zelle',
  'bank-transfer': 'Bank transfer',
};

export function paymentMethodLabel(id: string | null | undefined): string {
  if (!id?.trim()) return 'Selected at checkout';
  return PAYMENT_METHOD_LABELS[id] ?? id;
}

export function shippingMethodLabel(id: string | null | undefined): string {
  if (id === 'express') return 'Priority express (1–2 business days)';
  return 'Standard (3–5 business days)';
}
