'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 320;

export function BackToTopButton() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [reduce]);

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={scrollToTop}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 12,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      transition={{ duration: reduce ? 0 : 0.25 }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      className="fixed bottom-[calc(4.75rem+1.25rem+3.5rem+3.5rem)] left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-lab-primary/40 bg-lab-base/90 text-lab-primary shadow-glow backdrop-blur-xl lg:bottom-[calc(1.5rem+3.5rem)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  );
}
