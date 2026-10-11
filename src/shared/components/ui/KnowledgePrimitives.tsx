/**
 * @file src/shared/components/ui/KnowledgePrimitives.tsx
 * @description Foundation Component System — Eliot Personal Learning OS Exclusive Domain Primitives
 * @license Apache-2.0
 */

import React from 'react';

export interface KnowledgeNodeProps {
  id?: string;
  title: string;
  domain?: string;
  masteryScore?: number; // 0 - 100
  status?: 'active' | 'decaying' | 'mastered' | 'unexplored';
  onClick?: () => void;
  className?: string;
}

export const KnowledgeNode: React.FC<KnowledgeNodeProps> = ({
  id,
  title,
  domain,
  masteryScore = 0,
  status = 'unexplored',
  onClick,
  className = '',
}) => {
  const statusColors = {
    active: 'border-[var(--accent-signal)] text-[var(--text-primary)] shadow-sm',
    decaying: 'border-[var(--status-warning)] text-[var(--status-warning)]',
    mastered: 'border-[var(--status-success)] text-[var(--status-success)]',
    unexplored: 'border-[var(--border-color)] text-[var(--text-secondary)] opacity-70',
  };

  const badgeColors = {
    active: 'bg-[var(--accent-signal)]/20 text-[var(--accent-signal)]',
    decaying: 'bg-[var(--status-warning)]/20 text-[var(--status-warning)]',
    mastered: 'bg-[var(--status-success)]/20 text-[var(--status-success)]',
    unexplored: 'bg-[var(--surface-low)] text-[var(--text-secondary)]',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`group relative p-4 bg-[var(--surface-card)] border rounded-[var(--mode-radius)] transition-all duration-200 ease-out-quad hover:border-[var(--accent-signal)] cursor-pointer ${statusColors[status]} ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          {domain && <span className="text-[10px] font-mono-ui text-[var(--text-secondary)] tracking-wider uppercase">{domain}</span>}
          <h4 className="font-ui-body-bold text-sm text-[var(--text-primary)] font-semibold group-hover:text-[var(--accent-signal)] transition-colors">
            {title}
          </h4>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-mono-ui font-semibold rounded-full uppercase ${badgeColors[status]}`}>
          {status}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-mono-ui">
        <span className="text-[var(--text-secondary)]">Mastery</span>
        <span className="font-bold text-[var(--accent-signal)]">{masteryScore}%</span>
      </div>
      <div className="w-full bg-[var(--surface-low)] h-1 rounded-full mt-1.5 overflow-hidden">
        <div
          className="bg-[var(--accent-signal)] h-full transition-all duration-300"
          style={{ width: `${masteryScore}%` }}
        />
      </div>
    </div>
  );
};

export interface MemoryCardProps {
  concept: string;
  definition: string;
  retentionIntervalDays?: number;
  lastReviewed?: string;
  onReview?: () => void;
  className?: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  concept,
  definition,
  retentionIntervalDays = 1,
  lastReviewed = 'Today',
  onReview,
  className = '',
}) => {
  return (
    <div className={`p-5 bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] font-ui-body flex flex-col justify-between gap-4 transition-all hover:shadow-md ${className}`}>
      <div>
        <div className="flex items-center justify-between text-xs font-mono-ui text-[var(--text-secondary)] mb-2">
          <span>Ebbinghaus Interval: {retentionIntervalDays}d</span>
          <span>Last: {lastReviewed}</span>
        </div>
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5 font-ui-body">{concept}</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">{definition}</p>
      </div>
      {onReview && (
        <button
          type="button"
          onClick={onReview}
          className="self-end px-3 py-1.5 text-xs font-label-sm font-semibold bg-[var(--accent-signal)] text-[#0A0A0A] rounded-[var(--mode-radius)] hover:opacity-90 transition-opacity"
        >
          Review Memory
        </button>
      )}
    </div>
  );
};

export interface EvidenceBadgeProps {
  confidenceScore: number; // 0.0 to 1.0
  sourceCount?: number;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  confidenceScore,
  sourceCount = 1,
  className = '',
}) => {
  const percentage = Math.round(confidenceScore * 100);
  const isHigh = confidenceScore >= 0.8;
  const isMed = confidenceScore >= 0.5 && confidenceScore < 0.8;

  const badgeColor = isHigh
    ? 'bg-[var(--status-success)]/15 text-[var(--status-success)] border-[var(--status-success)]/30'
    : isMed
    ? 'bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30'
    : 'bg-[var(--status-error)]/15 text-[var(--status-error)] border-[var(--status-error)]/30';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono-ui ${badgeColor} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>Confidence: {percentage}%</span>
      {sourceCount > 1 && <span className="text-[10px] opacity-75">({sourceCount} sources)</span>}
    </div>
  );
};

