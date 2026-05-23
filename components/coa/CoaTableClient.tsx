'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { coaProductHref } from '@/lib/coa/href';
import type { CoaEntry } from '@/lib/types/coa';

const docLinkClass =
  'font-mono text-[10px] uppercase tracking-wider text-lab-primary hover:text-white';

function formatMonthYear(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

type Props = { entries: CoaEntry[] };

export function CoaTableClient({ entries }: Props) {
  const [searchText, setSearchText] = useState('');
  const [batchText, setBatchText] = useState('');

  const filtered = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    const batch = batchText.trim().toUpperCase();
    return entries.filter((entry) => {
      const matchSearch =
        !search ||
        entry.productName.toLowerCase().includes(search) ||
        entry.productSlug.toLowerCase().includes(search);
      const matchBatch = !batch || entry.batchId.includes(batch);
      return matchSearch && matchBatch;
    });
  }, [entries, searchText, batchText]);

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-lab-base/80 px-3 py-2.5 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-lab-primary/50';

  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by product name…"
          className={inputClass}
          aria-label="Search COA by product"
        />
        <input
          value={batchText}
          onChange={(e) => setBatchText(e.target.value)}
          placeholder="Filter by batch ID (e.g. PPL-2409)…"
          className={inputClass}
          aria-label="Filter COA by batch"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-lab-elevated/80">
            <tr>
              {['Product', 'Batch ID', 'Purity', 'Method', 'Status', 'Updated', 'Document'].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-lab-surface/40">
            {filtered.map((entry) => (
              <tr key={`${entry.productSlug}-${entry.batchId}`} className="transition hover:bg-white/[0.03]">
                <td className="px-4 py-3.5 font-display text-white">
                  <Link
                    href={coaProductHref(entry.productSlug)}
                    className="hover:text-lab-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-primary"
                  >
                    {entry.productName}
                  </Link>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-slate-400">{entry.batchId}</td>
                <td className="px-4 py-3.5 font-mono text-lab-mint">{entry.purity}</td>
                <td className="px-4 py-3.5 text-slate-400">{entry.method}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full border border-lab-mint/30 bg-lab-mint/10 px-2.5 py-0.5 font-mono text-[10px] uppercase text-lab-mint">
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-500">{formatMonthYear(entry.updatedAt)}</td>
                <td className="px-4 py-3.5">
                  <Link href={coaProductHref(entry.productSlug)} className={docLinkClass}>
                    Open COA
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No records matched your filters. Try another product name or batch ID.</p>
      ) : null}
    </>
  );
}
