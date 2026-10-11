/**
 * @file src/core/import/commit/types.ts
 * @description Types and Interfaces for Knowledge Commit & Activation Engine (Eliot RDI-1C).
 * Defines versioned commits, immutable ledger entries, validation reports, and activation states.
 * @license Apache-2.0
 */

import { ImportProviderId } from '../types';
import {
  CandidateConcept,
  CandidateSkill,
  CandidateDependency,
  CandidateLearningAsset,
} from '../extraction/types';

export type CommitStatus = 'draft' | 'validating' | 'validated' | 'committed' | 'active' | 'rolled_back' | 'failed';

export interface CommittedConcept extends CandidateConcept {
  committedAt: string;
  version: string;
}

export interface CommittedSkill extends CandidateSkill {
  committedAt: string;
  version: string;
}

export interface CommittedDependency extends CandidateDependency {
  committedAt: string;
  version: string;
}

export interface KnowledgeCommitRecord {
  commitId: string;
  importId: string;
  sourceTitle: string;
  providerId: ImportProviderId;
  version: string; // e.g. "v1.0.0"
  timestamp: string;
  author: string;
  commitNote: string;
  contentHash: string; // SHA-256 fingerprint of payload
  parentCommitId?: string;
  status: CommitStatus;
  
  // Committed Payload
  concepts: CommittedConcept[];
  skills: CommittedSkill[];
  dependencies: CommittedDependency[];
  learningAssets: CandidateLearningAsset[];

  // Audit
  stats: {
    totalConcepts: number;
    totalSkills: number;
    totalDependencies: number;
    totalAssets: number;
  };
}

export interface KnowledgeLedgerEntry {
  entryId: string;
  commitId: string;
  timestamp: string;
  action: 'COMMIT_CREATED' | 'COMMIT_VALIDATED' | 'COMMIT_ACTIVATED' | 'COMMIT_ROLLED_BACK';
  version: string;
  contentHash: string;
  previousHash: string;
  entryHash: string;
  details: string;
  actor: string;
}

export interface CommitValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  entityId?: string;
}

export interface CommitValidationReport {
  isValid: boolean;
  timestamp: string;
  relationshipIntegrityScore: number; // 0 - 100
  duplicateCheckPassed: boolean;
  cyclicDependencyCheckPassed: boolean;
  errors: CommitValidationError[];
  warnings: CommitValidationError[];
  summary: {
    danglingReferencesCount: number;
    duplicateMatchesCount: number;
    cyclicPathsCount: number;
  };
}

export interface KnowledgeActivationState {
  activeCommitId: string | null;
  activeVersion: string | null;
  activatedAt: string | null;
  concepts: CommittedConcept[];
  skills: CommittedSkill[];
  dependencies: CommittedDependency[];
  assets: CandidateLearningAsset[];
}

export interface KnowledgeDomainEvent {
  eventId: string;
  type: 'knowledge.commit.created' | 'knowledge.commit.validated' | 'knowledge.commit.activated' | 'knowledge.commit.rolled_back';
  timestamp: string;
  commitId: string;
  payload: Record<string, unknown>;
}
