/**
 * @file src/shared/components/learning/LearningSessionWorkspace.tsx
 * @description Master Workspace environment where learning actually happens with Context Lock & Cognitive Load Monitoring.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { isOk, isFail } from '../../../core/errors/Result';
import { learningDomainService, LearningSessionState, LearningSourceType, PracticeSkillType, EvidenceType, StageChallengeData } from '../../../domains/dom-001-learning';
import { useLanguage } from '../../../i18n';
import { LearningSourceViewer } from './LearningSourceViewer';
import { PracticeWorkspaceView } from './PracticeWorkspaceView';
import { ActiveNotesView } from './ActiveNotesView';
import { ReflectionView } from './ReflectionView';
import { EvidenceSubmissionView } from './EvidenceSubmissionView';
import { SessionExitView } from './SessionExitView';
import { EvaluationChallengeModal } from '../session';
import {
  Lock,
  Unlock,
  Clock,
  RotateCcw,
  Coffee,
  LogOut,
  Target,
  ShieldQuestion,
} from 'lucide-react';
import { WorkspaceSurface, Card, Button, Modal, Alert, ProgressBar } from '../ui';

interface LearningSessionWorkspaceProps {
  onExitWorkspace: () => void;
}

export const LearningSessionWorkspace: React.FC<LearningSessionWorkspaceProps> = ({ onExitWorkspace }) => {
  const { t } = useLanguage();
  const [session, setSession] = useState<LearningSessionState | null>(null);
  const [showExitSummary, setShowExitSummary] = useState<boolean>(false);
  const [showPausePrompt, setShowPausePrompt] = useState<boolean>(false);
  const [isRequestingHint, setIsRequestingHint] = useState<boolean>(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState<boolean>(false);
  const [challengeData, setChallengeData] = useState<StageChallengeData | null>(null);
  const [isChallengeLoading, setIsChallengeLoading] = useState<boolean>(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  // Global Esc key listener: Registered ONLY while Focus Mode workspace is mounted, cleaned up immediately on unmount
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (showPausePrompt) {
          setShowPausePrompt(false);
        } else if (showExitSummary) {
          setShowExitSummary(false);
        } else {
          onExitWorkspace();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPausePrompt, showExitSummary, onExitWorkspace]);

  // Timer interval to advance session focus duration every 5 seconds & auto-save draft every 10 seconds
  useEffect(() => {
    const timer = setInterval(async () => {
      const res = await learningDomainService.tickSessionTimer(5);
      if (res.ok) {
        setSession((prev) => prev ? { ...prev, cognitiveLoad: res.value } : null);
      }
      // Auto-save draft session state to LocalFirst persistence (DEF-001)
      await learningDomainService.saveDraftSession();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const loadSession = async () => {
    const res = await learningDomainService.getActiveSession();
    if (res.ok) {
      setSession(res.value);
    }
  };

  const handleSourceTypeChange = async (type: LearningSourceType) => {
    const res = await learningDomainService.updateSourceType(type);
    if (res.ok) setSession(res.value);
  };

  const handleSkillTypeChange = async (type: PracticeSkillType) => {
    const res = await learningDomainService.updateSkillType(type);
    if (res.ok) setSession(res.value);
  };

  const handleAddNote = async (text: string) => {
    const res = await learningDomainService.addNote(text);
    if (res.ok) setSession(res.value);
  };

  const handleDeleteNote = async (id: string) => {
    const res = await learningDomainService.deleteNote(id);
    if (res.ok) setSession(res.value);
  };

  const handleCodeChange = async (code: string) => {
    const res = await learningDomainService.updatePracticeCode(code);
    if (res.ok) setSession(res.value);
  };

  const handleExecutePractice = async (input?: string) => {
    try {
      await learningDomainService.executePractice(input);
      const updated = await learningDomainService.getActiveSession();
      if (updated.ok) setSession(updated.value);
    } catch (err) {
      console.warn('[LearningSessionWorkspace] Practice execution caught error:', err);
    }
  };

  const handleRequestHint = async () => {
    setIsRequestingHint(true);
    try {
      const res = await learningDomainService.requestSocraticHint();
      if (isOk(res)) {
        setSession(res.value);
      } else if (isFail(res)) {
        console.warn('[LearningSessionWorkspace] Socratic hint error:', res.error.message);
      }
    } catch (err) {
      console.warn('[LearningSessionWorkspace] Socratic hint exception caught:', err);
    } finally {
      setIsRequestingHint(false);
    }
  };

  const handleOpenChallenge = async () => {
    setIsChallengeOpen(true);
    setIsChallengeLoading(true);
    setChallengeError(null);
    setChallengeData(null);

    try {
      const res = await learningDomainService.requestStageChallenge();
      if (isOk(res)) {
        setChallengeData(res.value);
      } else if (isFail(res)) {
        setChallengeError(res.error.message || 'Could not generate a challenge right now. Please try again.');
      }
    } catch (err) {
      setChallengeError(err instanceof Error ? err.message : 'An unexpected error occurred while generating the challenge.');
    } finally {
      setIsChallengeLoading(false);
    }
  };

  const handleReflectionChange = async (text: string) => {
    try {
      const res = await learningDomainService.updateReflection(text);
      if (res.ok) setSession(res.value);
    } catch (err) {
      console.warn('[LearningSessionWorkspace] Reflection change caught error:', err);
    }
  };

  const handleSubmitEvidence = async (type: EvidenceType, payload: string) => {
    try {
      const res = await learningDomainService.submitEvidence(type, payload);
      if (res.ok) {
        setSession(res.value.session);
        setShowExitSummary(true);
      }
    } catch (err) {
      console.warn('[LearningSessionWorkspace] Evidence submission caught error:', err);
    }
  };

  const handleToggleContextLock = async () => {
    if (!session) return;
    const res = await learningDomainService.toggleContextLock();
    if (res.ok) {
      setSession({ ...session, isContextLocked: res.value });
    }
  };

  const handleResetSession = async () => {
    const res = await learningDomainService.resetSession();
    if (res.ok) {
      setSession(res.value);
      setShowExitSummary(false);
    }
  };

  if (!session) {
    return (
      <WorkspaceSurface className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center font-mono-ui text-xs text-[var(--text-secondary)] animate-pulse">
          Initializing Cognitive Workspace Environment...
        </div>
      </WorkspaceSurface>
    );
  }

  const durationMinutes = Math.floor(session.cognitiveLoad.sessionDurationSeconds / 60);

  return (
    <WorkspaceSurface className="min-h-screen p-4 sm:p-6 space-y-6 max-w-6xl mx-auto pb-16 focus-warmup-fade">
      {/* ========================================================================= */}
      {/* ZONE A — MINIMAL FOCUS BAR (44-48px HEIGHT, FIT FOR 13-INCH LAPTOPS) */}
      {/* ========================================================================= */}
      <header
        id="context-lock-header"
        className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] px-3 sm:px-4 py-2 sm:py-0 sm:h-12 sticky top-3 z-30 shadow-sm flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-2 gap-y-1.5 sm:gap-3 font-mono-ui text-xs"
      >
        {/* Left: Focus Lock & Mission Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Button
            variant={session.isContextLocked ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleToggleContextLock}
            className="text-[11px] font-mono-ui py-1 px-2.5 h-7 whitespace-nowrap"
            title="Toggle Focus Lock Mode"
          >
            {session.isContextLocked ? (
              <Lock className="w-3.5 h-3.5 me-1" />
            ) : (
              <Unlock className="w-3.5 h-3.5 me-1" />
            )}
            <span>{session.isContextLocked ? 'Focus Locked' : 'Unlocked'}</span>
          </Button>

          <div className="truncate hidden md:block max-w-[220px] lg:max-w-xs font-semibold text-[var(--text-primary)] text-xs" title={session.objective}>
            {session.objective}
          </div>
        </div>

        {/* Center: Elapsed Time & Session Progress */}
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div className="flex items-center gap-1 font-semibold text-[var(--text-primary)]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-signal)] me-0.5" />
            <span>Focus: {durationMinutes}m</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 ps-3 border-s border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)] text-[10px] uppercase font-bold">Stage 3</span>
            <div className="w-16">
              <ProgressBar
                value={session.cognitiveLoad.estimatedLoadPercent}
                max={100}
                variant={session.cognitiveLoad.isHeavy ? 'warning' : 'default'}
                size="sm"
              />
            </div>
            <span
              className={`font-bold text-[11px] ${
                session.cognitiveLoad.isHeavy ? 'text-[var(--status-warning)]' : 'text-[var(--text-primary)]'
              }`}
            >
              {session.cognitiveLoad.estimatedLoadPercent}%
            </span>
          </div>
        </div>

        {/* Right: Reset & Exit Focus Button (with ESC badge) */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenChallenge}
            className="p-1 h-7 w-7 text-[var(--text-secondary)] hover:text-[var(--accent-signal)]"
            title="Verify Stage Mastery (AI Challenge)"
          >
            <ShieldQuestion className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetSession}
            className="p-1 h-7 w-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            title="Reset Workspace State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onExitWorkspace}
            className="text-[11px] font-mono-ui py-1 px-2.5 h-7 border border-[var(--border-color)]"
            title="Exit Focus Mode (ESC)"
          >
            <LogOut className="w-3.5 h-3.5 me-1" />
            <span>Exit Focus</span>
            <kbd className="hidden sm:inline-block ms-1.5 px-1 py-0.2 bg-[var(--surface-low)] text-[10px] rounded border border-[var(--border-color)] text-[var(--text-secondary)] font-mono">
              ESC
            </kbd>
          </Button>
        </div>
      </header>

      {/* Cognitive Load Natural Recommendation Banner (Appears if Load >= 75%) */}
      {session.cognitiveLoad.isHeavy && (
        <Alert
          type="warning"
          title="Cognitive Load Advisory"
          message={session.cognitiveLoad.recommendationMessage}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPausePrompt(true)}
              className="mt-1 text-xs font-mono-ui"
            >
              <Coffee className="w-3.5 h-3.5 me-1" />
              Take 5-Min Pause
            </Button>
          }
        />
      )}

      {/* ========================================================================= */}
      {/* MISSION OVERVIEW CARD */}
      {/* ========================================================================= */}
      <Card id="section-workspace-mission" variant="default" padding="lg" className="space-y-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono-ui text-[var(--text-secondary)] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[var(--surface-low)] text-[var(--accent-signal)] border border-[var(--border-color)] rounded font-bold uppercase text-[10px] tracking-wider">
              Current Mission Objective
            </span>
            <span>•</span>
            <span className="text-[var(--text-primary)] font-semibold">Stage 3 — Applying</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--text-secondary)] bg-[var(--surface-low)] px-2.5 py-1 rounded border border-[var(--border-color)]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
            <span>Est. {session.estimatedTimeMinutes} min</span>
          </div>
        </div>

        <h1 className="font-headline-md text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {session.objective}
        </h1>

        <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] space-y-1">
          <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase font-bold block">Mission Purpose</span>
          <p className="text-xs sm:text-sm text-[var(--text-primary)] font-ui-body leading-relaxed max-w-[70ch]">
            {session.purpose}
          </p>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* ZONE B — LEARNING SURFACE */}
      {/* ========================================================================= */}
      <LearningSourceViewer
        activeType={session.activeSourceType}
        sourceContent={session.sourceContent}
        onSourceTypeChange={handleSourceTypeChange}
      />

      {/* ========================================================================= */}
      {/* ZONE C — ACTIVE PRACTICE */}
      {/* ========================================================================= */}
      <PracticeWorkspaceView
        activeSkillType={session.activeSkillType}
        codeInput={session.practiceState.codeInput}
        terminalLogs={session.practiceState.terminalLogs}
        lastExecutionResult={session.practiceState.lastExecutionResult}
        socraticHints={session.socraticHints}
        isRequestingHint={isRequestingHint}
        onSkillTypeChange={handleSkillTypeChange}
        onCodeChange={handleCodeChange}
        onExecute={handleExecutePractice}
        onRequestHint={handleRequestHint}
      />

      {/* ========================================================================= */}
      {/* ZONE D — REFLECTION & EVIDENCE */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <ActiveNotesView
          notes={session.notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />

        <ReflectionView
          reflectionText={session.reflectionText}
          reflectionSubmitted={session.reflectionSubmitted}
          onReflectionChange={handleReflectionChange}
          onForceAcceptReflection={async () => {
            if (!session) return;
            const updated = { ...session, reflectionSubmitted: true };
            setSession(updated);
            await learningDomainService.saveDraftSession();
          }}
        />

        <EvidenceSubmissionView
          selectedType={session.selectedEvidenceType}
          submittedHash={session.evidenceSubmittedHash}
          isCompleted={session.isSessionCompleted}
          reviewVerdict={session.reviewVerdict}
          onSubmitEvidence={handleSubmitEvidence}
        />
      </div>

      {/* ========================================================================= */}
      {/* SESSION EXIT SUMMARY MODAL */}
      {/* ========================================================================= */}
      {showExitSummary && (
        <SessionExitView
          sessionState={session}
          onExitConfirm={() => {
            setShowExitSummary(false);
            onExitWorkspace();
          }}
        />
      )}

      {/* Stage Gate Challenge — AI-generated, tied to this session's actual skill & objective */}
      <EvaluationChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => setIsChallengeOpen(false)}
        unitTitle={session.objective}
        challenge={challengeData}
        isLoading={isChallengeLoading}
        loadError={challengeError}
        onRetry={handleOpenChallenge}
      />

      {/* Pause Recommendation Modal */}
      <Modal
        isOpen={showPausePrompt}
        onClose={() => setShowPausePrompt(false)}
        title="Recommended 5-Minute Pause"
        description="Your focus session has reached 80% cognitive load density. Stepping away for 5 minutes allows your brain's memory consolidation network to organize concepts."
        maxWidth="md"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowPausePrompt(false)}
            >
              Resume Workspace
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setShowPausePrompt(false);
                onExitWorkspace();
              }}
            >
              Pause &amp; Exit
            </Button>
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="inline-flex p-3 bg-[var(--surface-low)] text-[var(--status-warning)] rounded-full border border-[var(--border-color)] mb-2">
            <Coffee className="w-8 h-8" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] font-ui-body leading-relaxed">
            Consolidating working memory stability prevents cognitive fatigue and improves long-term recall strength.
          </p>
        </div>
      </Modal>
    </WorkspaceSurface>
  );
};
