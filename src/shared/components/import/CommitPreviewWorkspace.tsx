/**
 * @file src/shared/components/import/CommitPreviewWorkspace.tsx
 * @description Commit Preview Workspace for Eliot RDI-1C.
 * Provides commit previewing, delta diff inspection, validation pipeline reporting,
 * ledger chain verification, rollback capabilities, and CKM activation triggers.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  GitBranch,
  RotateCcw,
  Activity,
  Layers,
  FileCode,
  BookOpen,
  Code,
  Lock,
  ArrowRight,
  Database,
  Hash,
  Clock,
  User,
  Info,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';

import {
  WorkspaceSurface,
  Card,
  Button,
  Modal,
  Alert,
  ProgressBar,
  Badge,
} from '../ui';

import { CandidateKnowledgeModel } from '../../../core/import/extraction/types';
import {
  KnowledgeCommitRecord,
  CommitValidationReport,
  KnowledgeLedgerEntry,
  KnowledgeActivationState,
  KnowledgeDomainEvent,
} from '../../../core/import/commit/types';

import { knowledgeCommitEngine } from '../../../core/import/commit/KnowledgeCommitEngine';
import { knowledgeLedger } from '../../../core/import/commit/KnowledgeLedger';
import { useLanguage } from '../../../i18n';

interface CommitPreviewWorkspaceProps {
  candidateModel: CandidateKnowledgeModel;
  onBackToReview: () => void;
  onActivationComplete: (activeState: KnowledgeActivationState) => void;
}

type CommitTab = 'delta' | 'validation' | 'ledger' | 'events';

export const CommitPreviewWorkspace: React.FC<CommitPreviewWorkspaceProps> = ({
  candidateModel,
  onBackToReview,
  onActivationComplete,
}) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<CommitTab>('delta');

  // Form & Preview State
  const [commitNote, setCommitNote] = useState<string>(`Release import from ${candidateModel.sourceTitle}`);
  const [author, setAuthor] = useState<string>('Knowledge Architect');
  
  const [previewRecord, setPreviewRecord] = useState<KnowledgeCommitRecord | null>(null);
  const [validationReport, setValidationReport] = useState<CommitValidationReport | null>(null);
  const [isPreparing, setIsPreparing] = useState<boolean>(true);

  // Ledger & Activation State
  const [ledgerEntries, setLedgerEntries] = useState<KnowledgeLedgerEntry[]>([]);
  const [isChainIntact, setIsChainIntact] = useState<boolean | null>(null);
  const [activeState, setActiveState] = useState<KnowledgeActivationState>(knowledgeCommitEngine.getActiveState());
  const [domainEvents, setDomainEvents] = useState<KnowledgeDomainEvent[]>([]);

  // UI Modals
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [activatedResult, setActivatedResult] = useState<KnowledgeActivationState | null>(null);
  const [isExecutingCommit, setIsExecutingCommit] = useState<boolean>(false);

  // Load preview data
  useEffect(() => {
    let isMounted = true;
    const prepare = async () => {
      setIsPreparing(true);
      try {
        const { commit, validation } = await knowledgeCommitEngine.prepareAndValidateCommit(
          candidateModel,
          commitNote,
          author
        );
        if (isMounted) {
          setPreviewRecord(commit);
          setValidationReport(validation);
        }
      } catch (err) {
        console.error('Error preparing commit:', err);
      } finally {
        if (isMounted) setIsPreparing(false);
      }
    };

    prepare();
    refreshLedgerAndEvents();

    return () => {
      isMounted = false;
    };
  }, [candidateModel, commitNote, author]);

  const refreshLedgerAndEvents = async () => {
    setLedgerEntries(knowledgeLedger.getLedger());
    setDomainEvents(knowledgeCommitEngine.getDomainEvents());
    setActiveState(knowledgeCommitEngine.getActiveState());

    const verification = await knowledgeLedger.verifyLedgerIntegrity();
    setIsChainIntact(verification.isIntact);
  };

  const handleExecuteCommitAndActivate = async () => {
    if (!previewRecord || !validationReport?.isValid) return;

    setIsExecutingCommit(true);
    try {
      // 1. Commit to immutable ledger
      const { commit } = await knowledgeCommitEngine.executeCommit(previewRecord);

      // 2. Activate state
      const state = await knowledgeCommitEngine.activateCommit(commit.commitId);

      setActivatedResult(state);
      await refreshLedgerAndEvents();
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to execute commit and activate:', err);
    } finally {
      setIsExecutingCommit(false);
    }
  };

  const handleRollback = async (targetCommitId: string) => {
    try {
      const state = await knowledgeCommitEngine.rollbackCommit(targetCommitId);
      setActiveState(state);
      await refreshLedgerAndEvents();
    } catch (err) {
      console.error('Rollback failed:', err);
    }
  };

  return (
    <WorkspaceSurface className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-28" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ========================================================================= */}
      {/* HEADER & TOP LEVEL CONTROLS */}
      {/* ========================================================================= */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              {t('commitWorkspace.title')}
            </h1>
            <Badge variant="primary">{previewRecord?.version || 'v1.0.0'}</Badge>
            {activeState.activeVersion && (
              <Badge variant="success" className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-[var(--status-success)]" />
                <span>Active CKM {activeState.activeVersion}</span>
              </Badge>
            )}
          </div>
          <p className="text-xs font-ui-body text-[var(--text-secondary)]">
            {t('commitWorkspace.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBackToReview}>
            <RotateCcw className="w-4 h-4 me-1.5" />
            <span>Back to Review</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            disabled={!validationReport?.isValid || isExecutingCommit || isPreparing}
            onClick={handleExecuteCommitAndActivate}
          >
            <ShieldCheck className="w-4 h-4 me-1.5 text-[var(--status-success)]" />
            <span>{t('commitWorkspace.executeCommitAndActivate')}</span>
          </Button>
        </div>
      </header>

      {/* LEDGER INTEGRITY BANNER */}
      {isChainIntact !== null && (
        <Alert
          type={isChainIntact ? 'success' : 'error'}
          title={isChainIntact ? t('commitWorkspace.integrityVerified') : t('commitWorkspace.integrityBroken')}
          message={
            isChainIntact
              ? `Cryptographic SHA-256 ledger hash chain intact. Current root: ${knowledgeLedger.getLatestHash().substring(0, 16)}...`
              : 'Ledger hash verification failed! Checksum mismatch detected in block history.'
          }
        />
      )}

      {/* ========================================================================= */}
      {/* TABS NAVIGATION */}
      {/* ========================================================================= */}
      <nav className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-3 font-mono-ui text-xs">
        <button
          onClick={() => setActiveTab('delta')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'delta'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <GitCommit className="w-3.5 h-3.5" />
          <span>{t('commitWorkspace.tabDeltaPreview')}</span>
        </button>

        <button
          onClick={() => setActiveTab('validation')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'validation'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>
            {t('commitWorkspace.tabValidationReport')}{' '}
            {validationReport ? (validationReport.isValid ? '(Passed)' : '(Failed)') : ''}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'ledger'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{t('commitWorkspace.tabLedgerHistory')} ({ledgerEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'events'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t('commitWorkspace.tabDomainEvents')} ({domainEvents.length})</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* TAB 1: COMMIT DELTA PREVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'delta' && (
        <section className="space-y-6">
          {/* Metadata & Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="elevated" padding="md" className="space-y-3 md:col-span-2">
              <h3 className="text-xs font-mono-ui font-bold uppercase text-[var(--accent-signal)]">
                Release &amp; Committer Parameters
              </h3>
              <div className="space-y-3 font-mono-ui text-xs">
                <div>
                  <label className="block text-[var(--text-tertiary)] mb-1">
                    {t('commitWorkspace.commitNoteLabel')}
                  </label>
                  <input
                    type="text"
                    value={commitNote}
                    onChange={(e) => setCommitNote(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-signal)]"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-tertiary)] mb-1">
                    {t('commitWorkspace.authorLabel')}
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-signal)]"
                  />
                </div>
              </div>
            </Card>

            <Card variant="elevated" padding="md" className="space-y-2">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Commit Fingerprint</span>
              <div className="p-2 bg-black/40 rounded border border-[var(--border-color)] font-mono-ui text-xs text-[var(--status-success)] break-all">
                {previewRecord?.contentHash || 'Generating...'}
              </div>
              <div className="text-[11px] font-mono-ui text-[var(--text-secondary)] pt-2 space-y-1">
                <p>• Targeted Version: {previewRecord?.version}</p>
                <p>• Parent Commit: {previewRecord?.parentCommitId ? previewRecord.parentCommitId.substring(0, 12) : 'Genesis'}</p>
              </div>
            </Card>
          </div>

          {/* Delta Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="elevated" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Concepts to Commit</span>
              <span className="text-2xl font-bold font-mono-ui text-sky-400 block">
                +{previewRecord?.concepts.length || 0}
              </span>
            </Card>

            <Card variant="elevated" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Skills to Commit</span>
              <span className="text-2xl font-bold font-mono-ui text-[var(--status-success)] block">
                +{previewRecord?.skills.length || 0}
              </span>
            </Card>

            <Card variant="elevated" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Dependencies Linked</span>
              <span className="text-2xl font-bold font-mono-ui text-[var(--status-warning)] block">
                +{previewRecord?.dependencies.length || 0}
              </span>
            </Card>

            <Card variant="elevated" padding="md" className="space-y-1">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Learning Assets</span>
              <span className="text-2xl font-bold font-mono-ui text-[var(--text-primary)] block">
                +{previewRecord?.learningAssets.length || 0}
              </span>
            </Card>
          </div>

          {/* Detailed Entity Preview Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="elevated" padding="md" className="space-y-3">
              <h3 className="text-xs font-mono-ui font-bold uppercase text-[var(--text-primary)] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                Concepts Payload ({previewRecord?.concepts.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {previewRecord?.concepts.map((c) => (
                  <div key={c.id} className="p-2 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-xs font-mono-ui flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">{c.name}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] block">{c.category}</span>
                    </div>
                    <Badge variant="neutral">{c.confidence}%</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="elevated" padding="md" className="space-y-3">
              <h3 className="text-xs font-mono-ui font-bold uppercase text-[var(--text-primary)] flex items-center gap-2">
                <Code className="w-4 h-4 text-[var(--status-success)]" />
                Skills Payload ({previewRecord?.skills.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {previewRecord?.skills.map((s) => (
                  <div key={s.id} className="p-2 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-xs font-mono-ui flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[var(--text-primary)]">{s.name}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)] block">Level: {s.level}</span>
                    </div>
                    <Badge variant="success">{s.confidence}%</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VALIDATION REPORT */}
      {/* ========================================================================= */}
      {activeTab === 'validation' && validationReport && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="elevated" padding="md" className="space-y-2">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Relationship Integrity</span>
              <span className="text-2xl font-bold font-mono-ui text-[var(--status-success)] block">
                {validationReport.relationshipIntegrityScore}%
              </span>
              <ProgressBar value={validationReport.relationshipIntegrityScore} max={100} size="sm" variant="success" />
            </Card>

            <Card variant="elevated" padding="md" className="space-y-2">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Duplicate Commit Check</span>
              <span className={`text-2xl font-bold font-mono-ui ${validationReport.duplicateCheckPassed ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'}`}>
                {validationReport.duplicateCheckPassed ? 'Passed' : 'Failed'}
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] block">Unique Fingerprint Verification</span>
            </Card>

            <Card variant="elevated" padding="md" className="space-y-2">
              <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">Cyclic Dependency Check</span>
              <span className={`text-2xl font-bold font-mono-ui ${validationReport.cyclicDependencyCheckPassed ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'}`}>
                {validationReport.cyclicDependencyCheckPassed ? 'Passed' : 'Failed'}
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)] block">No Prerequisite Loops</span>
            </Card>
          </div>

          {/* Validation Log List */}
          <Card variant="elevated" padding="md" className="space-y-3">
            <h3 className="text-xs font-mono-ui font-bold uppercase text-[var(--text-primary)]">
              Validation Pipeline Audit Log
            </h3>

            {validationReport.errors.length === 0 && validationReport.warnings.length === 0 ? (
              <Alert
                type="success"
                title="All Validation Checks Passed"
                message="Zero dangling references, zero cyclic dependencies, and unique cryptographic fingerprint confirmed."
              />
            ) : (
              <div className="space-y-2">
                {validationReport.errors.map((err, idx) => (
                  <div key={idx} className="p-3 bg-[var(--status-error)]/10 border border-[var(--status-error)]/30 rounded font-mono-ui text-xs text-[var(--status-error)] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--status-error)] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">[{err.code}]</span> {err.message}
                    </div>
                  </div>
                ))}

                {validationReport.warnings.map((warn, idx) => (
                  <div key={idx} className="p-3 bg-[var(--status-warning)]/20 border border-[var(--status-warning)]/30 rounded font-mono-ui text-xs text-[var(--status-warning)] flex items-start gap-2">
                    <Info className="w-4 h-4 text-[var(--status-warning)] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">[{warn.code}]</span> {warn.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: IMMUTABLE KNOWLEDGE LEDGER */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono-ui font-bold uppercase text-[var(--text-primary)]">
              Immutable Cryptographic Audit Ledger
            </h3>
            <Button variant="ghost" size="sm" onClick={refreshLedgerAndEvents}>
              <RefreshCw className="w-3.5 h-3.5 me-1.5" />
              <span>Verify Chain Integrity</span>
            </Button>
          </div>

          {ledgerEntries.length === 0 ? (
            <Card variant="elevated" padding="lg" className="text-center text-xs font-ui-body text-[var(--text-tertiary)]">
              Knowledge Ledger is empty. Execute a commit to append the first block.
            </Card>
          ) : (
            <div className="space-y-3">
              {ledgerEntries.map((entry) => {
                const isCurrentActive = activeState.activeCommitId === entry.commitId;

                return (
                  <Card
                    key={entry.entryId}
                    variant="elevated"
                    padding="md"
                    className={`space-y-2 font-mono-ui text-xs border ${
                      isCurrentActive
                        ? 'border-[var(--status-success)]/50 bg-[var(--status-success)]/10'
                        : 'border-[var(--border-color)]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[var(--text-primary)]">
                            {entry.version} ({entry.action})
                          </span>
                          {isCurrentActive && (
                            <Badge variant="success">Active CKM</Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-[var(--text-tertiary)] block">
                          Committed by {entry.actor} • {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>

                      {!isCurrentActive && entry.action === 'COMMIT_CREATED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRollback(entry.commitId)}
                        >
                          <RotateCcw className="w-3.5 h-3.5 me-1 text-sky-400" />
                          <span>Rollback to this Version</span>
                        </Button>
                      )}
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] font-ui-body">
                      {entry.details}
                    </p>

                    <div className="p-2 bg-black/40 rounded border border-[var(--border-color)] text-[10px] text-[var(--text-tertiary)] space-y-1">
                      <div><span className="text-[var(--accent-signal)]">Entry Hash:</span> {entry.entryHash}</div>
                      <div><span>Previous Hash:</span> {entry.previousHash}</div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CANONICAL DOMAIN EVENTS */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <section className="space-y-4">
          <Card variant="elevated" padding="md" className="space-y-3">
            <h3 className="text-xs font-mono-ui font-bold uppercase text-[var(--text-primary)]">
              Canonical Knowledge Domain Event Stream
            </h3>

            {domainEvents.length === 0 ? (
              <p className="text-xs text-[var(--text-tertiary)] italic">No domain events recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {domainEvents.map((evt) => (
                  <div key={evt.eventId} className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] font-mono-ui text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sky-400">{evt.type}</span>
                      <span className="text-[10px] text-[var(--text-tertiary)]">{evt.timestamp}</span>
                    </div>
                    <pre className="text-[10px] text-[var(--text-secondary)] overflow-x-auto">
                      {JSON.stringify(evt.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SUCCESS & ACTIVATION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('commitWorkspace.successModalTitle')}
        description={t('commitWorkspace.successModalDesc')}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="primary"
              onClick={() => {
                setShowSuccessModal(false);
                if (activatedResult) {
                  onActivationComplete(activatedResult);
                }
              }}
            >
              <CheckCircle2 className="w-4 h-4 me-1.5 text-[var(--status-success)]" />
              <span>Enter Active CKM Environment</span>
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2 font-mono-ui text-xs text-[var(--text-secondary)]">
          <div className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--status-success)] font-bold">
              <Activity className="w-4 h-4" />
              <span>Active CKM State Initialized ({activatedResult?.activeVersion})</span>
            </div>
            <p>• Active Concepts: {activatedResult?.concepts.length}</p>
            <p>• Active Skills: {activatedResult?.skills.length}</p>
            <p>• Active Dependencies: {activatedResult?.dependencies.length}</p>
            <p>• Ledger Root Hash: {knowledgeLedger.getLatestHash().substring(0, 24)}...</p>
          </div>
        </div>
      </Modal>
    </WorkspaceSurface>
  );
};
