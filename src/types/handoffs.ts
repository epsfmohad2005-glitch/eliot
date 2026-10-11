/**
 * @file src/types/handoffs.ts
 * @description State Handoff Payload Contracts across Canonical Workflows (HANDOFF-01 to HANDOFF-04).
 * @license Apache-2.0
 */

import { LearningStageNumber } from './domains';

/**
 * HANDOFF-01: Evidence Submission -> AI Review Workflow
 */
export interface Handoff01EvidenceToReview {
  readonly artifactId: string;
  readonly unitId: string;
  readonly stageNumber: LearningStageNumber;
  readonly evaluationRubricId: string;
  readonly userReflectionText?: string;
}

/**
 * HANDOFF-02: AI Review -> Memory Update / Failure Recovery Workflows
 */
export interface Handoff02ReviewToMemoryRecovery {
  readonly submissionId: string;
  readonly artifactId: string;
  readonly verdictStatus: 'Approved' | 'RevisionRequired';
  readonly diagnosticCritique: string;
  readonly correctiveSteps: readonly string[];
  readonly rubricScores: Record<string, number | boolean>;
}

/**
 * HANDOFF-03: Mastery Evaluation -> Skill Unlock Workflow
 */
export interface Handoff03MasteryToSkillUnlock {
  readonly skillNodeId: string;
  readonly masteryScore: number;
  readonly supportingArtifactIds: readonly string[];
  readonly timestamp: string;
}

/**
 * HANDOFF-04: Skill Unlock -> Career Progression Workflow
 */
export interface Handoff04SkillUnlockToCareerProgression {
  readonly unlockedSkillIds: readonly string[];
  readonly masteredSkillIds: readonly string[];
  readonly targetRoleId: string;
}
