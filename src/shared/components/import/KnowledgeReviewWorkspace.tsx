/**
 * @file src/shared/components/import/KnowledgeReviewWorkspace.tsx
 * @description Dedicated Knowledge Extraction & Candidate Review Workspace for Eliot RDI-1B.
 * Allows users to inspect, rename, merge, split, delete, and validate Candidate Knowledge Models (CKM-C)
 * using Foundation Component System (FCS-1) design primitives.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Code,
  GitMerge,
  GitPullRequest,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Edit3,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Activity,
  FileCode,
  List,
  Eye,
  X,
  Split,
  Check,
  HelpCircle,
  Hash,
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
  CandidateKnowledgeModel,
  CandidateConcept,
  CandidateSkill,
  CandidateDependency,
  CandidateLearningAsset,
  DuplicateConceptSuggestion,
  UnsupportedKnowledgeItem,
  RelationshipType,
} from '../../../core/import/extraction/types';
import { useLanguage } from '../../../i18n';

interface KnowledgeReviewWorkspaceProps {
  model: CandidateKnowledgeModel;
  onApproveAndStage: (validatedModel: CandidateKnowledgeModel) => void;
  onBackToInspection: () => void;
}

type ReviewTab = 'concepts' | 'skills' | 'dependencies' | 'assets' | 'duplicates' | 'quality' | 'unsupported';

export const KnowledgeReviewWorkspace: React.FC<KnowledgeReviewWorkspaceProps> = ({
  model: initialModel,
  onApproveAndStage,
  onBackToInspection,
}) => {
  const { t, isRTL } = useLanguage();
  const [model, setModel] = useState<CandidateKnowledgeModel>(initialModel);
  const [activeTab, setActiveTab] = useState<ReviewTab>('concepts');

  // Modal States
  const [editingConcept, setEditingConcept] = useState<CandidateConcept | null>(null);
  const [mergeSource, setMergeSource] = useState<CandidateConcept | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState<string>('');
  const [splitConceptTarget, setSplitConceptTarget] = useState<CandidateConcept | null>(null);
  const [splitPart1, setSplitPart1] = useState<string>('');
  const [splitPart2, setSplitPart2] = useState<string>('');
  const [showAddConceptModal, setShowAddConceptModal] = useState<boolean>(false);
  const [newConceptName, setNewConceptName] = useState<string>('');
  const [newConceptCategory, setNewConceptCategory] = useState<string>('User Added');
  const [newConceptDesc, setNewConceptDesc] = useState<string>('');
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);

  // Filter & Search
  const [conceptSearch, setConceptSearch] = useState<string>('');

  // =========================================================================
  // CONCEPT MUTATION HANDLERS
  // =========================================================================

  const handleRenameConcept = (conceptId: string, newName: string) => {
    setModel((prev) => ({
      ...prev,
      concepts: prev.concepts.map((c) =>
        c.id === conceptId ? { ...c, name: newName } : c
      ),
    }));
    setEditingConcept(null);
  };

  const handleDeleteConcept = (conceptId: string) => {
    setModel((prev) => ({
      ...prev,
      concepts: prev.concepts.filter((c) => c.id !== conceptId),
      dependencies: prev.dependencies.filter(
        (d) => d.sourceConceptId !== conceptId && d.targetConceptId !== conceptId
      ),
    }));
  };

  const handleToggleStatus = (conceptId: string) => {
    setModel((prev) => ({
      ...prev,
      concepts: prev.concepts.map((c) => {
        if (c.id === conceptId) {
          const nextStatus = c.status === 'approved' ? 'pending' : c.status === 'ignored' ? 'approved' : 'ignored';
          return { ...c, status: nextStatus };
        }
        return c;
      }),
    }));
  };

  const handleExecuteMerge = (sourceId: string, targetId: string) => {
    const source = model.concepts.find((c) => c.id === sourceId);
    const target = model.concepts.find((c) => c.id === targetId);

    if (!source || !target || sourceId === targetId) return;

    // Merge source into target: combine synonyms and description
    const updatedTarget: CandidateConcept = {
      ...target,
      synonyms: Array.from(new Set([...target.synonyms, source.name, ...source.synonyms])),
      description: `${target.description} (Merged with ${source.name}: ${source.description})`,
      status: 'approved',
    };

    setModel((prev) => ({
      ...prev,
      concepts: prev.concepts
        .map((c) => (c.id === targetId ? updatedTarget : c))
        .filter((c) => c.id !== sourceId),
      dependencies: prev.dependencies.map((d) => {
        let s = d.sourceConceptId;
        let tId = d.targetConceptId;
        if (s === sourceId) s = targetId;
        if (tId === sourceId) tId = targetId;
        return { ...d, sourceConceptId: s, targetConceptId: tId };
      }),
      duplicateSuggestions: prev.duplicateSuggestions.map((sug) =>
        sug.primaryConceptId === sourceId || sug.duplicateConceptId === sourceId
          ? { ...sug, resolvedStatus: 'merged' }
          : sug
      ),
    }));

    setMergeSource(null);
    setMergeTargetId('');
  };

  const handleExecuteSplit = () => {
    if (!splitConceptTarget || !splitPart1.trim() || !splitPart2.trim()) return;

    const c1: CandidateConcept = {
      ...splitConceptTarget,
      id: `concept-split-${Math.random().toString(36).substring(2, 7)}`,
      name: splitPart1.trim(),
      description: `Sub-concept split from ${splitConceptTarget.name}`,
      status: 'pending',
    };

    const c2: CandidateConcept = {
      ...splitConceptTarget,
      id: `concept-split-${Math.random().toString(36).substring(2, 7)}`,
      name: splitPart2.trim(),
      description: `Sub-concept split from ${splitConceptTarget.name}`,
      status: 'pending',
    };

    setModel((prev) => ({
      ...prev,
      concepts: prev.concepts
        .filter((c) => c.id !== splitConceptTarget.id)
        .concat([c1, c2]),
    }));

    setSplitConceptTarget(null);
    setSplitPart1('');
    setSplitPart2('');
  };

  const handleAddManualConcept = () => {
    if (!newConceptName.trim()) return;

    const newC: CandidateConcept = {
      id: `concept-manual-${Math.random().toString(36).substring(2, 7)}`,
      name: newConceptName.trim(),
      description: newConceptDesc.trim() || 'User added candidate concept.',
      category: newConceptCategory,
      confidence: 100,
      reason: 'Manually defined by user during Knowledge Review',
      evidenceText: 'User definition',
      originSource: model.sourceTitle,
      originChunkId: 'manual-input',
      status: 'approved',
      synonyms: [],
      tags: ['user-added'],
    };

    setModel((prev) => ({
      ...prev,
      concepts: [newC, ...prev.concepts],
    }));

    setNewConceptName('');
    setNewConceptDesc('');
    setShowAddConceptModal(false);
  };

  // =========================================================================
  // DEPENDENCY MUTATION HANDLERS
  // =========================================================================

  const handleAddDependency = (sourceId: string, targetId: string, relType: RelationshipType) => {
    if (sourceId === targetId) return;

    const newDep: CandidateDependency = {
      id: `dep-user-${Math.random().toString(36).substring(2, 7)}`,
      sourceConceptId: sourceId,
      targetConceptId: targetId,
      relationshipType: relType,
      confidence: 100,
      reason: 'Manually defined during relationship review',
      status: 'approved',
    };

    setModel((prev) => ({
      ...prev,
      dependencies: [...prev.dependencies, newDep],
    }));
  };

  const handleDeleteDependency = (depId: string) => {
    setModel((prev) => ({
      ...prev,
      dependencies: prev.dependencies.filter((d) => d.id !== depId),
    }));
  };

  const filteredConcepts = model.concepts.filter(
    (c) =>
      c.name.toLowerCase().includes(conceptSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(conceptSearch.toLowerCase())
  );

  return (
    <WorkspaceSurface className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ========================================================================= */}
      {/* HEADER & TOP LEVEL CONTROLS */}
      {/* ========================================================================= */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-headline-md text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              {t('extractionReview.workspaceTitle')}
            </h1>
            <Badge variant="primary">{model.sourceTitle}</Badge>
            <Badge variant="neutral">CKM-C Stage</Badge>
          </div>
          <p className="text-xs font-ui-body text-[var(--text-secondary)]">
            {t('extractionReview.workspaceSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBackToInspection}>
            <RotateCcw className="w-4 h-4 me-1.5" />
            <span>Inspection Report</span>
          </Button>

          <Button variant="primary" size="md" onClick={() => setShowApprovalModal(true)}>
            <ShieldCheck className="w-4 h-4 me-1.5 text-[var(--status-success)]" />
            <span>Validate &amp; Stage CKM-C</span>
          </Button>
        </div>
      </header>

      {/* SPRINT PROTOCOL NOTICE */}
      <Alert
        type="info"
        title="Candidate Knowledge Model (CKM-C) Protocol"
        message="Deterministic extraction complete. All entities exist as local candidates. Nothing is persisted to permanent CKM until approved."
      />

      {/* ========================================================================= */}
      {/* SECTION TABS */}
      {/* ========================================================================= */}
      <nav className="flex flex-wrap gap-2 border-b border-[var(--border-color)] pb-3 font-mono-ui text-xs">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'concepts'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t('extractionReview.tabConcepts')} ({model.concepts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'skills'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>{t('extractionReview.tabSkills')} ({model.skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dependencies')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'dependencies'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>{t('extractionReview.tabDependencies')} ({model.dependencies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'assets'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>{t('extractionReview.tabAssets')} ({model.learningAssets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'duplicates'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <GitMerge className="w-3.5 h-3.5" />
          <span>{t('extractionReview.tabDuplicates')} ({model.duplicateSuggestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'quality'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{t('extractionReview.tabQuality')} ({model.qualityMetrics.overallExtractionScore}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('unsupported')}
          className={`px-3 py-1.5 rounded-[var(--mode-radius)] transition-all flex items-center gap-1.5 font-bold ${
            activeTab === 'unsupported'
              ? 'bg-[var(--accent-signal)] text-black'
              : 'bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t('extractionReview.tabUnsupported')} ({model.unsupportedItems.length})</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* TAB 1: DETECTED CONCEPTS & EDITING */}
      {/* ========================================================================= */}
      {activeTab === 'concepts' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search concepts or tags..."
                value={conceptSearch}
                onChange={(e) => setConceptSearch(e.target.value)}
                className="w-full px-3 py-1.5 bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-signal)]"
              />
            </div>

            <Button variant="primary" size="sm" onClick={() => setShowAddConceptModal(true)}>
              <Plus className="w-4 h-4 me-1.5" />
              <span>{t('extractionReview.addConcept')}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConcepts.map((concept) => (
              <Card
                key={concept.id}
                variant="elevated"
                padding="md"
                className={`space-y-3 transition-all border ${
                  concept.status === 'ignored'
                    ? 'opacity-50 border-[var(--status-error)]/20 bg-[var(--status-error)]/5'
                    : concept.status === 'approved'
                    ? 'border-[var(--status-success)]/30 bg-[var(--status-success)]/5'
                    : 'border-[var(--border-color)]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-headline-md text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      {concept.name}
                      <Badge variant="neutral">{concept.category}</Badge>
                    </h3>
                    <p className="text-xs font-ui-body text-[var(--text-secondary)] pt-1">
                      {concept.description}
                    </p>
                  </div>

                  <span className="text-[11px] font-mono-ui font-bold text-[var(--accent-signal)] shrink-0">
                    {concept.confidence}%
                  </span>
                </div>

                {/* Evidence snippet */}
                <div className="p-2 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-[11px] font-mono-ui text-[var(--text-tertiary)] italic">
                  &quot;{concept.evidenceText}&quot;
                </div>

                {/* Synonyms & Tags */}
                {concept.synonyms.length > 0 && (
                  <div className="flex flex-wrap gap-1 text-[10px] font-mono-ui">
                    <span className="text-[var(--text-tertiary)]">Synonyms:</span>
                    {concept.synonyms.map((s, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-[var(--surface-card)] rounded border border-[var(--border-color)] text-[var(--text-secondary)]">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingConcept(concept)}
                      title="Rename"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMergeSource(concept)}
                      title="Merge into another concept"
                    >
                      <GitMerge className="w-3.5 h-3.5 text-[var(--status-warning)]" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSplitConceptTarget(concept);
                        setSplitPart1(`${concept.name} Part A`);
                        setSplitPart2(`${concept.name} Part B`);
                      }}
                      title="Split Concept"
                    >
                      <Split className="w-3.5 h-3.5 text-indigo-400" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConcept(concept.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[var(--status-error)]" />
                    </Button>
                  </div>

                  <Button
                    variant={concept.status === 'approved' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => handleToggleStatus(concept.id)}
                  >
                    {concept.status === 'approved' ? (
                      <span className="text-[var(--status-success)] font-bold flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="text-[var(--text-tertiary)] text-[11px]">Approve</span>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DETECTED SKILLS */}
      {/* ========================================================================= */}
      {activeTab === 'skills' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.skills.map((skill) => (
              <Card key={skill.id} variant="elevated" padding="md" className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <Code className="w-4 h-4 text-[var(--status-success)]" />
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)] block pt-0.5">
                      Level: {skill.level} • {skill.confidence}% Confidence
                    </span>
                  </div>
                  <Badge variant={skill.level === 'advanced' ? 'error' : skill.level === 'intermediate' ? 'warning' : 'success'}>
                    {skill.level}
                  </Badge>
                </div>

                {skill.codeSnippetRef && (
                  <pre className="p-3 bg-black/40 text-[var(--status-success)] rounded font-mono-ui text-[11px] overflow-x-auto border border-[var(--status-success)]/30">
                    <code>{skill.codeSnippetRef}</code>
                  </pre>
                )}

                <p className="text-xs font-ui-body text-[var(--text-secondary)]">
                  Reasoning: {skill.reason}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEPENDENCIES & PREREQUISITES */}
      {/* ========================================================================= */}
      {activeTab === 'dependencies' && (
        <section className="space-y-4">
          <Card variant="elevated" padding="md" className="space-y-3">
            <h3 className="text-xs font-mono-ui font-bold uppercase text-[var(--accent-signal)]">
              Candidate Concept Relationship Graph
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-ui-body">
              Deterministic dependency ordering derived from section flow, explicit prerequisites, and builds-on references.
            </p>

            <div className="space-y-2 pt-2">
              {model.dependencies.map((dep) => {
                const source = model.concepts.find((c) => c.id === dep.sourceConceptId)?.name || 'Unknown Concept';
                const target = model.concepts.find((c) => c.id === dep.targetConceptId)?.name || 'Unknown Concept';

                return (
                  <div
                    key={dep.id}
                    className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] flex items-center justify-between font-mono-ui text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sky-400">{source}</span>
                      <ArrowRight className="w-4 h-4 text-[var(--accent-signal)]" />
                      <span className="font-bold text-[var(--status-success)]">{target}</span>
                      <Badge variant="neutral">{dep.relationshipType}</Badge>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDependency(dep.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[var(--status-error)]" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LEARNING ASSETS & EVIDENCE */}
      {/* ========================================================================= */}
      {activeTab === 'assets' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.learningAssets.map((asset) => (
              <Card key={asset.id} variant="elevated" padding="md" className="space-y-2">
                <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
                  <span className="font-mono-ui text-xs font-bold text-[var(--text-primary)]">
                    {asset.title}
                  </span>
                  <Badge variant="neutral">{asset.assetType}</Badge>
                </div>
                <div className="p-2.5 bg-[var(--surface-low)] rounded border border-[var(--border-color)] font-mono-ui text-xs text-[var(--text-secondary)] whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {asset.content}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DUPLICATE CONCEPT SUGGESTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'duplicates' && (
        <section className="space-y-4">
          {model.duplicateSuggestions.length === 0 ? (
            <Card variant="elevated" padding="lg" className="text-center text-xs font-ui-body text-[var(--text-tertiary)]">
              No duplicate concept candidates detected.
            </Card>
          ) : (
            model.duplicateSuggestions.map((sug) => (
              <Card key={sug.id} variant="elevated" padding="md" className="space-y-3 border-[var(--status-warning)]/30 bg-[var(--status-warning)]/10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-sm font-bold text-[var(--status-warning)] flex items-center gap-2">
                      <GitMerge className="w-4 h-4" />
                      Duplicate Concept Candidate ({sug.similarityScore}% Match)
                    </h3>
                    <p className="text-xs font-mono-ui text-[var(--text-secondary)] pt-1">
                      {sug.reason}
                    </p>
                  </div>
                  {sug.resolvedStatus && (
                    <Badge variant={sug.resolvedStatus === 'merged' ? 'success' : 'neutral'}>
                      {sug.resolvedStatus}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-xs font-mono-ui space-y-1">
                    <span className="text-[10px] uppercase text-[var(--text-tertiary)] block">Primary Concept</span>
                    <span className="font-bold text-[var(--text-primary)]">{sug.primaryConceptName}</span>
                  </div>

                  <div className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-xs font-mono-ui space-y-1">
                    <span className="text-[10px] uppercase text-[var(--text-tertiary)] block">Duplicate Candidate</span>
                    <span className="font-bold text-[var(--text-primary)]">{sug.duplicateConceptName}</span>
                  </div>
                </div>

                {sug.resolvedStatus === 'pending' && (
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleExecuteMerge(sug.duplicateConceptId, sug.primaryConceptId)}
                    >
                      <GitMerge className="w-4 h-4 me-1.5" />
                      Merge Into Primary Concept
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: EXTRACTION QUALITY METRICS */}
      {/* ========================================================================= */}
      {activeTab === 'quality' && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="elevated" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">{t('extractionReview.qualityCoverage')}</span>
            <span className="text-2xl font-bold font-mono-ui text-[var(--status-success)] block">{model.qualityMetrics.coveragePercent}%</span>
            <ProgressBar value={model.qualityMetrics.coveragePercent} max={100} size="sm" variant="success" />
          </Card>

          <Card variant="elevated" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">{t('extractionReview.qualityAmbiguity')}</span>
            <span className="text-2xl font-bold font-mono-ui text-[var(--status-warning)] block">{model.qualityMetrics.ambiguityScore}%</span>
            <ProgressBar value={model.qualityMetrics.ambiguityScore} max={100} size="sm" variant="warning" />
          </Card>

          <Card variant="elevated" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">{t('extractionReview.qualityNoise')}</span>
            <span className="text-2xl font-bold font-mono-ui text-sky-400 block">{model.qualityMetrics.noiseScore}%</span>
            <ProgressBar value={model.qualityMetrics.noiseScore} max={100} size="sm" variant="primary" />
          </Card>

          <Card variant="elevated" padding="md" className="space-y-2">
            <span className="text-[10px] font-mono-ui uppercase text-[var(--text-tertiary)]">{t('extractionReview.qualityUnknown')}</span>
            <span className="text-2xl font-bold font-mono-ui text-[var(--text-primary)] block">{model.qualityMetrics.unknownTermsCount} Terms</span>
          </Card>
        </section>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: UNSUPPORTED KNOWLEDGE QUEUE */}
      {/* ========================================================================= */}
      {activeTab === 'unsupported' && (
        <section className="space-y-4">
          {model.unsupportedItems.length === 0 ? (
            <Card variant="elevated" padding="lg" className="text-center text-xs font-ui-body text-[var(--text-tertiary)]">
              No unsupported knowledge items currently pending review.
            </Card>
          ) : (
            model.unsupportedItems.map((item) => (
              <Card key={item.id} variant="elevated" padding="md" className="space-y-2 border-[var(--status-error)]/30">
                <div className="flex justify-between items-center">
                  <span className="font-mono-ui text-xs font-bold text-[var(--status-error)]">{item.term}</span>
                  <Badge variant="error">{item.reasonWhy}</Badge>
                </div>
                <p className="text-xs font-ui-body text-[var(--text-secondary)]">{item.suggestedAction}</p>
              </Card>
            ))
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODALS: RENAME, MERGE, SPLIT, ADD */}
      {/* ========================================================================= */}

      {/* RENAME MODAL */}
      {editingConcept && (
        <Modal
          isOpen={!!editingConcept}
          onClose={() => setEditingConcept(null)}
          title="Rename Concept"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setEditingConcept(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleRenameConcept(editingConcept.id, editingConcept.name)}
              >
                Save Name
              </Button>
            </div>
          }
        >
          <div className="space-y-3 py-2 font-mono-ui text-xs">
            <label className="block text-[var(--text-tertiary)]">Concept Name</label>
            <input
              type="text"
              value={editingConcept.name}
              onChange={(e) => setEditingConcept({ ...editingConcept, name: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none"
            />
          </div>
        </Modal>
      )}

      {/* MERGE MODAL */}
      {mergeSource && (
        <Modal
          isOpen={!!mergeSource}
          onClose={() => setMergeSource(null)}
          title={`Merge Concept "${mergeSource.name}"`}
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setMergeSource(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!mergeTargetId}
                onClick={() => handleExecuteMerge(mergeSource.id, mergeTargetId)}
              >
                Execute Merge
              </Button>
            </div>
          }
        >
          <div className="space-y-3 py-2 font-mono-ui text-xs">
            <p className="text-[var(--text-secondary)]">
              Select the primary target concept to merge &quot;{mergeSource.name}&quot; into:
            </p>
            <select
              value={mergeTargetId}
              onChange={(e) => setMergeTargetId(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none"
            >
              <option value="">-- Select Target Concept --</option>
              {model.concepts
                .filter((c) => c.id !== mergeSource.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
            </select>
          </div>
        </Modal>
      )}

      {/* SPLIT MODAL */}
      {splitConceptTarget && (
        <Modal
          isOpen={!!splitConceptTarget}
          onClose={() => setSplitConceptTarget(null)}
          title={`Split Concept "${splitConceptTarget.name}"`}
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setSplitConceptTarget(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleExecuteSplit}>
                Split Concept
              </Button>
            </div>
          }
        >
          <div className="space-y-3 py-2 font-mono-ui text-xs">
            <div>
              <label className="block text-[var(--text-tertiary)] mb-1">Sub-Concept 1</label>
              <input
                type="text"
                value={splitPart1}
                onChange={(e) => setSplitPart1(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-tertiary)] mb-1">Sub-Concept 2</label>
              <input
                type="text"
                value={splitPart2}
                onChange={(e) => setSplitPart2(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ADD MANUAL CONCEPT MODAL */}
      {showAddConceptModal && (
        <Modal
          isOpen={showAddConceptModal}
          onClose={() => setShowAddConceptModal(false)}
          title={t('extractionReview.addConcept')}
          footer={
            <div className="flex justify-end gap-2 w-full">
              <Button variant="ghost" onClick={() => setShowAddConceptModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddManualConcept}>
                Add Concept
              </Button>
            </div>
          }
        >
          <div className="space-y-3 py-2 font-mono-ui text-xs">
            <div>
              <label className="block text-[var(--text-tertiary)] mb-1">Concept Name</label>
              <input
                type="text"
                value={newConceptName}
                onChange={(e) => setNewConceptName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none"
                placeholder="e.g., Reactive State Store"
              />
            </div>
            <div>
              <label className="block text-[var(--text-tertiary)] mb-1">Category</label>
              <input
                type="text"
                value={newConceptCategory}
                onChange={(e) => setNewConceptCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--text-tertiary)] mb-1">Description</label>
              <textarea
                value={newConceptDesc}
                onChange={(e) => setNewConceptDesc(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-primary)] focus:outline-none h-20 resize-none"
                placeholder="Brief concept definition..."
              />
            </div>
          </div>
        </Modal>
      )}

      {/* STAGED APPROVAL CONFIRMATION MODAL */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={t('extractionReview.stagedSuccessModalTitle')}
        description={t('extractionReview.stagedSuccessModalDesc')}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="primary"
              onClick={() => {
                setShowApprovalModal(false);
                onApproveAndStage(model);
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
              <span>Candidate Model Staging Summary</span>
            </div>
            <p>• Approved Concepts: {model.concepts.filter((c) => c.status === 'approved').length}</p>
            <p>• Candidate Skills: {model.skills.length}</p>
            <p>• Validated Dependencies: {model.dependencies.length}</p>
          </div>
          <Alert
            type="info"
            message="Sprint RDI-1B Constraint: Candidate entities are staged locally. No CKM database insertion occurs."
          />
        </div>
      </Modal>
    </WorkspaceSurface>
  );
};
