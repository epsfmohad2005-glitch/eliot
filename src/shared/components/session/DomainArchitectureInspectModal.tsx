/**
 * @file src/shared/components/session/DomainArchitectureInspectModal.tsx
 * @description Comprehensive Architecture Inspector Modal covering 12 Bounded Contexts and Event Bus.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { MASTER_DOMAIN_REGISTRY } from '../../../domains';
import { CANONICAL_EVENT_REGISTRY, eventBus } from '../../../core/events';
import { ShieldCheck, Cpu, Activity, RotateCcw, Search } from 'lucide-react';
import { Modal, Button, Card } from '../ui';

export interface DomainArchitectureInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReboot?: () => void;
}

export const DomainArchitectureInspectModal: React.FC<DomainArchitectureInspectModalProps> = ({
  isOpen,
  onClose,
  onReboot,
}) => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'domains' | 'events'>('domains');

  const filteredDomains = MASTER_DOMAIN_REGISTRY.filter(
    (d) =>
      d.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.codeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const filteredEvents = CANONICAL_EVENT_REGISTRY.filter(
    (e) =>
      e.type.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.publisherDomain.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <Modal
      id="domain-architecture-inspect-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="PLOS Kernel Architecture Inspector"
      description="Bounded domain contexts, contract boundaries, and canonical event mappings."
      maxWidth="xl"
      footer={
        <div className="flex items-center justify-between w-full font-mono-ui text-xs">
          <span className="text-[var(--text-secondary)]">
            12 Bounded Contexts • {CANONICAL_EVENT_REGISTRY.length} Events Registered
          </span>
          <div className="flex gap-2">
            {onReboot && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onReboot}
                className="font-mono-ui text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 me-1 text-[var(--accent-signal)]" />
                <span>Re-Run Boot</span>
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              className="font-mono-ui text-xs"
            >
              Close Inspector
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 font-sans">
        {/* Tab & Search Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center gap-1 font-mono-ui text-xs">
            <Button
              variant={activeTab === 'domains' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveTab('domains')}
              className="py-1 px-3 text-xs font-mono-ui"
            >
              <Cpu className="w-3.5 h-3.5 me-1.5" />
              <span>Bounded Domains ({MASTER_DOMAIN_REGISTRY.length})</span>
            </Button>
            <Button
              variant={activeTab === 'events' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setActiveTab('events')}
              className="py-1 px-3 text-xs font-mono-ui"
            >
              <Activity className="w-3.5 h-3.5 me-1.5" />
              <span>Canonical Events ({CANONICAL_EVENT_REGISTRY.length})</span>
            </Button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter domains or events..."
              className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-signal)] font-mono-ui"
            />
          </div>
        </div>

        {/* Tab Content: Domains */}
        {activeTab === 'domains' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {filteredDomains.map((domain) => (
              <Card
                key={domain.id}
                id={`modal-domain-${domain.id.toLowerCase()}`}
                variant="default"
                padding="sm"
                className="space-y-2 hover:border-[var(--accent-signal)] transition-colors"
              >
                <div className="flex items-center justify-between font-mono-ui text-xs">
                  <span className="px-2 py-0.5 bg-[var(--surface-card)] text-[var(--accent-signal)] border border-[var(--border-color)] rounded font-bold">
                    {domain.id}
                  </span>
                  <span className="text-[10px] text-[var(--status-success)] flex items-center gap-1 font-semibold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)]" />
                    {domain.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-ui-body-bold text-xs font-bold text-[var(--text-primary)]">
                    {domain.name}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    {domain.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono-ui text-[var(--text-tertiary)]">
                  <span>Code: {domain.codeName}</span>
                  <span>v{domain.version}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab Content: Canonical Events */}
        {activeTab === 'events' && (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1 font-mono-ui text-xs">
            {filteredEvents.map((evt) => (
              <div
                key={evt.type}
                className="p-2.5 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] flex items-start justify-between gap-2"
              >
                <div>
                  <span className="text-[var(--accent-signal)] font-bold">{evt.type}</span>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-sans">
                    {evt.description}
                  </p>
                </div>
                <span className="text-[10px] bg-[var(--surface-card)] px-1.5 py-0.5 text-[var(--text-secondary)] rounded border border-[var(--border-color)] shrink-0">
                  Publisher: {evt.publisherDomain}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
