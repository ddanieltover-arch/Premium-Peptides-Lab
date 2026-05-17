import { escapeHtml } from './escape';
import { emailTheme as t } from './theme';

export function emailParagraph(html: string, opts?: { muted?: boolean; marginBottom?: number }): string {
  const color = opts?.muted ? t.textSecondary : t.text;
  const mb = opts?.marginBottom ?? 16;
  return `<p style="margin:0 0 ${mb}px;font-family:${t.fontSans};font-size:15px;line-height:1.65;color:${color};">${html}</p>`;
}

export function emailGreeting(name: string): string {
  return emailParagraph(`Hi ${escapeHtml(name)},`);
}

export function emailButton(href: string, label: string): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px auto 8px;">
      <tr>
        <td style="border-radius:10px;background:linear-gradient(135deg,${t.deep} 0%,${t.primary} 55%,${t.mint} 100%);">
          <a href="${safeHref}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:${t.fontSans};font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
            ${safeLabel}
          </a>
        </td>
      </tr>
    </table>`;
}

export function emailBadge(label: string, variant: 'primary' | 'mint' | 'energy' = 'primary'): string {
  const styles = {
    primary: { bg: 'rgba(74,159,232,0.12)', border: 'rgba(74,159,232,0.35)', color: t.primaryDark },
    mint: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)', color: t.successText },
    energy: { bg: 'rgba(245,200,66,0.15)', border: 'rgba(245,200,66,0.4)', color: t.warnText },
  }[variant];
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;border:1px solid ${styles.border};background:${styles.bg};font-family:${t.fontMono};font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${styles.color};">${escapeHtml(label)}</span>`;
}

