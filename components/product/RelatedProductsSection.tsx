'use client';

import { motion } from 'framer-motion';
import type { FeaturedProduct } from '@/lib/types/catalog';
import { ProductCard } from '@/components/product/ProductCard';

type Props = {
  products: FeaturedProduct[];
  added: Record<string, boolean>;
  onAddToCart: (id: string) => void;
};

export function RelatedProductsSection({ products, added, onAddToCart }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-white/5 bg-lab-base py-16">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Related constructs</p>
          <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">From the same research vector</h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              added={!!added[product.id]}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
