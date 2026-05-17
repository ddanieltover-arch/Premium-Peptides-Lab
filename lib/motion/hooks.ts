'use client';

import { useReducedMotion } from 'framer-motion';
import {
  badgeReveal,
  cardWhileHover,
  fadeUpReduced,
  fadeUpVariants,
  heroStaggerContainer,
  pageVariantsFor,
  staggerVariants,
  viewportDefault,
  viewportSection,
  whileHoverLift,
  whileTapScale,
  wordRevealVariants,
} from '@/lib/motion/presets';

/** Central motion config — respects `prefers-reduced-motion`. */
export function useMotionConfig() {
  const reduce = useReducedMotion() === true;

  return {
    reduce,
    viewport: viewportDefault,
    viewportSection,
    page: pageVariantsFor(reduce),
    fadeUp: fadeUpVariants(reduce),
    fadeUpReduced,
    stagger: staggerVariants(reduce),
    heroStagger: heroStaggerContainer(reduce),
    wordReveal: wordRevealVariants(reduce),
    badgeReveal: reduce ? fadeUpReduced : badgeReveal,
    cardHover: cardWhileHover(reduce),
    tap: (scale?: number) => whileTapScale(reduce, scale),
    hoverLift: (scale?: number) => whileHoverLift(reduce, scale),
  };
}

export { useReducedMotion };
