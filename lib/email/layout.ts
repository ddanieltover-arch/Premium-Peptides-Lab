import { SITE_NAME } from '@/lib/seo/site';
import { siteOrigin } from './constants';
import { escapeHtml } from './escape';

const BRAND = '#4A9FE8';
const BRAND_DEEP = '#2D3A52';
const BG = '#0f1419';
const CARD = '#ffffff';
const MUTED = '#64748b';

export function emailShell(opts: {
  title: string;
  preheader?: string;
  innerHtml: string;
  footerNote?: string;
}): string {
  const pre = opts.preheader
    ? `<span style="display:none;font-size:1px;color:${BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(opts.preheader)}</span>`
    : '';

  const footer =
    opts.footerNote ||
    `${SITE_NAME} — Research-use compounds. COA documentation available on qualified lots.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:#e8edf2;font-family:system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;">
  ${pre}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e8edf2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:${CARD};border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(45,58,82,0.12);border:1px solid #e2e8f0;">
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_DEEP} 0%,${BRAND} 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.85);font-family:system-ui,sans-serif;">${escapeHtml(SITE_NAME)}</p>
              <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.25;font-family:system-ui,sans-serif;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 28px;font-size:15px;line-height:1.65;color:#1e293b;font-family:system-ui,-apple-system,sans-serif;">
              ${opts.innerHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;font-family:system-ui,sans-serif;">
              <table role="presentation" width="100%" style="border-top:1px solid #e2e8f0;padding-top:20px;">
                <tr>
                  <td style="font-size:11px;line-height:1.6;color:${MUTED};text-align:center;">
                    ${escapeHtml(footer)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:${MUTED};font-family:system-ui,sans-serif;text-align:center;">
          This message was sent regarding your activity at ${escapeHtml(siteOrigin())}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
