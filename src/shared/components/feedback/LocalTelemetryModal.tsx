/**
 * @file src/shared/components/feedback/LocalTelemetryModal.tsx
 * @description Local Privacy Telemetry Audit Modal for inspecting local anonymous telemetry events.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Trash2, X, Activity, BarChart2, CheckCircle2 } from 'lucide-react';
import { localTelemetryService, LocalTelemetryMetrics } from '../../../domains/dom-012-analytics';
import { useLanguage } from '../../../i18n';

interface LocalTelemetryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalTelemetryModal: React.FC<LocalTelemetryModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<LocalTelemetryMetrics | null>(null);
  const [cleared, setCleared] = useState<boolean>(false);


  useEffect(() => {
    if (isOpen) {
      loadMetrics();
      setCleared(false);
    }
  }, [isOpen]);

  const loadMetrics = () => {
    const res = localTelemetryService.getMetrics();
    if (res.ok) {
      setMetrics(res.value);
    }
  };

  const handleClear = () => {
    localTelemetryService.clearTelemetry();
    setCleared(true);
    loadMetrics();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--surface-low)]/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div
        id="local-telemetry-audit-modal"
        className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-6 shadow-2xl max-w-lg w-full space-y-5 text-[var(--text-primary)] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--surface-high)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-[var(--border-color)] pb-3">
          <div className="p-2 bg-[var(--status-success)] text-[var(--status-success)] border border-[var(--status-success)]/80 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">Local Privacy Telemetry Audit</h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono">100% Private • Stored locally in LocalStorage</p>
          </div>
        </div>

        {metrics && (
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Sessions Completed</span>
              <span className="text-base font-bold text-[var(--status-success)]">{metrics.totalSessionsCompleted}</span>
            </div>

            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Total Focus Time</span>
              <span className="text-base font-bold text-indigo-400">
                {Math.round(metrics.totalFocusDurationSeconds / 60)} Mins
              </span>
            </div>

            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Reflections Submitted</span>
              <span className="text-base font-bold text-purple-400">{metrics.totalReflectionsSubmitted}</span>
            </div>

            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Evidence Records</span>
              <span className="text-base font-bold text-sky-400">{metrics.totalEvidenceSubmissions}</span>
            </div>

            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Avg Reflection Quality</span>
              <span className="text-base font-bold text-[var(--status-warning)]">{Math.round(metrics.avgReflectionQualityScore * 100)}%</span>
            </div>

            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg space-y-1">
              <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold block">Pauses / Resumes</span>
              <span className="text-base font-bold text-[var(--text-secondary)]">{metrics.pauseCount} / {metrics.resumeCount}</span>
            </div>
          </div>
        )}

        {cleared ? (
          <div className="p-3 bg-[var(--status-success)]/60 border border-[var(--status-success)] rounded-lg text-xs font-mono text-[var(--status-success)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--status-success)]" />
            <span>Local telemetry logs purged successfully.</span>
          </div>
        ) : (
          <div className="pt-2 border-t border-[var(--border-color)] flex justify-between items-center font-mono text-xs">
            <span className="text-[var(--text-muted)] text-[11px]">No cloud servers or analytics beacons.</span>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 bg-[var(--status-error)]/20 hover:opacity-80 text-[var(--status-error)] border border-[var(--status-error)]/40 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Local Telemetry</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
