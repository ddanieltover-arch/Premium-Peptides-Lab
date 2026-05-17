'use client';

import { motion, useInView, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function CountUp({
  end,
  suffix = '',
  decimals = 1,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduce = useReducedMotion();
  const spring = useSpring(0, { stiffness: 90, damping: 18 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(end.toFixed(decimals));
      return;
    }
    spring.set(end);
  }, [inView, end, spring, reduce, decimals]);

  useEffect(() => {
    if (reduce) return;
    return spring.on('change', (v) => setDisplay(v.toFixed(decimals)));
  }, [spring, decimals, reduce]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