export function emailPanel(
  rows: Array<{ label: string; value: string; highlight?: boolean }>,
  opts?: { title?: string },
): string {
  const titleRow = opts?.title
    ? `<p style="margin:0 0 14px;font-family:${t.fontMono};font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:${t.muted};">${escapeHtml(opts.title)}</p>`
  : '';

  const body = rows
    .map((row) => {
      const valueColor = row.highlight ? t.primaryDark : t.text;
      const valueWeight = row.highlight ? '700' : '500';
      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${t.border};font-family:${t.fontSans};font-size:13px;color:${t.muted};vertical-align:top;width:38%;">${escapeHtml(row.label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid ${t.border};font-family:${t.fontSans};font-size:14px;font-weight:${valueWeight};color:${valueColor};text-align:right;vertical-align:top;">${row.value}</td>
        </tr>`;
    })
    .join('');

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:${t.surface};border-radius:${t.radius};border:1px solid ${t.border};">
      <tr>
        <td style="padding:20px 22px;">
          ${titleRow}
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${body}</table>
        </td>
      </tr>
    </table>`;
}

export function emailHeroOrderNumber(orderNumber: string): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:linear-gradient(135deg,${t.deep} 0%,#1a2332 100%);border-radius:${t.radiusLg};overflow:hidden;">
      <tr>
        <td style="padding:24px 26px;text-align:center;">
          <p style="margin:0 0 8px;font-family:${t.fontMono};font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.55);">Order reference</p>
          <p style="margin:0;font-family:${t.fontSans};font-size:26px;font-weight:700;letter-spacing:0.04em;color:#ffffff;">${escapeHtml(orderNumber)}</p>
        </td>
      </tr>
    </table>`;
}

export type OrderLineEmail = { name: string; quantity: number; unitPrice: number };

export function emailOrderLinesTable(
  lines: OrderLineEmail[],
  totals: { subtotal: number; shipping: number; total: number; shippingLabel?: string },
): string {
  const money = (n: number) => `$${n.toFixed(2)}`;

  const rows = lines
    .map(
      (line, i) => `
      <tr style="background:${i % 2 === 0 ? t.card : t.surface};">
        <td style="padding:12px 14px;font-family:${t.fontSans};font-size:14px;color:${t.text};border-bottom:1px solid ${t.border};">${escapeHtml(line.name)}</td>
        <td style="padding:12px 10px;font-family:${t.fontMono};font-size:13px;color:${t.muted};text-align:center;border-bottom:1px solid ${t.border};">${line.quantity}</td>
        <td style="padding:12px 14px;font-family:${t.fontMono};font-size:13px;color:${t.textSecondary};text-align:right;border-bottom:1px solid ${t.border};">${money(line.unitPrice)}</td>
        <td style="padding:12px 14px;font-family:${t.fontSans};font-size:14px;font-weight:600;color:${t.text};text-align:right;border-bottom:1px solid ${t.border};">${money(line.unitPrice * line.quantity)}</td>
      </tr>`,
    )
    .join('');

  const shipLabel = totals.shippingLabel ?? 'Shipping';
  const shippingDisplay =
    totals.shipping <= 0 ? `<span style="color:${t.successText};">Complimentary</span>` : money(totals.shipping);

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border:1px solid ${t.border};border-radius:${t.radius};overflow:hidden;">
      <thead>
        <tr style="background:${t.deep};">
          <th align="left" style="padding:12px 14px;font-family:${t.fontMono};font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Item</th>
          <th align="center" style="padding:12px 10px;font-family:${t.fontMono};font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Qty</th>
          <th align="right" style="padding:12px 14px;font-family:${t.fontMono};font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Unit</th>
          <th align="right" style="padding:12px 14px;font-family:${t.fontMono};font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Line</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:14px 14px 6px;font-family:${t.fontSans};font-size:13px;color:${t.muted};text-align:right;">Subtotal</td>
          <td style="padding:14px 14px 6px;font-family:${t.fontMono};font-size:13px;color:${t.text};text-align:right;">${money(totals.subtotal)}</td>
        </tr>
        <tr>
          <td colspan="3" style="padding:6px 14px;font-family:${t.fontSans};font-size:13px;color:${t.muted};text-align:right;">${escapeHtml(shipLabel)}</td>
          <td style="padding:6px 14px;font-family:${t.fontMono};font-size:13px;text-align:right;">${shippingDisplay}</td>
        </tr>
        <tr style="background:${t.surface};">
          <td colspan="3" style="padding:12px 14px;font-family:${t.fontSans};font-size:15px;font-weight:700;color:${t.text};text-align:right;">Total</td>
          <td style="padding:12px 14px;font-family:${t.fontSans};font-size:18px;font-weight:700;color:${t.primaryDark};text-align:right;">${money(totals.total)}</td>
        </tr>
      </tfoot>
    </table>`;
}

export function emailAddressBlock(addr: {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}): string {
  const lines = [
    addr.fullName,
    addr.address,
    `${addr.city}, ${addr.state} ${addr.zip}`,
    addr.country,
  ]
    .filter(Boolean)
    .map((l) => escapeHtml(l))
    .join('<br/>');

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border-radius:${t.radius};border:1px solid ${t.border};">
      <tr>
        <td style="padding:18px 20px;background:${t.card};">
          <p style="margin:0 0 8px;font-family:${t.fontMono};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${t.muted};">Ship to</p>
          <p style="margin:0;font-family:${t.fontSans};font-size:14px;line-height:1.6;color:${t.text};">${lines}</p>
        </td>
      </tr>
    </table>`;
}

export function emailQuoteBlock(text: string): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:16px 18px;border-left:4px solid ${t.primary};background:${t.surface};border-radius:0 ${t.radius} ${t.radius} 0;">
          <p style="margin:0;font-family:${t.fontSans};font-size:14px;line-height:1.65;color:${t.textSecondary};white-space:pre-wrap;">${escapeHtml(text)}</p>
        </td>
      </tr>
    </table>`;
}

export function emailNotice(
  title: string,
  body: string,
  variant: 'ruo' | 'info' = 'ruo',
): string {
  const bg = variant === 'ruo' ? t.warnBg : t.surface;
  const border = variant === 'ruo' ? t.warnBorder : t.border;
  const titleColor = variant === 'ruo' ? t.warnText : t.primaryDark;
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 0;">
      <tr>
        <td style="padding:16px 18px;background:${bg};border:1px solid ${border};border-radius:${t.radius};">
          <p style="margin:0 0 6px;font-family:${t.fontMono};font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:${titleColor};">${escapeHtml(title)}</p>
          <p style="margin:0;font-family:${t.fontSans};font-size:12px;line-height:1.6;color:${t.textSecondary};">${escapeHtml(body)}</p>
        </td>
      </tr>
    </table>`;
}

export function emailDivider(): string {
  return `<hr style="margin:28px 0;border:none;border-top:1px solid ${t.border};" />`;
}

export function emailSupportLine(email: string): string {
  return emailParagraph(
    `Questions? Reply to this email or contact <a href="mailto:${escapeHtml(email)}" style="color:${t.primary};font-weight:600;text-decoration:none;">${escapeHtml(email)}</a>.`,
    { muted: true, marginBottom: 0 },
  );
}
