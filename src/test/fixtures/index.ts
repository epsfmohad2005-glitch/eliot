import { ExtractedAsset, SourceMetadata } from '../../core/import/types';
import { CandidateKnowledgeModel } from '../../core/import/extraction/types';

export const mockSourceMetadata: SourceMetadata = {
  title: 'Systems Architecture & Clean Design',
  description: 'Clean Architecture Bounded Domain Boundaries',
  authorOrChannel: 'Eliot Engineer',
  totalItemsCount: 2,
  sha256Fingerprint: 'abc123sha256checksum',
  totalSizeBytes: 102450,
};

export const mockExtractedAssets: ExtractedAsset[] = [
  {
    itemId: 'item-01',
    mimeType: 'text/markdown',
    rawText: '# Monadic Result Type Container\n\nA Result type is defined as a container representing success or failure.',
  },
  {
    itemId: 'item-02',
    mimeType: 'text/typescript',
    codeSnippet: {
      language: 'typescript',
      content: 'export class Result<T, E> { static ok<T>(val: T) { return new Result(val); } }',
    },
  },
];

export const mockCandidateModel: CandidateKnowledgeModel = {
  importId: 'test-import-001',
  sourceTitle: 'Systems Architecture & Clean Design',
  providerId: 'pdf-document',
  extractedTimestamp: new Date().toISOString(),
  concepts: [
    {
      id: 'concept-01',
      name: 'Monadic Result Type Container',
      description: 'Zero-exception functional error handling container.',
      category: 'Systems Architecture',
      confidence: 90,
      reason: 'Heading definition match',
      evidenceText: 'Result type is defined as container',
      originSource: 'Systems Architecture',
      originChunkId: 'chunk-1',
      status: 'pending',
      synonyms: [],
      tags: ['architecture', 'monad'],
    },
    {
      id: 'concept-02',
      name: 'Async Event Dispatcher',
      description: 'In-memory asynchronous event subscription bus.',
      category: 'Systems Engineering',
      confidence: 88,
      reason: 'Key terminology definition',
      evidenceText: 'Event dispatcher subscribes handlers',
      originSource: 'Systems Architecture',
      originChunkId: 'chunk-2',
      status: 'pending',
      synonyms: [],
      tags: ['events', 'async'],
    },
  ],
  skills: [
    {
      id: 'skill-01',
      name: 'Implement Result Pattern',
      level: 'intermediate',
      confidence: 92,
      reason: 'Code snippet match',
      originChunkId: 'chunk-1',
      status: 'pending',
      associatedConceptId: 'concept-01',
    },
  ],
  dependencies: [
    {
      id: 'dep-01',
      sourceConceptId: 'concept-02',
      targetConceptId: 'concept-01',
      relationshipType: 'prerequisite',
      confidence: 85,
      reason: 'Sequence order dependency',
      status: 'pending',
    },
  ],
  learningAssets: [],
  evidence: [],
  reviewNodes: [],
  duplicateSuggestions: [],
  qualityMetrics: {
    coveragePercent: 85,
    ambiguityScore: 10,
    noiseScore: 5,
    unknownTermsCount: 0,
    unclassifiedAssetsCount: 0,
    overallExtractionScore: 90,
  },
  unsupportedItems: [],
};
