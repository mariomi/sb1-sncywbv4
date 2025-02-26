import { cn } from '../lib/utils';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90':
            variant === 'primary',
          'bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-100/90':
            variant === 'secondary',
          'border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100':
            variant === 'outline',
        },
        {
          'h-8 px-3': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}