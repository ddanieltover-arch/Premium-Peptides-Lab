'use client';

import type { FeaturedProduct } from '@/lib/types/catalog';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/ui/section-header';
import { SectionReveal } from '@/components/shared/SectionReveal';

type Props = {
  products: FeaturedProduct[];
  added: Record<string, boolean>;
  onAddToCart: (id: string) => void;
};

export function FeaturedProductsSection({ products, added, onAddToCart }: Props) {
  return (
    <section className="relative border-t border-white/5 bg-lab-base py-20">
      <SectionReveal className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Featured SKUs"
            title={
              <>
                Validated lots, <span className="text-spectrum">transparent</span> release data
              </>
            }
          />
          <p className="max-w-md text-sm text-slate-400 md:pb-1">
            Live catalog from your Supabase database — featured and recent active products.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-sm text-slate-500">No active products in catalog.</p>
          ) : (
            products.map((p, idx) => (
              <ProductCard key={p.id} product={p} index={idx} added={!!added[p.id]} onAddToCart={onAddToCart} />
            ))
          )}
        </div>
      </SectionReveal>
    </section>
  );
}
