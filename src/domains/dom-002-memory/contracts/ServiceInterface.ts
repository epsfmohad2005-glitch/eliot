/**
 * @file src/domains/dom-002-memory/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-002: Memory Domain.
 * @license Apache-2.0
 */

import { MemoryItemEntity } from '../../../types';
import { Result } from '../../../core/errors/Result';

export interface IMemoryDomainService {
  getSkillConfidence(skillId: string): Promise<Result<number, Error>>;
  updateSkillConfidence(skillId: string, scoreDelta: number, artifactId: string): Promise<Result<MemoryItemEntity, Error>>;
  recalculateDecay(): Promise<Result<readonly MemoryItemEntity[], Error>>;
  recordPracticeEvent(
    skillOrConceptId: string,
    qualityScore: number,
    artifactId?: string
  ): Promise<Result<MemoryItemEntity, Error>>;
  getMemoryItem(skillOrConceptId: string): Promise<Result<MemoryItemEntity | null, Error>>;
  getItemsDueForReview(): Promise<Result<readonly MemoryItemEntity[], Error>>;
}
