/**
 * @file src/shared/components/learning/EvidenceSubmissionView.tsx
 * @description Evidence Submission panel supporting 7 evidence types and generating SHA-256 artifact hashes.
 * Strictly NEVER uses "Complete Lesson", only "Submit Evidence". Consumes FCS-1 primitives and Design Tokens.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { EvidenceType } from '../../../domains/dom-001-learning';
import { ReviewVerdictEntity } from '../../../types';
import {
  ShieldCheck,
  Code2,
  GitBranch,
  FileText,
  Type,
  Image as ImageIcon,
  File,
  Link as LinkIcon,
  Send,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Card, Button } from '../ui';

interface EvidenceSubmissionViewProps {
  selectedType: EvidenceType;
  submittedHash?: string;
  isCompleted: boolean;
  reviewVerdict?: ReviewVerdictEntity;
  onSubmitEvidence: (type: EvidenceType, payload: string) => void;
}

const EVIDENCE_TYPES: { id: EvidenceType; label: string; icon: React.ElementType; placeholder: string }[] = [
  { id: 'Code', label: 'Code Snippet', icon: Code2, placeholder: 'Paste verified TypeScript implementation or function solution...' },
  { id: 'Repository', label: 'Repository', icon: GitBranch, placeholder: 'GitHub Repository URL or Commit SHA (e.g. https://github.com/org/repo/commit/4f8b9e1)...' },
  { id: 'Markdown', label: 'Markdown Spec', icon: FileText, placeholder: 'Paste architectural markdown documentation spec...' },
  { id: 'Text', label: 'Text Writeup', icon: Type, placeholder: 'Write summary explanation of verified proof...' },
  { id: 'Screenshot', label: 'Screenshot', icon: ImageIcon, placeholder: 'Drag & drop screenshot or enter image artifact URL...' },
  { id: 'Files', label: 'File Attachment', icon: File, placeholder: 'Upload or specify artifact file path...' },
  { id: 'Links', label: 'External Link', icon: LinkIcon, placeholder: 'Live deployment or Pull Request URL...' },
];

export const EvidenceSubmissionView: React.FC<EvidenceSubmissionViewProps> = ({
  selectedType,
  submittedHash,
  isCompleted,
  reviewVerdict,
  onSubmitEvidence,
}) => {
  const [activeType, setActiveType] = useState<EvidenceType>(selectedType);
  const [payloadInput, setPayloadInput] = useState<string>('');

  const currentTypeConfig = EVIDENCE_TYPES.find((t) => t.id === activeType) || EVIDENCE_TYPES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitEvidence(activeType, payloadInput);
  };

  return (
    <Card id="evidence-submission-panel" variant="default" padding="md" className="space-y-4 shadow-sm font-ui-body">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--status-success)]" />
          <h3 className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">Evidence Submission</h3>
          <span className="text-[10px] font-mono-ui text-[var(--status-success)] bg-[var(--surface-low)] px-2 py-0.5 rounded border border-[var(--border-color)]">
            Artifact Verification
          </span>
        </div>
        {submittedHash && (
          <span className="text-xs font-mono-ui text-[var(--status-success)] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Evidence Recorded
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Evidence Type Selector Pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono-ui text-[var(--text-secondary)]">Select Evidence Type Artifact:</label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full font-mono-ui text-xs">
            {EVIDENCE_TYPES.map((et) => {
              const Icon = et.icon;
              const isActive = activeType === et.id;
              return (
                <Button
                  key={et.id}
                  type="button"
                  variant={isActive ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setActiveType(et.id)}
                  className="py-1 px-2.5 text-[11px] font-mono-ui whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5 me-1" />
                  <span>{et.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Submission Payload Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <textarea
              value={payloadInput}
              onChange={(e) => setPayloadInput(e.target.value)}
              rows={3}
              placeholder={currentTypeConfig.placeholder}
              className="w-full bg-[var(--surface-low)] border border-[var(--border-color)] focus:border-[var(--status-success)] rounded-[var(--mode-radius)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none font-mono-ui leading-relaxed resize-y"
            />
          </div>

          {/* Cryptographic SHA-256 Artifact Hash Display */}
          {submittedHash && (
            <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] font-mono-ui text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--status-success)] font-bold text-[11px]">
                <Lock className="w-3.5 h-3.5" />
                <span>SHA-256 Artifact Cryptographic Proof</span>
              </div>
              <p className="text-[var(--text-secondary)] break-all text-[11px] select-all">
                {submittedHash}
              </p>
            </div>
          )}

          {/* AI Review Verdict (DOM-009) — appears once evaluation resolves */}
          {reviewVerdict && (
            <div
              className={`p-3 rounded-[var(--mode-radius)] border space-y-1.5 ${
                reviewVerdict.status === 'Approved'
                  ? 'bg-[var(--status-success)]/10 border-[var(--status-success)]/30'
                  : reviewVerdict.status === 'Pending'
                  ? 'bg-[var(--surface-low)] border-[var(--border-color)]'
                  : 'bg-[var(--status-warning)]/10 border-[var(--status-warning)]/30'
              }`}
            >
              <div className="flex items-center gap-1.5 font-mono-ui text-[11px] font-bold">
                {reviewVerdict.status === 'Approved' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[var(--status-success)]" />
                    <span className="text-[var(--status-success)]">Review: Approved</span>
                  </>
                ) : reviewVerdict.status === 'Pending' ? (
                  <span className="text-[var(--text-muted)] terminal-cursor">Review pending</span>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-[var(--status-warning)]" />
                    <span className="text-[var(--status-warning)]">Review: Revision Requested</span>
                  </>
                )}
              </div>
              {reviewVerdict.critique && (
                <p className="text-xs text-[var(--text-primary)] font-ui-body leading-relaxed">
                  {reviewVerdict.critique}
                </p>
              )}
              {reviewVerdict.correctiveSteps.length > 0 && (
                <ul className="list-disc list-inside text-xs text-[var(--text-secondary)] space-y-0.5">
                  {reviewVerdict.correctiveSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Primary Evidence Submission CTA Button (Strictly NEVER "Complete Lesson") */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-3 text-sm font-bold font-ui-body uppercase tracking-wider"
          >
            <Send className="w-4 h-4 me-2" />
            <span>Submit Evidence</span>
          </Button>
        </form>
      </div>
    </Card>
  );
};
