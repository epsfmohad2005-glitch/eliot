/**
 * @file src/shared/components/session/EvaluationChallengeModal.tsx
 * @description Socratic Stage Gate Evaluation & Verification Challenge Modal.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { LearningStageNumber, ReviewVerdictEntity } from '../../../types';
import { StageChallengeData } from '../../../domains/dom-001-learning';
import { Modal, Button, Card } from '../ui';
import { HelpCircle, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { eventBus } from '../../../core/events';

export interface EvaluationChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPass?: (verdict: ReviewVerdictEntity) => void;
  stageNumber?: LearningStageNumber;
  unitTitle?: string;
  challenge: StageChallengeData | null;
  isLoading?: boolean;
  loadError?: string | null;
  onRetry?: () => void;
}

export const EvaluationChallengeModal: React.FC<EvaluationChallengeModalProps> = ({
  isOpen,
  onClose,
  onPass,
  stageNumber = 2,
  unitTitle = 'Stage Progression Verification',
  challenge,
  isLoading = false,
  loadError = null,
  onRetry,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = challenge !== null && selectedOption === challenge.correctIndex;

  const handleSubmit = () => {
    if (selectedOption === null || challenge === null) return;
    setSubmitted(true);

    if (isCorrect) {
      const verdict: ReviewVerdictEntity = {
        id: `verdict-${Date.now()}`,
        artifactId: `challenge-stage-${stageNumber}`,
        status: 'Approved',
        critique: 'Accurately articulated the architectural rationale of ADR-004 event-driven decoupling.',
        correctiveSteps: [],
      };

      eventBus.publish({
        eventId: `evt-${Date.now()}`,
        eventType: 'StageGatePassed',
        sourceDomain: 'DOM-001',
        timestamp: new Date().toISOString(),
        payload: { stageNumber, unitTitle, verdict },
      });

      if (onPass) {
        onPass(verdict);
      }
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <Modal
      id="evaluation-challenge-modal"
      isOpen={isOpen}
      onClose={onClose}
      title={`Stage ${stageNumber} Gate Challenge: ${unitTitle}`}
      description="Verify conceptual mastery before advancing to the next learning stage."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full font-mono-ui text-xs">
          <span className="text-[var(--text-secondary)]">
            Epistemic Gate Check • Stage {stageNumber}/8
          </span>
          <div className="flex gap-2">
            {isLoading || loadError ? null : submitted && !isCorrect ? (
              <Button variant="secondary" size="sm" onClick={handleReset}>
                Try Again
              </Button>
            ) : null}
            {isLoading || loadError ? null : !submitted ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={selectedOption === null || !challenge}
              >
                Submit Verification
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onClose}>
                Continue
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 font-sans">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-[var(--text-secondary)]">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-signal)]" />
            <span className="text-xs font-mono-ui">Generating a challenge for this stage…</span>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <AlertCircle className="w-6 h-6 text-[var(--status-error)]" />
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">{loadError}</p>
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Try Again
              </Button>
            )}
          </div>
        )}

        {!isLoading && !loadError && challenge && (
          <>
        <div className="p-3.5 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono-ui text-[var(--accent-signal)]">
            <HelpCircle className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider">Concept Verification</span>
          </div>
          <p className="text-sm text-[var(--text-primary)] font-ui-body-bold leading-relaxed">
            {challenge.question}
          </p>
        </div>

        <div className="space-y-2">
          {challenge.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            let optionStyle =
              'bg-[var(--surface-low)] border-[var(--border-color)] hover:border-[var(--accent-signal)]';

            if (submitted) {
              if (idx === challenge.correctIndex) {
                optionStyle = 'bg-[var(--status-success)]/10 border-[var(--status-success)] text-[var(--status-success)]';
              } else if (isSelected) {
                optionStyle = 'bg-[var(--status-error)]/10 border-[var(--status-error)] text-[var(--status-error)]';
              }
            } else if (isSelected) {
              optionStyle = 'bg-[var(--surface-high)] border-[var(--accent-signal)]';
            }

            return (
              <div
                key={idx}
                onClick={() => !submitted && setSelectedOption(idx)}
                className={`p-3 rounded-[var(--mode-radius)] border cursor-pointer transition-all flex items-start gap-3 text-xs leading-relaxed ${optionStyle}`}
              >
                <span className="w-5 h-5 rounded-full border border-[var(--border-color)] flex items-center justify-center font-mono-ui font-bold text-[10px] shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-[var(--text-primary)] font-sans">{option}</span>
              </div>
            );
          })}
        </div>

        {submitted && (
          <div
            className={`p-3 rounded-[var(--mode-radius)] border text-xs flex items-start gap-2.5 ${
              isCorrect
                ? 'bg-[var(--status-success)]/10 border-[var(--status-success)] text-[var(--text-primary)]'
                : 'bg-[var(--status-error)]/10 border-[var(--status-error)] text-[var(--text-primary)]'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-[var(--status-success)] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[var(--status-error)] shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">
                {isCorrect ? 'Stage Gate Passed!' : 'Verification Incomplete'}
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {challenge.explanation}
              </p>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </Modal>
  );
};
