/**
 * @file src/domains/dom-011-evidence/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-011: Evidence Domain.
 * @license Apache-2.0
 */

import { EvidenceArtifactEntity, LearningStageNumber } from '../../../types';
import { Result } from '../../../core/errors/Result';

export interface IEvidenceDomainService {
  registerArtifact(unitId: string, stageNumber: LearningStageNumber, rawContent: string): Promise<Result<EvidenceArtifactEntity, Error>>;
  getArtifactById(artifactId: string): Promise<Result<EvidenceArtifactEntity | null, Error>>;
  getArtifactsByUnitId(unitId: string): Promise<Result<readonly EvidenceArtifactEntity[], Error>>;
  verifyContentHash(artifactId: string, rawContent: string): Promise<Result<boolean, Error>>;
}
