/**
 * @file src/shared/components/session/DomainEventAuditLogView.tsx
 * @description Master Audit Log Table for Canonical Domain Events.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BaseDomainEvent, CanonicalEventType, DomainId } from '../../../types';
import { eventBus } from '../../../core/events';
import { Card, Button } from '../ui';
import { Activity, Filter, Trash2, ChevronRight, Hash, Clock } from 'lucide-react';

export interface DomainEventAuditLogViewProps {
  maxEvents?: number;
  domainFilter?: DomainId;
  className?: string;
  onClear?: () => void;
}

export const DomainEventAuditLogView: React.FC<DomainEventAuditLogViewProps> = ({
  maxEvents = 100,
  domainFilter,
  className = '',
  onClear,
}) => {
  const [events, setEvents] = useState<readonly BaseDomainEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<BaseDomainEvent | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'ALL'>(domainFilter || 'ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Initial fetch
    setEvents(eventBus.getHistory());

    // Subscribe to all new events
    const sub = eventBus.subscribeAll((event) => {
      setEvents(eventBus.getHistory());
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const filteredEvents = events
    .filter((e) => selectedDomain === 'ALL' || e.sourceDomain === selectedDomain)
    .filter(
      (e) =>
        e.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.correlationId && e.correlationId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.payload !== undefined && e.payload !== null ? JSON.stringify(e.payload).toLowerCase() : '').includes(searchQuery.toLowerCase())
    )
    .slice(-maxEvents)
    .reverse();

  return (
    <Card
      id="domain-event-audit-log-view"
      variant="default"
      padding="sm"
      className={`space-y-3 font-sans ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--accent-signal)]" />
          <h3 className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">
            Domain Event Audit Log
          </h3>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono-ui bg-[var(--surface-low)] text-[var(--accent-signal)] border border-[var(--border-color)]">
            {filteredEvents.length} Events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search event type, correlation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] px-2.5 py-1 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] font-mono-ui focus:outline-none focus:border-[var(--accent-signal)]"
          />
          {onClear && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClear}
              className="py-1 px-2 text-xs font-mono-ui"
              title="Clear event logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[300px] max-h-[500px]">
        {/* Events Table / Stream */}
        <div className="lg:col-span-7 overflow-y-auto space-y-1.5 pr-1 font-mono-ui text-xs">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-tertiary)] border border-dashed border-[var(--border-color)] rounded-[var(--mode-radius)]">
              No domain events recorded yet.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const isSelected = selectedEvent?.eventId === evt.eventId;
              return (
                <div
                  key={evt.eventId}
                  onClick={() => setSelectedEvent(evt)}
                  className={`p-2 rounded-[var(--mode-radius)] border cursor-pointer transition-colors flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[var(--surface-high)] border-[var(--accent-signal)]'
                      : 'bg-[var(--surface-low)] border-[var(--border-color)] hover:border-[var(--border-color-focus)]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--surface-card)] text-[var(--accent-signal)] border border-[var(--border-color)] font-bold shrink-0">
                      {evt.sourceDomain}
                    </span>
                    <span className="font-bold text-[var(--text-primary)] truncate">
                      {evt.eventType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] shrink-0">
                    <Clock className="w-3 h-3 text-[var(--text-tertiary)]" />
                    <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Event Detail Inspector */}
        <div className="lg:col-span-5 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] p-3 overflow-y-auto font-mono-ui text-xs">
          {selectedEvent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--accent-signal)] font-bold">
                  {selectedEvent.eventType}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  {selectedEvent.sourceDomain}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="text-[var(--text-secondary)]">
                  <span className="text-[var(--text-tertiary)]">Event ID: </span>
                  {selectedEvent.eventId}
                </div>
                <div className="text-[var(--text-secondary)]">
                  <span className="text-[var(--text-tertiary)]">Correlation: </span>
                  {selectedEvent.correlationId || 'N/A'}
                </div>
                <div className="text-[var(--text-secondary)]">
                  <span className="text-[var(--text-tertiary)]">Timestamp: </span>
                  {selectedEvent.timestamp}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[var(--text-tertiary)] font-bold tracking-wider">
                  Payload:
                </span>
                <pre className="mt-1 p-2 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] text-[10px] overflow-x-auto text-[var(--text-primary)]">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-tertiary)] text-center">
              Select an event to inspect payload and correlation metadata.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
