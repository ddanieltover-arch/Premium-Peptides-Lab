import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  phase?: number;
};

export function AdminPhasePlaceholder({ title, description, phase = 2 }: Props) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-mono text-xs uppercase tracking-wider text-primary">Phase {phase}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
        <p className="mt-6 text-sm text-slate-500">
          Orders and dashboard are live on this domain. Catalog and CRM screens will follow in the next port phase.
        </p>
        <Link
          href="/admin/orders"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Manage orders
        </Link>
      </div>
    </div>
  );
}
