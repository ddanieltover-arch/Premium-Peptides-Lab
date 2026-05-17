'use client';

import { FormEvent, useState } from 'react';
import { CONTACT_SUBJECTS } from '@/lib/data/contact';
import { SITE_EMAIL } from '@/lib/seo/site';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-lab-base/80 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-lab-primary/50';

function buildMailtoUrl(opts: {
  name: string;
  email: string;
  phone: string;
  subjectLabel: string;
  message: string;
}) {
  const lines = [
    `Name: ${opts.name}`,
    `Email: ${opts.email}`,
    opts.phone ? `Phone: ${opts.phone}` : null,
    '',
    opts.message,
  ].filter(Boolean);

  return `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(`[${opts.subjectLabel}] Website contact`)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subjectKey, setSubjectKey] = useState('order');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [usedMailtoFallback, setUsedMailtoFallback] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (website) return;

    const subjectLabel = CONTACT_SUBJECTS.find((s) => s.value === subjectKey)?.label ?? 'Inquiry';
    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: `[${subjectLabel}] Website contact`,
      message: message.trim(),
      website,
    };

    setStatus('sending');

    try {
      const res = await fetch('/api/email/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; code?: string };

      if (res.status === 503 && data.code === 'missing_smtp') {
        window.location.href = buildMailtoUrl({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          subjectLabel,
          message: payload.message,
        });
        setUsedMailtoFallback(true);
        setStatus('success');
        return;
      }

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.');
        return;
      }

      setUsedMailtoFallback(false);
      setStatus('success');
      setMessage('');
    } catch {
      setStatus('error');
      setErrorMsg(`Network error. Email us directly at ${SITE_EMAIL}.`);
    }
  }

  if (status === 'success') {
    return (
      <div className="mt-10 rounded-2xl border border-lab-mint/30 bg-lab-mint/10 p-8 text-center">
        <p className="font-display text-lg text-white">
          {usedMailtoFallback ? 'Opening your email client' : 'Message sent'}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {usedMailtoFallback ? (
            <>
              SMTP is not configured on this server, so we opened your mail app instead. You can also write to{' '}
              <a href={`mailto:${SITE_EMAIL}`} className="text-lab-primary hover:text-white">
                {SITE_EMAIL}
              </a>
              .
            </>
          ) : (
            <>
              Thanks — we’ve notified our team and sent a confirmation to your inbox. We typically reply within one
              business day.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setUsedMailtoFallback(false);
            setName('');
            setEmail('');
            setPhone('');
            setSubjectKey('order');
          }}
          className="mt-6 rounded-xl border border-white/15 px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-slate-300 hover:text-white"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-lab-elevated/40 p-6 sm:p-8"
    >
      <div>
        <h2 className="font-display text-lg text-white">Send a message</h2>
        <p className="mt-1 text-sm text-slate-400">
          Required fields are marked with <span className="text-lab-energy">*</span>. We typically reply within one
          business day.
        </p>
      </div>

      <label className="hidden" aria-hidden="true">
        <span>Website</span>
        <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Name <span className="text-lab-energy">*</span>
          </label>
          <input id="contact-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Email <span className="text-lab-energy">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Phone <span className="text-slate-600">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-topic" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
            Topic <span className="text-lab-energy">*</span>
          </label>
          <select
            id="contact-topic"
            value={subjectKey}
            onChange={(e) => setSubjectKey(e.target.value)}
            className={inputClass}
          >
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
          Message <span className="text-lab-energy">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Include order number or batch ID if relevant."
          className={`${inputClass} min-h-[140px] resize-y`}
        />
      </div>

      {errorMsg ? (
        <p className="text-sm text-lab-energy" role="alert">
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-xl bg-spectrum px-6 py-3 font-display text-sm font-semibold text-lab-base transition hover:opacity-90 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Submit message'}
      </button>
    </form>
  );
}
