import { SITE_NAME } from '@/lib/seo/site';
import { emailPublicOrigin } from './constants';
import { escapeHtml } from './escape';
import { emailLogoSrc } from './logo';
import { emailTheme as t } from './theme';

export type EmailShellVariant = 'default' | 'success' | 'alert';

const variantAccent: Record<EmailShellVariant, string> = {
  default: `linear-gradient(90deg, ${t.primary} 0%, ${t.mint} 50%, ${t.violet} 100%)`,
  success: `linear-gradient(90deg, ${t.mint} 0%, ${t.primary} 100%)`,
  alert: `linear-gradient(90deg, ${t.energy} 0%, ${t.primary} 100%)`,
};

export function emailShell(opts: {
  title: string;
  preheader?: string;
  innerHtml: string;
  footerNote?: string;
  variant?: EmailShellVariant;
}): string {
  const variant = opts.variant ?? 'default';
  const pre = opts.preheader
    ? `<span style="display:none;font-size:1px;color:${t.canvas};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(opts.preheader)}</span>`
    : '';

  const footer =
    opts.footerNote ||
    `${SITE_NAME} · Research-use only (RUO) · Not for human or veterinary administration`;

  const logoSrc = emailLogoSrc();
  const linkOrigin = emailPublicOrigin();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${t.canvas};font-family:${t.fontSans};-webkit-font-smoothing:antialiased;">
  ${pre}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${t.canvas};padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;background:${t.card};border-radius:${t.radiusLg};overflow:hidden;box-shadow:0 16px 48px rgba(45,58,82,0.14);border:1px solid ${t.border};">
          <tr>
            <td style="height:4px;background:${variantAccent[variant]};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="background:linear-gradient(160deg,${t.deep} 0%,#1a2332 45%,#243044 100%);padding:28px 32px 24px;text-align:center;">
              <a href="${escapeHtml(linkOrigin)}" style="text-decoration:none;">
                <img
                  src="${escapeHtml(logoSrc)}"
                  width="64"
                  height="64"
                  alt="${escapeHtml(SITE_NAME)}"
                  style="display:block;margin:0 auto 16px;border-radius:14px;border:2px solid rgba(255,255,255,0.15);background:#ffffff;"
                />
              </a>
              <p style="margin:0;font-family:${t.fontMono};font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:rgba(255,255,255,0.6);">${escapeHtml(SITE_NAME)}</p>
              <h1 style="margin:10px 0 0;font-family:${t.fontSans};font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 20px;font-size:15px;line-height:1.65;color:${t.text};">
              ${opts.innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <table role="presentation" width="100%" style="border-top:1px solid ${t.border};padding-top:22px;">
                <tr>
                  <td style="font-family:${t.fontSans};font-size:11px;line-height:1.65;color:${t.muted};text-align:center;">
                    ${escapeHtml(footer)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-family:${t.fontSans};font-size:11px;color:${t.muted};text-align:center;">
          <a href="${escapeHtml(linkOrigin)}" style="color:${t.primary};text-decoration:none;">${escapeHtml(linkOrigin.replace(/^https?:\/\//, ''))}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
