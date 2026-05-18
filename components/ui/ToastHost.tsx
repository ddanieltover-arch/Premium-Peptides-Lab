'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useToastStore } from '@/lib/toast/store';
import { cn } from '@/lib/cn';

const AUTO_DISMISS_MS = 4200;

export function ToastHost() {
  const reduce = useReducedMotion();
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <ToastPortal>
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            reduce={!!reduce}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </ToastPortal>
  );
}

function ToastItem({
  toast,
  reduce,
  onDismiss,
}: {
  toast: { id: string; message: string; type: 'success' | 'error' | 'info' };
  reduce: boolean;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(t);
  }, [onDismiss, reduce]);

  return (
    <motion.div
      layout
      role="status"
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
      className={cn(
        'pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-glow backdrop-blur-xl',
        toast.type === 'success' && 'border-lab-mint/30 bg-lab-surface/95 text-white',
        toast.type === 'error' && 'border-lab-rose/40 bg-lab-surface/95 text-white',
        toast.type === 'info' && 'border-lab-primary/30 bg-lab-surface/95 text-white',
      )}
    >
      <span className="mt-0.5 text-lg leading-none" aria-hidden>
        {toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}
      </span>
      <p className="flex-1 text-sm leading-snug">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
        aria-label="Dismiss"
      >
        ×
      </button>
    </motion.div>
  );
}

function ToastPortal({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-none fixed bottom-20 right-4 z-[400] flex flex-col gap-2 md:bottom-6 md:right-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {children}
    </div>
  );
}
