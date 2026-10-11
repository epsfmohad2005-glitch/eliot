/**
 * @file src/shared/components/learning/ReflectionView.tsx
 * @description Cognitive Reflection Editor. Never simple yes/no questions.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { Brain, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';
import { ReflectionQualityValidator } from '../../../domains/dom-001-learning/validators/ReflectionQualityValidator';
import { Card, Button } from '../ui';

interface ReflectionViewProps {
  reflectionText: string;
  reflectionSubmitted: boolean;
  onReflectionChange: (text: string) => void;
  onForceAcceptReflection?: () => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  reflectionText,
  reflectionSubmitted,
  onReflectionChange,
  onForceAcceptReflection,
}) => {
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const validation = ReflectionQualityValidator.validate(reflectionText);
  const charCount = reflectionText.trim().length;

  const handleChange = (val: string) => {
    onReflectionChange(val);
    setAttemptCount((prev) => prev + 1);
  };

  return (
    <Card id="cognitive-reflection-panel" variant="default" padding="md" className="space-y-4 shadow-sm font-ui-body">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-500" />
          <h3 className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">Zone D — Reflection &amp; Evidence</h3>
          <span className="text-[10px] font-mono-ui text-purple-400 bg-[var(--surface-low)] px-2 py-0.5 rounded border border-[var(--border-color)]">
            Concept Synthesis
          </span>
        </div>
        {reflectionSubmitted && (
          <span className="text-xs font-mono-ui text-[var(--status-success)] flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Reflection Recorded
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Cognitive Reflection Open-Ended Prompt (Never yes/no) */}
        <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-purple-400 font-mono-ui font-semibold">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Synthesis Prompt</span>
          </div>
          <p className="text-[var(--text-primary)] font-ui-body leading-relaxed">
            In your own words, explain how the monadic <code className="bg-[var(--surface-card)] px-1 py-0.5 rounded border border-[var(--border-color)] font-mono-ui text-[var(--text-primary)]">Result&lt;T, E&gt;</code> container prevents unhandled exceptions in asynchronous event routing. What architectural trade-offs are introduced?
          </p>
        </div>

        {/* Reflection Text Area */}
        <div className="space-y-2">
          <textarea
            value={reflectionText}
            onChange={(e) => handleChange(e.target.value)}
            rows={4}
            placeholder="Type your cognitive synthesis explanation here (e.g., Result<T,E> forces callers to check result.ok explicitly, preventing uncaught thrown exceptions from unstacking async call chains...)"
            className={`w-full bg-[var(--surface-low)] border rounded-[var(--mode-radius)] p-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none transition-colors font-ui-body leading-relaxed resize-y ${
              validation.isSpamDetected
                ? 'border-[var(--status-warning)] focus:border-[var(--status-warning)]'
                : validation.isValid
                ? 'border-[var(--status-success)] focus:border-[var(--status-success)]'
                : 'border-[var(--border-color)] focus:border-purple-500'
            }`}
          />

          {/* Validation Feedback & Warnings */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono-ui">
              <span className="flex items-center gap-1">
                {validation.isValid ? (
                  <span className="text-[var(--status-success)] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Depth Score: {Math.round(validation.depthScore * 100)}% (Validated)
                  </span>
                ) : validation.isSpamDetected ? (
                  <span className="text-[var(--status-warning)] font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-[var(--status-warning)]" />
                    Repetition / Spam Detected
                  </span>
                ) : charCount > 0 ? (
                  <span className="text-[var(--status-warning)] font-semibold">
                    {validation.feedback}
                  </span>
                ) : (
                  <span className="text-[var(--text-tertiary)]">Minimum 5 words required for synthesis ({charCount} chars)</span>
                )}
              </span>
              <span className="text-[var(--text-tertiary)]">{charCount} chars • {validation.wordCount} words</span>
            </div>

            {/* Spam or Low Quality Override Option */}
            {!validation.isValid && charCount >= 10 && onForceAcceptReflection && (
              <div className="p-2 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] flex items-center justify-between gap-2 text-xs font-mono-ui">
                <span className="text-[var(--text-secondary)] text-[11px]">
                  Validation score low. You may override and proceed with a minimal quality score.
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onForceAcceptReflection}
                  className="text-[11px] font-mono-ui font-semibold whitespace-nowrap"
                >
                  Proceed Anyway (Low Score)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
