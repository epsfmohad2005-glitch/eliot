/**
 * @file src/core/errors/DomainErrors.ts
 * @description Structured Domain Error Taxonomy for Eliot PLOS.
 * @license Apache-2.0
 */

import { DomainId } from '../../types';

export class DomainError extends Error {
  readonly domainId: DomainId;
  readonly errorCode: string;

  constructor(domainId: DomainId, errorCode: string, message: string) {
    super(`[${domainId}:${errorCode}] ${message}`);
    this.name = 'DomainError';
    this.domainId = domainId;
    this.errorCode = errorCode;
  }
}

export class StateTransitionError extends DomainError {
  constructor(domainId: DomainId, currentStage: string, targetStage: string, reason: string) {
    super(
      domainId,
      'INVALID_STATE_TRANSITION',
      `Cannot transition from '${currentStage}' to '${targetStage}': ${reason}`
    );
    this.name = 'StateTransitionError';
  }
}

export class ArtifactVerificationError extends DomainError {
  constructor(artifactId: string, reason: string) {
    super('DOM-011', 'ARTIFACT_VERIFICATION_FAILED', `Artifact '${artifactId}' failed verification: ${reason}`);
    this.name = 'ArtifactVerificationError';
  }
}

export class ConstitutionViolationError extends DomainError {
  constructor(reason: string) {
    super('DOM-004', 'CONSTITUTION_VIOLATION', `AI response violated Constitution rules: ${reason}`);
    this.name = 'ConstitutionViolationError';
  }
}
