'use client';

import { motion } from 'framer-motion';
import { CountUp } from '@/components/shared/CountUp';

type Props = { productCount: number };

export function QualityTrustSection({ productCount }: Props) {
  const purityDisplay = 99.4;
  const accountsDisplay = Math.max(1200, Math.round(productCount * 8));

  return (
    <section className="border-t border-white/5 bg-lab-surface py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-primary">Quality dossier</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">
            COA-first workflow: what you receive is what chromatographed.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Preview mirrors the PDF bundle tied to each lot: instrument method, acquisition time, peak integration,
            and reviewer sign-off.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {['GMP-adjacent suite', 'HPLC', 'LC–MS', 'qNMR (select)'].map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-white/10 bg-lab-base/70 px-3 py-4 text-center font-mono text-[10px] uppercase tracking-wider text-slate-300"
              >
                {c}
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-8">
            <div>
              <p className="font-display text-4xl text-spectrum">
                <CountUp end={purityDisplay} suffix="%" decimals={1} />
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">target release purity</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <p className="font-display text-4xl text-white">
                <CountUp end={productCount} suffix="+" decimals={0} />
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">active catalog SKUs</p>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel relative overflow-hidden rounded-3xl p-6 shadow-glow"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">COA · EXAMPLE ONLY</span>
            <span className="rounded-full border border-lab-energy/40 bg-lab-energy/10 px-3 py-1 text-xs text-lab-energy">
              Lot PPL-2409
            </span>
          </div>
          <motion.div
            className="space-y-4 rounded-2xl border border-white/10 bg-lab-base/80 p-4 font-mono text-[11px] text-slate-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <motion.div
              className="flex justify-between border-b border-white/5 pb-2"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span>Analyte</span>
              <span>BPC-157 Acetate</span>
            </motion.div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>HPLC purity</span>
              <span className="text-lab-mint">99.41%</span>
            </div>
            <motion.div className="mt-4 h-24 rounded-lg bg-gradient-to-br from-lab-primary/20 via-lab-mint/10 to-lab-violet/25 p-2">
              <div className="flex h-full items-end gap-0.5">
                {[28, 42, 56, 40, 64, 52, 48, 70, 60, 44].map((h, j) => (
                  <motion.div
                    key={j}
                    className="flex-1 rounded-t bg-gradient-to-t from-lab-primary to-lab-mint"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + j * 0.04, duration: 0.4 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
