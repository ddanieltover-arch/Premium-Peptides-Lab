'use client';

import type { ReactNode } from 'react';
import type { CategoryWithCount, FeaturedProduct } from '@/lib/types/catalog';
import { StorefrontChrome } from '@/components/layout/StorefrontChrome';

type Props = {
  children: ReactNode;
  categories: CategoryWithCount[];
  highlightProduct?: FeaturedProduct | null;
};

/** Standard storefront wrapper for inner routes. */
export function StorefrontPageShell({ children, categories, highlightProduct = null }: Props) {
  return (
    <StorefrontChrome categories={categories} highlightProduct={highlightProduct}>
      {children}
    </StorefrontChrome>
  );
}
