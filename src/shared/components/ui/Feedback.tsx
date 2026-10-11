/**
 * @file src/shared/components/ui/Feedback.tsx
 * @description Foundation Component System — User Feedback & Alert Primitives
 * @license Apache-2.0
 */

import React from 'react';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
  id?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onDismiss,
  action,
  className = '',
  id,
}) => {
  const typeStyles = {
    info: 'bg-[var(--surface-low)] border-[var(--border-color)] text-[var(--text-primary)]',
    success: 'bg-[var(--accent-signal)]/10 border-[var(--accent-signal)]/30 text-[var(--text-primary)]',
    warning: 'bg-[var(--status-warning)]/10 border-[var(--status-warning)]/30 text-[var(--text-primary)]',
    error: 'bg-[var(--status-error)]/10 border-[var(--status-error)]/30 text-[var(--status-error)]',
  };

  const iconSvg = {
    info: (
      <svg className="w-5 h-5 text-[var(--accent-signal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 text-[var(--accent-signal)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-[var(--status-warning)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-[var(--status-error)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      id={id}
      className={`flex items-start gap-3 p-4 border rounded-[var(--mode-radius)] font-ui-body text-sm transition-all duration-200 ${typeStyles[type]} ${className}`}
      role="alert"
    >
      {iconSvg[type]}
      <div className="flex-1">
        {title && <h4 className="font-ui-body-bold font-semibold mb-0.5">{title}</h4>}
        <div className="text-xs font-ui-body leading-relaxed">{message}</div>
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
          aria-label="Dismiss alert"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export interface BannerProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
  type?: 'info' | 'warning' | 'error';
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  message,
  actionText,
  onAction,
  type = 'info',
  className = '',
}) => {
  const bgStyles = {
    info: 'bg-[var(--surface-card)] text-[var(--text-primary)] border-b border-[var(--border-color)]',
    warning: 'bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-b border-[var(--status-warning)]/30',
    error: 'bg-[var(--status-error)]/15 text-[var(--status-error)] border-b border-[var(--status-error)]/30',
  };

  return (
    <div className={`w-full py-2 px-4 flex items-center justify-between text-xs font-label-sm ${bgStyles[type]} ${className}`}>
      <span>{message}</span>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="font-semibold underline hover:opacity-80 transition-opacity ml-4"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export interface ToastProps {
  id?: string;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  type = 'info',
  onClose,
}) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-[var(--mode-radius)] shadow-lg backdrop-blur-md max-w-sm animate-slideUp">
      <div className="flex-1">
        <h5 className="font-ui-body-bold text-xs font-semibold">{title}</h5>
        {description && <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  const [visible, setVisible] = React.useState(false);

  const posClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute z-[var(--z-toast)] px-2.5 py-1 text-[11px] font-label-sm text-[var(--text-primary)] bg-[var(--surface-card)] border border-[var(--border-color)] rounded shadow-md whitespace-nowrap pointer-events-none ${posClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-[var(--border-color)] rounded-[var(--mode-radius)] bg-[var(--surface-low)]/20 ${className}`}>
      {icon && <div className="text-[var(--text-secondary)] mb-3">{icon}</div>}
      <h3 className="font-headline-md text-base text-[var(--text-primary)] font-medium mb-1">{title}</h3>
      {description && <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  error?: string | Error;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'An error occurred',
  error,
  onRetry,
  className = '',
}) => {
  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center border border-[var(--status-error)]/30 bg-[var(--status-error)]/10 rounded-[var(--mode-radius)] ${className}`}>
      <svg className="w-8 h-8 text-[var(--status-error)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="font-ui-body-bold text-sm text-[var(--status-error)] font-semibold mb-1">{title}</h3>
      {errorMessage && <p className="text-xs text-[var(--status-error)] font-mono-ui max-w-md mb-4">{errorMessage}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-medium bg-[var(--status-error)] hover:opacity-90 text-white rounded transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
