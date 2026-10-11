/**
 * @file src/shared/components/boot/BootSequenceView.tsx
 * @description FCS-1 Redesigned Boot Sequence View — Personal Cognitive OS Initialization
 * @license Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { BootEngine, BootProgressState } from '../../../core/boot';
import { ENVIRONMENT_CONFIG } from '../../../config';
import { Cpu, CheckCircle2, ShieldCheck, Zap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../../i18n';
import { WorkspaceSurface, Card, ProgressBar, Button } from '../ui';

interface BootSequenceViewProps {
  onBootComplete: () => void;
}

export const BootSequenceView: React.FC<BootSequenceViewProps> = ({ onBootComplete }) => {
  const { t } = useLanguage();
  const [bootState, setBootState] = useState<BootProgressState | null>(null);
  const [isFastBoot, setIsFastBoot] = useState<boolean>(false);
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const engineRef = useRef<BootEngine | null>(null);

  useEffect(() => {
    const engine = new BootEngine((state) => {
      setBootState(state);
    });
    engineRef.current = engine;

    engine
      .executeBootSequence()
      .then((finalState) => {
        if (finalState.isComplete) {
          // Smooth transition timeout
          setTimeout(() => {
            onBootComplete();
          }, 400);
        }
      })
      .catch((err) => {
        console.warn('[BootSequenceView] Boot sequence exception caught:', err);
        // Ensure user can still enter application even if a boot self-test has a warning
        setTimeout(() => {
          onBootComplete();
        }, 800);
      });

    // Keyboard shortcut to accelerate boot
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        engine.setFastMode(true);
        setIsFastBoot(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBootComplete]);

  const handleAccelerate = () => {
    if (engineRef.current) {
      engineRef.current.setFastMode(true);
      setIsFastBoot(true);
    }
  };

  const completedStepsCount = bootState?.steps.filter((s) => s.status === 'completed').length ?? 0;
  const totalStepsCount = bootState?.steps.length ?? 0;
  const currentStep = bootState?.steps.find((s) => s.id === bootState.currentStepId);

  return (
    <WorkspaceSurface
      id="plos-boot-sequence-container"
      className="min-h-screen flex flex-col justify-between p-6 sm:p-12 select-none transition-opacity duration-200 ease-out-quad scanlines"
      aria-label="System Boot Initialization"
    >
      {/* Top Kernel Identifier Bar */}
      <header className="max-w-xl w-full mx-auto flex items-center justify-between pb-4 border-b border-[var(--border-color)] text-xs font-mono-ui">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-signal)] animate-pulse me-1"></span>
          <span className="font-semibold text-[var(--text-primary)] tracking-wider">ELIOT KERNEL</span>
          <span className="text-[var(--text-tertiary)]">|</span>
          <span className="text-[var(--text-secondary)]">v{ENVIRONMENT_CONFIG.appVersion}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
          <span>{ENVIRONMENT_CONFIG.sprintStage}</span>
        </div>
      </header>

      {/* Main Centered Boot Surface */}
      <main className="max-w-xl w-full mx-auto my-auto py-12 space-y-8" role="status" aria-live="polite">
        {/* Title & Core Focal Point */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--surface-low)] border border-[var(--border-color)] mb-2 shadow-sm scan-sweep">
            <Cpu className="w-6 h-6 text-[var(--accent-signal)]" />
          </div>
          <span className="bracket-label">boot sequence</span>
          <h1 className="font-headline-md text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Initializing Personal Learning OS
          </h1>
          <p
            className="font-ui-body text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed type-in"
            style={{ '--chars': 54 } as React.CSSProperties}
          >
            Zero-exception kernel boot sequence &amp; offline storage verification.
          </p>
        </div>

        {/* Progress System */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-ui">
            <span className="text-[var(--text-secondary)] font-medium">
              {currentStep ? currentStep.title : 'Preparing Mission Control...'}
            </span>
            <span className="text-[var(--text-primary)] font-bold">
              {bootState?.overallProgressPercent ?? 0}%
            </span>
          </div>
          <ProgressBar
            value={bootState?.overallProgressPercent ?? 0}
            size="md"
            variant="primary"
          />
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1 font-mono-ui">
            <span>
              {completedStepsCount} of {totalStepsCount} modules verified
            </span>
            <span>{isFastBoot ? '⚡ Accelerated Boot' : 'Standard Rate'}</span>
          </div>
        </div>

        {/* Module Steps List */}
        <Card variant="default" padding="sm" className="space-y-2">
          {bootState?.steps.map((step) => {
            const isCurrent = bootState.currentStepId === step.id && step.status === 'in_progress';
            const isCompleted = step.status === 'completed';

            return (
              <div
                key={step.id}
                id={`boot-step-${step.id}`}
                className={`p-3 rounded-[var(--mode-radius)] border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[var(--surface-low)] border-[var(--accent-signal)] text-[var(--text-primary)] shadow-sm'
                    : isCompleted
                    ? 'bg-[var(--surface-card)] border-[var(--border-color)]/60 text-[var(--text-secondary)]'
                    : 'bg-[var(--surface-low)]/30 border-[var(--border-color)]/30 text-[var(--text-tertiary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent-signal)] shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-[var(--accent-signal)] border-t-transparent animate-spin shrink-0"></span>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-[var(--border-color)] shrink-0"></span>
                    )}
                    <span className="font-ui-body-bold text-xs font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono-ui">
                    {isCompleted && step.durationMs !== undefined && (
                      <span className="text-[var(--text-tertiary)]">{step.durationMs}ms</span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-[var(--surface-low)] text-[var(--accent-signal)] border border-[var(--border-color)]'
                          : isCurrent
                          ? 'bg-[var(--surface-low)] text-[var(--text-primary)] border border-[var(--accent-signal)]'
                          : 'bg-[var(--surface-low)] text-[var(--text-tertiary)] border border-[var(--border-color)]/40'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>

                {/* Optional Diagnostics Details Inline if expanded */}
                {showDiagnostics && step.diagnostics && (
                  <div className="mt-2 pt-2 border-t border-[var(--border-color)] text-[11px] font-mono-ui text-[var(--text-secondary)] flex items-start gap-1.5">
                    <span className="text-[var(--accent-signal)] font-bold me-1">&gt;</span>
                    <span>{step.diagnostics}</span>
                  </div>
                )}
              </div>
            );
          })}
        </Card>

        {/* Diagnostics Toggle & Fast Boot Control */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono-ui"
            aria-expanded={showDiagnostics}
          >
            {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5 me-1" /> : <ChevronDown className="w-3.5 h-3.5 me-1" />}
            <span>{showDiagnostics ? 'Hide Diagnostics' : 'System Diagnostics'}</span>
          </Button>

          <div>
            {!isFastBoot ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAccelerate}
                className="font-mono-ui text-xs glow-signal"
              >
                <Zap className="w-3.5 h-3.5 text-[var(--status-warning)] me-1" />
                <span>Fast Boot [Space]</span>
              </Button>
            ) : (
              <span className="text-[var(--status-warning)] font-mono-ui text-xs flex items-center gap-1 font-semibold">
                <Zap className="w-3.5 h-3.5" /> Accelerated Mode
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Footer System Hash Bar */}
      <footer className="max-w-xl w-full mx-auto pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[11px] font-mono-ui text-[var(--text-tertiary)]">
        <span>SHA-256 SIGNATURE: 8F2E...4B91</span>
        <span className="flex items-center gap-1 text-[var(--text-secondary)] terminal-cursor">
          Ready <ArrowRight className="w-3 h-3 text-[var(--accent-signal)] ms-1" /> Mission Control
        </span>
      </footer>
    </WorkspaceSurface>
  );
};
