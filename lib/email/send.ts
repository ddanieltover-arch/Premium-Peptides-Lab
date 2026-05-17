import { Resend } from 'resend';
import { ADMIN_NOTIFICATION_EMAIL, emailFrom } from './constants';
import { getEmailLogoAttachment } from './logo';

export type SendResult =
  | { ok: true; id?: string }
  | { ok: false; skipped: true; reason: string };

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/** @deprecated Use isEmailConfigured */
export const isSmtpConfigured = isEmailConfigured;

function normalizeRecipients(to: string | string[]): string[] {
  const list = Array.isArray(to) ? to : [to];
  return list.map((addr) => addr.trim()).filter(Boolean);
}

function mapResendError(err: unknown): Error {
  const msg =
    err && typeof err === 'object' && 'message' in err
      ? String((err as { message: string }).message)
      : err instanceof Error
        ? err.message
        : String(err);

  if (/invalid.*from|domain.*not verified|not authorized/i.test(msg)) {
    return new Error(
      'The sender address is not verified in Resend. Set EMAIL_FROM to an address on your verified domain.',
    );
  }
  if (/api key|unauthorized|401/i.test(msg)) {
    return new Error('Resend API key is missing or invalid. Check RESEND_API_KEY in your environment.');
  }
  return err instanceof Error ? err : new Error(msg);
}

export async function sendTransactionalEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  const resend = getResendClient();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — email skipped');
    return { ok: false, skipped: true, reason: 'missing_resend' };
  }

  const to = normalizeRecipients(opts.to);
  if (to.length === 0) {
    return { ok: false, skipped: true, reason: 'no_recipients' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom(),
      to,
      subject: opts.subject,
      html: opts.html,
      attachments: [getEmailLogoAttachment()],
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });

    if (error) {
      console.error('[email] Resend error:', error);
      throw mapResendError(error);
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    console.error('[email] send failed:', err);
    throw mapResendError(err);
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
