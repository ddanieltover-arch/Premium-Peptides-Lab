import { cn } from '@/lib/cn';

type Props = {
  label: string;
  lowStock?: boolean;
  outOfStock?: boolean;
  className?: string;
};

export function StockBadge({ label, lowStock, outOfStock, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wide',
        outOfStock && 'border-red-400/40 bg-red-500/15 text-red-300',
        lowStock && !outOfStock && 'border-amber-400/40 bg-amber-500/15 text-amber-200',
        !lowStock && !outOfStock && 'border-white/15 bg-white/10 text-slate-300',
        className,
      )}
    >
      {label}
    </span>
  );
}
