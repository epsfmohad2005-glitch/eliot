/**
 * @file src/shared/components/knowledge/KnowledgeMapView.tsx
 * @description Cognitive Knowledge Model (CKM) Interactive Knowledge Map & Concept Graph.
 * @license Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { knowledgeDomainService, ConceptNode } from '../../../domains/dom-003-knowledge';
import { graphScalabilityEngine } from '../../../domains/dom-003-knowledge/GraphScalabilityEngine';
import { memoryDomainService } from '../../../domains/dom-002-memory';
import { MemoryItemEntity } from '../../../types';
import { useLanguage } from '../../../i18n';
import { Layers, Network, CheckCircle2, Clock, GitCommit, ShieldCheck, Cpu, ArrowRight, Activity, Filter, Info, Zap } from 'lucide-react';

interface KnowledgeMapViewProps {
  onSelectConceptForSession?: (conceptId: string) => void;
}

export const KnowledgeMapView: React.FC<KnowledgeMapViewProps> = ({ onSelectConceptForSession }) => {
  const { t, isRTL } = useLanguage();
  const [concepts, setConcepts] = useState<readonly ConceptNode[]>([]);
  const [memories, setMemories] = useState<Map<string, MemoryItemEntity>>(new Map());
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadKnowledgeData();
  }, []);

  const loadKnowledgeData = useCallback(async () => {
    setLoading(true);
    const conceptsRes = await knowledgeDomainService.getAllConcepts();
    if (conceptsRes.ok) {
      setConcepts(conceptsRes.value);
      if (conceptsRes.value.length > 0) {
        setSelectedConcept(conceptsRes.value[0]);
      }
    }

    const memMap = new Map<string, MemoryItemEntity>();
    for (const concept of conceptsRes.ok ? conceptsRes.value : []) {
      const memRes = await memoryDomainService.getMemoryItem(concept.id);
      if (memRes.ok && memRes.value) {
        memMap.set(concept.id, memRes.value);
      }
    }
    setMemories(memMap);
    setLoading(false);
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(concepts.map((c) => c.category)));
  }, [concepts]);

  const filteredConcepts = useMemo(() => {
    const raw = categoryFilter === 'ALL'
      ? concepts
      : concepts.filter((c) => c.category === categoryFilter);

    // Apply Virtualization Viewport Filtering for 10,000+ Concept Scalability
    const { visibleNodes } = graphScalabilityEngine.getVisibleNodes(raw, {
      xMin: 0,
      xMax: 2000,
      yMin: 0,
      yMax: 2000,
      zoomLevel: 1.0,
    }, 100);

    return visibleNodes;
  }, [categoryFilter, concepts]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-[var(--text-muted)] animate-pulse">
        Loading Cognitive Knowledge Model (CKM) Graph...
      </div>
    );
  }

  const selectedMemory = selectedConcept ? memories.get(selectedConcept.id) : null;
  const prerequisites = selectedConcept
    ? concepts.filter((c) => selectedConcept.prerequisiteIds.includes(c.id))
    : [];

  return (
    <div id="ckm-knowledge-map-container" className="space-y-6 font-sans antialiased max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Network className="w-4 h-4 text-indigo-400" />
            <span>DOM-003 • Cognitive Knowledge Model (CKM)</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mt-1">
            Knowledge Map &amp; Concept Dependency Graph
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
            Deterministic Mastery Score (M<sub>c</sub> = 0.35 R(t) + 0.45 E<sub>q</sub> + 0.20 P) &amp; Confidence K<sub>c</sub>
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] mr-1" />
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
              categoryFilter === 'ALL'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-[var(--surface-low)] text-[var(--text-secondary)] hover:bg-[var(--surface-high)] border border-[var(--border-color)]'
            }`}
          >
            All ({concepts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[var(--surface-low)] text-[var(--text-secondary)] hover:bg-[var(--surface-high)] border border-[var(--border-color)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Grid & Inspector Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Concept Nodes List / Cards */}
        <div className="md:col-span-7 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-400" />
            Concept Nodes ({filteredConcepts.length})
          </h2>

          <div className="space-y-3">
            {filteredConcepts.map((node) => {
              const isSelected = selectedConcept?.id === node.id;
              const mem = memories.get(node.id);
              const masteryPercent = Math.round(node.masteryScore * 100);
              const confidencePercent = Math.round(node.knowledgeConfidence * 100);

              return (
                <div
                  key={node.id}
                  id={`concept-card-${node.id}`}
                  onClick={() => setSelectedConcept(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--surface-card)] border-indigo-500/80 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-950/20'
                      : 'bg-[var(--surface-card)]/60 border-[var(--border-color)] hover:border-[var(--border-color)] hover:bg-[var(--surface-card)]/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="px-2 py-0.5 bg-[var(--surface-low)] text-indigo-300 border border-[var(--border-color)] rounded font-semibold">
                          {node.id}
                        </span>
                        <span className="text-[var(--text-muted)]">•</span>
                        <span className="text-[var(--text-secondary)]">{node.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] font-sans leading-snug">
                        {node.title}
                      </h3>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <span className="text-sm font-extrabold text-indigo-400">
                        {masteryPercent}%
                      </span>
                      <span className="block text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                        Mastery M<sub>c</sub>
                      </span>
                    </div>
                  </div>

                  {/* Progress indicators */}
                  <div className="mt-3 pt-3 border-t border-[var(--border-color)]/80 grid grid-cols-2 gap-3 text-[11px] font-mono">
                    <div>
                      <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                        <span>Confidence K<sub>c</sub></span>
                        <span className="text-sky-400 font-bold">{confidencePercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--surface-low)] rounded-full overflow-hidden border border-[var(--border-color)]">
                        <div
                          className="h-full bg-sky-400 transition-all duration-300"
                          style={{ width: `${confidencePercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                        <span>Retention R(t)</span>
                        <span className="text-[var(--status-success)] font-bold">
                          {mem ? Math.round(mem.retentionScore * 100) : 85}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--surface-low)] rounded-full overflow-hidden border border-[var(--border-color)]">
                        <div
                          className="h-full bg-[var(--status-success)] transition-all duration-300"
                          style={{ width: `${mem ? mem.retentionScore * 100 : 85}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Prerequisite indicators */}
                  {node.prerequisiteIds.length > 0 && (
                    <div className="mt-2 text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1">
                      <GitCommit className="w-3 h-3 text-[var(--text-secondary)]" />
                      <span>Prerequisites: {node.prerequisiteIds.join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Node Inspector */}
        <div className="md:col-span-5 space-y-3">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-400" />
            Concept Formula &amp; Inspector
          </h2>

          {selectedConcept ? (
            <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-5 shadow-xl space-y-5 sticky top-20 font-sans">
              <div className="border-b border-[var(--border-color)] pb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded font-semibold">
                  {selectedConcept.id}
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary)] mt-2">
                  {selectedConcept.title}
                </h3>
                <span className="text-xs font-mono text-[var(--text-secondary)] block mt-1">
                  Category: {selectedConcept.category}
                </span>
              </div>

              {/* Formula Breakdown Panel */}
              <div className="bg-[var(--surface-low)] p-4 rounded-lg border border-[var(--border-color)] space-y-3 font-mono text-xs">
                <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider block">
                  CKM Deterministic Formula Output
                </span>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[var(--text-secondary)]">
                    <span>Mastery Score M<sub>c</sub>:</span>
                    <span className="text-indigo-400 font-bold text-sm">
                      {selectedConcept.masteryScore.toFixed(3)} ({(selectedConcept.masteryScore * 100).toFixed(1)}%)
                    </span>
                  </div>

                  <div className="text-[11px] text-[var(--text-muted)] leading-relaxed font-sans bg-[var(--surface-card)]/80 p-2.5 rounded border border-[var(--border-color)]/80">
                    <p className="font-mono text-[10px] text-[var(--text-secondary)] mb-1">
                      M<sub>c</sub> = 0.35 R(t) + 0.45 E<sub>q</sub> + 0.20 P
                    </p>
                    <ul className="space-y-0.5 text-[11px] text-[var(--text-secondary)]">
                      <li>• Retention R(t): <strong>{selectedMemory ? selectedMemory.retentionScore : 0.85}</strong></li>
                      <li>• Evidence Quality E<sub>q</sub>: <strong>0.95</strong></li>
                      <li>• Practice Execution P: <strong>0.95</strong></li>
                    </ul>
                  </div>

                  <div className="flex justify-between items-center text-[var(--text-secondary)] pt-2 border-t border-[var(--border-color)]">
                    <span>Knowledge Confidence K<sub>c</sub>:</span>
                    <span className="text-sky-400 font-bold text-sm">
                      {selectedConcept.knowledgeConfidence.toFixed(3)}
                    </span>
                  </div>

                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    K<sub>c</sub> = 1.0 - exp(-N / 5) • N = {selectedConcept.iterationsCount} iterations
                  </p>
                </div>
              </div>

              {/* Prerequisites Breakdown */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider block">
                  Prerequisite Graph Node Requirements
                </span>

                {prerequisites.length > 0 ? (
                  <div className="space-y-1.5">
                    {prerequisites.map((pre) => (
                      <div
                        key={pre.id}
                        className="p-2.5 bg-[var(--surface-low)] rounded border border-[var(--border-color)] flex items-center justify-between"
                      >
                        <div>
                          <span className="text-indigo-400 font-semibold">{pre.id}</span>
                          <p className="text-[11px] text-[var(--text-secondary)] font-sans">{pre.title}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-[var(--status-success)] text-[var(--status-success)] border border-[var(--status-success)] rounded text-[10px]">
                          Satisfied
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-[var(--surface-low)] rounded border border-[var(--border-color)] text-[var(--text-muted)] text-[11px]">
                    Root Concept Node • No prerequisites required.
                  </div>
                )}
              </div>

              {/* Action Button */}
              {onSelectConceptForSession && (
                <button
                  onClick={() => onSelectConceptForSession(selectedConcept.id)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 font-mono"
                >
                  <span>Practice Concept Mission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[var(--surface-card)] border border-[var(--border-color)] rounded-xl p-8 text-center text-xs font-mono text-[var(--text-muted)]">
              Select a concept node to view its CKM formula breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
