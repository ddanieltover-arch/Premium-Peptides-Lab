import Image from 'next/image';
import Link from 'next/link';
import { LEGAL_FOOTER_LINKS } from '@/lib/data/legal';
import { catalogHref } from '@/lib/data/navigation';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-lab-base py-12 text-sm text-slate-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-white">
              <Image src="/brand-logo.png" alt="" fill className="object-cover" sizes="36px" />
            </span>
            <span className="font-display text-base text-slate-200">Premium Peptides Lab</span>
          </div>
          <p className="mt-4 max-w-sm text-xs leading-relaxed">
            premiumpeptideslab.online · Research-use analytical peptides. Verify suitability for your jurisdiction and
            institutional review requirements before acquisition.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            [
              { href: catalogHref('/products'), label: 'Catalog' },
              { href: catalogHref('/coa'), label: 'COA Library' },
              { href: catalogHref('/faq'), label: 'FAQ' },
            ],
            [
              { href: catalogHref('/shipping'), label: 'Shipping' },
              { href: catalogHref('/contact'), label: 'Contact' },
              { href: catalogHref('/about'), label: 'About' },
            ],
            [
              { href: catalogHref('/research'), label: 'Research' },
              { href: catalogHref('/peptide-calculator'), label: 'Calculator' },
              { href: catalogHref('/wishlist'), label: 'Wishlist' },
            ],
            LEGAL_FOOTER_LINKS.map((link) => ({
              href: catalogHref(link.href),
              label: link.label,
            })),
          ].map((col, i) => (
            <ul key={i} className="space-y-2 text-xs">
              {col.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/5 px-4 pt-8 text-center">
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
          {LEGAL_FOOTER_LINKS.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-4">
              {i > 0 ? <span className="text-slate-700" aria-hidden>·</span> : null}
              <Link href={catalogHref(link.href)} className="hover:text-slate-300">
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
        <p className="text-[11px] text-slate-600">
          For research purposes only. Not for human consumption, diagnostic, or clinical use. Premium Peptides Lab does
          not supply dosing or therapeutic guidance.
        </p>
      </div>
    </footer>
  );
}
