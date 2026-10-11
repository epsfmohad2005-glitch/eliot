/**
 * @file src/shared/components/memory/MemoryTimelineView.tsx
 * @description Spaced Repetition Memory Timeline & Ebbinghaus Decay Curve Visualizer for DOM-002.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { memoryDomainService } from '../../../domains/dom-002-memory';
import { MemoryItemEntity } from '../../../types';
import { useLanguage } from '../../../i18n';
import { Clock, Activity, Calendar, RotateCcw, ShieldCheck, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface MemoryTimelineViewProps {
  onTriggerReviewSession?: (conceptId: string) => void;
}

export const MemoryTimelineView: React.FC<MemoryTimelineViewProps> = ({ onTriggerReviewSession }) => {
  const { t, isRTL } = useLanguage();
  const [memoryItems, setMemoryItems] = useState<readonly MemoryItemEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRecalculated, setLastRecalculated] = useState<string>('');


  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = async () => {
    setLoading(true);
    const res = await memoryDomainService.recalculateDecay();
    if (res.ok) {
      setMemoryItems(res.value);
      setLastRecalculated(new Date().toLocaleTimeString());
    }
    setLoading(false);
  };

  const handleRecalculateDecay = async () => {
    const res = await memoryDomainService.recalculateDecay();
    if (res.ok) {
      setMemoryItems(res.value);
      setLastRecalculated(new Date().toLocaleTimeString());
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] animate-pulse">
        Recalculating Ebbinghaus Memory Decay Curves...
      </div>
    );
  }

  // Count nodes requiring review (Retention R(t) < 0.65)
  const itemsRequiringReview = memoryItems.filter((m) => m.retentionScore < 0.65);

  return (
    <div id="memory-timeline-container" className="space-y-6 font-sans antialiased max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-sky-400 font-semibold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>DOM-002 • Cognitive Memory Domain</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Memory Decay Timeline &amp; Spaced Repetition
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
            Ebbinghaus Decay Engine: R(t) = exp(-t / (S • c<sub>diff</sub>)) • Decay Floor = 0.35
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRecalculateDecay}
            className="px-3 py-1.5 bg-[var(--surface-low)] hover:bg-[var(--surface-high)] text-[var(--text-secondary)] rounded-lg border border-[var(--border-color)] font-mono text-xs flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Recalculate Decay</span>
          </button>
        </div>
      </div>

      {/* Review Alert Banner (if items are due for review) */}
      {itemsRequiringReview.length > 0 ? (
        <div className="bg-[var(--status-warning)]/40 border border-[var(--status-warning)]/80 rounded-xl p-4 font-mono text-xs text-[var(--status-warning)] flex items-center flex-wrap justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--status-warning)] shrink-0" />
            <span>
              {itemsRequiringReview.length} concept node(s) have dropped below optimal retention threshold (R(t) &lt; 0.65).
            </span>
          </div>
          <span className="text-[10px] bg-[var(--status-warning)]/80 px-2 py-0.5 rounded border border-[var(--status-warning)] text-[var(--status-warning)] font-semibold">
            Review Recommended
          </span>
        </div>
      ) : (
        <div className="bg-[var(--surface-card)]/60 border border-[var(--border-color)] rounded-xl p-4 font-mono text-xs text-[var(--status-success)] flex items-center flex-wrap justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--status-success)]" />
            <span>All memory items are operating within high stability parameters. Zero critical decay detected.</span>
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">Updated {lastRecalculated}</span>
        </div>
      )}

      {/* Memory Items Spaced Repetition Cards */}
      <div className="space-y-4">
        <div className="flex items-center flex-wrap justify-between gap-2 text-xs font-mono text-[var(--text-secondary)]">
          <span className="uppercase font-bold tracking-wider">Active Memory Nodes ({memoryItems.length})</span>
          <span>Sort: Next Review Date</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memoryItems.map((item) => {
            const retentionPercent = Math.round(item.retentionScore * 100);
            const stabilityDays = item.memoryStability;
            const isDueSoon = item.retentionScore < 0.65;
            const lastPracticed = new Date(item.lastPracticedAt).toLocaleDateString();
            const nextReview = new Date(item.nextReviewDueAt).toLocaleDateString();

            return (
              <div
                key={item.id}
                id={`memory-item-${item.id}`}
                className={`bg-[var(--surface-card)] border rounded-xl p-5 shadow-md space-y-4 transition-all ${
                  isDueSoon ? 'border-[var(--status-warning)]/80 bg-[var(--surface-card)]/90' : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--surface-low)] text-indigo-300 border border-[var(--border-color)] rounded font-semibold">
                      {item.conceptId || item.skillId}
                    </span>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] font-sans mt-2">
                      {item.conceptId === 'CPT-SYS-MONADIC-RESULT'
                        ? 'Monadic Result Type Container'
                        : item.conceptId === 'CPT-SYS-ASYNC-DISPATCH'
                        ? 'Async Event Dispatcher Subscriptions'
                        : item.skillId}
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <span
                      className={`text-base font-extrabold ${
                        isDueSoon ? 'text-[var(--status-warning)]' : 'text-[var(--status-success)]'
                      }`}
                    >
                      {retentionPercent}%
                    </span>
                    <span className="block text-[9px] text-[var(--text-muted)] uppercase">Retention R(t)</span>
                  </div>
                </div>

                {/* Retention Bar Track */}
                <div className="space-y-1 font-mono text-xs">
                  <div className="w-full h-2 bg-[var(--surface-low)] rounded-full overflow-hidden border border-[var(--border-color)]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isDueSoon
                          ? 'bg-[var(--status-warning)]'
                          : retentionPercent >= 80
                          ? 'bg-[var(--status-success)]'
                          : 'bg-sky-400'
                      }`}
                      style={{ width: `${retentionPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] pt-0.5">
                    <span>Decay Floor: 0.35</span>
                    <span>Target: &gt;0.80</span>
                  </div>
                </div>

                {/* Timeline Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-color)]/80 font-mono text-xs text-[var(--text-secondary)]">
                  <div className="bg-[var(--surface-low)] p-2.5 rounded border border-[var(--border-color)]/80">
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Stability (S)</span>
                    <span className="text-[var(--text-primary)] font-bold mt-0.5 block">{stabilityDays} Days</span>
                  </div>

                  <div className="bg-[var(--surface-low)] p-2.5 rounded border border-[var(--border-color)]/80">
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Confidence (K<sub>c</sub>)</span>
                    <span className="text-sky-400 font-bold mt-0.5 block">{item.confidenceScore}</span>
                  </div>

                  <div className="bg-[var(--surface-low)] p-2.5 rounded border border-[var(--border-color)]/80 col-span-2 flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">Last Practiced: {lastPracticed}</span>
                    <span className="text-indigo-400 font-semibold">Next Review: {nextReview}</span>
                  </div>
                </div>

                {/* Optional Review CTA */}
                {onTriggerReviewSession && (
                  <button
                    onClick={() => onTriggerReviewSession(item.conceptId || item.skillId)}
                    className="w-full py-2 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-primary)] rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[var(--border-color)]"
                  >
                    <span>Launch Spaced Practice Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
