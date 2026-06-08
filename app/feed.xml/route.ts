import { NextResponse } from 'next/server';
import { isProductInStock } from '@/lib/catalog/stock';
import { getAllActiveProductsForFeed } from '@/lib/data/catalog';
import { getPublicSiteUrl, SITE_NAME } from '@/lib/seo/site';
import type { ProductDetail, ProductVariant } from '@/lib/types/catalog';

export const dynamic = 'force-dynamic';

const CURRENCY = 'USD';

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function absUrl(base: string, url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base.replace(/\/$/, '')}${path}`;
}

function productDescription(p: ProductDetail): string {
  const raw = p.description || p.spec || '';
  return stripHtml(raw).slice(0, 5000);
}

function buildItem(site: string, p: ProductDetail, v: ProductVariant | null): string {
  const link = `${site}/products/${encodeURIComponent(p.slug)}`;
  const price = v ? p.price + v.priceModifier : p.price;
  const availability = isProductInStock(p.stock, v ? [v] : p.variants) ? 'in stock' : 'out of stock';
  const title = v ? `${p.name} (${v.value})` : p.name;
  const id = v ? v.sku?.trim() || `${p.id}_${v.id}` : p.id;
  const img = absUrl(site, p.images[0]?.url || p.image);
  const desc = productDescription(p);
  const productType = p.category?.name || 'Research supplies';

  const lines = [
    '    <item>',
    `      <g:id>${xmlEscape(id)}</g:id>`,
    `      <g:item_group_id>${xmlEscape(p.id)}</g:item_group_id>`,
    `      <title>${xmlEscape(title)}</title>`,
    `      <g:title>${xmlEscape(title)}</g:title>`,
    `      <link>${xmlEscape(link)}</link>`,
    `      <g:link>${xmlEscape(link)}</g:link>`,
    `      <g:product_type>${xmlEscape(productType)}</g:product_type>`,
    '      <g:condition>new</g:condition>',
    `      <g:availability>${availability}</g:availability>`,
    `      <g:price>${price.toFixed(2)} ${CURRENCY}</g:price>`,
    `      <g:brand>${xmlEscape(SITE_NAME)}</g:brand>`,
    ...(img ? [`      <g:image_link>${xmlEscape(img)}</g:image_link>`] : []),
    `      <g:description>${xmlEscape(desc)}</g:description>`,
    '    </item>',
  ];
  return lines.join('\n');
}

export async function GET() {
  const site = getPublicSiteUrl();

  try {
    const products = await getAllActiveProductsForFeed();
    const blocks: string[] = [];

    for (const p of products) {
      if (p.variants.length > 0) {
        for (const v of p.variants) {
          blocks.push(buildItem(site, p, v));
        }
      } else {
        blocks.push(buildItem(site, p, null));
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xmlEscape(`${SITE_NAME} — Product catalog`)}</title>
    <link>${xmlEscape(site)}</link>
    <description>${xmlEscape(`Product feed for ${SITE_NAME}`)}</description>
${blocks.join('\n')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (e) {
    console.error('[feed.xml]', e);
    return new NextResponse('Feed unavailable', { status: 503 });
  }
}
