import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const variantStyles = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm',
  ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20',
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10 p-2 justify-center',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 justify-center rounded-lg font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
