import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AICoreDomainService } from './AICoreDomainService';
import { IAIProvider, PromptContextPayload, AIResponsePayload } from '../../core/ai/AIProvider';
import { Result, isFail } from '../../core/errors/Result';
import { assertOk } from '../../test/utils';

function makeMockProvider(overrides: Partial<IAIProvider> = {}): IAIProvider {
  return {
    generateResponse: vi.fn(async (): Promise<Result<AIResponsePayload, Error>> =>
      Result.ok({
        responseText: 'What assumption does your current approach rely on?',
        isSocraticQuestion: true,
        modelUsed: 'mock-model',
      })
    ),
    evaluateRubric: vi.fn(async (): Promise<Result<AIResponsePayload, Error>> =>
      Result.ok({
        responseText: 'Rubric evaluated.',
        structuredJson: { approved: true },
        isSocraticQuestion: false,
        modelUsed: 'mock-model',
      })
    ),
    ...overrides,
  };
}

const samplePrompt: PromptContextPayload = {
  systemPrompt: 'You are a Socratic tutor.',
  userMessage: 'How do I fix this null pointer?',
};

describe('AICoreDomainService Unit Tests', () => {
  let mockProvider: IAIProvider;
  let service: AICoreDomainService;

  beforeEach(() => {
    mockProvider = makeMockProvider();
    service = new AICoreDomainService(mockProvider);
  });

  it('delegates requestSocraticGuidance to the injected provider and returns its result', async () => {
    const res = await service.requestSocraticGuidance(samplePrompt);

    assertOk(res);
    expect(res.value.isSocraticQuestion).toBe(true);
    expect(res.value.modelUsed).toBe('mock-model');
    expect(mockProvider.generateResponse).toHaveBeenCalledWith(samplePrompt);
  });

  it('delegates evaluateSubmissionRubric to the injected provider and returns its result', async () => {
    const res = await service.evaluateSubmissionRubric(samplePrompt);

    assertOk(res);
    expect(res.value.structuredJson).toEqual({ approved: true });
    expect(mockProvider.evaluateRubric).toHaveBeenCalledWith(samplePrompt);
  });

  it('propagates provider failure without throwing', async () => {
    mockProvider = makeMockProvider({
      generateResponse: vi.fn(async () => Result.fail(new Error('Constitution violation'))),
    });
    service = new AICoreDomainService(mockProvider);

    const res = await service.requestSocraticGuidance(samplePrompt);

    expect(res.ok).toBe(false);
    if (isFail(res)) {
      expect(res.error.message).toBe('Constitution violation');
    }
  });

  it('defaults to GeminiAIProvider when no provider is injected', () => {
    // Constructing with no args should not throw even without an API key
    // configured (GeminiAIProvider falls back to offline Socratic mode).
    expect(() => new AICoreDomainService()).not.toThrow();
  });
});
