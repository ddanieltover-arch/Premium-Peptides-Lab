'use client';

import { useRouter } from 'next/navigation';
import type { MouseEvent, ReactNode } from 'react';
import { coaProductHref } from '@/lib/coa/href';
import {
  isProductPath,
  markCoaSectionIntent,
  notifyCoaSectionTarget,
  ensureCoaHashInUrl,
} from '@/lib/coa/section';

type Props = {
  productSlug: string;
  className?: string;
  children: ReactNode;
};

function applyCoaHashWhenReady(productPath: string, maxFrames = 90) {
  let frames = 0;
  const tick = () => {
    frames += 1;
    if (!isProductPath(window.location.pathname, productPath)) {
      if (frames < maxFrames) requestAnimationFrame(tick);
      return;
    }
    ensureCoaHashInUrl();
    notifyCoaSectionTarget();
  };
  requestAnimationFrame(tick);
}

/** Navigate to the product page and open the certificate accordion (`#coa`). */
export function CoaProductLink({ productSlug, className, children }: Props) {
  const router = useRouter();
  const href = coaProductHref(productSlug);
  const path = href.split('#')[0];

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    markCoaSectionIntent(productSlug);

    if (isProductPath(window.location.pathname, path)) {
      ensureCoaHashInUrl();
      notifyCoaSectionTarget();
      return;
    }

    router.push(href, { scroll: false });
    applyCoaHashWhenReady(path);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
