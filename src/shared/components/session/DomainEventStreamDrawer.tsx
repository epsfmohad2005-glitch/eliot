/**
 * @file src/shared/components/session/DomainEventStreamDrawer.tsx
 * @description Real-Time Live Streaming Drawer for Canonical Domain Events.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BaseDomainEvent } from '../../../types';
import { eventBus } from '../../../core/events';
import { X, Activity, Radio, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui';

export interface DomainEventStreamDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainEventStreamDrawer: React.FC<DomainEventStreamDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [events, setEvents] = useState<readonly BaseDomainEvent[]>([]);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const streamBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setEvents(eventBus.getHistory());

    const sub = eventBus.subscribeAll((event) => {
      if (!isPaused) {
        setEvents(eventBus.getHistory());
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [isOpen, isPaused]);

  useEffect(() => {
    if (!isPaused && streamBottomRef.current) {
      streamBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, isPaused]);

  if (!isOpen) return null;

  return (
    <div
      id="domain-event-stream-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-stream-title"
    >
      <div className="w-full max-w-md h-full bg-[var(--surface-canvas)] border-s border-[var(--border-color)] flex flex-col shadow-2xl font-sans">
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--surface-card)]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[var(--accent-signal)] animate-pulse" />
            <h2 id="event-stream-title" className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">
              Live Event Stream
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-ui bg-[var(--surface-low)] text-[var(--accent-signal)] border border-[var(--border-color)]">
              {events.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="text-xs font-mono-ui py-1 px-2 h-7"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-7 w-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Close event stream drawer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Live Stream List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono-ui text-xs">
          {events.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center text-[var(--text-tertiary)]">
              Awaiting published domain events...
            </div>
          ) : (
            events.map((evt) => {
              const isExpanded = expandedEventId === evt.eventId;
              return (
                <div
                  key={evt.eventId}
                  className="p-2.5 rounded-[var(--mode-radius)] bg-[var(--surface-low)] border border-[var(--border-color)] space-y-1.5 transition-all"
                >
                  <div
                    onClick={() => setExpandedEventId(isExpanded ? null : evt.eventId)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--surface-card)] text-[var(--accent-signal)] border border-[var(--border-color)] font-bold">
                        {evt.sourceDomain}
                      </span>
                      <span className="font-bold text-[var(--text-primary)] truncate">
                        {evt.eventType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] shrink-0">
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-2 border-t border-[var(--border-color)] space-y-1 text-[11px]">
                      <div className="text-[var(--text-secondary)]">
                        <span className="text-[var(--text-tertiary)]">ID: </span>
                        {evt.eventId}
                      </div>
                      {evt.correlationId && (
                        <div className="text-[var(--text-secondary)]">
                          <span className="text-[var(--text-tertiary)]">Correlation: </span>
                          {evt.correlationId}
                        </div>
                      )}
                      <pre className="p-2 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] text-[10px] overflow-x-auto text-[var(--text-primary)] mt-1">
                        {JSON.stringify(evt.payload, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={streamBottomRef} />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border-color)] bg-[var(--surface-card)] flex items-center justify-between font-mono-ui text-xs text-[var(--text-secondary)]">
          <span>Broker: InMemoryEventBus</span>
          <span className="flex items-center gap-1 text-[var(--status-success)] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--status-success)] animate-ping" />
            Connected
          </span>
        </div>
      </div>
    </div>
  );
};
