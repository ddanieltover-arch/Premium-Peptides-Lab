'use client';

import { motion } from 'framer-motion';
import { PILLARS } from '@/lib/data/home-content';
import { fadeUp, staggerVariants, useMotionConfig, viewportSection } from '@/lib/motion';

export function PillarsSection() {
  const { reduce } = useMotionConfig();
  const itemVariants = reduce ? fadeUp : fadeUp;
  const stagger = staggerVariants(reduce);

  return (
    <section className="border-t border-white/5 bg-lab-surface py-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportSection}
          transition={{ duration: reduce ? 0 : 0.5 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-rose">Why Premium Peptides Lab</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
            Built for principal investigators who treat peptides as{' '}
            <span className="text-spectrum">measurable variables</span>, not commodities.
          </h2>
        </motion.div>
        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSection}
          variants={stagger}
        >
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={itemVariants}
              whileHover={reduce ? undefined : { y: -4 }}
              className="rounded-2xl border border-white/10 bg-lab-elevated/40 p-6 backdrop-blur-sm"
            >
              <p className="font-display text-3xl text-lab-primary">{pillar.stat}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{pillar.statLabel}</p>
              <h3 className="mt-4 font-display text-lg text-white">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{pillar.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
