'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ProductReviewSummary } from '@/lib/types/reviews';

type Props = {
  productName: string;
  summary: ProductReviewSummary;
};

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const full = Math.round(rating);
  const cls = size === 'lg' ? 'text-xl' : 'text-sm';
  return (
    <span className={`inline-flex gap-0.5 text-lab-energy ${cls}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? 'opacity-100' : 'opacity-25'}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ProductReviewsSection({ productName, summary }: Props) {
  const reduce = useReducedMotion();
  const { reviews, averageRating, count } = summary;

  if (count === 0) return null;

  return (
    <section className="border-t border-white/5 py-12" aria-labelledby="product-reviews-heading">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-mint">Institutional feedback</p>
            <h2 id="product-reviews-heading" className="mt-2 font-display text-2xl text-white md:text-3xl">
              Reviews for {productName}
            </h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-lab-surface/60 px-5 py-3">
            <div className="flex items-center gap-3">
              <Stars rating={averageRating} size="lg" />
              <div>
                <p className="font-display text-2xl text-white">{averageRating.toFixed(1)}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {count} verified review{count === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
        >
          {reviews.map((review) => (
            <motion.article
              key={review.id}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-lab-elevated/50 p-5"
            >
              <Stars rating={review.rating} />
              {review.title ? (
                <h3 className="mt-3 font-display text-sm text-white">{review.title}</h3>
              ) : null}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">&ldquo;{review.body}&rdquo;</p>
              <footer className="mt-4 border-t border-white/10 pt-4">
                <p className="text-sm font-medium text-slate-200">{review.authorName}</p>
                {review.authorTitle ? (
                  <p className="text-xs text-lab-primary">{review.authorTitle}</p>
                ) : null}
                {review.institution ? (
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {review.institution}
                  </p>
                ) : null}
                <p className="mt-1 text-[10px] text-slate-600">
                  {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </p>
              </footer>
            </motion.article>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-xs text-slate-600">
          Research-use only. Reviews reflect institutional purchasing experience; not medical advice.
        </p>
      </div>
    </section>
  );
}
