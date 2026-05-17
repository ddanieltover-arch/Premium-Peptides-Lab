import type { Metadata } from 'next';
import { RoutePlaceholder } from '@/components/layout/RoutePlaceholder';
import { StorefrontPageShell } from '@/components/layout/StorefrontPageShell';
import { getNavCategories } from '@/lib/data/catalog';
import { PLACEHOLDER_ROUTES, type PlaceholderRoute } from '@/lib/data/routes';
import { SITE_NAME } from '@/lib/seo/site';

export async function renderPlaceholderPage(routeKey: keyof typeof PLACEHOLDER_ROUTES) {
  const config: PlaceholderRoute = PLACEHOLDER_ROUTES[routeKey];
  const categories = await getNavCategories();

  return (
    <StorefrontPageShell categories={categories}>
      <RoutePlaceholder {...config} />
    </StorefrontPageShell>
  );
}

export function placeholderMetadata(routeKey: keyof typeof PLACEHOLDER_ROUTES): Metadata {
  const { title } = PLACEHOLDER_ROUTES[routeKey];
  return {
    title: `${title} | ${SITE_NAME}`,
    robots: { index: false, follow: true },
  };
}
