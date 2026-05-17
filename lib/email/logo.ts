import fs from 'fs';
import path from 'path';

/** Content-ID for inline logo in HTML: `<img src="cid:ppl-logo" />` */
export const EMAIL_LOGO_CID = 'ppl-logo';

let cachedBase64: string | null = null;

function readLogoBase64(): string {
  if (cachedBase64) return cachedBase64;

  const candidates = [
    path.join(process.cwd(), 'public', 'brand-logo.png'),
    path.join(process.cwd(), 'pharma-ecommerce-rebrand', 'public', 'brand-logo.png'),
  ];

  for (const logoPath of candidates) {
    try {
      if (fs.existsSync(logoPath)) {
        cachedBase64 = fs.readFileSync(logoPath).toString('base64');
        return cachedBase64;
      }
    } catch {
      /* try next path */
    }
  }

  throw new Error('[email] brand-logo.png not found in public/');
}

export function emailLogoSrc(): string {
  return `cid:${EMAIL_LOGO_CID}`;
}

export function getEmailLogoAttachment() {
  return {
    filename: 'brand-logo.png',
    content: readLogoBase64(),
    contentType: 'image/png' as const,
    contentId: EMAIL_LOGO_CID,
  };
}
