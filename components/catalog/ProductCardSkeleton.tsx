import { cn } from '@/lib/cn';

type Props = {
  className?: string;
};

export function ProductCardSkeleton({ className }: Props) {
  return (
    <div
      className={cn(
        'animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-lab-surface/40',
        className,
      )}
      aria-hidden
    >
      <div className="aspect-square bg-lab-elevated/60" />
      <div className="space-y-3 p-3 sm:p-5">
        <div className="h-4 w-3/4 rounded bg-lab-elevated/80" />
        <div className="h-3 w-full rounded bg-lab-elevated/50" />
        <div className="h-3 w-2/3 rounded bg-lab-elevated/50" />
        <div className="h-6 w-1/2 rounded bg-lab-elevated/70" />
        <div className="h-10 w-full rounded-xl bg-lab-elevated/60" />
      </div>
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
