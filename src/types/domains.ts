/**
 * @file src/types/domains.ts
 * @description Master Domain Identifiers and Core Entity Types for Eliot PLOS.
 * @license Apache-2.0
 */

export type DomainId =
  | 'DOM-001'
  | 'DOM-002'
  | 'DOM-003'
  | 'DOM-004'
  | 'DOM-005'
  | 'DOM-006'
  | 'DOM-007'
  | 'DOM-008'
  | 'DOM-009'
  | 'DOM-010'
  | 'DOM-011'
  | 'DOM-012';

export interface DomainMeta {
  readonly id: DomainId;
  readonly name: string;
  readonly codeName: string;
  readonly description: string;
  readonly version: string;
  readonly status: 'placeholder' | 'initialized' | 'active';
}

export type LearningStageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type LearningStageName =
  | 'Understanding'
  | 'Practicing'
  | 'Applying'
  | 'Building'
  | 'Reflecting'
  | 'Reviewing'
  | 'Mastering'
  | 'RealWorldUse';

export interface LearningUnitEntity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly activeStage: LearningStageNumber;
  readonly isCompleted: boolean;
  readonly skillIds: readonly string[];
}

export interface MemoryItemEntity {
  readonly id: string;
  readonly skillId: string;
  readonly conceptId?: string;
  readonly confidenceScore: number; // 0 to 1 (Kc)
  readonly retentionScore?: number; // R(t) (0 to 1)
  readonly memoryStability?: number; // S (in days)
  readonly masteryScore?: number; // Mc = 0.35*R(t) + 0.45*Eq + 0.20*P
  readonly lastPracticedAt: string; // ISO 8601
  readonly nextReviewDueAt?: string; // ISO 8601
  readonly decayCapFloor: number; // 0.35 hard floor
}

export interface EvidenceArtifactEntity {
  readonly id: string;
  readonly contentHash: string; // SHA-256
  readonly unitId: string;
  readonly stageNumber: LearningStageNumber;
  readonly timestamp: string; // ISO 8601
  readonly conceptIds?: readonly string[];
  readonly qualityScore?: number; // Eq score (0.0 to 1.0)
  readonly verificationStatus?: 'Verified' | 'Pending' | 'Rejected';
  readonly evidenceType?: string;
  readonly payload?: string;
}

export interface ReviewVerdictEntity {
  readonly id: string;
  readonly artifactId: string;
  readonly status: 'Approved' | 'RevisionRequired' | 'Pending';
  readonly critique: string;
  readonly correctiveSteps: readonly string[];
}

export interface CareerRoleEntity {
  readonly id: string;
  readonly title: string;
  readonly requiredSkills: readonly string[];
  readonly readinessPercentage: number;
}
