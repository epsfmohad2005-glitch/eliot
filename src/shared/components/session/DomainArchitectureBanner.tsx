/**
 * @file src/shared/components/session/DomainArchitectureBanner.tsx
 * @description System Architecture Banner displaying Bounded Domain status and Kernel events.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Cpu, Activity, ExternalLink } from 'lucide-react';
import { MASTER_DOMAIN_REGISTRY } from '../../../domains';
import { CANONICAL_EVENT_REGISTRY } from '../../../core/events';
import { ENVIRONMENT_CONFIG } from '../../../config';
import { Card, Button } from '../ui';

export interface DomainArchitectureBannerProps {
  onInspect?: () => void;
  onOpenEventStream?: () => void;
  activeDomainCount?: number;
  className?: string;
}

export const DomainArchitectureBanner: React.FC<DomainArchitectureBannerProps> = ({
  onInspect,
  onOpenEventStream,
  activeDomainCount = MASTER_DOMAIN_REGISTRY.length,
  className = '',
}) => {
  return (
    <Card
      id="domain-architecture-banner"
      variant="default"
      padding="sm"
      className={`border-l-4 border-l-[var(--accent-signal)] shadow-sm ${className}`}
      role="region"
      aria-label="Domain Architecture Status"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-ui text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] text-[var(--accent-signal)] shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-ui-body-bold font-bold text-sm text-[var(--text-primary)]">
                PLOS Kernel Architecture
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--surface-low)] text-[var(--accent-signal)] border border-[var(--border-color)] font-semibold uppercase tracking-wider">
                {ENVIRONMENT_CONFIG.sprintStage}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-sans">
              {activeDomainCount} Bounded Contexts registered • {CANONICAL_EVENT_REGISTRY.length} Canonical Events bound
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {onOpenEventStream && (
            <Button
              id="btn-open-event-stream"
              variant="secondary"
              size="sm"
              onClick={onOpenEventStream}
              className="text-xs font-mono-ui py-1 px-2.5 h-7"
              title="Open Live Event Stream"
            >
              <Activity className="w-3.5 h-3.5 me-1 text-[var(--accent-signal)]" />
              <span>Event Stream</span>
            </Button>
          )}

          {onInspect && (
            <Button
              id="btn-inspect-architecture"
              variant="primary"
              size="sm"
              onClick={onInspect}
              className="text-xs font-mono-ui py-1 px-2.5 h-7"
              title="Inspect 12 Domain Contexts"
            >
              <ShieldCheck className="w-3.5 h-3.5 me-1" />
              <span>Inspect Architecture</span>
              <ExternalLink className="w-3 h-3 ms-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
