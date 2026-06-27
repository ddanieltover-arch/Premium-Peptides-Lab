'use client';

import { useLayoutEffect, useState } from 'react';
import {
  clearCoaSectionIntent,
  ensureCoaHashInUrl,
  scrollToCoaSection,
  wantsCoaSection,
} from '@/lib/coa/section';

/** Opens the certificate accordion and scrolls to it when `#coa` is present or navigation intent was set. */
export function useCoaSection(productSlug: string) {
  const [openCoa, setOpenCoa] = useState(false);

  useLayoutEffect(() => {
    const activate = () => {
      if (!wantsCoaSection(productSlug)) return false;
      clearCoaSectionIntent();
      ensureCoaHashInUrl();
      setOpenCoa(true);
      return true;
    };

    const sync = () => {
      if (window.location.hash === '#coa' || wantsCoaSection(productSlug)) {
        activate();
      }
    };

    if (activate()) {
      requestAnimationFrame(() => requestAnimationFrame(scrollToCoaSection));
      const t1 = window.setTimeout(scrollToCoaSection, 200);
      const t2 = window.setTimeout(scrollToCoaSection, 500);

      window.addEventListener('hashchange', sync);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener('hashchange', sync);
      };
    }

    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [productSlug]);

  return openCoa;
}
