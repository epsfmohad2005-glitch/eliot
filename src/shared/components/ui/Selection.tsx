/**
 * @file src/shared/components/ui/Selection.tsx
 * @description Foundation Component System — Checkbox, Radio, Toggle, and Select Primitives
 * @license Apache-2.0
 */

import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, disabled, className = '', id, checked, onChange, ...props }, ref) => {
    const checkId = id || (label ? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label
        htmlFor={checkId}
        className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={checkId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div className="w-4 h-4 rounded border border-[var(--border-color)] bg-[var(--surface-low)] transition-all duration-150 peer-checked:bg-[var(--accent-signal)] peer-checked:border-[var(--accent-signal)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring-color)] flex items-center justify-center">
            <svg
              className={`w-3 h-3 text-[#0A0A0A] font-bold transition-opacity ${
                checked ? 'opacity-100' : 'opacity-0'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-xs font-ui-body text-[var(--text-primary)]">{label}</span>}
            {description && (
              <span className="text-[11px] font-label-sm text-[var(--text-secondary)]">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, disabled, className = '', id, checked, onChange, ...props }, ref) => {
    const radioId = id || (label ? `radio-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <label
        htmlFor={radioId}
        className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
          disabled ? 'opacity-40 cursor-not-allowed' : ''
        } ${className}`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div className="w-4 h-4 rounded-full border border-[var(--border-color)] bg-[var(--surface-low)] transition-all duration-150 peer-checked:border-[var(--accent-signal)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring-color)] flex items-center justify-center">
            <div
              className={`w-2 h-2 rounded-full bg-[var(--accent-signal)] transition-transform ${
                checked ? 'scale-100' : 'scale-0'
              }`}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-xs font-ui-body text-[var(--text-primary)]">{label}</span>}
            {description && (
              <span className="text-[11px] font-label-sm text-[var(--text-secondary)]">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
  id,
}) => {
  const toggleId = id || (label ? `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const trackSizes = {
    sm: 'w-8 h-4 p-0.5',
    md: 'w-10 h-5.5 p-0.5',
  };

  const knobSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  const translateStyles = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-4.5' : 'translate-x-0',
  };

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
    >
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 ease-out-quad focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] ${
          trackSizes[size]
        } ${checked ? 'bg-[var(--accent-signal)]' : 'bg-[var(--surface-low)] border border-[var(--border-color)]'}`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-out-quad ${
            knobSizes[size]
          } ${translateStyles[size]} ${checked ? '!bg-[#0A0A0A]' : 'bg-[var(--text-secondary)]'}`}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-xs font-ui-body text-[var(--text-primary)]">{label}</span>}
          {description && (
            <span className="text-[11px] font-label-sm text-[var(--text-secondary)]">{description}</span>
          )}
        </div>
      )}
    </label>
  );
};

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectMenuProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
}

export const SelectMenu = React.forwardRef<HTMLSelectElement, SelectMenuProps>(
  ({ label, options, value, onChange, error, helperText, disabled, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-label-sm font-medium text-[var(--text-secondary)] tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full appearance-none bg-[var(--surface-low)] text-[var(--text-primary)] font-ui-body text-sm py-2 pl-3 pr-8 rounded-[var(--mode-radius)] border transition-all duration-200 ease-out-quad focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed ${
              error ? 'border-[var(--status-error)]' : 'border-[var(--border-color)]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-[var(--surface-card)]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs text-[var(--status-error)] font-label-sm">{error}</span>}
        {!error && helperText && <span className="text-xs text-[var(--text-secondary)] font-label-sm">{helperText}</span>}
      </div>
    );
  }
);

SelectMenu.displayName = 'SelectMenu';
