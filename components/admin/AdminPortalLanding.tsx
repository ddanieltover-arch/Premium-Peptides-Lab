import {
  LEGACY_ADMIN_DEV_ORIGIN,
  LEGACY_ADMIN_REPO_PATH,
  adminAppUrl,
} from '@/lib/admin/config';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import type { CategoryWithCount } from '@/lib/types/catalog';

type Props = {
  categories: CategoryWithCount[];
  requestedPath?: string;
};

export function AdminPortalLanding({ categories, requestedPath }: Props) {
  const path = requestedPath || '/admin/dashboard';
  const external = adminAppUrl(path);
  const localLegacy = `${LEGACY_ADMIN_DEV_ORIGIN}${path}`;
  const href = external ?? localLegacy;

  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Operations</p>
        <h1 className="mt-3 font-display text-3xl text-white md:text-4xl">Admin portal</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Order management, catalog edits, and analytics run in the legacy Precision Health storefront admin
          app. It uses the <strong className="font-normal text-slate-300">same Supabase project</strong> as this
          site—no duplicate database.
        </p>

        <div className="mt-8">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'primary' }))}
          >
            {external ? 'Open admin portal' : 'Open local admin (port 3000)'}
          </a>
        </div>

        {!external && (
          <>
            <div className="mt-6 rounded-2xl border border-white/10 bg-lab-surface/50 p-6 text-sm text-slate-400">
              <p className="font-mono text-xs uppercase tracking-wider text-lab-energy">Local development</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>
                  In a second terminal, start the legacy admin app:
                  <code className="mt-1 block rounded-lg border border-white/10 bg-lab-base/80 px-3 py-2 font-mono text-xs text-slate-300">
                    cd {LEGACY_ADMIN_REPO_PATH}
                    <br />
                    npm run dev -- -p 3000
                  </code>
                </li>
                <li>
                  Copy Supabase keys from this app&apos;s <code className="text-slate-300">.env.local</code> into{' '}
                  <code className="text-slate-300">{LEGACY_ADMIN_REPO_PATH}/.env.local</code>.
                </li>
                <li>Sign in with your Supabase admin user at the link above.</li>
              </ol>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-slate-500">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400">Production shortcut</p>
              <p className="mt-3">
                Set <code className="text-slate-300">NEXT_PUBLIC_ADMIN_APP_URL</code> to the host that serves{' '}
                <code className="text-slate-300">/admin</code> (e.g.{' '}
                <code className="text-slate-300">https://www.ph-research.store</code>). Visits to{' '}
                <code className="text-slate-300">/admin</code> on this domain will redirect automatically.
              </p>
            </div>
          </>
        )}

        <div className="mt-10">
          <Button href="/" variant="secondary">
            Back to storefront
          </Button>
        </div>
      </main>
    </StorefrontChrome>
  );
}
