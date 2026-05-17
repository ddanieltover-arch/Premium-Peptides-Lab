import { SITE_EMAIL } from '@/lib/seo/site';
import { escapeHtml } from './escape';
import { emailShell } from './layout';

export function templateContactAdmin(opts: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { subject: string; html: string } {
  const inner = `
    <p style="margin:0 0 12px;font-family:system-ui,sans-serif;"><strong>From:</strong> ${escapeHtml(opts.name)} &lt;${escapeHtml(opts.email)}&gt;</p>
    ${opts.phone ? `<p style="margin:0 0 12px;font-family:system-ui,sans-serif;"><strong>Phone:</strong> ${escapeHtml(opts.phone)}</p>` : ''}
    <p style="margin:0 0 16px;font-family:system-ui,sans-serif;"><strong>Subject:</strong> ${escapeHtml(opts.subject)}</p>
    <div style="background:#f1f5f9;border-radius:10px;padding:18px;border-left:4px solid #4A9FE8;font-family:system-ui,sans-serif;font-size:14px;line-height:1.65;color:#334155;white-space:pre-wrap;">${escapeHtml(opts.message)}</div>
    <p style="margin:20px 0 0;font-size:12px;color:#64748b;font-family:system-ui,sans-serif;">Reply directly to this thread — customer Reply-To is set to their address.</p>
  `;

  return {
    subject: `[PPL Contact] ${opts.subject}`,
    html: emailShell({
      title: 'Website inquiry',
      preheader: opts.subject,
      innerHtml: inner,
      footerNote: 'Inbound contact form · Premium Peptides Lab',
    }),
  };
}

export function templateContactAutoReplyCustomer(opts: { name: string }): { subject: string; html: string } {
  const inner = `
    <p style="margin:0 0 16px;">Hi ${escapeHtml(opts.name)},</p>
    <p style="margin:0 0 16px;color:#475569;line-height:1.7;">Thanks for contacting Premium Peptides Lab. We’ve received your message and our team will respond as soon as possible — typically within one business day.</p>
    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.65;">For order questions, include your PPL- order number. COA requests should list product name and batch ID.</p>
    <p style="margin:24px 0 0;font-size:13px;color:#64748b;">— Premium Peptides Lab<br/><a href="mailto:${escapeHtml(SITE_EMAIL)}" style="color:#4A9FE8;">${escapeHtml(SITE_EMAIL)}</a></p>
  `;

  return {
    subject: 'We received your message',
    html: emailShell({
      title: 'Thank you',
      preheader: 'We’ll be in touch shortly.',
      innerHtml: inner,
    }),
  };
}
