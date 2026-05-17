'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/glass-panel';
import { LightningBolt } from './LightningBolt';

export function OrbitingHelix() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto h-[min(52vw,420px)] w-[min(92vw,520px)] md:h-[460px] md:w-[460px]"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-8 rounded-full border border-white/10"
        style={{ borderImage: 'linear-gradient(90deg, #4A9FE8, #34D399, #F472B6, #A78BFA) 1' }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 48, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-14 rounded-full border border-dashed border-white/15"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={reduce ? undefined : { duration: 36, repeat: Infinity, ease: 'linear' }}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 38;
        const x = 50 + r * Math.cos(angle);
        const y = 50 + r * Math.sin(angle);
        return (
          <motion.div
            key={i}
            className="absolute h-3 w-3 rounded-full bg-gradient-to-br from-lab-primary to-lab-violet shadow-glow"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            animate={reduce ? undefined : { scale: [1, 1.25, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.35, ease: 'easeInOut' }}
          />
        );
      })}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div whileHover={reduce ? undefined : { scale: 1.02 }}>
          <GlassPanel rounded="[2rem]" className="relative overflow-hidden p-8 shadow-glow">
            <motion.div
              className="absolute inset-0 bg-mesh-dark opacity-90"
              animate={reduce ? undefined : { opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="relative flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <LightningBolt className="h-8 w-8 text-lab-energy drop-shadow-glow-gold" />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-slate-400">
                DNA · ∞ · Molecular orbital
              </p>
              <p className="max-w-[240px] text-sm leading-relaxed text-slate-300">
                Batch-level traceability with identity confirmation by LC–MS on file for qualified catalog.
              </p>
            </motion.div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
