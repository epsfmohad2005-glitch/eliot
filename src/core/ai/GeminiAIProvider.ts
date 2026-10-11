/**
 * @file src/core/ai/GeminiAIProvider.ts
 * @description Production Gemini Provider Implementation for Server & Client operations.
 * @license Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { Result, isFail } from '../errors/Result';
import { IAIProvider, PromptContextPayload, AIResponsePayload } from './AIProvider';
import { AIConstitution } from './Constitution';

let genAIInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIInstance) {
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : undefined;
    if (apiKey) {
      genAIInstance = new GoogleGenAI({ apiKey });
    }
  }
  return genAIInstance;
}

export class GeminiAIProvider implements IAIProvider {
  private readonly defaultModel = 'gemini-3.8-flash';

  public async generateResponse(context: PromptContextPayload): Promise<Result<AIResponsePayload, Error>> {
    // 1. In browser environments, proxy through server-side /api/ai/generate
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        const res = await window.fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: context.systemPrompt,
            userMessage: context.userMessage,
            contextMemoryItems: context.contextMemoryItems,
            model: this.defaultModel,
          }),
        });

        const json = await res.json().catch(() => null);

        if (res.ok && json && json.ok && json.data) {
          const validation = AIConstitution.validateResponse(json.data.responseText || '');
          if (isFail(validation)) {
            return Result.fail(validation.error);
          }
          return Result.ok({
            responseText: json.data.responseText,
            isSocraticQuestion: json.data.isSocraticQuestion ?? true,
            modelUsed: json.data.modelUsed || this.defaultModel,
          });
        }

        if (json && json.isFallback && json.fallbackData) {
          return Result.ok(json.fallbackData);
        }

        if (json && json.error) {
          return Result.fail(new Error(json.error));
        }

        // Return clean fallback if server reported non-OK without explicit error payload
        const fallbackText = `[Socratic Offline Mode]: ${context.userMessage}\n\nWhat specific mental model assumption underpins your current approach?`;
        return Result.ok({
          responseText: fallbackText,
          isSocraticQuestion: true,
          modelUsed: 'offline-socratic-fallback',
        });
      } catch {
        // Fallback to offline if server route is unavailable or network error
        const fallbackText = `[Socratic Offline Mode]: ${context.userMessage}\n\nWhat specific mental model assumption underpins your current approach?`;
        return Result.ok({
          responseText: fallbackText,
          isSocraticQuestion: true,
          modelUsed: 'offline-socratic-fallback',
        });
      }
    }

    // 2. Direct Node.js / Server-side invocation (e.g. tests or server scripts)
    const ai = getGenAI();

    const fullPrompt = AIConstitution.wrapSocraticPrompt(
      context.userMessage,
      context.contextMemoryItems?.join('\n') || ''
    );

    if (!ai) {
      // Fallback response when GEMINI_API_KEY is not configured or server unreachable
      const fallbackText = `[Socratic Offline Mode]: ${context.userMessage}\n\nWhat specific mental model assumption underpins your current approach?`;
      return Result.ok({
        responseText: fallbackText,
        isSocraticQuestion: true,
        modelUsed: 'offline-socratic-fallback',
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: this.defaultModel,
        contents: `${context.systemPrompt}\n\n${fullPrompt}`,
      });

      const text = response.text || '';

      const validation = AIConstitution.validateResponse(text);
      if (isFail(validation)) {
        return Result.fail(validation.error);
      }

      return Result.ok({
        responseText: text,
        isSocraticQuestion: true,
        modelUsed: this.defaultModel,
      });
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      return Result.fail(errorObj);
    }
  }

  public async evaluateRubric(context: PromptContextPayload): Promise<Result<AIResponsePayload, Error>> {
    // 1. In browser environments, proxy through server-side /api/ai/rubric
    if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
      try {
        const res = await window.fetch('/api/ai/rubric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: context.systemPrompt,
            rubricCriteria: context.rubricCriteria,
            userMessage: context.userMessage,
            model: this.defaultModel,
          }),
        });

        const json = await res.json().catch(() => null);

        if (res.ok && json && json.ok && json.data) {
          return Result.ok({
            responseText: json.data.responseText,
            isSocraticQuestion: false,
            modelUsed: json.data.modelUsed || this.defaultModel,
          });
        }

        if (json && json.isFallback && json.fallbackData) {
          return Result.ok(json.fallbackData);
        }

        if (json && json.error) {
          return Result.fail(new Error(json.error));
        }

        // Return clean fallback if server reported non-OK without explicit error payload
        return Result.ok({
          responseText: 'Rubric evaluation pending live API key connection.',
          structuredJson: { status: 'PENDING_KEY', approved: false },
          isSocraticQuestion: false,
          modelUsed: 'offline-socratic-fallback',
        });
      } catch {
        // Fallback to offline if server route is unavailable
        return Result.ok({
          responseText: 'Rubric evaluation pending live API key connection.',
          structuredJson: { status: 'PENDING_KEY', approved: false },
          isSocraticQuestion: false,
          modelUsed: 'offline-socratic-fallback',
        });
      }
    }

    // 2. Direct Node.js / Server-side invocation
    const ai = getGenAI();

    if (!ai) {
      return Result.ok({
        responseText: 'Rubric evaluation pending live API key connection.',
        structuredJson: { status: 'PENDING_KEY', approved: false },
        isSocraticQuestion: false,
        modelUsed: 'offline-socratic-fallback',
      });
    }

    try {
      const prompt = `${context.systemPrompt}\n\nRubric Criteria:\n${JSON.stringify(context.rubricCriteria || {})}\n\nSubmitted Content:\n${context.userMessage}`;
      const response = await ai.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
      });

      const text = response.text || '';
      return Result.ok({
        responseText: text,
        isSocraticQuestion: false,
        modelUsed: this.defaultModel,
      });
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      return Result.fail(errorObj);
    }
  }
}
