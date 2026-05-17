'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/data/home-content';

export function TestimonialsSection() {
  const reduce = useReducedMotion();

  return (
    <section className="border-t border-white/5 bg-lab-base py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-mint">Peer narratives</p>
            <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">What investigators report back</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
            <span className="font-display text-2xl text-lab-energy">4.9</span>
            <span className="text-slate-500"> /5 · </span>
            aggregated across 2,400+ structured reviews
          </div>
        </motion.div>
        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-8%' }}
          variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.07 } } }}
        >
          {TESTIMONIALS.map((t) => (
            <motion.blockquote
              key={t.name}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              whileHover={reduce ? undefined : { y: -4 }}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-lab-surface/70 p-6 shadow-card backdrop-blur-lg"
            >
              <motion.div
                className="mb-4 flex gap-1 text-lab-energy"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {Array.from({ length: 5 }).map((_, s) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: s * 0.05 }}
                  >
                    ★
                  </motion.span>
                ))}
              </motion.div>
              <p className="flex-1 text-sm leading-relaxed text-slate-300">“{t.quote}”</p>
              <footer className="mt-6 border-t border-white/10 pt-4">
                <p className="font-display text-base text-white">{t.name}</p>
                <p className="text-xs text-lab-primary">{t.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{t.lab}</p>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
