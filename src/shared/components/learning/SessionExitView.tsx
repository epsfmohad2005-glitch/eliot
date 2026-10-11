/**
 * @file src/shared/components/learning/SessionExitView.tsx
 * @description Short minimalist session exit summary. No dashboard, no badges, no XP.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LearningSessionState } from '../../../domains/dom-001-learning';
import { evidenceDomainService } from '../../../domains/dom-011-evidence';
import { EvidenceArtifactEntity } from '../../../types';
import { CheckCircle2, Clock, FileText, Lock, ShieldCheck, ArrowRight, Brain, Calendar } from 'lucide-react';
import { Modal, Button } from '../ui';
import { EvidenceLedgerAuditView } from '../session';

interface SessionExitViewProps {
  sessionState: LearningSessionState;
  onExitConfirm: () => void;
}

export const SessionExitView: React.FC<SessionExitViewProps> = ({ sessionState, onExitConfirm }) => {
  const [unitArtifacts, setUnitArtifacts] = useState<readonly EvidenceArtifactEntity[]>([]);

  useEffect(() => {
    let cancelled = false;
    evidenceDomainService.getArtifactsByUnitId(sessionState.unitId).then((res) => {
      if (!cancelled && res.ok) setUnitArtifacts(res.value);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionState.unitId]);

  const details = sessionState.sessionSummaryDetails;
  const durationMinutes = details?.durationMinutes ?? Math.round(sessionState.cognitiveLoad.sessionDurationSeconds / 60);

  return (
    <Modal
      isOpen={true}
      onClose={onExitConfirm}
      maxWidth="lg"
      className="font-ui-body space-y-5"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-[var(--surface-low)] text-[var(--status-success)] rounded-full border border-[var(--border-color)] mb-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="font-headline-md text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Learning Session Concluded
        </h2>
        <p className="text-xs text-[var(--text-secondary)] font-ui-body leading-relaxed max-w-sm mx-auto">
          Evidence registered into LocalFirst ledger. CKM concepts &amp; memory stability updated. Zero gamification / pure focus completion.
        </p>
      </div>

      {/* Detailed Metrics Summary Box */}
      <div className="bg-[var(--surface-low)] p-4 rounded-[var(--mode-radius)] border border-[var(--border-color)] space-y-3 font-mono-ui text-xs">
        <div className="flex items-center justify-between text-[var(--text-secondary)] pb-2 border-b border-[var(--border-color)]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-signal)]" />
            <span>Session Focus Duration</span>
          </span>
          <span className="font-bold text-[var(--text-primary)]">{durationMinutes} minutes</span>
        </div>

        <div className="flex items-center justify-between text-[var(--text-secondary)] pb-2 border-b border-[var(--border-color)]">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[var(--status-warning)]" />
            <span>Active Notes &amp; Logs</span>
          </span>
          <span className="font-bold text-[var(--text-primary)]">{sessionState.notes.length} notes</span>
        </div>

        <div className="flex items-center justify-between text-[var(--text-secondary)] pb-2 border-b border-[var(--border-color)]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
            <span>Reflection Quality</span>
          </span>
          <span className="font-bold text-[var(--status-success)]">
            {details?.reflectionStatus.isValid ? `Validated (${(details.reflectionStatus.depthScore * 100).toFixed(0)}% Depth)` : 'Recorded'}
          </span>
        </div>

        {/* Evidence Details */}
        <div className="pt-2 border-t border-[var(--border-color)] space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[var(--text-secondary)] uppercase font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-[var(--accent-signal)]" />
              Evidence Artifact UUID
            </span>
            <span className="text-[var(--status-success)] font-bold px-1.5 py-0.5 bg-[var(--surface-card)] rounded border border-[var(--border-color)] text-[10px]">
              {details?.verificationStatus || 'Verified'}
            </span>
          </div>
          {details?.evidenceUuid && (
            <p className="text-[11px] text-[var(--text-primary)] font-mono-ui bg-[var(--surface-card)] p-2 rounded border border-[var(--border-color)] truncate">
              {details.evidenceUuid}
            </p>
          )}
          {sessionState.evidenceSubmittedHash && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase">SHA-256 Digest</span>
              <p className="text-[10px] text-[var(--text-primary)] font-mono-ui break-all bg-[var(--surface-card)] p-2 rounded border border-[var(--border-color)]">
                {sessionState.evidenceSubmittedHash}
              </p>
            </div>
          )}
          {details?.evidenceQualityScore && (
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] pt-1">
              <span>Evidence Quality Score (Eq):</span>
              <span className="text-[var(--accent-signal)] font-bold">{details.evidenceQualityScore.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* AI Review Verdict (DOM-009) */}
        {sessionState.reviewVerdict && sessionState.reviewVerdict.status !== 'Pending' && (
          <div
            className={`pt-2 border-t border-[var(--border-color)] space-y-1.5 mt-2 pb-2 px-2.5 -mx-2.5 rounded-[var(--mode-radius)] ${
              sessionState.reviewVerdict.status === 'Approved'
                ? 'bg-[var(--status-success)]/10'
                : 'bg-[var(--status-warning)]/10'
            }`}
          >
            <span className="text-[10px] uppercase font-bold flex items-center gap-1">
              <Brain className={`w-3 h-3 ${sessionState.reviewVerdict.status === 'Approved' ? 'text-[var(--status-success)]' : 'text-[var(--status-warning)]'}`} />
              <span className={sessionState.reviewVerdict.status === 'Approved' ? 'text-[var(--status-success)]' : 'text-[var(--status-warning)]'}>
                AI Review: {sessionState.reviewVerdict.status === 'Approved' ? 'Approved' : 'Revision Requested'}
              </span>
            </span>
            {sessionState.reviewVerdict.critique && (
              <p className="text-[11px] text-[var(--text-primary)] font-ui-body leading-relaxed">
                {sessionState.reviewVerdict.critique}
              </p>
            )}
          </div>
        )}

        {/* Cryptographic Evidence Ledger (DOM-011) — full audit trail for this unit */}
        {unitArtifacts.length > 0 && (
          <div className="pt-2 -mx-2.5">
            <EvidenceLedgerAuditView unitId={sessionState.unitId} artifacts={unitArtifacts} />
          </div>
        )}

        {/* CKM Concept Mastery Updates */}
        {details?.conceptsUpdated && details.conceptsUpdated.length > 0 && (
          <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold flex items-center gap-1">
              <Brain className="w-3 h-3 text-[var(--accent-signal)]" />
              CKM Concepts Updated
            </span>
            {details.conceptsUpdated.map((concept) => (
              <div key={concept.conceptId} className="bg-[var(--surface-card)] p-2.5 rounded border border-[var(--border-color)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)] font-semibold font-ui-body text-xs">{concept.title}</span>
                  <span className="text-[10px] bg-[var(--surface-low)] text-[var(--accent-signal)] border border-[var(--border-color)] px-1.5 py-0.5 rounded">
                    {concept.conceptId}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--text-secondary)] pt-1 font-mono-ui">
                  <div>Mastery Score (Mc): <span className="text-[var(--status-success)] font-bold">{(concept.masteryScore * 100).toFixed(0)}%</span></div>
                  <div>Knowledge Conf (Kc): <span className="text-[var(--accent-signal)] font-bold">{(concept.knowledgeConfidence * 100).toFixed(0)}%</span></div>
                  <div>Retention R(t): <span className="text-[var(--accent-signal)] font-bold">{(concept.retentionScore * 100).toFixed(0)}%</span></div>
                  <div>Stability S: <span className="text-[var(--status-warning)] font-bold">{concept.memoryStability} days</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next Review & Next Recommended Action */}
        <div className="pt-2 border-t border-[var(--border-color)] space-y-1">
          {details?.nextReviewDueAt && (
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[var(--status-warning)]" />
                Next Memory Review Due:
              </span>
              <span className="text-[var(--text-primary)]">{new Date(details.nextReviewDueAt).toLocaleDateString()}</span>
            </div>
          )}
          <div className="pt-1">
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-bold block">Next Recommended Action</span>
            <p className="text-xs text-[var(--text-primary)] font-ui-body font-semibold mt-0.5">
              {details?.nextRecommendedAction || 'Stage Gate 4 Evaluation'}
            </p>
          </div>
        </div>
      </div>

      {/* Exit CTA */}
      <Button
        onClick={onExitConfirm}
        variant="primary"
        size="lg"
        className="w-full py-3 text-sm font-bold uppercase tracking-wider font-ui-body"
      >
        <span>Return to Mission Control</span>
        <ArrowRight className="w-4 h-4 ms-2" />
      </Button>
    </Modal>
  );
};
