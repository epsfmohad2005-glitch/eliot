/**
 * @file src/shared/components/learning/LearningSourceViewer.tsx
 * @description Supports multiple learning source types (Video, Documentation, NotebookLM, Gemini Gem, PDF, Article, Future sources).
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React from 'react';
import { LearningSourceType } from '../../../domains/dom-001-learning';
import {
  FileText,
  Video,
  Cpu,
  Bot,
  FileCode,
  Newspaper,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Card, Button } from '../ui';

interface LearningSourceViewerProps {
  activeType: LearningSourceType;
  sourceContent: {
    title: string;
    description: string;
    mediaUrl?: string;
    bodyMarkdown?: string;
  };
  onSourceTypeChange: (type: LearningSourceType) => void;
}

const SOURCE_TYPES: { id: LearningSourceType; label: string; icon: React.ElementType }[] = [
  { id: 'Documentation', label: 'Docs', icon: FileText },
  { id: 'Video', label: 'Video', icon: Video },
  { id: 'NotebookLM', label: 'NotebookLM', icon: Cpu },
  { id: 'Gemini Gem', label: 'Gemini Gem', icon: Bot },
  { id: 'PDF', label: 'PDF Spec', icon: FileCode },
  { id: 'Article', label: 'Article', icon: Newspaper },
  { id: 'FutureSource', label: 'Plugin', icon: Sparkles },
];

export const LearningSourceViewer: React.FC<LearningSourceViewerProps> = ({
  activeType,
  sourceContent,
  onSourceTypeChange,
}) => {
  return (
    <Card id="learning-source-container" variant="default" padding="md" className="space-y-4 shadow-sm">
      {/* Source Selector Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--accent-signal)]" />
          <h3 className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">Zone B — Learning Surface</h3>
        </div>

        {/* Source Type Pills */}
        <div className="flex items-center gap-1 font-mono-ui text-[11px] overflow-x-auto pb-1 max-w-full">
          {SOURCE_TYPES.map((st) => {
            const Icon = st.icon;
            const isActive = activeType === st.id;
            return (
              <Button
                key={st.id}
                variant={isActive ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onSourceTypeChange(st.id)}
                className="py-1 px-2.5 text-[11px] font-mono-ui whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 me-1" />
                <span>{st.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Source Content Viewer Envelope */}
      <div className="space-y-3">
        <div className="space-y-1">
          <h4 className="font-headline-md text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
            {sourceContent.title}
          </h4>
          <p className="font-ui-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {sourceContent.description}
          </p>
        </div>

        {/* Video Mode */}
        {activeType === 'Video' && sourceContent.mediaUrl && (
          <div className="aspect-video bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] overflow-hidden relative group flex items-center justify-center">
            <img
              src={sourceContent.mediaUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-card)] via-transparent to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center justify-between text-xs font-mono-ui text-[var(--text-primary)]">
                <span className="flex items-center gap-1.5 bg-[var(--surface-low)] px-2.5 py-1 rounded border border-[var(--border-color)]">
                  <Video className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
                  Interactive Video Player (12:40)
                </span>
                <span className="bg-[var(--accent-signal)] text-black px-2 py-0.5 rounded font-bold">1080p</span>
              </div>
            </div>
          </div>
        )}

        {/* Text/Markdown Modes (Docs, NotebookLM, Gemini Gem, PDF, Article, FutureSource) */}
        {activeType !== 'Video' && sourceContent.bodyMarkdown && (
          <div className="p-4 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] space-y-3 font-ui-body text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed max-h-96 overflow-y-auto">
            <div className="prose max-w-[70ch] space-y-2 whitespace-pre-line text-[var(--text-primary)]">
              {sourceContent.bodyMarkdown}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

