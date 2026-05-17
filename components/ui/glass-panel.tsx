import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  rounded?: '2xl' | '3xl' | '[2rem]';
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { className, rounded = '2xl', ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'glass-panel',
        rounded === '2xl' && 'rounded-2xl',
        rounded === '3xl' && 'rounded-3xl',
        rounded === '[2rem]' && 'rounded-[2rem]',
        className,
      )}
      {...props}
    />
  );
});
