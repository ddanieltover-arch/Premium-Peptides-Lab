'use client';

import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { coaProductHref } from '@/lib/coa/href';

type Props = {
  productSlug: string;
  className?: string;
  children: ReactNode;
};

function ensureCoaHash(path: string) {
  const tick = () => {
    const onProductPage = window.location.pathname === path || window.location.pathname.endsWith(path);
    if (!onProductPage) {
      requestAnimationFrame(tick);
      return;
    }
    if (window.location.hash !== '#coa') {
      window.location.hash = 'coa';
    } else {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };
  requestAnimationFrame(tick);
}

/** Navigate to the product page COA accordion; avoids Next.js scroll-to-top eating the hash. */
export function CoaProductLink({ productSlug, className, children }: Props) {
  const router = useRouter();
  const href = coaProductHref(productSlug);
  const path = href.split('#')[0];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(href, { scroll: false });
    ensureCoaHash(path);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
