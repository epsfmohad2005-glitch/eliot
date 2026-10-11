/**
 * @file src/shared/components/boot/OnboardingModal.tsx
 * @description First-Time User Onboarding Modal & Guided Orientation for Eliot PLOS.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import {
  Layers,
  Brain,
  ShieldCheck,
  Zap,
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Target,
  Key,
} from 'lucide-react';
import { localTelemetryService } from '../../../domains/dom-012-analytics';
import { useLanguage } from '../../../i18n';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPath?: (pathId: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onSelectPath }) => {
  const { t, isRTL } = useLanguage();
  const [step, setStep] = useState<number>(1);
  const [selectedPath, setSelectedPath] = useState<string>('typescript_fundamentals');
  const [cadence, setCadence] = useState<number>(20);

  if (!isOpen) return null;

  const markCompleted = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('eliot_onboarding_completed', 'true');
    }
  };

  const handleDismiss = () => {
    // Closing via the X (without finishing all 4 steps) still counts as
    // "seen it" — it must never reappear on every reload just because the
    // user didn't click through to the end.
    markCompleted();
    onClose();
  };

  const handleFinish = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      markCompleted();
      window.localStorage.setItem('eliot_study_cadence_mins', cadence.toString());
      window.localStorage.setItem('eliot_selected_learning_path', selectedPath);
    }
    localTelemetryService.trackEvent('SESSION_START', { onboarding: true, path: selectedPath });
    if (onSelectPath) {
      onSelectPath(selectedPath);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--surface-low)]/85 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div
        id="first-run-onboarding-modal"
        className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full space-y-6 text-[var(--text-primary)] relative overflow-hidden"
      >
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-signal)]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header indicator */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--surface-low)] border border-[var(--accent-signal)]/40 rounded-xl text-[var(--accent-signal)]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent-signal)] font-bold block">
                {t('onboarding.guidedOrientation')} • {t('onboarding.stepOf', { step, total: 4 })}
              </span>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('onboarding.welcomeTitle')}</h2>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-high)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Philosophy & PLOS Definition */}
        {step === 1 && (
          <div className="space-y-4 font-sans leading-relaxed animate-fade-in">
            <div className="p-4 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[var(--accent-signal)] font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[var(--accent-signal)]" />
                <span>{t('onboarding.whatIsPlosTitle')}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t('onboarding.whatIsPlosDesc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              <div className="p-3 bg-[var(--surface-low)]/60 border border-[var(--border-color)]/80 rounded-lg space-y-1">
                <span className="font-mono text-[var(--accent-signal)] font-bold text-[11px] block">{t('onboarding.point1Title')}</span>
                <p className="text-[var(--text-secondary)] text-[11px]">
                  {t('onboarding.point1Desc')}
                </p>
              </div>

              <div className="p-3 bg-[var(--surface-low)]/60 border border-[var(--border-color)]/80 rounded-lg space-y-1">
                <span className="font-mono text-[var(--accent-signal)] font-bold text-[11px] block">{t('onboarding.point2Title')}</span>
                <p className="text-[var(--text-secondary)] text-[11px]">
                  {t('onboarding.point2Desc')}
                </p>
              </div>

              <div className="p-3 bg-[var(--surface-low)]/60 border border-[var(--border-color)]/80 rounded-lg space-y-1">
                <span className="font-mono text-[var(--accent-signal)] font-bold text-[11px] block">{t('onboarding.point3Title')}</span>
                <p className="text-[var(--text-secondary)] text-[11px]">
                  {t('onboarding.point3Desc')}
                </p>
              </div>

              <div className="p-3 bg-[var(--surface-low)]/60 border border-[var(--border-color)]/80 rounded-lg space-y-1">
                <span className="font-mono text-[var(--accent-signal)] font-bold text-[11px] block">{t('onboarding.point4Title')}</span>
                <p className="text-[var(--text-secondary)] text-[11px]">
                  {t('onboarding.point4Desc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Choose Initial Learning Path */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in font-sans">
            <span className="text-xs font-mono uppercase text-[var(--text-secondary)] font-bold block">
              {t('onboarding.selectPathTitle')}
            </span>

            <div className="grid grid-cols-1 gap-3">
              <div
                onClick={() => setSelectedPath('typescript_fundamentals')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPath === 'typescript_fundamentals'
                    ? 'bg-[var(--accent-signal)]/15 border-[var(--accent-signal)] shadow-md shadow-[var(--accent-signal)]/20'
                    : 'bg-[var(--surface-low)] border-[var(--border-color)] hover:border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-[var(--accent-signal)]" />
                    <span className="font-bold text-sm text-[var(--text-primary)]">{t('onboarding.tsPathTitle')}</span>
                  </div>
                  {selectedPath === 'typescript_fundamentals' && (
                    <CheckCircle2 className="w-5 h-5 text-[var(--accent-signal)]" />
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2 font-sans">
                  {t('onboarding.tsPathDesc')}
                </p>
              </div>

              <div
                onClick={() => setSelectedPath('distributed_systems')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedPath === 'distributed_systems'
                    ? 'bg-[var(--accent-signal)]/15 border-[var(--accent-signal)] shadow-md shadow-[var(--accent-signal)]/20'
                    : 'bg-[var(--surface-low)] border-[var(--border-color)] hover:border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Target className="w-5 h-5 text-sky-400" />
                    <span className="font-bold text-sm text-[var(--text-primary)]">{t('onboarding.distSysTitle')}</span>
                  </div>
                  {selectedPath === 'distributed_systems' && (
                    <CheckCircle2 className="w-5 h-5 text-sky-400" />
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2 font-sans">
                  {t('onboarding.distSysDesc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Configure Study Cadence */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in font-sans">
            <span className="text-xs font-mono uppercase text-[var(--text-secondary)] font-bold block">
              {t('onboarding.selectCadenceTitle')}
            </span>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('onboarding.selectCadenceDesc')}
            </p>

            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              {[15, 20, 30].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setCadence(mins)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    cadence === mins
                      ? 'bg-[var(--accent-signal)] border-[var(--accent-signal)] text-[var(--accent-on-signal)] font-bold shadow-lg'
                      : 'bg-[var(--surface-low)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--surface-high)]'
                  }`}
                >
                  <Clock className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <span className="text-base font-bold block">{t('onboarding.cadenceMins', { mins })}</span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-sans block mt-1">{t('onboarding.dailyTarget')}</span>
                </button>
              ))}
            </div>

            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] font-mono">
              <span>{t('onboarding.selectedCadence', { mins: cadence })}</span>
            </div>
          </div>
        )}

        {/* Step 4: Core Engine Verification */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in font-sans">
            <div className="p-4 bg-[var(--status-success)]/40 border border-[var(--status-success)]/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[var(--status-success)] font-mono text-xs font-bold">
                <ShieldCheck className="w-5 h-5 text-[var(--status-success)]" />
                <span>{t('onboarding.systemInitComplete')}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                {t('onboarding.systemInitDesc', { path: selectedPath })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg flex items-center gap-2">
                <Brain className="w-4 h-4 text-[var(--accent-signal)]" />
                <span>{t('onboarding.knowledgeGraphInit')}</span>
              </div>
              <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-lg flex items-center gap-2">
                <Key className="w-4 h-4 text-[var(--status-warning)]" />
                <span>{t('onboarding.localLedgerReady')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] font-mono text-xs">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-[var(--surface-high)] hover:bg-[var(--surface-bright)] text-[var(--text-primary)] rounded-lg transition-colors"
            >
              {t('common.back')}
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-[var(--accent-signal)] hover:opacity-90 text-[var(--accent-on-signal)] font-bold rounded-lg shadow-md flex items-center gap-2 transition-all"
            >
              <span>{t('common.continue')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-[var(--status-success)] hover:opacity-90 text-[var(--accent-on-signal)] font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all"
            >
              <span>{t('onboarding.launchPlos')}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
