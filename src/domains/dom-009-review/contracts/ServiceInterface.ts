/**
 * @file src/domains/dom-009-review/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-009: Review Domain.
 * @license Apache-2.0
 */

import { ReviewVerdictEntity } from '../../../types';
import { Result } from '../../../core/errors/Result';

export interface IReviewDomainService {
  submitForReview(artifactId: string, rubricId: string): Promise<Result<string, Error>>;
  getVerdict(submissionId: string): Promise<Result<ReviewVerdictEntity | null, Error>>;
}
