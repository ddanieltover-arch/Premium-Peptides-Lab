'use client';

import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { SITE_LINKS } from '@/lib/data/home-content';

export function CtaBannerSection() {
  const [email, setEmail] = useState('');
  const [leadStatus, setLeadStatus] = useState<'idle' | 'ok'>('idle');

  const onEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLeadStatus('ok');
  };

  return (
    <section className="border-t border-white/5 bg-gradient-to-br from-lab-surface via-lab-base to-lab-elevated py-20">
      <motion.div
        className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-mesh-dark px-6 py-14 text-center shadow-glow md:px-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-lab-energy">Dispatch window</p>
        <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">
          Same-day fulfillment on orders confirmed before 14:00 local when inventory permits.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400">
          Join the institutional mailing list for lot-drop notifications, method updates, and changes to analytical
          panels—never promotional scarcity language, only technical deltas.
        </p>
        <form onSubmit={onEmailSubmit} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="pi.name@university.edu"
            className="flex-1 rounded-2xl border border-white/10 bg-lab-base/80 px-4 py-3.5 font-mono text-sm outline-none focus:border-lab-primary/50"
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-spectrum px-8 py-3.5 font-display text-sm font-semibold text-lab-base"
          >
            {leadStatus === 'ok' ? 'Subscribed' : 'Request updates'}
          </motion.button>
        </form>
        {leadStatus === 'ok' && (
          <p className="mt-3 text-xs text-lab-mint">Thank you. Wire this form to your ESP or CRM in production.</p>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs text-slate-500">
          <span>HPLC method sheets on qualified materials</span>
          <span>·</span>
          <span>Discreet export-compliant outer packaging</span>
          <span>·</span>
          <span>Dedicated technical inbox: {SITE_LINKS.email}</span>
        </div>
      </motion.div>
    </section>
  );
}
