/**
 * @file src/shared/components/boot/MissionControlView.tsx
 * @description Mission Control Experience — Private Cognitive Command Center (SMS-2).
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dashboardDomainService, MissionControlData } from '../../../domains/dom-007-dashboard';
import { learningDomainService, StageChallengeData } from '../../../domains/dom-001-learning';
import { memoryDomainService } from '../../../domains/dom-002-memory';
import { MemoryItemEntity } from '../../../types';
import { EvaluationChallengeModal } from '../session';
import { useLanguage } from '../../../i18n';
import {
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Clock,
  ShieldCheck,
  Zap,
  Play,
  RotateCw,
  Compass,
  CheckCircle2,
  Info,
  Target,
  UploadCloud,
  BrainCircuit,
} from 'lucide-react';
import { WorkspaceSurface, Card, Button, ProgressBar } from '../ui';

interface MissionControlViewProps {
  onRebootRequest: () => void;
  onLaunchWorkspace?: () => void;
  onOpenImport?: () => void;
}

export const MissionControlView: React.FC<MissionControlViewProps> = ({ onRebootRequest, onLaunchWorkspace, onOpenImport }) => {
  const { t } = useLanguage();
  const [data, setData] = useState<MissionControlData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasInterruptedDraft, setHasInterruptedDraft] = useState<boolean>(false);
  const [dueItems, setDueItems] = useState<readonly MemoryItemEntity[]>([]);
  const [activeReviewItem, setActiveReviewItem] = useState<MemoryItemEntity | null>(null);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [challengeData, setChallengeData] = useState<StageChallengeData | null>(null);
  const [isChallengeLoading, setIsChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  useEffect(() => {
    loadMissionControlData();
    checkDraftSession();
    loadDueReviews();
  }, []);

  const loadDueReviews = async () => {
    const res = await memoryDomainService.getItemsDueForReview();
    if (res.ok) setDueItems(res.value);
  };

  const startReview = async (item: MemoryItemEntity) => {
    setActiveReviewItem(item);
    setIsChallengeOpen(true);
    setIsChallengeLoading(true);
    setChallengeError(null);
    setChallengeData(null);

    const res = await learningDomainService.requestStageChallenge({
      skill: item.skillId,
      objective: item.conceptId || item.skillId,
    });
    if (res.ok) {
      setChallengeData(res.value);
    } else {
      setChallengeError('Could not generate a review challenge right now. Please try again.');
    }
    setIsChallengeLoading(false);
  };

  const handleReviewPassed = async () => {
    if (!activeReviewItem) return;
    // A passed review is a successful active-recall event — feed it back
    // into the memory engine so the decay clock resets and this item drops
    // off the due list until it's naturally due again.
    await memoryDomainService.recordPracticeEvent(activeReviewItem.skillId, 0.9);
    await loadDueReviews();
  };

  const checkDraftSession = async () => {
    const res = await learningDomainService.hasInterruptedSession();
    if (res.ok && res.value) {
      setHasInterruptedDraft(true);
    }
  };

  const handleResumeDraft = async () => {
    await learningDomainService.restoreInterruptedSession();
    if (onLaunchWorkspace) {
      onLaunchWorkspace();
    }
  };

  const loadMissionControlData = async () => {
    setLoading(true);
    const result = await dashboardDomainService.getMissionControlData();
    if (result.ok) {
      setData(result.value);
    }
    setLoading(false);
  };

  const handleUpdateProgress = async (newProgress: number) => {
    const result = await dashboardDomainService.updateMissionProgress(newProgress);
    if (result.ok) {
      setData(result.value);
    }
  };

  const handleToggleAttention = async () => {
    const result = await dashboardDomainService.toggleAttentionIntervention();
    if (result.ok) {
      setData(result.value);
    }
  };

  const handlePrimaryCTA = () => {
    if (onLaunchWorkspace) {
      onLaunchWorkspace();
    } else {
      if (!data) return;
      if (data.mission.progressPercent >= 100) {
        handleUpdateProgress(0);
      } else {
        handleUpdateProgress(Math.min(100, data.mission.progressPercent + 25));
      }
    }
  };

  if (loading || !data) {
    return (
      <WorkspaceSurface className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center text-xs font-mono-ui text-[var(--text-secondary)] animate-pulse">
          Initializing Mission Control State...
        </div>
      </WorkspaceSurface>
    );
  }

  const { identity, mission, primaryActionLabel, attention, systemStatus, isNearCompletion } = data;

  // Cognitive Rationale and Intention from Cognitive Model (No motivational quotes)
  const whyThisMattersReason =
    "Understanding event-driven reasoning and state isolation is required before constructing distributed learning workflows.";
  const todaysIntention = "Consolidate prerequisite concept mastery before advancing to next retention tier.";

  return (
    <WorkspaceSurface
      id="plos-mission-control"
      className="min-h-screen p-6 sm:p-12 transition-opacity duration-200 ease-out-quad"
      aria-label="Cognitive Command Center"
    >
      <div className="max-w-2xl mx-auto space-y-8 my-auto">
        {/* Top Eyebrow Question & Logotype */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-low)] border border-[var(--border-color)] text-[11px] font-mono-ui text-[var(--accent-signal)]">
            <Compass className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-widest">MISSION CONTROL • COGNITIVE COMMAND CENTER</span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight pt-1">
            What is the single most valuable cognitive action I should perform right now?
          </h1>
        </header>

        {/* Spaced-Review Due Banner — surfaces items the Memory Engine (DOM-002)
            has calculated are due, using the AI-generated challenge modal
            already built for stage gates. Only the single most-overdue item
            is offered at a time to avoid overwhelming the user. */}
        {dueItems.length > 0 && (
          <div className="bg-[var(--accent-signal)]/10 border border-[var(--accent-signal)]/40 rounded-[var(--mode-radius)] p-4 flex items-center flex-wrap justify-between gap-3">
            <div className="flex items-start gap-3">
              <BrainCircuit className="w-5 h-5 text-[var(--accent-signal)] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {dueItems.length} concept{dueItems.length > 1 ? 's' : ''} due for review
                </p>
                <p className="text-xs text-[var(--text-secondary)] font-mono-ui mt-0.5">
                  Retention decays over time — a quick check-in keeps it locked in.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => startReview(dueItems[0])}
              className="font-mono-ui text-xs"
            >
              Start Review
            </Button>
          </div>
        )}

        {/* Layer 4: Attention Intervention (Conditional - Only rendered if required) */}
        {(hasInterruptedDraft || attention.required) && (
          <div className="space-y-3" role="alert" aria-live="assertive">
            {hasInterruptedDraft && (
              <Card variant="interactive" padding="sm" className="border-l-4 border-l-[var(--accent-signal)]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono-ui">
                  <div className="flex items-center gap-3 text-[var(--text-primary)]">
                    <div className="p-2 rounded bg-[var(--surface-low)] text-[var(--accent-signal)]">
                      <RotateCw className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider block text-[10px] text-[var(--accent-signal)]">
                        Interrupted Session Draft Detected
                      </span>
                      <p className="font-ui-body text-xs text-[var(--text-secondary)] mt-0.5">
                        An unfinished learning session draft was restored from local-first storage.
                      </p>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={handleResumeDraft} className="whitespace-nowrap font-mono-ui">
                    <span>Resume Session</span>
                    <Play className="w-3.5 h-3.5 ms-1 fill-current" />
                  </Button>
                </div>
              </Card>
            )}

            {attention.required && (
              <Card variant="default" padding="sm" className="border-l-4 border-l-[var(--status-warning)]">
                <div className="space-y-2 font-mono-ui text-xs">
                  <div className="flex items-center flex-wrap justify-between gap-2 text-[var(--status-warning)] font-bold">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="uppercase tracking-wider">Attention Intervention Required</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleToggleAttention} className="text-xs text-[var(--text-secondary)]">
                      Dismiss
                    </Button>
                  </div>
                  <p className="font-ui-body text-xs text-[var(--text-secondary)]">
                    {attention.reason}
                  </p>
                  {attention.recommendedAction && (
                    <div className="pt-2 border-t border-[var(--border-color)] text-[11px] text-[var(--text-tertiary)] flex items-center flex-wrap justify-between gap-2">
                      <span>{attention.recommendedAction}</span>
                      <Button variant="secondary" size="sm" onClick={handleToggleAttention}>
                        Resolve Alert
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Main Cognitive Command Center Container */}
        <Card variant="default" padding="lg" className="space-y-8 shadow-md">
          {/* ========================================================================= */}
          {/* LAYER 1: TODAY'S MISSION (DOMINANT FOCAL POINT) */}
          {/* ========================================================================= */}
          <section id="layer-todays-mission" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-ui">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[var(--surface-low)] border border-[var(--border-color)] font-semibold text-[var(--accent-signal)] uppercase tracking-wider">
                  Today's Mission
                </span>
                <span className="text-[var(--text-tertiary)]">•</span>
                <span className="text-[var(--text-secondary)] font-medium">{mission.currentLesson}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
                <span>Est. {mission.estimatedTimeMinutes} min</span>
              </div>
            </div>

            <h2 className="font-headline-md text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight leading-snug">
              {mission.objective}
            </h2>

            {/* Mission Progress */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs font-mono-ui">
                <span className="text-[var(--text-secondary)]">Mission Progress</span>
                <span className="font-bold text-[var(--text-primary)]">{mission.progressPercent}%</span>
              </div>
              <ProgressBar value={mission.progressPercent} size="md" variant="primary" />
            </div>

            {/* Layer 1 Single Primary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                id="btn-resume-primary-cta"
                variant="primary"
                size="lg"
                onClick={handlePrimaryCTA}
                className="flex-1 py-4 text-base sm:text-lg font-bold shadow-sm justify-center group"
              >
                <span>{primaryActionLabel}</span>
                <ArrowRight className="w-5 h-5 ms-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              {onOpenImport && (
                <Button
                  id="btn-open-import-cta"
                  variant="secondary"
                  size="lg"
                  onClick={onOpenImport}
                  className="py-4 text-sm font-bold justify-center"
                >
                  <UploadCloud className="w-5 h-5 me-2 text-[var(--accent-signal)]" />
                  <span>Import Knowledge Source</span>
                </Button>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* LAYER 2: WHY THIS MATTERS (COGNITIVE RATIONALE) */}
          {/* ========================================================================= */}
          <section id="layer-why-this-matters" className="pt-4 border-t border-[var(--border-color)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-ui text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
              <span>Why This Matters</span>
            </div>
            <p className="font-ui-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {whyThisMattersReason}
            </p>
          </section>

          {/* ========================================================================= */}
          {/* LAYER 3: TODAY'S INTENTION (COGNITIVE OBJECTIVE) */}
          {/* ========================================================================= */}
          <section id="layer-todays-intention" className="pt-4 border-t border-[var(--border-color)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-ui text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
              <span>Today's Intention</span>
            </div>
            <p className="font-ui-body text-xs sm:text-sm text-[var(--text-primary)] font-medium leading-relaxed">
              {todaysIntention}
            </p>
          </section>
        </Card>

        {/* ========================================================================= */}
        {/* LAYER 5: QUIET INFORMATION (BOTTOM METADATA & SYSTEM STATUS) */}
        {/* ========================================================================= */}
        <footer id="layer-quiet-information" className="pt-4 border-t border-[var(--border-color)] space-y-4 text-xs font-mono-ui text-[var(--text-tertiary)]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-[var(--mode-radius)] bg-[var(--surface-low)] border border-[var(--border-color)]/60">
            <div>
              <span className="text-[10px] uppercase block text-[var(--text-tertiary)]">Learning Path</span>
              <span className="text-[var(--text-secondary)] font-semibold font-ui-body text-xs truncate block mt-0.5">
                {identity.learningPath}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase block text-[var(--text-tertiary)]">Current Stage</span>
              <span className="text-[var(--text-primary)] font-bold block mt-0.5">
                Stage {identity.stageNumber} — {identity.stageName}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase block text-[var(--text-tertiary)]">Cadence</span>
              <span className="text-[var(--text-secondary)] font-bold block mt-0.5">
                Week {identity.currentWeek}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-signal)]"></span>
              <span>Kernel v{systemStatus.version}</span>
              <span>•</span>
              <span>{systemStatus.kernelStatus}</span>
              <span>•</span>
              <span>{systemStatus.storageAdapter}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{systemStatus.activeDomainsCount} Bounded Contexts</span>
              <span>•</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRebootRequest}
                className="text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0 h-auto font-mono-ui"
              >
                <RotateCcw className="w-3 h-3 me-1 text-[var(--accent-signal)]" />
                Re-Run Boot
              </Button>
            </div>
          </div>
        </footer>
      </div>

      <EvaluationChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => {
          setIsChallengeOpen(false);
          setActiveReviewItem(null);
        }}
        unitTitle={activeReviewItem ? `Review: ${activeReviewItem.skillId}` : undefined}
        challenge={challengeData}
        isLoading={isChallengeLoading}
        loadError={challengeError}
        onRetry={() => activeReviewItem && startReview(activeReviewItem)}
        onPass={handleReviewPassed}
      />
    </WorkspaceSurface>
  );
};

