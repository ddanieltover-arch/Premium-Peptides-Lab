'use client';

import { motion, useReducedMotion, useScroll } from 'framer-motion';

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[3px] origin-left bg-spectrum"
      style={{ scaleX: scrollYProgress }}
      aria-hidden
    />
  );
}
