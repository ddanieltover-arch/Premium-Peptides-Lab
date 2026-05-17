'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { LightningBolt } from '@/components/shared/LightningBolt';
import { ANNOUNCEMENT_MESSAGES } from '@/lib/data/navigation';
import { SITE_LINKS } from '@/lib/data/home-content';

const ROTATE_MS = 5500;

export function AnnouncementBar() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const message = ANNOUNCEMENT_MESSAGES[index];

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % ANNOUNCEMENT_MESSAGES.length);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(advance, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [advance, paused, reduce]);

  return (
    <motion.div
      className="border-b border-white/5 bg-lab-surface/80 text-center text-xs text-slate-400 backdrop-blur-md"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="mx-auto flex min-h-[2.75rem] max-w-4xl flex-wrap items-center justify-center gap-2 px-4 py-2.5">
        <span className="inline-flex items-center gap-1 font-mono text-lab-energy">
          <LightningBolt className="h-3.5 w-3.5" />
          <AnimatePresence mode="wait">
            <motion.span
              key={message.highlight}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              {message.highlight}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="hidden sm:inline text-slate-600">·</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={message.id}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.28 }}
            className="text-slate-400"
          >
            {message.text}
            <span className="hidden md:inline">
              {' '}
              · Contact:{' '}
              <a href={`mailto:${SITE_LINKS.email}`} className="text-lab-primary hover:text-white">
                {SITE_LINKS.email}
              </a>
            </span>
          </motion.span>
        </AnimatePresence>
        {!reduce && (
          <span className="ml-1 hidden items-center gap-1 sm:inline-flex" aria-hidden>
            {ANNOUNCEMENT_MESSAGES.map((m, i) => (
              <button
                key={m.id}
                type="button"
                className={`h-1 rounded-full transition-all ${
                  i === index ? 'w-3 bg-lab-primary' : 'w-1 bg-white/25 hover:bg-white/40'
                }`}
                onClick={() => setIndex(i)}
                aria-label={`Show announcement ${i + 1}`}
              />
            ))}
          </span>
        )}
      </p>
    </motion.div>
  );
}
