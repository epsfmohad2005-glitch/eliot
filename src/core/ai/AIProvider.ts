/**
 * @file src/core/ai/AIProvider.ts
 * @description Abstract AI Service Contract for Server-Side LLM Operations.
 * @license Apache-2.0
 */

import { Result } from '../errors/Result';

export interface PromptContextPayload {
  readonly systemPrompt: string;
  readonly userMessage: string;
  readonly contextMemoryItems?: readonly string[];
  readonly rubricCriteria?: Record<string, string>;
}

export interface AIResponsePayload {
  readonly responseText: string;
  readonly structuredJson?: Record<string, unknown>;
  readonly isSocraticQuestion: boolean;
  readonly modelUsed: string;
}

export interface IAIProvider {
  generateResponse(context: PromptContextPayload): Promise<Result<AIResponsePayload, Error>>;
  evaluateRubric(context: PromptContextPayload): Promise<Result<AIResponsePayload, Error>>;
}
