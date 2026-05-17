'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMotionConfig } from '@/lib/motion';
import { cn } from '@/lib/cn';

type Props = {
  children: ReactNode;
  className?: string;
};

export function PageEnter({ children, className }: Props) {
  const { page } = useMotionConfig();

  return (
    <motion.div className={cn(className)} initial="hidden" animate="visible" variants={page}>
      {children}
    </motion.div>
  );
}
