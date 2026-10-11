/**
 * @file src/shared/components/session/DomainArchitectureIndicator.tsx
 * @description Compact status indicator for Bounded Domain Contexts and Kernel Event Bus state.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React from 'react';
import { DomainId } from '../../../types';
import { Cpu, ShieldCheck } from 'lucide-react';

export interface DomainArchitectureIndicatorProps {
  domainId?: DomainId;
  status?: 'active' | 'initialized' | 'placeholder';
  onClick?: () => void;
  className?: string;
  showLabel?: boolean;
}

export const DomainArchitectureIndicator: React.FC<DomainArchitectureIndicatorProps> = ({
  domainId = 'DOM-001',
  status = 'active',
  onClick,
  className = '',
  showLabel = true,
}) => {
  const statusColors = {
    active: 'text-[var(--status-success)] bg-[var(--surface-low)] border-[var(--status-success)]/40',
    initialized: 'text-[var(--accent-signal)] bg-[var(--surface-low)] border-[var(--accent-signal)]/40',
    placeholder: 'text-[var(--text-secondary)] bg-[var(--surface-low)] border-[var(--border-color)]',
  };

  const dotColors = {
    active: 'bg-[var(--status-success)]',
    initialized: 'bg-[var(--accent-signal)]',
    placeholder: 'bg-[var(--text-tertiary)]',
  };

  return (
    <button
      id={`domain-indicator-${domainId.toLowerCase()}`}
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--mode-radius)] border text-xs font-mono-ui transition-all ${
        onClick ? 'cursor-pointer hover:bg-[var(--surface-high)] active:scale-95' : 'cursor-default'
      } ${statusColors[status]} ${className}`}
      title={`Domain Context: ${domainId} (${status})`}
      aria-label={`Domain Context ${domainId}, status: ${status}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]} animate-pulse`} />
      <span className="font-bold">{domainId}</span>
      {showLabel && (
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] ms-1 border-s border-[var(--border-color)] ps-1.5">
          {status}
        </span>
      )}
    </button>
  );
};
