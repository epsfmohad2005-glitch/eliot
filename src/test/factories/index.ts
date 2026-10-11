import { MemoryItemEntity, EvidenceArtifactEntity } from '../../types';
import { ConceptNode } from '../../domains/dom-003-knowledge/contracts/ServiceInterface';
import { KnowledgeCommitRecord } from '../../core/import/commit/types';

export class DomainMockFactory {
  public static createMemoryItem(overrides?: Partial<MemoryItemEntity>): MemoryItemEntity {
    return {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      skillId: 'SKILL-TEST-001',
      conceptId: 'CPT-TEST-001',
      confidenceScore: 0.85,
      retentionScore: 0.80,
      memoryStability: 6.0,
      masteryScore: 0.78,
      lastPracticedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      nextReviewDueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      decayCapFloor: 0.35,
      ...overrides,
    };
  }

  public static createConceptNode(overrides?: Partial<ConceptNode>): ConceptNode {
    return {
      id: `CPT-FACTORY-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      title: 'Factory Generated Concept Title',
      prerequisiteIds: [],
      category: 'Software Architecture',
      masteryScore: 0.75,
      knowledgeConfidence: 0.80,
      iterationsCount: 3,
      lastUpdated: new Date().toISOString(),
      ...overrides,
    };
  }

  public static createEvidenceArtifact(overrides?: Partial<EvidenceArtifactEntity>): EvidenceArtifactEntity {
    return {
      id: `ev_factory_${Math.random().toString(36).substring(2, 6)}`,
      contentHash: 'SHA-256: 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      unitId: 'unit-001',
      stageNumber: 3,
      timestamp: new Date().toISOString(),
      conceptIds: ['CPT-TEST-001'],
      qualityScore: 0.90,
      verificationStatus: 'Verified',
      evidenceType: 'Code',
      payload: 'export function test() { return true; }',
      ...overrides,
    };
  }

  public static createKnowledgeCommitRecord(overrides?: Partial<KnowledgeCommitRecord>): KnowledgeCommitRecord {
    return {
      commitId: `commit-factory-${Date.now()}`,
      importId: 'import-factory-001',
      sourceTitle: 'Factory Systems Book',
      providerId: 'pdf-document',
      version: 'v1.0.0',
      timestamp: new Date().toISOString(),
      author: 'Test Factory',
      commitNote: 'Initial commit created by factory',
      contentHash: 'a1b2c3d4e5f6071829304a5b6c7d8e9f0a1b2c3d4e5f6071829304a5b6c7d8e9f',
      status: 'validated',
      concepts: [
        {
          id: 'CPT-TEST-001',
          name: 'Factory Concept',
          description: 'Desc',
          category: 'Architecture',
          confidence: 90,
          reason: 'Test',
          evidenceText: 'Evidence',
          originSource: 'Source',
          originChunkId: 'chunk-1',
          status: 'pending',
          synonyms: [],
          tags: [],
          committedAt: new Date().toISOString(),
          version: 'v1.0.0',
        },
      ],
      skills: [],
      dependencies: [],
      learningAssets: [],
      stats: {
        totalConcepts: 1,
        totalSkills: 0,
        totalDependencies: 0,
        totalAssets: 0,
      },
      ...overrides,
    };
  }
}
