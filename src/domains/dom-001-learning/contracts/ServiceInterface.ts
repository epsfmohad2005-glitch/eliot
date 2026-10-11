/**
 * @file src/domains/dom-001-learning/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-001: Learning Domain.
 * @license Apache-2.0
 */

import { LearningStageNumber, LearningUnitEntity, ReviewVerdictEntity } from '../../../types';
import { Result } from '../../../core/errors/Result';

export type LearningSourceType =
  | 'Video'
  | 'Documentation'
  | 'NotebookLM'
  | 'Gemini Gem'
  | 'PDF'
  | 'Article'
  | 'FutureSource';

export type PracticeSkillType =
  | 'Programming'
  | 'Git'
  | 'Linux'
  | 'Algorithms'
  | 'Debugging'
  | 'Architecture';

export type EvidenceType =
  | 'Code'
  | 'Repository'
  | 'Markdown'
  | 'Text'
  | 'Screenshot'
  | 'Files'
  | 'Links';

export interface LessonNoteItem {
  readonly id: string;
  readonly timestamp: string;
  readonly text: string;
}

export interface SocraticHintItem {
  readonly id: string;
  readonly timestamp: string;
  readonly text: string;
}

export interface StageChallengeData {
  readonly question: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly explanation: string;
}

export interface PracticeExecutionResult {
  readonly success: boolean;
  readonly output: string;
  readonly testCasesPassed?: number;
  readonly totalTestCases?: number;
}

export interface CognitiveLoadState {
  readonly sessionDurationSeconds: number;
  readonly interactionCount: number;
  readonly estimatedLoadPercent: number; // 0 to 100
  readonly isHeavy: boolean;
  readonly recommendationMessage?: string;
}

export interface SessionSummaryDetails {
  readonly durationMinutes: number;
  readonly evidenceUuid: string;
  readonly evidenceHash: string;
  readonly evidenceQualityScore: number;
  readonly verificationStatus: string;
  readonly conceptsUpdated: readonly {
    readonly conceptId: string;
    readonly title: string;
    readonly masteryScore: number;
    readonly knowledgeConfidence: number;
    readonly retentionScore: number;
    readonly memoryStability: number;
  }[];
  readonly reflectionStatus: {
    readonly isValid: boolean;
    readonly depthScore: number;
    readonly wordCount: number;
    readonly feedback: string;
  };
  readonly nextReviewDueAt: string;
  readonly nextRecommendedAction: string;
}

export interface LearningSessionState {
  readonly unitId: string;
  readonly objective: string;
  readonly purpose: string;
  readonly estimatedTimeMinutes: number;
  readonly activeSourceType: LearningSourceType;
  readonly sourceContent: {
    readonly title: string;
    readonly description: string;
    readonly mediaUrl?: string;
    readonly bodyMarkdown?: string;
  };
  readonly activeSkillType: PracticeSkillType;
  readonly practiceState: {
    readonly codeInput: string;
    readonly terminalLogs: readonly string[];
    readonly lastExecutionResult?: PracticeExecutionResult;
  };
  readonly notes: readonly LessonNoteItem[];
  readonly socraticHints: readonly SocraticHintItem[];
  readonly reflectionText: string;
  readonly reflectionSubmitted: boolean;
  readonly selectedEvidenceType: EvidenceType;
  readonly evidencePayload: string;
  readonly evidenceSubmittedHash?: string;
  readonly isContextLocked: boolean;
  readonly cognitiveLoad: CognitiveLoadState;
  readonly isSessionCompleted: boolean;
  readonly sessionSummaryDetails?: SessionSummaryDetails;
  readonly reviewVerdict?: ReviewVerdictEntity;
}

export interface ILearningDomainService {
  getActiveUnit(): Promise<Result<LearningUnitEntity | null, Error>>;
  advanceStage(unitId: string, artifactId?: string): Promise<Result<LearningStageNumber, Error>>;
  getUnitById(unitId: string): Promise<Result<LearningUnitEntity | null, Error>>;
  
  // Workspace Session Methods
  getActiveSession(unitId?: string): Promise<Result<LearningSessionState, Error>>;
  updateSourceType(type: LearningSourceType): Promise<Result<LearningSessionState, Error>>;
  updateSkillType(type: PracticeSkillType): Promise<Result<LearningSessionState, Error>>;
  addNote(text: string): Promise<Result<LearningSessionState, Error>>;
  deleteNote(noteId: string): Promise<Result<LearningSessionState, Error>>;
  requestSocraticHint(): Promise<Result<LearningSessionState, Error>>;
  requestStageChallenge(override?: { skill: string; objective: string }): Promise<Result<StageChallengeData, Error>>;
  updatePracticeCode(code: string): Promise<Result<LearningSessionState, Error>>;
  executePractice(input?: string): Promise<Result<PracticeExecutionResult, Error>>;
  updateReflection(text: string): Promise<Result<LearningSessionState, Error>>;
  submitEvidence(type: EvidenceType, payload: string): Promise<Result<{ hash: string; session: LearningSessionState }, Error>>;
  toggleContextLock(forcedState?: boolean): Promise<Result<boolean, Error>>;
  tickSessionTimer(addedSeconds?: number): Promise<Result<CognitiveLoadState, Error>>;
  exitSession(): Promise<Result<LearningSessionState, Error>>;
  resetSession(): Promise<Result<LearningSessionState, Error>>;
}

