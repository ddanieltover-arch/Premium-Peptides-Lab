import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="max-w-md text-sm text-slate-600">
        This admin route does not exist. Check the URL or return to the dashboard.
      </p>
      <Link
        href="/admin/dashboard"
        className="rounded-xl bg-lab-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
