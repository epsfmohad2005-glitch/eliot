/**
 * @file src/shared/components/learning/PracticeWorkspaceView.tsx
 * @description Dynamic Practice Workspace supporting Programming, Git, Linux, Algorithms, Debugging, and Architecture.
 * Consumes FCS-1 primitives and Design Tokens exclusively.
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { PracticeSkillType, PracticeExecutionResult, SocraticHintItem } from '../../../domains/dom-001-learning';
import {
  Code2,
  Terminal,
  Cpu,
  Workflow,
  Bug,
  Layers,
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';
import { Card, Button } from '../ui';

interface PracticeWorkspaceViewProps {
  activeSkillType: PracticeSkillType;
  codeInput: string;
  terminalLogs: readonly string[];
  lastExecutionResult?: PracticeExecutionResult;
  socraticHints: readonly SocraticHintItem[];
  isRequestingHint: boolean;
  onSkillTypeChange: (skill: PracticeSkillType) => void;
  onCodeChange: (code: string) => void;
  onExecute: (input?: string) => void;
  onRequestHint: () => void;
}

const SKILL_TYPES: { id: PracticeSkillType; label: string; icon: React.ElementType }[] = [
  { id: 'Programming', label: 'Programming', icon: Code2 },
  { id: 'Git', label: 'Git Shell', icon: Terminal },
  { id: 'Linux', label: 'Linux CLI', icon: Cpu },
  { id: 'Algorithms', label: 'Algorithms', icon: Workflow },
  { id: 'Debugging', label: 'Debugging', icon: Bug },
  { id: 'Architecture', label: 'Architecture', icon: Layers },
];

export const PracticeWorkspaceView: React.FC<PracticeWorkspaceViewProps> = ({
  activeSkillType,
  codeInput,
  terminalLogs,
  lastExecutionResult,
  socraticHints,
  isRequestingHint,
  onSkillTypeChange,
  onCodeChange,
  onExecute,
  onRequestHint,
}) => {
  const [commandInput, setCommandInput] = useState<string>('');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSkillType === 'Git' || activeSkillType === 'Linux') {
      onExecute(commandInput);
      setCommandInput('');
    } else {
      onExecute();
    }
  };

  return (
    <Card id="practice-workspace-container" variant="default" padding="md" className="space-y-4 shadow-sm">
      {/* Skill Type Header Selector */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[var(--accent-signal)]" />
          <h3 className="font-ui-body-bold text-sm font-bold text-[var(--text-primary)]">Zone C — Active Practice</h3>
          <span className="text-[10px] font-mono-ui text-[var(--accent-signal)] bg-[var(--surface-low)] px-2 py-0.5 rounded border border-[var(--border-color)] uppercase tracking-wider">
            Interactive
          </span>
        </div>

        {/* Skill Type Tabs */}
        <div className="flex items-center gap-1 font-mono-ui text-[11px] overflow-x-auto max-w-full pb-1">
          {SKILL_TYPES.map((st) => {
            const Icon = st.icon;
            const isActive = activeSkillType === st.id;
            return (
              <Button
                key={st.id}
                variant={isActive ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onSkillTypeChange(st.id)}
                className="py-1 px-2.5 text-[11px] font-mono-ui whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 me-1" />
                <span>{st.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Practice Workspace Content */}
      <div className="space-y-3">
        {/* Code/Script Input View */}
        <div className="space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono-ui text-[var(--text-secondary)]">
            <span>
              {activeSkillType === 'Programming' && 'TypeScript Implementation File'}
              {activeSkillType === 'Git' && 'Git Working Tree Environment'}
              {activeSkillType === 'Linux' && 'Linux Shell Script / Environment'}
              {activeSkillType === 'Algorithms' && 'Queue Buffer Trace Visualizer'}
              {activeSkillType === 'Debugging' && 'Exception Stack Inspector'}
              {activeSkillType === 'Architecture' && 'Dependency Map Spec'}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRequestHint}
                disabled={isRequestingHint}
                className="flex-1 sm:flex-none justify-center font-mono-ui text-xs py-2.5 sm:py-1 px-3 glow-signal"
                title="Ask the Socratic tutor a guiding question — it won't give you the answer"
              >
                <Lightbulb className="w-3.5 h-3.5 me-1" />
                <span>{isRequestingHint ? 'Thinking…' : 'Ask for a Hint'}</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onExecute()}
                className="flex-1 sm:flex-none justify-center font-mono-ui text-xs py-2.5 sm:py-1 px-3"
              >
                <Play className="w-3.5 h-3.5 me-1 fill-current" />
                <span>
                  {activeSkillType === 'Programming' ? 'Run Tests' : 'Execute & Validate'}
                </span>
              </Button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] p-3 font-mono-ui text-xs text-[var(--text-primary)] leading-relaxed overflow-x-auto relative group">
            {activeSkillType === 'Programming' || activeSkillType === 'Architecture' ? (
              <>
                <textarea
                  value={codeInput}
                  onChange={(e) => onCodeChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.currentTarget.blur();
                    }
                  }}
                  rows={8}
                  aria-label="Practice Code Editor"
                  placeholder="Type or paste code implementation..."
                  className="w-full bg-transparent text-[var(--text-primary)] focus:outline-none font-mono-ui resize-y"
                  spellCheck={false}
                />
                <div className="text-[10px] text-[var(--text-tertiary)] font-mono-ui text-right pt-1 border-t border-[var(--border-color)] flex items-center justify-between">
                  <span>Keyboard shortcuts:</span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-[var(--surface-card)] border border-[var(--border-color)] rounded text-[var(--text-secondary)] font-bold">Esc</kbd> Release Focus
                  </span>
                </div>
              </>
            ) : (
              <pre className="whitespace-pre-wrap text-[var(--text-primary)] font-mono-ui text-xs">
                {codeInput}
              </pre>
            )}
          </div>
        </div>

        {/* Command Line Input for Git or Linux */}
        {(activeSkillType === 'Git' || activeSkillType === 'Linux') && (
          <form onSubmit={handleCommandSubmit} className="flex gap-2">
            <div className="flex-1 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] px-3 py-2 flex items-center gap-2 font-mono-ui text-xs">
              <span className="text-[var(--accent-signal)] font-bold">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder={
                  activeSkillType === 'Git'
                    ? 'e.g. git commit -m "feat: event dispatcher"'
                    : 'e.g. systemctl restart plos-kernel'
                }
                className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className="font-mono-ui text-xs"
            >
              Run Command
            </Button>
          </form>
        )}

        {/* Console / Terminal Log Output Container */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono-ui text-[var(--text-secondary)]">
            <span>Terminal Output &amp; Validation Stream</span>
            {lastExecutionResult && (
              <span
                className={`flex items-center gap-1 font-bold ${
                  lastExecutionResult.success ? 'text-[var(--status-success)]' : 'text-rose-500'
                }`}
              >
                {lastExecutionResult.success ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {lastExecutionResult.testCasesPassed}/
                {lastExecutionResult.totalTestCases} Tests Passed
              </span>
            )}
          </div>

          <div className="p-3 bg-[var(--surface-low)] border border-[var(--border-color)] rounded-[var(--mode-radius)] font-mono-ui text-xs text-[var(--text-secondary)] space-y-1 max-h-40 overflow-y-auto">
            {terminalLogs.map((log, idx) => (
              <p
                key={idx}
                className={
                  log.includes('✓') || log.includes('Passed') || log.includes('OK')
                    ? 'text-[var(--status-success)] font-semibold'
                    : log.includes('Error') || log.includes('Root Cause')
                    ? 'text-[var(--status-warning)] font-semibold'
                    : 'text-[var(--text-secondary)]'
                }
              >
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Socratic Hints — the tutor asks questions, it doesn't hand over answers */}
        {(socraticHints.length > 0 || isRequestingHint) && (
          <div className="space-y-1.5">
            <span className="bracket-label">socratic tutor</span>
            <div className="space-y-2">
              {socraticHints.map((hint) => (
                <div
                  key={hint.id}
                  className="flex items-start gap-2 p-2.5 bg-[var(--surface-low)] border border-[var(--accent-signal)]/25 rounded-[var(--mode-radius)]"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[var(--accent-signal)] mt-0.5 shrink-0" />
                  <p className="text-xs text-[var(--text-primary)] font-ui-body leading-relaxed">{hint.text}</p>
                </div>
              ))}
              {isRequestingHint && (
                <div className="flex items-center gap-2 p-2.5 text-xs text-[var(--text-muted)] font-mono-ui">
                  <span className="terminal-cursor">awaiting guidance</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
