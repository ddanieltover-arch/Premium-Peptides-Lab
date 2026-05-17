import Link from 'next/link';
import Image from 'next/image';
import type { CategoryWithCount } from '@/lib/types/catalog';
import { ContactForm } from '@/components/contact/ContactForm';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';
import { Button } from '@/components/ui/button';
import { CONTACT_CHANNELS, CONTACT_TIPS } from '@/lib/data/contact';
import { catalogHref } from '@/lib/data/navigation';

type Props = { categories: CategoryWithCount[] };

export function ContactPageClient({ categories }: Props) {
  return (
    <StorefrontChrome categories={categories}>
      <main id="main-content">
        <section className="border-b border-white/10 bg-mesh-dark py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-violet">Support</p>
            <h1 className="mt-3 font-display text-3xl text-white md:text-5xl">Contact us</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              Order status, batch verification, institutional onboarding, and catalog questions—our technical support
              team is here to help.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl border border-white/10 shadow-glow">
            <Image
              src="/brand-logo.png"
              alt="Premium Peptides Lab"
              fill
              className="object-cover opacity-40"
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-lab-base via-lab-base/40 to-transparent" />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {CONTACT_CHANNELS.map((channel) => (
              <div
                key={channel.id}
                className="rounded-2xl border border-white/10 bg-lab-elevated/40 p-5 backdrop-blur-sm"
              >
                <h2 className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{channel.title}</h2>
                {channel.href ? (
                  <a href={channel.href} className="mt-2 block text-sm text-lab-primary hover:text-white">
                    {channel.value}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-slate-300">{channel.value}</p>
                )}
              </div>
            ))}
          </div>

          <ContactForm />

          <div className="mt-10 rounded-2xl border border-white/10 bg-lab-surface/50 p-6 md:p-8">
            <h2 className="font-display text-lg text-white">Before you contact us</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {CONTACT_TIPS.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="text-lab-primary">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={catalogHref('/faq')} variant="secondary" size="md">
                Visit FAQ
              </Button>
              <Link
                href={catalogHref('/shipping')}
                className="inline-flex items-center rounded-2xl border border-white/10 px-5 py-2.5 font-display text-sm text-slate-300 hover:border-lab-primary/40 hover:text-white"
              >
                Shipping info
              </Link>
            </div>
          </div>
        </section>
      </main>
    </StorefrontChrome>
  );
}
