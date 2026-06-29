import type { Metadata } from 'next';
import { absoluteUrl, BRAND_LOGO_PATH, getSiteUrl, OG_IMAGE_PATH, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site';
import type { ProductDetail } from '@/lib/types/catalog';

const OG_IMAGE_WIDTH = 1024;
const OG_IMAGE_HEIGHT = 683;

function brandOgImages(siteUrl: string) {
  const ogImage = absoluteUrl(OG_IMAGE_PATH, siteUrl);
  return [{ url: ogImage, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: SITE_NAME }];
}

export function buildRootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const ogImages = brandOgImages(siteUrl);

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
    icons: {
      icon: [{ url: BRAND_LOGO_PATH, type: 'image/png' }],
      apple: [{ url: BRAND_LOGO_PATH, type: 'image/png' }],
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: SITE_NAME,
      title: `${SITE_NAME} | Research-Grade Peptide Standards`,
      description: SITE_DESCRIPTION,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} | Research-Grade Peptide Standards`,
      description: SITE_DESCRIPTION,
      images: ogImages.map((img) => img.url),
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
  const ogImages = brandOgImages(siteUrl);
  return {
    title: 'Research-Grade Peptide Standards',
    description: SITE_DESCRIPTION,
    alternates: { canonical: siteUrl },
    openGraph: {
      url: siteUrl,
      title: `${SITE_NAME} | Research-Grade Peptide Standards`,
      description: SITE_DESCRIPTION,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} | Research-Grade Peptide Standards`,
      description: SITE_DESCRIPTION,
      images: ogImages.map((img) => img.url),
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
