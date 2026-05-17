import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ADMIN_NOTIFICATION_EMAIL, emailFrom } from './constants';

export type SendResult =
  | { ok: true; id?: string }
  | { ok: false; skipped: true; reason: string };

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number(portRaw) : 465;
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim().replace(/\r$/, '').replace(/^\uFEFF/, '');
  return { host, port, user, pass };
}

export function isSmtpConfigured(): boolean {
  const { host, user, pass } = getSmtpConfig();
  return Boolean(host && user && pass);
}

function smtpTransportOptions(
  host: string,
  port: number,
  secure: boolean,
  user: string,
  pass: string,
): SMTPTransport.Options {
  const base: SMTPTransport.Options = {
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 25_000,
    greetingTimeout: 15_000,
  };
  if (port === 587) {
    return { ...base, secure: false, requireTLS: true };
  }
  return base;
}

function mapSmtpErrorForClient(err: unknown): Error {
  const any = err as { message?: string; responseCode?: number; code?: string };
  const msg = String(any?.message || err);
  const code =
    any?.responseCode ?? (typeof any?.code === 'string' && /^\d+$/.test(any.code) ? Number(any.code) : undefined);

  if (code === 535 || /535|invalid login|authentication failed|bad credentials|535-/i.test(msg)) {
    return new Error(
      'Our mail server rejected the login (SMTP). Verify SMTP_USER and SMTP_PASS in the deployment environment, or try port 587 with STARTTLS.',
    );
  }
  if (code === 534 || /certificate|TLS|SSL/i.test(msg)) {
    return new Error(
      'A secure connection to the mail server failed. Check SMTP_PORT and SMTP_SECURE (465 vs 587) for your provider.',
    );
  }
  return err instanceof Error ? err : new Error(msg);
}

export async function sendTransactionalEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  const { host, port, user, pass } = getSmtpConfig();
  if (!host || !user || !pass) {
    console.warn('[email] SMTP_HOST / SMTP_USER / SMTP_PASS not set — email skipped');
    return { ok: false, skipped: true, reason: 'missing_smtp' };
  }

  const secure =
    port === 587
      ? false
      : process.env.SMTP_SECURE !== 'false' && (port === 465 || process.env.SMTP_SECURE === 'true');

  const transporter = nodemailer.createTransport(smtpTransportOptions(host, port, secure, user, pass));

  try {
    const info = await transporter.sendMail({
      from: emailFrom(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    return { ok: true, id: info.messageId };
  } catch (err) {
    console.error('[email] sendMail failed:', err);
    throw mapSmtpErrorForClient(err);
  }
}

export async function sendAdminNotification(opts: { subject: string; html: string; replyTo?: string }) {
  return sendTransactionalEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
}
