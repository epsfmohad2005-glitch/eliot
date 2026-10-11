/**
 * @file src/shared/components/ui/Buttons.tsx
 * @description Foundation Component System — Reusable Button Primitives
 * @license Apache-2.0
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      id,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base classes consuming tokens & CSS vars
    const baseStyle =
      'inline-flex items-center justify-center font-ui-body font-medium transition-all duration-150 ease-out select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-bg)] disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed min-h-[44px] sm:min-h-[36px]';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-[var(--mode-radius)]',
      md: 'text-sm px-4 py-2 gap-2 rounded-[var(--mode-radius)]',
      lg: 'text-base px-6 py-3 gap-2.5 rounded-[var(--mode-radius)]',
    };

    const variantStyles = {
      primary:
        'bg-[var(--accent-signal)] text-[var(--accent-on-signal)] hover:opacity-90 active:scale-[0.98] shadow-sm font-semibold',
      secondary:
        'bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--surface-low)] active:scale-[0.98]',
      ghost:
        'bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-low)] active:scale-[0.98]',
      destructive:
        'bg-[var(--status-error)] text-white hover:opacity-90 active:scale-[0.98] shadow-sm',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        id={id}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span className="whitespace-nowrap">{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      ariaLabel,
      variant = 'ghost',
      size = 'md',
      disabled,
      className = '',
      id,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: 'w-8 h-8 text-xs p-1.5',
      md: 'w-10 h-10 text-sm p-2',
      lg: 'w-12 h-12 text-base p-2.5',
    };

    const variantStyles = {
      primary: 'bg-[var(--accent-signal)] text-[var(--accent-on-signal)] hover:opacity-90',
      secondary: 'bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--surface-low)]',
      ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-low)]',
      destructive: 'bg-[var(--status-error)] text-white hover:opacity-90',
    };

    return (
      <button
        ref={ref}
        id={id}
        type={type}
        aria-label={ariaLabel}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-[var(--mode-radius)] transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] disabled:opacity-40 disabled:pointer-events-none min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
