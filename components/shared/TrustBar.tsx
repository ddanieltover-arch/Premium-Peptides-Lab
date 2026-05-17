'use client';

import { motion } from 'framer-motion';
import { useMotionConfig } from '@/lib/motion';

const ITEMS = [
  { label: 'Purity tested', sub: 'HPLC release' },
  { label: 'COA available', sub: 'Per lot' },
  { label: 'ISO partner labs', sub: 'Third-party' },
  { label: 'Tracked shipping', sub: '24–48h window' },
  { label: 'Secure checkout', sub: 'Encrypted' },
] as const;

type Props = {
  className?: string;
};

export function TrustBar({ className }: Props) {
  const { reduce, fadeUp } = useMotionConfig();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
      }}
      role="list"
      aria-label="Trust signals"
    >
      <motion.div
        className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center"
        variants={{ hidden: {}, visible: {} }}
      >
        {ITEMS.map((item) => (
          <motion.div
            key={item.label}
            role="listitem"
            variants={fadeUp}
            className="flex min-w-[9.5rem] shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-lab-surface/60 px-3 py-2 backdrop-blur-sm"
          >
            <span className="text-lab-energy" aria-hidden>
              ✦
            </span>
            <span>
              <span className="block font-display text-xs text-white">{item.label}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{item.sub}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
