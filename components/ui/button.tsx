'use client';

import Link from 'next/link';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'sale';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonVariantProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
  fullWidth?: boolean;
};

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  glow = false,
  fullWidth = false,
}: ButtonVariantProps = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-display font-semibold transition',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-lab-base',
    'disabled:pointer-events-none disabled:opacity-50',
    fullWidth && 'w-full',
    size === 'sm' && 'rounded-xl px-4 py-2 text-xs',
    size === 'md' && 'rounded-2xl px-6 py-3 text-sm',
    size === 'lg' && 'rounded-2xl px-8 py-3.5 text-sm md:text-base',
    variant === 'primary' && [
      'btn-primary text-lab-base',
      glow !== false && 'shadow-glow hover:-translate-y-px hover:shadow-[0_0_32px_rgba(74,159,232,0.45)]',
    ],
    variant === 'secondary' && [
      'border border-lab-primary/40 bg-lab-primary/10 text-lab-primary',
      'hover:bg-lab-primary/20',
    ],
    variant === 'ghost' && [
      'border border-white/15 bg-white/5 text-slate-100 backdrop-blur-md',
      'hover:border-lab-primary/40 hover:bg-white/10 hover:text-white',
    ],
    variant === 'sale' && [
      'btn-sale text-white shadow-md',
      'hover:-translate-y-px hover:brightness-110',
    ],
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    href?: string;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    glow,
    fullWidth,
    href,
    loading,
    disabled,
    leftIcon,
    rightIcon,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size, glow, fullWidth }), className);
  const content = (
    <>
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled || loading}>
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref} type={type} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
});
