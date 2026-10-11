/**
 * @file src/shared/components/import/ImportInspectionView.tsx
 * @description Dedicated Import Inspection & Confidence Workspace for Eliot RDI-1.5.
 * Built using Foundation Component System (FCS-1) primitives and design tokens.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  Clock,
  BookOpen,
  Code,
  FileCode,
  Activity,
  Hash,
  UploadCloud,
  Folder,
  ArrowRight,
  RotateCcw,
  Info,
  XCircle,
  HelpCircle,
  Check,
  Copy,
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

import { InspectionReport } from '../../../core/import/inspection/types';
import { useLanguage } from '../../../i18n';

interface ImportInspectionViewProps {
  report: InspectionReport;
  onApproveInspection: () => void;
  onResetOrChangeSource: () => void;
  onDuplicateAction?: (action: 'skip' | 'replace' | 'separate') => void;
}

export const ImportInspectionView: React.FC<ImportInspectionViewProps> = ({
  report,
  onApproveInspection,
  onResetOrChangeSource,
  onDuplicateAction,
}) => {
  const { t, isRTL } = useLanguage();
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [copiedFingerprint, setCopiedFingerprint] = useState<boolean>(false);

  const {
    sourceName,
    providerId,
    timestamp,
    sha256Fingerprint,
    contentStats,
    knowledgeEstimates,
    detectedTopics,
    confidence,
    sourceHealth,
    duplicateComparison,
    unsupportedDiagnostic,
  } = report;

  const handleCopyFingerprint = () => {
    navigator.clipboard.writeText(sha256Fingerprint);
    setCopiedFingerprint(true);
    setTimeout(() => setCopiedFingerprint(false), 2000);
  };

  const getHealthBadgeVariant = (state: string): 'success' | 'primary' | 'warning' | 'error' | 'neutral' => {
    switch (state) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'primary';
      case 'Fair':
      case 'Poor':
        return 'warning';
      case 'Unsupported':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getConfidenceColorClass = (scorePercent: number) => {
    if (scorePercent >= 85) return 'text-[var(--status-success)] border-[var(--status-success)]/30 bg-[var(--status-success)]/10';
    if (scorePercent >= 60) return 'text-[var(--status-warning)] border-[var(--status-warning)]/30 bg-[var(--status-warning)]/10';
    return 'text-[var(--status-error)] border-[var(--status-error)]/30 bg-[var(--status-error)]/10';
  };

  return (
    <WorkspaceSurface className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ========================================================================= */}
      {/* 1. HEADER: Source Metadata & Inspection Controls */}
      {/* ========================================================================= */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              {sourceName}
            </h1>
            <Badge variant={getHealthBadgeVariant(sourceHealth.state)}>
              {sourceHealth.state} Health
            </Badge>
            <Badge variant="neutral">{providerId}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono-ui text-[var(--text-secondary)] pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
              {new Date(timestamp).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <code className="text-[11px] text-[var(--text-primary)]">{sha256Fingerprint.substring(0, 16)}...</code>
              <button
                onClick={handleCopyFingerprint}
                className="hover:text-[var(--accent-signal)] transition-colors p-0.5 rounded"
                title="Copy SHA-256 Fingerprint"
              >
                {copiedFingerprint ? <Check className="w-3 h-3 text-[var(--status-success)]" /> : <Copy className="w-3 h-3" />}
              </button>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onResetOrChangeSource}>
            <RotateCcw className="w-4 h-4 me-1.5" />
            <span>Change Source</span>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowApprovalModal(true)}
            disabled={sourceHealth.state === 'Unsupported'}
          >
            <CheckCircle2 className="w-4 h-4 me-1.5 text-[var(--status-success)]" />
            <span>Approve Import</span>
          </Button>
        </div>
      </header>

      {/* STOP AT INSPECTION PROTOCOL NOTICE */}
      <Alert
        type="info"
        title="Inspection Layer Active (Sprint RDI-1.5 Protocol)"
        message="Eliot allows you to inspect content metrics, confidence, and detected concepts before committing. No data is saved to CKM."
      />

      {/* ========================================================================= */}
      {/* UNSUPPORTED SOURCE DIAGNOSTIC VIEW (If file is unreadable or unsupported) */}
      {/* ========================================================================= */}
      {unsupportedDiagnostic && !unsupportedDiagnostic.isSupported && (
        <Card variant="elevated" padding="lg" className="border-[var(--status-error)]/40 bg-[var(--status-error)]/10 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-[var(--status-error)]/20 text-[var(--status-error)] rounded-full shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-headline-md text-lg font-bold text-[var(--status-error)]">
                {t('inspection.unsupportedTitle')}
              </h2>
              <p className="text-sm font-ui-body text-[var(--text-secondary)]">
                {unsupportedDiagnostic.reasonWhy}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-2">
              <span className="text-xs font-mono-ui font-bold uppercase text-[var(--status-warning)] block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {t('inspection.missingInfo')}
              </span>
              <p className="text-xs font-ui-body text-[var(--text-secondary)]">
                {unsupportedDiagnostic.missingInformation}
              </p>
            </div>

            <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-2">
              <span className="text-xs font-mono-ui font-bold uppercase text-[var(--accent-signal)] block flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                {t('inspection.suggestedAlternatives')}
              </span>
              <ul className="text-xs font-ui-body text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                {unsupportedDiagnostic.suggestedAlternatives.map((alt, idx) => (
                  <li key={idx}>{alt}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* DUPLICATE DETECTION REVIEW BANNER & ACTIONS */}
      {/* ========================================================================= */}
      {duplicateComparison && duplicateComparison.isDuplicate && (
        <Card variant="elevated" padding="lg" className="border-[var(--status-warning)]/40 bg-[var(--status-warning)]/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[var(--status-warning)]/20 text-[var(--status-warning)] rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-headline-md text-base font-bold text-[var(--status-warning)]">
                  {t('inspection.duplicateDetected')}
                </h3>
                <p className="text-xs font-mono-ui text-[var(--text-secondary)]">
                  Identical SHA-256 fingerprint matching existing source &quot;{duplicateComparison.existingSourceTitle}&quot;
                </p>
              </div>
            </div>

            {onDuplicateAction && (
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onDuplicateAction('skip')}
                >
                  {t('inspection.skipImport')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onDuplicateAction('replace')}
                >
                  {t('inspection.replaceExisting')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDuplicateAction('separate')}
                >
                  {t('inspection.createNewWorkspace')}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 2. CONFIDENCE & SOURCE HEALTH GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IMPORT CONFIDENCE ENGINE CARD */}
        <Card variant="elevated" padding="lg" className="space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--accent-signal)]" />
                <h2 className="font-headline-md text-base font-bold text-[var(--text-primary)]">
                  {t('inspection.confidenceTitle')}
                </h2>
              </div>
              <span className={`text-lg font-bold font-mono-ui px-3 py-1 rounded-full border ${getConfidenceColorClass(confidence.scorePercent)}`}>
                {confidence.scorePercent}% Confidence
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] font-ui-body">
              Calculated deterministically from structural headings, character encoding, typographic consistency, and semantic layout.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* REASONS */}
              <div className="space-y-2 p-3 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)]">
                <span className="text-[11px] font-mono-ui font-bold text-[var(--status-success)] uppercase block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t('inspection.reasons')}
                </span>
                <ul className="text-xs font-ui-body text-[var(--text-secondary)] space-y-1.5">
                  {confidence.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[var(--status-success)]">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* WARNINGS */}
              <div className="space-y-2 p-3 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)]">
                <span className="text-[11px] font-mono-ui font-bold text-[var(--status-warning)] uppercase block flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {t('inspection.warnings')}
                </span>
                {confidence.warnings.length > 0 ? (
                  <ul className="text-xs font-ui-body text-[var(--text-secondary)] space-y-1.5">
                    {confidence.warnings.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[var(--status-warning)]">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[var(--text-tertiary)] italic font-ui-body">
                    No structural warnings detected.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <ProgressBar value={confidence.scorePercent} max={100} size="md" variant="primary" />
          </div>
        </Card>

        {/* SOURCE HEALTH PANEL */}
        <Card variant="elevated" padding="lg" className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[var(--status-success)]" />
                <h2 className="font-headline-md text-base font-bold text-[var(--text-primary)]">
                  {t('inspection.sourceHealth')}
                </h2>
              </div>
              <Badge variant={getHealthBadgeVariant(sourceHealth.state)}>
                {sourceHealth.state}
              </Badge>
            </div>

            <p className="text-xs font-ui-body text-[var(--text-secondary)] leading-relaxed">
              {sourceHealth.explanation}
            </p>

            <div className="space-y-2 pt-1">
              {sourceHealth.factors.map((factor, idx) => (
                <div key={idx} className="p-2.5 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
                  <div className="flex justify-between text-xs font-mono-ui">
                    <span className="font-bold text-[var(--text-primary)]">{factor.factor}</span>
                    <span className={factor.status === 'pass' ? 'text-[var(--status-success)] font-bold' : factor.status === 'warn' ? 'text-[var(--status-warning)] font-bold' : 'text-[var(--status-error)] font-bold'}>
                      {factor.score}%
                    </span>
                  </div>
                  <p className="text-[10px] font-ui-body text-[var(--text-tertiary)]">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETECTED CONTENT STATISTICS GRID */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono-ui font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--accent-signal)]" />
          <span>{t('inspection.detectedContent')}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.documents')}</span>
            <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-400" />
              {contentStats.documentCount}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.pages')}</span>
            <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[var(--status-warning)]" />
              {contentStats.pageCount}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.files')}</span>
            <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-[var(--status-success)]" />
              {contentStats.fileCount}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.folders')}</span>
            <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-indigo-400" />
              {contentStats.folderCount}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.primaryLanguage')}</span>
            <span className="text-sm font-bold text-[var(--text-primary)] font-ui-body truncate block">
              {contentStats.primaryLanguage}
            </span>
          </div>
        </div>

        {/* DETECTED MEDIA & RICH STRUCTURES */}
        <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-ui text-xs">
          <div>
            <span className="text-[var(--text-tertiary)] block text-[10px] uppercase">{t('inspection.codeLanguages')}</span>
            <span className="font-bold text-[var(--text-primary)]">
              {contentStats.codeLanguages.length > 0 ? contentStats.codeLanguages.join(', ') : 'None Detected'}
            </span>
          </div>
          <div>
            <span className="text-[var(--text-tertiary)] block text-[10px] uppercase">{t('inspection.tables')}</span>
            <span className="font-bold text-[var(--text-primary)]">{contentStats.tablesCount} Tables</span>
          </div>
          <div>
            <span className="text-[var(--text-tertiary)] block text-[10px] uppercase">{t('inspection.links')}</span>
            <span className="font-bold text-[var(--text-primary)]">{contentStats.linksCount} Links</span>
          </div>
          <div>
            <span className="text-[var(--text-tertiary)] block text-[10px] uppercase">{t('inspection.images')} &amp; Media</span>
            <span className="font-bold text-[var(--text-primary)]">
              {contentStats.imagesCount + contentStats.mediaAssetsCount} Assets
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. KNOWLEDGE ESTIMATION MODEL */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono-ui font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent-signal)]" />
          <span>{t('inspection.knowledgeEstimates')}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.concepts')}</span>
            <span className="text-xl font-bold text-[var(--text-primary)] font-mono-ui">
              {knowledgeEstimates.estimatedConcepts}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.skills')}</span>
            <span className="text-xl font-bold text-[var(--text-primary)] font-mono-ui">
              {knowledgeEstimates.estimatedSkills}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.prerequisites')}</span>
            <span className="text-xl font-bold text-[var(--text-primary)] font-mono-ui">
              {knowledgeEstimates.estimatedPrerequisites}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.learningAssets')}</span>
            <span className="text-xl font-bold text-[var(--text-primary)] font-mono-ui">
              {knowledgeEstimates.estimatedLearningAssets}
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.readingTime')}</span>
            <span className="text-xl font-bold text-[var(--text-primary)] font-mono-ui">
              {knowledgeEstimates.estimatedReadingTimeMinutes}m
            </span>
          </div>

          <div className="p-4 bg-[var(--surface-card)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
            <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">{t('inspection.studyTime')}</span>
            <span className="text-xl font-bold text-[var(--accent-signal)] font-mono-ui">
              {knowledgeEstimates.estimatedStudyTimeMinutes}m
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MAJOR DETECTED TOPICS */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <h2 className="text-xs font-mono-ui font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--accent-signal)]" />
          <span>{t('inspection.detectedTopics')}</span>
        </h2>

        <div className="flex flex-wrap gap-2">
          {detectedTopics.map((topic) => (
            <div
              key={topic.id}
              className="px-3 py-2 bg-[var(--surface-card)] hover:bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] flex items-center gap-2 font-mono-ui text-xs transition-all"
            >
              <span className="font-bold text-[var(--text-primary)]">{topic.name}</span>
              <span className="text-[10px] text-[var(--text-tertiary)] bg-[var(--surface-low)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                {topic.category}
              </span>
              <span className="text-[10px] font-bold text-[var(--accent-signal)]">
                {topic.relevanceScore}% match
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* APPROVAL CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={t('inspection.inspectionApprovedModalTitle')}
        description={t('inspection.inspectionApprovedModalDesc')}
        maxWidth="md"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="primary"
              onClick={() => {
                setShowApprovalModal(false);
                onApproveInspection();
              }}
            >
              <CheckCircle2 className="w-4 h-4 me-1.5" />
              <span>Acknowledge &amp; Return</span>
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2 font-mono-ui text-xs text-[var(--text-secondary)]">
          <div className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--status-success)] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Resource Inspection Verified</span>
            </div>
            <p className="text-[var(--text-primary)]">{sourceName}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">
              SHA-256: {sha256Fingerprint}
            </p>
          </div>
          <Alert
            type="info"
            message={t('inspection.stopAtInspectionNotice')}
          />
        </div>
      </Modal>
    </WorkspaceSurface>
  );
};
