/**
 * @file src/shared/components/ui/Navigation.tsx
 * @description Foundation Component System — Navigation Primitives
 * @license Apache-2.0
 */

import React from 'react';

export interface NavigationItemProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
  id?: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  label,
  icon,
  active = false,
  disabled = false,
  badge,
  onClick,
  className = '',
  id,
}) => {
  return (
    <button
      id={id}
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`group flex items-center justify-between px-3 py-2 text-sm font-ui-body rounded-[var(--mode-radius)] transition-all duration-200 ease-out-quad focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] disabled:opacity-40 disabled:cursor-not-allowed w-full ${
        active
          ? 'bg-[var(--surface-low)] text-[var(--text-primary)] font-semibold border-l-2 border-[var(--accent-signal)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-low)]/50'
      } ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <span
            className={`transition-colors ${
              active ? 'text-[var(--accent-signal)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
            }`}
          >
            {icon}
          </span>
        )}
        <span>{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-mono-ui ${
            active
              ? 'bg-[var(--accent-signal)]/20 text-[var(--accent-signal)]'
              : 'bg-[var(--surface-low)] text-[var(--text-secondary)]'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export interface SidebarItemProps extends NavigationItemProps {
  description?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  description,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      <NavigationItem {...props} />
      {description && (
        <span className="text-xs text-[var(--text-secondary)]/70 px-3 pl-9 pb-1 font-label-sm">
          {description}
        </span>
      )}
    </div>
  );
};

export interface HeaderActionProps {
  icon: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  active?: boolean;
  badge?: boolean;
  className?: string;
}

export const HeaderAction: React.FC<HeaderActionProps> = ({
  icon,
  ariaLabel,
  onClick,
  active = false,
  badge = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`relative p-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-low)] rounded-[var(--mode-radius)] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] ${
        active ? 'text-[var(--accent-signal)] bg-[var(--surface-low)]' : ''
      } ${className}`}
    >
      {icon}
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--accent-signal)] rounded-full animate-pulse" />
      )}
    </button>
  );
};

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs font-mono-ui ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="text-[var(--text-secondary)]/40 select-none">/</span>}
            {isLast || !item.onClick ? (
              <span
                className={`truncate ${
                  isLast ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'
                }`}
              >
                {item.label}
              </span>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline truncate transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabOption[];
  activeTabId: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 ${
        variant === 'underline'
          ? 'border-b border-[var(--border-color)]'
          : 'bg-[var(--surface-card)] p-1 rounded-[var(--mode-radius)] border border-[var(--border-color)]'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-label-sm font-medium transition-all duration-200 ease-out-quad focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] disabled:opacity-40 disabled:cursor-not-allowed ${
              variant === 'underline'
                ? isActive
                  ? 'text-[var(--accent-signal)] border-b-2 border-[var(--accent-signal)] font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-b-2 border-transparent'
                : isActive
                ? 'bg-[var(--surface-low)] text-[var(--text-primary)] shadow-sm rounded-[var(--mode-radius)] font-semibold'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--mode-radius)]'
            }`}
          >
            {tab.icon && <span className="text-current">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono-ui ${
                  isActive
                    ? 'bg-[var(--accent-signal)]/20 text-[var(--accent-signal)]'
                    : 'bg-[var(--surface-low)] text-[var(--text-secondary)]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export interface CommandPaletteTriggerProps {
  onClick?: () => void;
  shortcut?: string;
  placeholder?: string;
  className?: string;
}

export const CommandPaletteTrigger: React.FC<CommandPaletteTriggerProps> = ({
  onClick,
  shortcut = '⌘K',
  placeholder = 'Type a command or search...',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center justify-between w-full max-w-md px-3.5 py-2 bg-[var(--surface-low)]/60 hover:bg-[var(--surface-low)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-[var(--mode-radius)] border border-[var(--border-color)] transition-all duration-200 ease-out-quad shadow-sm backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <svg
          className="w-4 h-4 text-[var(--accent-signal)] opacity-80 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-xs font-ui-body truncate">{placeholder}</span>
      </div>
      <kbd className="px-1.5 py-0.5 text-[10px] font-mono-ui bg-[var(--surface-card)] text-[var(--text-secondary)] rounded border border-[var(--border-color)]">
        {shortcut}
      </kbd>
    </button>
  );
};
