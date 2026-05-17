import { getVariantPriceBounds } from '@/lib/pricing';
import { absoluteUrl, getSiteUrl, SITE_EMAIL, SITE_NAME } from '@/lib/seo/site';
import type { ProductDetail } from '@/lib/types/catalog';

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: absoluteUrl('/brand-logo.png', siteUrl),
    email: SITE_EMAIL,
    description:
      'Supplier of research-grade peptides with HPLC release documentation and batch traceability for institutional protocols.',
  };
}

export function websiteJsonLd(): JsonLd {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
  };
}

export function productJsonLd(product: ProductDetail): JsonLd {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/products/${product.slug}`;
  const images = product.images
    .map((img) => absoluteUrl(img.url, siteUrl))
    .filter((src) => src.startsWith('http'));
  const inStock = product.stock > 0 || product.variants.some((v) => v.stock > 0);
  const sku = product.variants.find((v) => v.sku)?.sku ?? product.id;
  const { min, max } = getVariantPriceBounds(product.price, product.variants);
  const hasRange = Math.abs(max - min) >= 0.005;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.spec,
    image: images.length > 0 ? images : [absoluteUrl(product.image, siteUrl)],
    sku,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: product.category?.name,
    offers: hasRange
      ? {
          '@type': 'AggregateOffer',
          url,
          priceCurrency: 'USD',
          lowPrice: min.toFixed(2),
          highPrice: max.toFixed(2),
          offerCount: product.variants.length,
          availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        }
      : {
          '@type': 'Offer',
          url,
          priceCurrency: 'USD',
          price: min.toFixed(2),
          availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
  };
}

export function productBreadcrumbJsonLd(product: ProductDetail): JsonLd {
  const siteUrl = getSiteUrl();
  const items: { name: string; item: string }[] = [
    { name: 'Home', item: siteUrl },
    { name: 'Catalog', item: `${siteUrl}/products` },
  ];

  if (product.category) {
    items.push({
      name: product.category.name,
      item: `${siteUrl}/products?category=${product.category.slug}`,
    });
  }

  items.push({ name: product.name, item: `${siteUrl}/products/${product.slug}` });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}
