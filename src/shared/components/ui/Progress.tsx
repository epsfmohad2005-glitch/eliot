/**
 * @file src/shared/components/ui/Progress.tsx
 * @description Foundation Component System — Progress & Skeleton Indicators
 * @license Apache-2.0
 */

import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantStyles = {
    primary: 'bg-[var(--accent-signal)]',
    success: 'bg-[var(--status-success)]',
    warning: 'bg-[var(--status-warning)]',
    error: 'bg-[var(--status-error)]',
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-label-sm">
          {label && <span className="text-[var(--text-secondary)] font-medium">{label}</span>}
          {showPercentage && <span className="text-[var(--text-primary)] font-mono-ui font-semibold">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full bg-[var(--surface-low)] rounded-full overflow-hidden border border-[var(--border-color)]/30 ${heightStyles[size]}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out-quad ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export interface LinearProgressProps {
  indeterminate?: boolean;
  className?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({ indeterminate = true, className = '' }) => {
  return (
    <div className={`w-full h-1 bg-[var(--surface-low)] overflow-hidden relative ${className}`}>
      {indeterminate && (
        <div className="absolute top-0 bottom-0 bg-[var(--accent-signal)] w-1/3 animate-indeterminate" />
      )}
    </div>
  );
};

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

export interface StepIndicatorProps {
  steps: StepItem[];
  currentStepIndex: number;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStepIndex,
  className = '',
}) => {
  return (
    <div className={`flex items-center w-full justify-between ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono-ui font-semibold transition-all duration-200 ${
                  isCompleted
                    ? 'bg-[var(--accent-signal)] text-[#0A0A0A]'
                    : isCurrent
                    ? 'border-2 border-[var(--accent-signal)] text-[var(--accent-signal)] bg-[var(--surface-card)]'
                    : 'bg-[var(--surface-low)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="hidden sm:flex flex-col">
                <span
                  className={`text-xs font-ui-body font-medium ${
                    isCurrent ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mx-3 transition-colors duration-200 ${
                  idx < currentStepIndex ? 'bg-[var(--accent-signal)]' : 'bg-[var(--border-color)]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width,
  height,
  variant = 'rectangular',
  className = '',
}) => {
  const variantClasses = {
    text: 'rounded h-4 w-full my-1',
    circular: 'rounded-full',
    rectangular: 'rounded-[var(--mode-radius)]',
  };

  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  };

  return (
    <div
      style={style}
      className={`bg-[var(--surface-low)] animate-pulse ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  );
};
