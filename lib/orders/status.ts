const STATUS_STYLES: Record<string, string> = {
  PENDING: 'border-amber-500/40 bg-amber-500/15 text-amber-200',
  PROCESSING: 'border-blue-500/40 bg-blue-500/15 text-blue-200',
  SHIPPED: 'border-violet-500/40 bg-violet-500/15 text-violet-200',
  DELIVERED: 'border-lab-mint/40 bg-lab-mint/15 text-lab-mint',
  CANCELLED: 'border-white/20 bg-white/5 text-slate-400',
};

export function orderStatusLabel(status: string | null | undefined): string {
  return (status ?? 'PENDING').toUpperCase();
}

export function orderStatusClass(status: string | null | undefined): string {
  const key = orderStatusLabel(status);
  return STATUS_STYLES[key] ?? 'border-white/20 bg-white/5 text-slate-300';
}
