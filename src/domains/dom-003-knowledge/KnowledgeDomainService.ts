/**
 * @file src/domains/dom-003-knowledge/KnowledgeDomainService.ts
 * @description Implementation of DOM-003 Knowledge Domain Service (Cognitive Knowledge Model Engine).
 * @license Apache-2.0
 */

import { Result } from '../../core/errors/Result';
import { ConceptNode, IKnowledgeDomainService } from './contracts/ServiceInterface';

export class KnowledgeDomainService implements IKnowledgeDomainService {
  private concepts: Map<string, ConceptNode> = new Map();

  constructor() {
    this.seedInitialConcepts();
  }

  private seedInitialConcepts(): void {
    const initialNodes: ConceptNode[] = [
      {
        id: 'CPT-SYS-MONADIC-RESULT',
        title: 'Monadic Result Type Container & Zero-Exception Handling',
        prerequisiteIds: [],
        category: 'Systems Architecture',
        masteryScore: 0.82,
        knowledgeConfidence: 0.88,
        iterationsCount: 8,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'CPT-SYS-ASYNC-DISPATCH',
        title: 'Async Event Dispatcher & Memory-Safe Subscriptions',
        prerequisiteIds: ['CPT-SYS-MONADIC-RESULT'],
        category: 'Systems Engineering',
        masteryScore: 0.79,
        knowledgeConfidence: 0.84,
        iterationsCount: 6,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'CPT-SYS-CLEAN-ARCH',
        title: 'Clean Architecture Bounded Domain Boundaries',
        prerequisiteIds: ['CPT-SYS-ASYNC-DISPATCH'],
        category: 'Architecture',
        masteryScore: 0.75,
        knowledgeConfidence: 0.78,
        iterationsCount: 5,
        lastUpdated: new Date().toISOString(),
      },
    ];

    for (const node of initialNodes) {
      this.concepts.set(node.id, node);
    }
  }

  public async getConcept(conceptId: string): Promise<Result<ConceptNode | null, Error>> {
    const concept = this.concepts.get(conceptId) || null;
    return Result.ok(concept);
  }

  public async getPrerequisites(conceptId: string): Promise<Result<readonly ConceptNode[], Error>> {
    const concept = this.concepts.get(conceptId);
    if (!concept) return Result.ok([]);

    const result: ConceptNode[] = [];
    for (const preId of concept.prerequisiteIds) {
      const node = this.concepts.get(preId);
      if (node) result.push(node);
    }
    return Result.ok(result);
  }

  /**
   * CKM Formula updates:
   * Mastery Score Mc = 0.35 * R(t) + 0.45 * Eq + 0.20 * P
   * Knowledge Confidence Kc = 1.0 - exp(-N / 5)
   */
  public async updateConceptMastery(
    conceptId: string,
    retentionScore: number,
    evidenceQuality: number,
    practiceScore: number
  ): Promise<Result<ConceptNode, Error>> {
    let concept = this.concepts.get(conceptId);
    const nowISO = new Date().toISOString();

    if (!concept) {
      concept = {
        id: conceptId,
        title: conceptId,
        prerequisiteIds: [],
        category: 'Systems Architecture',
        masteryScore: 0,
        knowledgeConfidence: 0,
        iterationsCount: 0,
        lastUpdated: nowISO,
      };
    }

    const nextN = concept.iterationsCount + 1;
    // Calculate Mc = 0.35 * R(t) + 0.45 * Eq + 0.20 * P
    const mc = 0.35 * Math.min(1.0, retentionScore) + 0.45 * Math.min(1.0, evidenceQuality) + 0.20 * Math.min(1.0, practiceScore);
    const clampedMc = Number(Math.min(1.0, Math.max(0, mc)).toFixed(3));

    // Calculate Kc = 1.0 - exp(-N / 5)
    const kc = Number((1.0 - Math.exp(-nextN / 5.0)).toFixed(3));

    const updatedNode: ConceptNode = {
      ...concept,
      masteryScore: clampedMc,
      knowledgeConfidence: kc,
      iterationsCount: nextN,
      lastUpdated: nowISO,
    };

    this.concepts.set(conceptId, updatedNode);
    return Result.ok(updatedNode);
  }

  public async getAllConcepts(): Promise<Result<readonly ConceptNode[], Error>> {
    return Result.ok(Array.from(this.concepts.values()));
  }
}

export const knowledgeDomainService = new KnowledgeDomainService();
