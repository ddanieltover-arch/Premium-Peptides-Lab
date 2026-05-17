import type { Metadata } from 'next';
import { absoluteUrl, getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site';
import type { ProductDetail } from '@/lib/types/catalog';

const DEFAULT_OG_IMAGE = '/brand-logo.png';

export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE, siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${SITE_NAME} | Research-Grade Peptide Standards`,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
      'research peptides',
      'HPLC peptides',
      'peptide COA',
      'analytical peptides',
      'Premium Peptides Lab',
    ],
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: SITE_NAME,
      title: `${SITE_NAME} | Research-Grade Peptide Standards`,
      description: SITE_DESCRIPTION,
      images: [{ url: ogImage, width: 512, height: 512, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} | Research-Grade Peptide Standards`,
      description: SITE_DESCRIPTION,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: { canonical: siteUrl },
  };
}

export function buildHomeMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  return {
    title: 'Research-Grade Peptide Standards',
    description: SITE_DESCRIPTION,
    alternates: { canonical: siteUrl },
    openGraph: {
      url: siteUrl,
      title: `${SITE_NAME} | Research-Grade Peptide Standards`,
      description: SITE_DESCRIPTION,
    },
  };
}

export function buildProductMetadata(product: ProductDetail): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/products/${product.slug}`;
  const description =
    product.spec?.trim() ||
    (product.description ? product.description.slice(0, 160) : SITE_DESCRIPTION);
  const ogImage = absoluteUrl(product.image, siteUrl);

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: product.name,
      description,
      images: [{ url: ogImage, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [ogImage],
    },
  };
}
