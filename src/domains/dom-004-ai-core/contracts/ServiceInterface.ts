/**
 * @file src/domains/dom-004-ai-core/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-004: AI Core Domain.
 * @license Apache-2.0
 */

import { AIResponsePayload, PromptContextPayload } from '../../../core/ai/AIProvider';
import { Result } from '../../../core/errors/Result';

export interface IAICoreDomainService {
  requestSocraticGuidance(context: PromptContextPayload): Promise<Result<AIResponsePayload, Error>>;
  evaluateSubmissionRubric(context: PromptContextPayload): Promise<Result<AIResponsePayload, Error>>;
}
