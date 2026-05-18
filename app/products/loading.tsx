import { ProductCardSkeletonGrid } from '@/components/catalog/ProductCardSkeleton';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';

export default function ProductsLoading() {
  return (
    <StorefrontChrome categories={[]}>
      <main className="border-t border-white/5 bg-lab-base pb-24">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 md:pt-14">
          <div className="h-3 w-32 animate-pulse rounded bg-lab-elevated/60" />
          <div className="mt-4 h-10 w-2/3 max-w-lg animate-pulse rounded bg-lab-elevated/70" />
          <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-lab-elevated/50" />
        </div>
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 h-4 w-48 animate-pulse rounded bg-lab-elevated/50" />
          <ProductCardSkeletonGrid count={8} />
        </div>
      </main>
    </StorefrontChrome>
  );
}
