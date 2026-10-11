/**
 * @file src/shared/components/ui/Containers.tsx
 * @description Foundation Component System — Container & Layout Primitives
 * @license Apache-2.0
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'paper';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  id,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-sm',
    elevated: 'bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] shadow-md',
    outline: 'bg-transparent border border-[var(--border-color)] text-[var(--text-primary)]',
    paper: 'bg-[var(--surface-card)] border border-[var(--border-color)] text-[var(--text-primary)] paper-texture shadow-sm',
  };

  return (
    <div
      id={id}
      className={`rounded-[var(--mode-radius)] transition-all duration-200 ease-out ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] overflow-hidden flex flex-col ${className}`}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-color)] bg-[var(--surface-low)]/40">
          <div>
            {title && <h3 className="font-ui-body-bold font-semibold text-sm text-[var(--text-primary)]">{title}</h3>}
            {subtitle && <p className="text-xs text-[var(--text-secondary)] font-label-sm">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5 flex-1">{children}</div>
    </div>
  );
};

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  side?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  side = 'right',
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  const sideStyles = side === 'right' ? 'right-0 border-l' : 'left-0 border-r';

  return (
    <div className="fixed inset-0 z-[var(--z-overlay)] flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 animate-fadeIn"
      />
      {/* Sheet Content */}
      <div
        className={`fixed top-0 bottom-0 w-full max-w-md bg-[var(--surface-card)] border-[var(--border-color)] shadow-xl flex flex-col z-[var(--z-modal)] transition-transform duration-200 ease-out ${sideStyles} ${className}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h3 className="font-headline-md font-medium text-lg text-[var(--text-primary)]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded hover:bg-[var(--surface-low)] transition-colors"
            aria-label="Close sheet"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  action,
  children,
  className = '',
  ...props
}) => {
  return (
    <section className={`flex flex-col gap-4 ${className}`} {...props}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="font-headline-md text-lg text-[var(--text-primary)] font-medium">{title}</h2>}
            {description && <p className="text-xs text-[var(--text-secondary)] font-ui-body mt-0.5">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export interface WorkspaceSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: string;
}

export const WorkspaceSurface: React.FC<WorkspaceSurfaceProps> = ({
  mode,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`min-h-screen w-full bg-[var(--surface-bg)] text-[var(--text-primary)] transition-colors duration-200 ease-out ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'sm',
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[var(--accent-signal)]/20 text-[var(--accent-signal)] border border-[var(--accent-signal)]/30',
    success: 'bg-[var(--status-success)]/20 text-[var(--status-success)] border border-[var(--status-success)]/30',
    warning: 'bg-[var(--status-warning)]/20 text-[var(--status-warning)] border border-[var(--status-warning)]/30',
    error: 'bg-[var(--status-error)]/20 text-[var(--status-error)] border border-[var(--status-error)]/30',
    neutral: 'bg-[var(--surface-low)] text-[var(--text-secondary)] border border-[var(--border-color)]',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center font-mono-ui font-bold uppercase rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
