'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMotionConfig } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger direct motion children */
  stagger?: boolean;
  id?: string;
};

export function SectionReveal({ children, className, stagger = false, id }: Props) {
  const { stagger: staggerV, fadeUp, viewportSection } = useMotionConfig();

  return (
    <motion.div
      id={id}
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportSection}
      variants={stagger ? staggerV : fadeUp}
    >
      {children}
    </motion.div>
  );
}

/** Child of `SectionReveal` when `stagger` is enabled */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const { fadeUp } = useMotionConfig();

  return (
    <motion.div variants={fadeUp} className={cn(className)}>
      {children}
    </motion.div>
  );
}
