/**
 * @file src/domains/dom-004-ai-core/AICoreDomainService.ts
 * @description Implementation of DOM-004 AI Core Domain Service. Wires the
 * domain contract to a concrete IAIProvider (Gemini by default) behind the
 * provider abstraction, so the domain layer never depends on a vendor SDK
 * directly. See src/core/ai/AIProvider.ts for the abstraction and ADR
 * (pending) for the multi-provider rationale.
 * @license Apache-2.0
 */

import { Result } from '../../core/errors/Result';
import { eventBus } from '../../core/events';
import { IAIProvider, PromptContextPayload, AIResponsePayload } from '../../core/ai/AIProvider';
import { GeminiAIProvider } from '../../core/ai/GeminiAIProvider';
import { IAICoreDomainService } from './contracts/ServiceInterface';

export class AICoreDomainService implements IAICoreDomainService {
  private readonly provider: IAIProvider;

  /**
   * Accepts an optional IAIProvider so tests (and any future provider swap —
   * OpenAI, Claude, a local model) can inject a substitute without touching
   * this class. Defaults to GeminiAIProvider to match current production
   * wiring.
   */
  constructor(provider: IAIProvider = new GeminiAIProvider()) {
    this.provider = provider;
  }

  public async requestSocraticGuidance(
    context: PromptContextPayload
  ): Promise<Result<AIResponsePayload, Error>> {
    const result = await this.provider.generateResponse(context);

    if (result.ok) {
      // Uses the existing registered canonical event (see EventRegistry.ts) —
      // no new event type was added here without going through the registry.
      eventBus.publish({
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        eventType: 'SocraticInterventionTriggered',
        sourceDomain: 'DOM-004',
        timestamp: new Date().toISOString(),
        payload: {
          modelUsed: result.value.modelUsed,
          isSocraticQuestion: result.value.isSocraticQuestion,
        },
      });
    }

    return result;
  }

  public async evaluateSubmissionRubric(
    context: PromptContextPayload
  ): Promise<Result<AIResponsePayload, Error>> {
    // NOTE: no canonical event exists yet for "rubric evaluation completed"
    // (see src/types/events.ts / EventRegistry.ts). Rather than inventing an
    // unregistered event type, this intentionally does not publish one.
    // If DOM-009 (Review) needs to react to this, add a proper canonical
    // event through the registry first — see ADR process, §7 of the master
    // handoff.
    return this.provider.evaluateRubric(context);
  }
}

export const aiCoreDomainService = new AICoreDomainService();
