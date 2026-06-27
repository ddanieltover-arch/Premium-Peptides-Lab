'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  url: string;
  productName: string;
};

function isPdfUrl(url: string): boolean {
  try {
    return new URL(url).pathname.toLowerCase().endsWith('.pdf');
  } catch {
    return url.toLowerCase().includes('.pdf');
  }
}

export function CoaViewerModal({ open, onClose, url, productName }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const pdf = isPdfUrl(url);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[500] bg-lab-base/85 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close COA viewer"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="coa-viewer-title"
            className="fixed inset-3 z-[510] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-lab-surface shadow-card sm:inset-6 md:inset-10 lg:inset-16"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id="coa-viewer-title" className="font-display text-lg text-white">
                  Certificate of Analysis
                </h2>
                <p className="mt-1 truncate text-sm text-slate-400">{productName}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden rounded-xl border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-slate-300 transition hover:border-lab-primary/40 hover:text-white sm:inline-flex"
                >
                  Open in new tab
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-auto bg-lab-base/40 p-2 sm:p-4">
              {pdf ? (
                <iframe
                  src={url}
                  title={`COA for ${productName}`}
                  className="h-full min-h-[60vh] w-full rounded-xl border border-white/5 bg-white"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={url}
                  alt={`COA for ${productName}`}
                  className="mx-auto block max-w-full rounded-xl border border-white/5"
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
