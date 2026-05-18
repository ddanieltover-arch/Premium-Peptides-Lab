import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

type Props = {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
};

export function StarRating({ rating, count, size = 'sm', className }: Props) {
  const starClass = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.35;

  return (
    <div
      className={cn('inline-flex flex-wrap items-center gap-1.5', className)}
      aria-label={
        count != null ? `${rating} out of 5 stars, ${count} reviews` : `${rating} out of 5 stars`
      }
    >
      <span className="inline-flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < full || (i === full && hasHalf);
          return (
            <Star
              key={i}
              className={cn(
                starClass,
                filled ? 'fill-lab-energy text-lab-energy' : 'fill-transparent text-slate-600',
              )}
            />
          );
        })}
      </span>
      {count != null && count > 0 ? (
        <span className="font-mono text-[10px] text-slate-500 tabular-nums">({count})</span>
      ) : null}
    </div>
  );
}
