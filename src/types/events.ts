/**
 * @file src/types/events.ts
 * @description Canonical Domain Event Types for Eliot PLOS Event-Driven Architecture.
 * @license Apache-2.0
 */

import { DomainId, LearningStageNumber } from './domains';

export type CanonicalEventType =
  | 'LearningUnitStarted'
  | 'StageGateRequested'
  | 'StageGatePassed'
  | 'PracticeCompleted'
  | 'ProjectDeliverableSubmitted'
  | 'EvidenceArtifactRegistered'
  | 'ReviewEnqueued'
  | 'VerdictRendered'
  | 'MemoryDecayCalculated'
  | 'SkillMastered'
  | 'CareerReadinessUpdated'
  | 'FrictionPatternDetected'
  | 'SocraticInterventionTriggered'
  | 'DashboardRefreshed'
  | 'ImportStarted'
  | 'ImportProgressUpdated'
  | 'ImportCompleted'
  | 'ImportCheckpointSaved';

export interface BaseDomainEvent<T = Record<string, unknown>> {
  readonly eventId: string;
  readonly eventType: CanonicalEventType;
  readonly sourceDomain: DomainId;
  readonly timestamp: string; // ISO 8601
  readonly correlationId?: string;
  readonly payload: T;
}

export interface StageGateRequestedPayload {
  readonly unitId: string;
  readonly stageNumber: LearningStageNumber;
  readonly artifactId?: string;
}

export interface VerdictRenderedPayload {
  readonly submissionId: string;
  readonly artifactId: string;
  readonly verdict: 'Approved' | 'RevisionRequired';
  readonly critique: string;
  readonly timestamp: string;
}

export interface SkillMasteredPayload {
  readonly skillId: string;
  readonly masteryScore: number;
  readonly artifactIds: readonly string[];
}
