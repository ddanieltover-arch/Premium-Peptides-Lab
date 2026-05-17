import { cn } from '@/lib/cn';

export type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({ eyebrow, title, subtitle, align = 'left', className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === 'center' && 'text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-lab-primary">{eyebrow}</p>
      )}
      <h2 className={cn('font-display text-3xl text-white md:text-4xl', eyebrow && 'mt-2')}>{title}</h2>
      {subtitle && (
        <p
          className={cn(
            'mt-3 text-sm text-slate-400',
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-md',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
