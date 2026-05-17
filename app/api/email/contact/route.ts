import { NextResponse } from 'next/server';
import { isSmtpConfigured, sendAdminNotification, sendTransactionalEmail } from '@/lib/email/send';
import { templateContactAdmin, templateContactAutoReplyCustomer } from '@/lib/email/templates';

const MAX_LEN = 8000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body.website) {
      return NextResponse.json({ ok: true });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required.' },
        { status: 400 },
      );
    }
    if (message.length > MAX_LEN) {
      return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json(
        {
          error:
            'Email is not configured on this server. Add SMTP_HOST, SMTP_USER, and SMTP_PASS to your environment, or use the mailto link on the contact page.',
          code: 'missing_smtp',
        },
        { status: 503 },
      );
    }

    const adminTpl = templateContactAdmin({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    });

    const firstName = name.split(/\s+/)[0] || name;
    const autoTpl = templateContactAutoReplyCustomer({ name: firstName });

    const [toAdmin, toCustomer] = await Promise.all([
      sendAdminNotification({
        subject: adminTpl.subject,
        html: adminTpl.html,
        replyTo: email,
      }),
      sendTransactionalEmail({
        to: email,
        subject: autoTpl.subject,
        html: autoTpl.html,
      }),
    ]);

    if (!toAdmin.ok && toAdmin.skipped) {
      return NextResponse.json({ error: 'Email delivery is unavailable.', code: 'missing_smtp' }, { status: 503 });
    }
    if (!toCustomer.ok && 'skipped' in toCustomer && toCustomer.skipped) {
      return NextResponse.json({ error: 'Email delivery is unavailable.', code: 'missing_smtp' }, { status: 503 });
    }

    return NextResponse.json({
      ok: true,
      delivered: true,
      admin: toAdmin,
      customer: toCustomer,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Server error';
    console.error('[contact-email]', e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
