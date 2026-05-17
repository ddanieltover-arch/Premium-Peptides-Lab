'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeSize = 'sm' | 'md';

function badgeSizeClasses(size: BadgeSize) {
  return size === 'sm'
    ? 'px-2 py-0.5 text-[9px]'
    : 'px-2.5 py-1 text-[10px]';
}

export type PurityBadgeProps = {
  value: string | number;
  suffix?: string;
  size?: BadgeSize;
  animated?: boolean;
  className?: string;
};

export function PurityBadge({ value, suffix = '% · HPLC', size = 'md', animated = false, className }: PurityBadgeProps) {
  const reduce = useReducedMotion();
  const label = typeof value === 'number' ? `≥${value}${suffix}` : value;

  const inner = (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-lab-mint/40 bg-lab-mint/15 font-mono font-medium uppercase tracking-wide text-lab-mint',
        badgeSizeClasses(size),
        animated && !reduce && 'shadow-[0_0_12px_rgba(52,211,153,0.25)]',
        className,
      )}
    >
      {label}
    </span>
  );

  if (!animated || reduce) return inner;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      {inner}
    </motion.span>
  );
}

export type TrustBadgeProps = {
  children: ReactNode;
  icon?: ReactNode;
  size?: BadgeSize;
  className?: string;
};

export function TrustBadge({ children, icon, size = 'md', className }: TrustBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 font-mono uppercase tracking-wider text-slate-300',
        badgeSizeClasses(size),
        className,
      )}
    >
      {icon ?? <span className="h-1.5 w-1.5 rounded-full bg-lab-mint shadow-[0_0_10px_#34D399]" aria-hidden />}
      {children}
    </span>
  );
}

export type CategoryBadgeProps = {
  children: ReactNode;
  href?: string;
  className?: string;
};

export function CategoryBadge({ children, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border border-lab-primary/30 bg-lab-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-lab-primary',
        className,
      )}
    >
      {children}
    </span>
  );
}

export type SaleBadgeProps = {
  children?: ReactNode;
  className?: string;
};

export function SaleBadge({ children = 'Sale', className }: SaleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border border-red-400/40 bg-gradient-to-r from-red-500/20 to-red-700/20 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-red-300',
        className,
      )}
    >
      {children}
    </span>
  );
}
