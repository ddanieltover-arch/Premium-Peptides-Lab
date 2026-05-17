import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type CardVariant = 'default' | 'product' | 'elevated';

export function cardVariants({ variant = 'default' }: { variant?: CardVariant } = {}) {
  return cn(
    'rounded-2xl border border-white/10',
    variant === 'default' && 'bg-lab-card/80 shadow-card',
    variant === 'product' && [
      'product-card overflow-hidden bg-[rgba(17,24,39,0.55)] shadow-card backdrop-blur-xl',
      'transition-[transform,box-shadow,border-color] duration-300',
      'hover:-translate-y-1 hover:border-lab-energy/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]',
    ],
    variant === 'elevated' && 'bg-lab-elevated/80 shadow-glow',
  );
}

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant = 'default', ...props },
  ref,
) {
  return <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />;
});
