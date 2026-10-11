/**
 * @file src/domains/dom-003-knowledge/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-003: Knowledge Domain.
 * @license Apache-2.0
 */

import { Result } from '../../../core/errors/Result';

export interface ConceptNode {
  readonly id: string;
  readonly title: string;
  readonly prerequisiteIds: readonly string[];
  readonly category: string;
  readonly masteryScore: number; // Mc = 0.35*R(t) + 0.45*Eq + 0.20*P
  readonly knowledgeConfidence: number; // Kc = 1.0 - exp(-N/5)
  readonly iterationsCount: number;
  readonly lastUpdated: string;
}

export interface IKnowledgeDomainService {
  getConcept(conceptId: string): Promise<Result<ConceptNode | null, Error>>;
  getPrerequisites(conceptId: string): Promise<Result<readonly ConceptNode[], Error>>;
  updateConceptMastery(
    conceptId: string,
    retentionScore: number,
    evidenceQuality: number,
    practiceScore: number
  ): Promise<Result<ConceptNode, Error>>;
}
