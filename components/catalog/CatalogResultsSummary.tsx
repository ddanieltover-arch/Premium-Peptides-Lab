type Props = {
  page: number;
  pageSize: number;
  total: number;
  showingCount: number;
};

export function CatalogResultsSummary({ page, pageSize, total, showingCount }: Props) {
  if (total === 0) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Showing 0 products</p>
    );
  }

  const start = (page - 1) * pageSize + 1;
  const end = (page - 1) * pageSize + showingCount;

  return (
    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
      Showing{' '}
      <span className="text-slate-300">
        {start}–{end}
      </span>{' '}
      of <span className="text-slate-300">{total}</span> product{total === 1 ? '' : 's'}
    </p>
  );
}
