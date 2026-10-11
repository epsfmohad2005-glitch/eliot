/**
 * @file src/core/import/extraction/types.ts
 * @description Candidate Knowledge Model (CKM-C) type definitions for Eliot RDI-1B.
 * Holds uncommitted candidate entities extracted deterministically from imported resources.
 * @license Apache-2.0
 */

import { ImportProviderId } from '../types';

export type CandidateEntityStatus = 'pending' | 'approved' | 'ignored' | 'merged' | 'split';

export interface CandidateConcept {
  id: string;
  name: string;
  description: string;
  category: string;
  confidence: number; // 0 - 100
  reason: string;
  evidenceText: string;
  originSource: string;
  originChunkId: string;
  status: CandidateEntityStatus;
  synonyms: string[];
  tags: string[];
  parentId?: string;
}

export interface CandidateSkill {
  id: string;
  name: string;
  level: 'foundational' | 'intermediate' | 'advanced';
  confidence: number;
  reason: string;
  codeSnippetRef?: string;
  originChunkId: string;
  status: CandidateEntityStatus;
  associatedConceptId?: string;
}

export type RelationshipType = 'prerequisite' | 'dependency' | 'builds_on' | 'references';

export interface CandidateDependency {
  id: string;
  sourceConceptId: string;
  targetConceptId: string;
  relationshipType: RelationshipType;
  confidence: number;
  reason: string;
  status: CandidateEntityStatus;
}

export interface CandidateLearningAsset {
  id: string;
  title: string;
  assetType: 'code' | 'summary' | 'table' | 'diagram_ref' | 'note';
  content: string;
  originChunkId: string;
  status: CandidateEntityStatus;
  associatedConceptId?: string;
}

export interface CandidateEvidence {
  id: string;
  conceptId: string;
  snippet: string;
  location: string;
  score: number;
}

export interface CandidateReviewNode {
  id: string;
  entityId: string; // Concept or Skill ID
  prompt: string;
  suggestedAnswer: string;
  nodeType: 'recall' | 'application' | 'synthesis';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DuplicateConceptSuggestion {
  id: string;
  primaryConceptId: string;
  duplicateConceptId: string;
  primaryConceptName: string;
  duplicateConceptName: string;
  similarityScore: number; // 0 - 100
  reason: string;
  suggestedAction: 'merge' | 'keep_separate';
  resolvedStatus?: 'pending' | 'merged' | 'kept_separate';
}

export interface ExtractionQualityMetrics {
  coveragePercent: number; // 0 - 100
  ambiguityScore: number; // 0 - 100
  noiseScore: number; // 0 - 100
  unknownTermsCount: number;
  unclassifiedAssetsCount: number;
  overallExtractionScore: number;
}

export interface UnsupportedKnowledgeItem {
  id: string;
  term: string;
  contextSnippet: string;
  reasonWhy: string;
  suggestedAction: string;
  resolvedStatus: 'pending' | 'resolved' | 'ignored';
}

export interface CandidateKnowledgeModel {
  importId: string;
  sourceTitle: string;
  providerId: ImportProviderId;
  extractedTimestamp: string;
  concepts: CandidateConcept[];
  skills: CandidateSkill[];
  dependencies: CandidateDependency[];
  learningAssets: CandidateLearningAsset[];
  evidence: CandidateEvidence[];
  reviewNodes: CandidateReviewNode[];
  duplicateSuggestions: DuplicateConceptSuggestion[];
  qualityMetrics: ExtractionQualityMetrics;
  unsupportedItems: UnsupportedKnowledgeItem[];
}
