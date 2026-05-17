export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'credit-card': 'Credit Card',
  bitcoin: 'Bitcoin',
  'apple-cash': 'Apple Cash',
  chime: 'Chime',
  cashapp: 'CashApp',
  zelle: 'Zelle',
  'bank-transfer': 'Bank Transfer',
};

export const PAYMENT_METHOD_IDS = Object.keys(PAYMENT_METHOD_LABELS);

export function paymentMethodLabel(id: string | null | undefined): string | null {
  if (!id?.trim()) return null;
  return PAYMENT_METHOD_LABELS[id] ?? id;
}
