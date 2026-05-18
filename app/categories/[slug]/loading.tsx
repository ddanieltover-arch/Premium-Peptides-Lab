import { ProductCardSkeletonGrid } from '@/components/catalog/ProductCardSkeleton';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';

export default function CategoryHubLoading() {
  return (
    <StorefrontChrome categories={[]}>
      <main className="border-t border-white/5 bg-lab-base pb-24">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8">
          <div className="h-8 w-48 animate-pulse rounded bg-lab-elevated/70" />
          <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-lab-elevated/50" />
        </div>
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 h-4 w-48 animate-pulse rounded bg-lab-elevated/50" />
          <ProductCardSkeletonGrid count={8} />
        </div>
      </main>
    </StorefrontChrome>
  );
}
