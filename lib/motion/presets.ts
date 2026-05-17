import type { Transition, Variants } from 'framer-motion';
import { motion as motionTokens } from '@/lib/design-system';

export const EASE_OUT_EXPO = motionTokens.pageTransition.ease;
export const DURATION_PAGE = motionTokens.pageTransition.duration;
export const HERO_STAGGER_CHILD = motionTokens.heroStaggerMs / 1000;
export const HERO_DELAY_CHILD = 0.08;

/** Standard in-view trigger — sections */
export const viewportSection = { once: true, margin: '-10%' } as const;

/** Slightly earlier trigger — cards / grids */
export const viewportDefault = { once: true, margin: '-8%' } as const;

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_PAGE, ease: EASE_OUT_EXPO },
  },
};

export const pageVariantsReduced: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export const fadeUpReduced: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const fadeUpSubtle: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerContainerReduced: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0, delayChildren: 0 } },
};

export function heroStaggerContainer(reduce: boolean): Variants {
  if (reduce) return staggerContainerReduced;
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: HERO_STAGGER_CHILD, delayChildren: HERO_DELAY_CHILD },
    },
  };
}

export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
};

export const badgeReveal: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT_EXPO },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE_OUT_EXPO },
  },
};

export const cardHover = { y: -4, scale: 1.01 };

export const cardHoverTransition: Transition = {
  duration: 0.3,
  ease: EASE_OUT_EXPO,
};

export const imageZoomHover = { scale: 1.06 };

export const imageZoomTransition: Transition = { duration: 0.45, ease: EASE_OUT_EXPO };

export function variantsFor(reduce: boolean, full: Variants, reduced: Variants = fadeUpReduced): Variants {
  return reduce ? reduced : full;
}

export function fadeUpVariants(reduce: boolean): Variants {
  return variantsFor(reduce, fadeUp);
}

export function pageVariantsFor(reduce: boolean): Variants {
  return variantsFor(reduce, pageVariants, pageVariantsReduced);
}

export function staggerVariants(reduce: boolean): Variants {
  return variantsFor(reduce, staggerContainer, staggerContainerReduced);
}

export function wordRevealVariants(reduce: boolean): Variants {
  return variantsFor(reduce, wordReveal, fadeUpReduced);
}

export function cardWhileHover(reduce: boolean) {
  return reduce ? undefined : cardHover;
}

export function whileTapScale(reduce: boolean, scale = 0.98) {
  return reduce ? undefined : { scale };
}

export function whileHoverLift(reduce: boolean, scale = 1.02) {
  return reduce ? undefined : { scale };
}

export function transitionDelay(reduce: boolean, index: number, step = 0.08) {
  return reduce ? 0 : index * step;
}
