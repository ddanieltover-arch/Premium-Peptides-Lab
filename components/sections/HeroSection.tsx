'use client';

import { motion } from 'framer-motion';
import { LightningBolt } from '@/components/shared/LightningBolt';
import { OrbitingHelix } from '@/components/shared/OrbitingHelix';
import { Button } from '@/components/ui/button';
import { TrustBadge } from '@/components/ui/badge';
import { TAGLINE_WORDS } from '@/lib/data/home-content';
import { catalogHref } from '@/lib/data/navigation';
import { useMotionConfig } from '@/lib/motion';

export function HeroSection() {
  const { reduce, heroStagger, wordReveal, badgeReveal, fadeUp, tap, hoverLift } = useMotionConfig();

  return (
    <section className="relative overflow-hidden bg-mesh-dark pb-20 pt-10 md:pb-28 md:pt-14">
      <motion.div className="pointer-events-none absolute inset-0 bg-spectrum-radial" />
      <motion.div
        className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-[1.05fr_0.95fr]"
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.5 }}
      >
        <motion.div initial="hidden" animate="visible" variants={heroStagger}>
          <div className="flex flex-wrap gap-2">
            {['ISO partner labs', 'HPLC release', 'LC–MS identity'].map((b) => (
              <motion.span key={b} variants={badgeReveal}>
                <TrustBadge>{b}</TrustBadge>
              </motion.span>
            ))}
          </div>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.1] text-white md:text-5xl lg:text-6xl">
            {TAGLINE_WORDS.map((word) => (
              <motion.span key={word} variants={wordReveal} className="mr-[0.28em] inline-block">
                {word.includes('peptides') || word.includes('rigor') ? (
                  <span className="text-spectrum">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg"
          >
            Premium Peptides Lab supplies institution-grade amino-acid constructs with documented purity,
            orthogonal identity confirmation, and lot-specific certificates suitable for peer-reviewed protocols.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <motion.div whileHover={hoverLift()} whileTap={tap()}>
              <Button href={catalogHref('/products')} size="lg" rightIcon={<LightningBolt className="h-4 w-4" />}>
                Browse analytical catalog
              </Button>
            </motion.div>
            <motion.div whileHover={hoverLift(1.01)} whileTap={tap(0.99)}>
              <Button href={catalogHref('/coa')} variant="ghost" size="lg">
                Request COA exemplar
              </Button>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-3">
            {['Third-party tested', '≥99% target purity', 'HPLC release'].map((label) => (
              <motion.div
                key={label}
                whileHover={hoverLift(1.03)}
                className="flex items-center gap-2 rounded-full border border-lab-energy/25 bg-lab-energy/5 px-4 py-2 text-xs text-lab-energy"
              >
                <span>✦</span>
                {label}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <OrbitingHelix />
      </motion.div>
    </section>
  );
}
