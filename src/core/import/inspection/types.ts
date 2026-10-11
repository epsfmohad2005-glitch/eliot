/**
 * @file src/core/import/inspection/types.ts
 * @description Type definitions for Eliot RDI-1.5 Import Inspection & Confidence Engine.
 * @license Apache-2.0
 */

import { ImportProviderId, SourceMetadata, ContentItem, ExtractedAsset, ImportSummaryData } from '../types';

export type HealthState = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unsupported';

export interface HealthFactor {
  factor: string;
  score: number; // 0-100
  status: 'pass' | 'warn' | 'fail';
  description: string;
}

export interface SourceHealthStatus {
  state: HealthState;
  scorePercent: number;
  explanation: string;
  factors: HealthFactor[];
}

export interface ConfidenceScore {
  scorePercent: number; // 0 - 100
  level: 'high' | 'moderate' | 'low';
  reasons: string[];
  warnings: string[];
}

export interface DetectedContentStats {
  documentCount: number;
  pageCount: number;
  fileCount: number;
  folderCount: number;
  primaryLanguage: string;
  codeLanguages: string[];
  mediaAssetsCount: number;
  tablesCount: number;
  linksCount: number;
  imagesCount: number;
}

export interface KnowledgeEstimateStats {
  estimatedConcepts: number;
  estimatedSkills: number;
  estimatedPrerequisites: number;
  estimatedLearningAssets: number;
  estimatedReadingTimeMinutes: number;
  estimatedStudyTimeMinutes: number;
}

export interface DetectedTopic {
  id: string;
  name: string;
  category: string;
  relevanceScore: number; // 0 - 100
  occurrenceCount: number;
}

export interface DuplicateComparison {
  isDuplicate: boolean;
  existingSummary: ImportSummaryData | null;
  currentSourceTitle: string;
  existingSourceTitle: string;
  sha256Fingerprint: string;
  existingTimestamp: string;
  existingChunksCount: number;
  existingWordCount: number;
}

export interface UnsupportedDiagnostic {
  isSupported: boolean;
  reasonWhy: string;
  missingInformation: string;
  suggestedAlternatives: string[];
}

export interface InspectionReport {
  inspectionId: string;
  sourceName: string;
  providerId: ImportProviderId;
  timestamp: string;
  sha256Fingerprint: string;
  contentStats: DetectedContentStats;
  knowledgeEstimates: KnowledgeEstimateStats;
  detectedTopics: DetectedTopic[];
  confidence: ConfidenceScore;
  sourceHealth: SourceHealthStatus;
  duplicateComparison: DuplicateComparison | null;
  unsupportedDiagnostic: UnsupportedDiagnostic | null;
}
