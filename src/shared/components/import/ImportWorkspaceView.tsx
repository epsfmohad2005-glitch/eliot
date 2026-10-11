/**
 * @file src/shared/components/import/ImportWorkspaceView.tsx
 * @description LocalFirst RDI-1 Import Workspace for Eliot.
 * Uses FCS-1 Primitives and Design Tokens Exclusively.
 * @license Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  FileCode,
  Folder,
  Archive,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Database,
  Hash,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
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

import {
  ImportInputSource,
  ImportProviderId,
  SourceMetadata,
  ImportSummaryData,
  ImportCheckpoint,
  DuplicateAction,
  ProgressReport,
  InspectionReport,
  inspectionEngine,
  CandidateKnowledgeModel,
  deterministicExtractionEngine,
} from '../../../core/import';

import { ImportProviderRegistry } from '../../../core/import/providers/ImportProviderRegistry';
import { importPipelineEngine } from '../../../core/import/pipeline/ImportPipelineEngine';
import { importCheckpointManager } from '../../../core/import/pipeline/ImportCheckpointManager';
import { ImportInspectionView } from './ImportInspectionView';
import { KnowledgeReviewWorkspace } from './KnowledgeReviewWorkspace';
import { CommitPreviewWorkspace } from './CommitPreviewWorkspace';

interface ImportWorkspaceViewProps {
  onStartLearningSession?: (summary: ImportSummaryData) => void;
  onCloseWorkspace?: () => void;
}

type WorkspaceStep = 'select' | 'preview' | 'importing' | 'inspection' | 'review' | 'commit' | 'summary';

export const ImportWorkspaceView: React.FC<ImportWorkspaceViewProps> = ({
  onStartLearningSession,
  onCloseWorkspace,
}) => {
  const [currentStep, setCurrentStep] = useState<WorkspaceStep>('select');
  const [selectedProviderId, setSelectedProviderId] = useState<ImportProviderId>('pdf-document');
  const [inputSource, setInputSource] = useState<ImportInputSource | null>(null);

  // Preview & Metadata State
  const [isCalculatingPreview, setIsCalculatingPreview] = useState<boolean>(false);
  const [previewMetadata, setPreviewMetadata] = useState<SourceMetadata | null>(null);
  const [sha256Digest, setSha256Digest] = useState<string | null>(null);

  // Duplicate Modal State
  const [duplicateMatch, setDuplicateMatch] = useState<ImportSummaryData | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState<boolean>(false);

  // Resume State
  const [activeCheckpoint, setActiveCheckpoint] = useState<ImportCheckpoint | null>(null);

  // Progress State
  const [progressReport, setProgressReport] = useState<ProgressReport>({
    stage: 'source_selection',
    stageLabel: 'Initializing Pipeline',
    completedUnits: 0,
    totalUnits: 10,
    progressPercent: 0,
    currentOperationLabel: 'Ready',
  });

  // Final Summary, Inspection & Candidate Model State
  const [importSummary, setImportSummary] = useState<ImportSummaryData | null>(null);
  const [inspectionReport, setInspectionReport] = useState<InspectionReport | null>(null);
  const [candidateModel, setCandidateModel] = useState<CandidateKnowledgeModel | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Hidden File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Check for resume checkpoints on mount
  useEffect(() => {
    checkResumeState();
  }, []);

  const checkResumeState = async () => {
    const checkpoint = await importCheckpointManager.getActiveCheckpoint();
    if (checkpoint) {
      setActiveCheckpoint(checkpoint);
    }
  };

  const handleSelectProvider = (providerId: ImportProviderId) => {
    setSelectedProviderId(providerId);
    setInputSource(null);
    setPreviewMetadata(null);
    setSha256Digest(null);
    setImportError(null);

    if (providerId === 'markdown-folder' || providerId === 'local-folder') {
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
        folderInputRef.current.click();
      }
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (selectedProviderId === 'markdown-folder' || selectedProviderId === 'local-folder') {
      const fileList: File[] = Array.from(files);
      const source: ImportInputSource = {
        providerId: selectedProviderId,
        files: fileList,
      };
      await processSelectedSource(source);
    } else {
      const file = files[0];
      const source: ImportInputSource = {
        providerId: selectedProviderId,
        file,
      };
      await processSelectedSource(source);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const files: File[] = Array.from(e.dataTransfer.files);
    let autoProviderId: ImportProviderId = 'plain-text';

    if (files.length === 1) {
      const name = files[0].name.toLowerCase();
      if (name.endsWith('.pdf')) autoProviderId = 'pdf-document';
      else if (name.endsWith('.md') || name.endsWith('.markdown')) autoProviderId = 'markdown-file';
      else if (name.endsWith('.zip')) autoProviderId = 'zip-project';
    } else {
      autoProviderId = 'markdown-folder';
    }

    setSelectedProviderId(autoProviderId);
    const source: ImportInputSource = {
      providerId: autoProviderId,
      file: files.length === 1 ? files[0] : undefined,
      files: files.length > 1 ? files : undefined,
    };

    await processSelectedSource(source);
  };

  const processSelectedSource = async (source: ImportInputSource) => {
    setInputSource(source);
    setIsCalculatingPreview(true);
    setImportError(null);
    setCurrentStep('preview');

    try {
      const provider = ImportProviderRegistry.resolveProviderForInput(source);
      const validation = await provider.validateSource(source);

      if (!validation.isValid) {
        setImportError(`${validation.errorMessage} (${validation.suggestedFix || 'Please select a valid file'})`);
        setIsCalculatingPreview(false);
        return;
      }

      // Calculate SHA-256 Fingerprint
      const digest = await importPipelineEngine.calculateSourceFingerprint(source);
      setSha256Digest(digest);

      // Extract Metadata
      const metadata = await provider.extractMetadata(source, digest);
      setPreviewMetadata(metadata);

      // Check for Duplicate Content
      const existing = await importPipelineEngine.checkForDuplicate(digest);
      if (existing) {
        setDuplicateMatch(existing);
        setShowDuplicateModal(true);
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to parse source file.');
    } finally {
      setIsCalculatingPreview(false);
    }
  };

  const executePipeline = async (duplicateAction: DuplicateAction = 'separate') => {
    if (!inputSource) return;

    setCurrentStep('importing');
    setImportError(null);

    try {
      const summary = await importPipelineEngine.runImportPipeline(
        inputSource,
        duplicateAction,
        (report) => setProgressReport(report)
      );

      setImportSummary(summary);

      // Perform Inspection Analysis
      const provider = ImportProviderRegistry.resolveProviderForInput(inputSource);
      const digest = sha256Digest || (await importPipelineEngine.calculateSourceFingerprint(inputSource));
      const metadata = previewMetadata || (await provider.extractMetadata(inputSource, digest));
      const items = await provider.enumerateContent(inputSource);
      const assets = await Promise.all(
        items.map((item) => provider.extractAsset(item, inputSource))
      );

      const report = await inspectionEngine.analyzeSource(
        inputSource.providerId,
        metadata,
        items,
        assets,
        inputSource,
        duplicateMatch
      );

      const candidate = await deterministicExtractionEngine.extractCandidateModel(
        inputSource.providerId,
        metadata,
        items,
        assets
      );

      setInspectionReport(report);
      setCandidateModel(candidate);
      setCurrentStep('inspection');
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'An error occurred during import processing.');
      setCurrentStep('preview');
    }
  };

  const handleResumeCheckpoint = async () => {
    if (!activeCheckpoint) return;

    setCurrentStep('importing');
    try {
      // Create fallback source
      const dummySource: ImportInputSource = {
        providerId: activeCheckpoint.providerId,
        customPayload: { resumed: true },
      };

      const summary = await importPipelineEngine.runImportPipeline(
        dummySource,
        'replace',
        (report) => setProgressReport(report),
        activeCheckpoint
      );

      setImportSummary(summary);
      setActiveCheckpoint(null);
      setCurrentStep('summary');
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to resume import checkpoint.');
      setCurrentStep('select');
    }
  };

  const handleDiscardCheckpoint = async () => {
    if (activeCheckpoint) {
      await importCheckpointManager.clearCheckpoint(activeCheckpoint.importId);
      setActiveCheckpoint(null);
    }
  };

  const allProviders = ImportProviderRegistry.getAllProviders();

  const getProviderIcon = (id: ImportProviderId) => {
    switch (id) {
      case 'pdf-document':
        return <FileText className="w-5 h-5 text-[var(--chart-secondary)]" />;
      case 'markdown-file':
      case 'markdown-folder':
        return <FileCode className="w-5 h-5 text-sky-400" />;
      case 'zip-project':
        return <Archive className="w-5 h-5 text-[var(--status-warning)]" />;
      case 'local-folder':
        return <Folder className="w-5 h-5 text-[var(--status-success)]" />;
      default:
        return <FileText className="w-5 h-5 text-[var(--text-secondary)]" />;
    }
  };

  return (
    <WorkspaceSurface className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto pb-20">
      {/* Hidden inputs for file/folder chooser */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.md,.markdown,.txt,.json,.csv,.yaml,.yml,.zip"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFileChange}
        className="hidden"
        {...({ webkitdirectory: '', directory: '' } as any)}
        multiple
      />

      {/* HEADER BAR */}
      <header className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[var(--surface-low)] text-[var(--accent-signal)] rounded-[var(--mode-radius)] border border-[var(--border-color)]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-md text-xl font-bold text-[var(--text-primary)]">
                Import Anything Engine (RDI-1)
              </h1>
              <Badge variant="primary">LocalFirst</Badge>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-ui-body">
              Transform PDFs, Markdown, ZIPs, and local folders into structured Cognitive Knowledge Models.
            </p>
          </div>
        </div>

        {onCloseWorkspace && (
          <Button variant="ghost" size="sm" onClick={onCloseWorkspace}>
            Close
          </Button>
        )}
      </header>

      {/* RESUME CHECKPOINT BANNER */}
      {activeCheckpoint && currentStep === 'select' && (
        <Alert
          type="warning"
          title="Incomplete Import Detected"
          message={`An interrupted import for "${activeCheckpoint.sourceName}" (${activeCheckpoint.extractedCount}/${activeCheckpoint.totalItems} items extracted) was saved.`}
          action={
            <div className="flex gap-2 mt-2">
              <Button variant="primary" size="sm" onClick={handleResumeCheckpoint}>
                <RefreshCw className="w-3.5 h-3.5 me-1" />
                Resume Import
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDiscardCheckpoint}>
                Discard
              </Button>
            </div>
          }
        />
      )}

      {/* ERROR DISPLAY */}
      {importError && (
        <Alert
          type="error"
          title="Import Operation Failed"
          message={importError}
          action={
            <Button variant="secondary" size="sm" onClick={() => setImportError(null)}>
              Dismiss
            </Button>
          }
        />
      )}

      {/* ========================================================================= */}
      {/* STEP 1: CHOOSE SOURCE */}
      {/* ========================================================================= */}
      {currentStep === 'select' && (
        <div className="space-y-6">
          {/* DRAG & DROP ZONE */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent-signal)] bg-[var(--surface-low)] hover:bg-[var(--surface-card)] rounded-[var(--mode-radius)] p-8 text-center transition-all cursor-pointer space-y-3"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="inline-flex p-4 bg-[var(--surface-card)] text-[var(--accent-signal)] rounded-full border border-[var(--border-color)]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)] font-ui-body">
                Drag &amp; drop learning resources here, or click to browse
              </p>
              <p className="text-xs text-[var(--text-tertiary)] font-mono-ui mt-1">
                Supports PDF, Markdown (.md), ZIP Archives, Text files, or Local Folders
              </p>
            </div>
          </div>

          {/* PROVIDER CARDS GRID */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono-ui font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Select Local Import Provider (Phase 1A)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allProviders.map((provider) => (
                <Card
                  key={provider.id}
                  variant="default"
                  padding="md"
                  className="hover:border-[var(--accent-signal)] cursor-pointer transition-all space-y-2 flex flex-col justify-between"
                  onClick={() => handleSelectProvider(provider.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getProviderIcon(provider.id)}
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {provider.name}
                        </span>
                      </div>
                      <Badge variant="neutral">Offline</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-ui-body leading-relaxed">
                      {provider.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] font-mono-ui text-[var(--text-tertiary)]">
                    <span>Formats: {provider.supportedExtensions.join(', ')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: PREVIEW */}
      {/* ========================================================================= */}
      {currentStep === 'preview' && (
        <Card variant="elevated" padding="lg" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-3">
              {getProviderIcon(selectedProviderId)}
              <div>
                <h2 className="font-headline-md text-lg font-bold text-[var(--text-primary)]">
                  {isCalculatingPreview ? 'Calculating Resource Metrics...' : previewMetadata?.title}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] font-mono-ui">
                  Provider: {selectedProviderId}
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setCurrentStep('select')}>
              <RotateCcw className="w-3.5 h-3.5 me-1" />
              Change Source
            </Button>
          </div>

          {/* CALCULATING SKELETON OR REAL METRICS */}
          {isCalculatingPreview ? (
            <div className="p-8 text-center space-y-3 font-mono-ui text-xs text-[var(--text-secondary)] animate-pulse">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[var(--accent-signal)]" />
              <p>Calculating Cryptographic Fingerprint &amp; Content Enumeration...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">File Size</span>
                <span className="text-base font-bold text-[var(--text-primary)] font-mono-ui">
                  {previewMetadata ? `${(previewMetadata.totalSizeBytes / 1024).toFixed(1)} KB` : 'Calculating…'}
                </span>
              </div>

              <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">Detected Documents</span>
                <span className="text-base font-bold text-[var(--text-primary)] font-mono-ui">
                  {previewMetadata ? previewMetadata.totalItemsCount : 'Calculating…'}
                </span>
              </div>

              <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">Est. Reading Time</span>
                <span className="text-base font-bold text-[var(--text-primary)] font-mono-ui flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
                  {previewMetadata?.estimatedContentLengthMinutes ? `${previewMetadata.estimatedContentLengthMinutes} min` : 'Calculating…'}
                </span>
              </div>

              <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
                <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">Est. Chunks</span>
                <span className="text-base font-bold text-[var(--text-primary)] font-mono-ui flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[var(--status-success)]" />
                  {previewMetadata ? Math.ceil(previewMetadata.totalItemsCount * 2.5) : 'Calculating…'}
                </span>
              </div>
            </div>
          )}

          {/* SHA-256 DIGEST DISPLAY */}
          {sha256Digest && (
            <div className="p-3 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] flex items-center justify-between font-mono-ui text-xs">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Hash className="w-4 h-4 text-[var(--accent-signal)] shrink-0" />
                <span>SHA-256 Digest:</span>
              </div>
              <span className="text-[var(--text-primary)] font-bold truncate max-w-md ms-2">
                {sha256Digest}
              </span>
            </div>
          )}

          {/* ACTION FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button variant="secondary" onClick={() => setCurrentStep('select')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={isCalculatingPreview || !!importError}
              onClick={() => executePipeline('separate')}
            >
              <Sparkles className="w-4 h-4 me-1.5" />
              Inspect Resource &amp; Confidence
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: LIVE PROGRESS */}
      {/* ========================================================================= */}
      {currentStep === 'importing' && (
        <Card variant="elevated" padding="lg" className="space-y-6 text-center py-10">
          <div className="inline-flex p-4 bg-[var(--surface-low)] text-[var(--accent-signal)] rounded-full border border-[var(--border-color)] mb-2">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-1">
            <h2 className="font-headline-md text-xl font-bold text-[var(--text-primary)]">
              {progressReport.stageLabel}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono-ui">
              {progressReport.currentOperationLabel}
            </p>
          </div>

          {/* PIPELINE PROGRESS BAR */}
          <div className="max-w-md mx-auto space-y-2">
            <ProgressBar
              value={progressReport.progressPercent}
              max={100}
              size="lg"
              variant="primary"
              showPercentage
            />
            <div className="flex justify-between text-[11px] font-mono-ui text-[var(--text-tertiary)]">
              <span>Stage {progressReport.completedUnits} / {progressReport.totalUnits}</span>
              <span>{progressReport.progressPercent}% Complete</span>
            </div>
          </div>

          <div className="p-4 bg-[var(--surface-low)] max-w-md mx-auto rounded-[var(--mode-radius)] border border-[var(--border-color)] text-start space-y-2 text-xs font-mono-ui text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--status-success)] shrink-0" />
              <span>LocalFirst Sandboxed Processing</span>
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] font-ui-body">
              All text extraction, character normalization, and chunk generation happen strictly in client-side memory.
            </p>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: IMPORT INSPECTION WORKSPACE */}
      {/* ========================================================================= */}
      {currentStep === 'inspection' && inspectionReport && (
        <ImportInspectionView
          report={inspectionReport}
          onApproveInspection={() => {
            if (candidateModel) {
              setCurrentStep('review');
            } else if (onCloseWorkspace) {
              onCloseWorkspace();
            } else {
              setCurrentStep('summary');
            }
          }}
          onResetOrChangeSource={() => setCurrentStep('select')}
          onDuplicateAction={(action) => {
            if (action === 'skip') setCurrentStep('select');
            else executePipeline(action === 'replace' ? 'replace' : 'separate');
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* STEP 5: KNOWLEDGE EXTRACTION & CANDIDATE REVIEW WORKSPACE */}
      {/* ========================================================================= */}
      {currentStep === 'review' && candidateModel && (
        <KnowledgeReviewWorkspace
          model={candidateModel}
          onApproveAndStage={(validatedModel) => {
            setCandidateModel(validatedModel);
            setCurrentStep('commit');
          }}
          onBackToInspection={() => setCurrentStep('inspection')}
        />
      )}

      {/* ========================================================================= */}
      {/* STEP 6: KNOWLEDGE COMMIT & ACTIVATION WORKSPACE */}
      {/* ========================================================================= */}
      {currentStep === 'commit' && candidateModel && (
        <CommitPreviewWorkspace
          candidateModel={candidateModel}
          onBackToReview={() => setCurrentStep('review')}
          onActivationComplete={(activeState) => {
            if (onCloseWorkspace) {
              onCloseWorkspace();
            } else {
              setCurrentStep('summary');
            }
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* STEP 7: IMPORT SUMMARY */}
      {/* ========================================================================= */}
      {currentStep === 'summary' && importSummary && (
        <Card variant="elevated" padding="lg" className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
            <div className="p-2.5 bg-[var(--status-success)]/40 text-[var(--status-success)] rounded-full border border-[var(--status-success)]/80">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-headline-md text-xl font-bold text-[var(--text-primary)]">
                Knowledge Source Ingested Successfully
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-mono-ui">
                Source: {importSummary.sourceName}
              </p>
            </div>
          </div>

          {/* SUMMARY METRICS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">Imported Assets</span>
              <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui">
                {importSummary.importedAssetsCount}
              </span>
            </div>

            <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">Generated Chunks</span>
              <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui">
                {importSummary.generatedChunksCount}
              </span>
            </div>

            <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">Processing Time</span>
              <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui">
                {importSummary.processingTimeMs} ms
              </span>
            </div>

            <div className="p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-1">
              <span className="text-[10px] font-mono-ui text-[var(--text-tertiary)] uppercase block">Total Words</span>
              <span className="text-lg font-bold text-[var(--text-primary)] font-mono-ui">
                {importSummary.totalWordCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* AUDIT DIGEST DETAILS */}
          <div className="space-y-2 p-4 bg-[var(--surface-low)] rounded-[var(--mode-radius)] border border-[var(--border-color)] text-xs font-mono-ui">
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">SHA-256 Digest:</span>
              <span className="text-[var(--text-primary)] font-bold">{importSummary.sha256Digest}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">Storage Location:</span>
              <span className="text-[var(--text-primary)] font-bold">{importSummary.storageLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-tertiary)]">Status:</span>
              <span className="text-[var(--status-success)] font-bold flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> Ready for Cognitive Knowledge Graph
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--border-color)]">
            <Button variant="secondary" onClick={() => setCurrentStep('select')}>
              Import Another Source
            </Button>

            <Button
              variant="primary"
              onClick={() => onStartLearningSession && onStartLearningSession(importSummary)}
            >
              <span>Begin Learning</span>
              <ArrowRight className="w-4 h-4 ms-1.5" />
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* DUPLICATE DETECTION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        title="Duplicate Content Detected"
        description="An identical file with the exact same SHA-256 digest already exists in your local knowledge model."
        maxWidth="md"
        footer={
          <div className="flex flex-wrap gap-2 justify-end w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowDuplicateModal(false);
                setCurrentStep('select');
              }}
            >
              Skip Import
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowDuplicateModal(false);
                executePipeline('replace');
              }}
            >
              Replace Existing
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowDuplicateModal(false);
                executePipeline('separate');
              }}
            >
              Create Separate Copy
            </Button>
          </div>
        }
      >
        {duplicateMatch && (
          <div className="space-y-3 py-2 text-xs font-mono-ui">
            <div className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--status-warning)] font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Existing Source Found</span>
              </div>
              <p className="text-[var(--text-primary)]">{duplicateMatch.sourceName}</p>
              <p className="text-[var(--text-tertiary)] text-[10px]">
                Ingested on {new Date(duplicateMatch.timestamp).toLocaleString()} ({duplicateMatch.generatedChunksCount} chunks)
              </p>
            </div>
          </div>
        )}
      </Modal>
    </WorkspaceSurface>
  );
};
