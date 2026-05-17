'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/cn';

const PLACEHOLDER = '/brand-logo.png';

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function CatalogImage({
  src,
  alt,
  fill,
  width = 400,
  height = 300,
  sizes,
  priority,
  className,
}: Props) {
  const [current, setCurrent] = useState(src?.trim() || PLACEHOLDER);

  const handleError = () => {
    if (current !== PLACEHOLDER) setCurrent(PLACEHOLDER);
  };

  const shared = {
    src: current,
    alt,
    onError: handleError,
    sizes: sizes ?? (fill ? '(max-width: 768px) 100vw, 50vw' : undefined),
    priority,
    className: cn('object-cover', className),
  };

  if (fill) {
    return <Image {...shared} fill />;
  }

  return <Image {...shared} width={width} height={height} />;
}
