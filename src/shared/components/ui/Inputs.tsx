/**
 * @file src/shared/components/ui/Inputs.tsx
 * @description Foundation Component System — Form & Text Input Primitives
 * @license Apache-2.0
 */

import React, { useState } from 'react';

export interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    BaseInputProps {}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-label-sm font-medium text-[var(--text-secondary)] tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--text-secondary)] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`w-full bg-[var(--surface-low)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 font-ui-body text-sm py-2 px-3 rounded-[var(--mode-radius)] border transition-all duration-200 ease-out-quad focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : ''
            } ${rightIcon ? 'pr-9' : ''} ${
              error ? 'border-[var(--status-error)] focus:ring-[var(--status-error)]' : 'border-[var(--border-color)]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[var(--text-secondary)] pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-[var(--status-error)] font-label-sm">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-[var(--text-secondary)] font-label-sm">{helperText}</span>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export interface SearchInputProps extends Omit<TextInputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, placeholder = 'Search...', ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <TextInput
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        leftIcon={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={
          hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="pointer-events-auto hover:text-[var(--text-primary)] transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

export interface PasswordInputProps extends Omit<TextInputProps, 'type' | 'rightIcon'> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="pointer-events-auto text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.047 10.047 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21-3-3" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseInputProps {}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      disabled,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-label-sm font-medium text-[var(--text-secondary)] tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          disabled={disabled}
          className={`w-full bg-[var(--surface-low)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 font-ui-body text-sm py-2 px-3 rounded-[var(--mode-radius)] border transition-all duration-200 ease-out-quad focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed ${
            error ? 'border-[var(--status-error)] focus:ring-[var(--status-error)]' : 'border-[var(--border-color)]'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-[var(--status-error)] font-label-sm">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-[var(--text-secondary)] font-label-sm">{helperText}</span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export interface NumberInputProps extends Omit<TextInputProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ min, max, step = 1, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';