export interface ConceptTagProps {
  label: string;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export const ConceptTag: React.FC<ConceptTagProps> = ({
  label,
  active = false,
  onRemove,
  onClick,
  className = '',
}) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-ui rounded-full transition-all select-none ${
        active
          ? 'bg-[var(--accent-signal)] text-[#0A0A0A] font-semibold'
          : 'bg-[var(--surface-low)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <span>#{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-75 transition-opacity"
          aria-label={`Remove tag ${label}`}
        >
          ✕
        </button>
      )}
    </span>
  );
};

export interface StageIndicatorProps {
  stage: 'INTAKE' | 'ABSORPTION' | 'SYNTHESIS' | 'RETENTION';
  className?: string;
}

export const StageIndicator: React.FC<StageIndicatorProps> = ({ stage, className = '' }) => {
  const stages: Array<'INTAKE' | 'ABSORPTION' | 'SYNTHESIS' | 'RETENTION'> = [
    'INTAKE',
    'ABSORPTION',
    'SYNTHESIS',
    'RETENTION',
  ];

  const currentIdx = stages.indexOf(stage);

  return (
    <div className={`flex items-center gap-1 text-[11px] font-mono-ui tracking-wider ${className}`}>
      {stages.map((stg, idx) => {
        const isPast = idx < currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <React.Fragment key={stg}>
            {idx > 0 && <span className="text-[var(--text-secondary)]/40">→</span>}
            <span
              className={`px-2 py-0.5 rounded ${
                isCurrent
                  ? 'bg-[var(--accent-signal)]/20 text-[var(--accent-signal)] font-bold border border-[var(--accent-signal)]/40'
                  : isPast
                  ? 'text-[var(--text-primary)] font-medium'
                  : 'text-[var(--text-secondary)] opacity-50'
              }`}
            >
              {stg}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export interface SessionTimerProps {
  elapsedSeconds: number;
  isRunning?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({
  elapsedSeconds,
  isRunning = false,
  onToggle,
  className = '',
}) => {
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className={`inline-flex items-center gap-3 px-3 py-1.5 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] font-mono-ui text-xs ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[var(--accent-signal)] animate-pulse' : 'bg-[var(--status-warning)]'}`} />
        <span className="font-bold text-[var(--text-primary)] text-sm">{formatted}</span>
      </div>
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-[10px] uppercase tracking-wider font-semibold"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      )}
    </div>
  );
};

export interface FocusMeterProps {
  score: number; // 0 - 100
  label?: string;
  className?: string;
}

export const FocusMeter: React.FC<FocusMeterProps> = ({
  score,
  label = 'Cognitive Focus',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 p-3 bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] ${className}`}>
      <div className="flex items-center justify-between text-xs font-label-sm">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="font-mono-ui font-bold text-[var(--accent-signal)]">{score}%</span>
      </div>
      <div className="w-full bg-[var(--surface-low)] h-2 rounded-full overflow-hidden">
        <div
          className="bg-[var(--accent-signal)] h-full transition-all duration-300"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export interface MissionStatusProps {
  missionTitle: string;
  progress: number; // 0 - 100
  status?: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  className?: string;
}

export const MissionStatus: React.FC<MissionStatusProps> = ({
  missionTitle,
  progress,
  status = 'ACTIVE',
  className = '',
}) => {
  return (
    <div className={`p-4 bg-[var(--surface-card)] border border-[var(--border-color)] rounded-[var(--mode-radius)] font-ui-body ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono-ui text-[var(--accent-signal)] uppercase tracking-wider font-semibold">
          Active Mission
        </span>
        <span className="text-[10px] font-mono-ui px-2 py-0.5 rounded bg-[var(--surface-low)] text-[var(--text-secondary)]">
          {status}
        </span>
      </div>
      <h4 className="font-ui-body-bold text-sm text-[var(--text-primary)] font-semibold mb-3">
        {missionTitle}
      </h4>
      <div className="flex items-center gap-3 text-xs font-mono-ui">
        <div className="flex-1 bg-[var(--surface-low)] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[var(--accent-signal)] h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-bold text-[var(--text-primary)]">{progress}%</span>
      </div>
    </div>
  );
};
