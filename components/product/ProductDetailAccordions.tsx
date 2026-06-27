'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CoaViewerModal } from '@/components/coa/CoaViewerModal';
import { coaLibraryHref } from '@/lib/coa/href';
import type { ProductDetail } from '@/lib/types/catalog';

type Section = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  product: ProductDetail;
  /** When set (e.g. from `#coa`), opens the certificate section on load. */
  defaultOpenId?: string;
};

export function ProductDetailAccordions({ product, defaultOpenId }: Props) {
  const reduce = useReducedMotion();
  const [coaOpen, setCoaOpen] = useState(false);
  const sections: Section[] = [
    {
      id: 'description',
      title: 'Description',
      content: (
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-400">
          {product.description ||
            'Scientific profile for this construct is being updated in our analytical records.'}
        </p>
      ),
    },
    {
      id: 'applications',
      title: 'Research applications',
      content: (
        <p className="text-sm leading-relaxed text-slate-400">
          Suitable for in-vitro analytical method development, binding assays, and receptor pharmacology studies
          where a characterized reference standard is required. Consult your institutional biosafety officer for
          protocol suitability.
        </p>
      ),
    },
    {
      id: 'specifications',
      title: 'Specifications',
      content: (
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {[
            ['Molecular formula', product.molecularFormula],
            ['Molecular weight', product.molecularWeight],
            ['CAS number', product.casNumber],
            ['Sequence', product.sequence],
            ['Release purity', `≥${product.purity}% (HPLC)`],
            ['Format', 'Lyophilized solid'],
          ]
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <motion.div key={label} className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</dt>
                <dd className="mt-1 font-mono text-slate-200">{value}</dd>
              </motion.div>
            ))}
          {!product.molecularFormula && !product.casNumber && !product.sequence && (
            <p className="col-span-full text-sm text-slate-500">
              Extended specifications available on the certificate of analysis for this batch.
            </p>
          )}
        </dl>
      ),
    },
    {
      id: 'coa',
      title: 'Certificate of analysis',
      content: (
        <motion.div className="space-y-3 text-sm text-slate-400">
          <p>
            Each manufacturing batch is released with orthogonal HPLC identity confirmation and documented
            integrator reports suitable for QA submission packages.
          </p>
          {product.coaUrl ? (
            <button
              type="button"
              onClick={() => setCoaOpen(true)}
              className="inline-flex font-display text-lab-primary hover:text-white"
            >
              View COA Document
            </button>
          ) : (
            <a href={coaLibraryHref()} className="inline-flex font-display text-lab-primary hover:text-white">
              View COA library →
            </a>
          )}
        </motion.div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping & returns',
      content: (
        <p className="text-sm leading-relaxed text-slate-400">
          Cold-chain dispatch with desiccated primary containment. Domestic orders typically ship within 24–48 hours
          on business days. Returns are evaluated for temperature excursion or documented lot mismatch — contact
          support with your order number and batch ID.
        </p>
      ),
    },
  ];

  const [openId, setOpenId] = useState<string>(defaultOpenId ?? 'description');

  useEffect(() => {
    if (defaultOpenId) setOpenId(defaultOpenId);
  }, [defaultOpenId]);

  return (
    <>
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-lab-elevated/30">
      {sections.map((section) => {
        const open = openId === section.id;
        return (
          <div key={section.id} id={section.id === 'coa' ? 'coa' : undefined}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-5 py-4 text-left font-display text-sm text-white"
              onClick={() => setOpenId(open ? '' : section.id)}
              aria-expanded={open}
            >
              {section.title}
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }} className="text-slate-500">
                ▾
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/5 px-5 pb-5 pt-2">{section.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      </div>

      {product.coaUrl ? (
        <CoaViewerModal
          open={coaOpen}
          onClose={() => setCoaOpen(false)}
          url={product.coaUrl}
          productName={product.name}
        />
      ) : null}
    </>
  );
}
