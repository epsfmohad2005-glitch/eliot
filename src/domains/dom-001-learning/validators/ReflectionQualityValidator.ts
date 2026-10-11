/**
 * @file src/domains/dom-001-learning/validators/ReflectionQualityValidator.ts
 * @description Evaluates reflection quality without AI answering or ghostwriting user synthesis.
 * @license Apache-2.0
 */

export interface ReflectionValidationResult {
  readonly isValid: boolean;
  readonly depthScore: number; // 0.0 to 1.0
  readonly feedback: string;
  readonly wordCount: number;
  readonly uniqueRatio: number;
  readonly isSpamDetected: boolean;
}

export class ReflectionQualityValidator {
  private static readonly KEYWORDS = [
    'monad',
    'result',
    'event',
    'dispatcher',
    'subscribe',
    'unsubscribe',
    'closure',
    'error',
    'exception',
    'clean',
    'architecture',
    'bounded',
    'context',
    'memory',
    'decay',
    'state',
  ];

  public static validate(text: string): ReflectionValidationResult {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        isValid: false,
        depthScore: 0,
        feedback: 'Reflection cannot be empty. Record your architectural takeaway.',
        wordCount: 0,
        uniqueRatio: 0,
        isSpamDetected: false,
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (wordCount < 5) {
      return {
        isValid: false,
        depthScore: 0.2,
        feedback: 'Reflection is too brief (minimum 5 words required for validation).',
        wordCount,
        uniqueRatio: 1.0,
        isSpamDetected: false,
      };
    }

    // Calculate lexical diversity (unique word ratio)
    const cleanedWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
    const uniqueWords = new Set(cleanedWords);
    const uniqueRatio = cleanedWords.length > 0 ? Number((uniqueWords.size / cleanedWords.length).toFixed(2)) : 0;

    // Check single word frequency dominance
    const wordFreq = new Map<string, number>();
    let maxFreq = 0;
    for (const w of cleanedWords) {
      const count = (wordFreq.get(w) || 0) + 1;
      wordFreq.set(w, count);
      if (count > maxFreq) maxFreq = count;
    }
    const maxFreqRatio = cleanedWords.length > 0 ? maxFreq / cleanedWords.length : 0;

    // Spam / Repetition detection heuristics
    if (wordCount >= 6 && (uniqueRatio < 0.35 || maxFreqRatio > 0.40)) {
      return {
        isValid: false,
        depthScore: 0.1,
        feedback: 'Excessive repetitive text or copy-paste spam detected. Write an original conceptual synthesis.',
        wordCount,
        uniqueRatio,
        isSpamDetected: true,
      };
    }

    // Check keyword match density for conceptual depth
    const lowerText = trimmed.toLowerCase();
    let matches = 0;
    for (const kw of this.KEYWORDS) {
      if (lowerText.includes(kw)) {
        matches++;
      }
    }

    const keywordRatio = Math.min(1.0, matches / 3.0);
    const lengthFactor = Math.min(1.0, wordCount / 25.0);
    const depthScore = Number((0.3 * uniqueRatio + 0.3 * lengthFactor + 0.4 * keywordRatio).toFixed(2));

    const isValid = depthScore >= 0.35 || (wordCount >= 10 && uniqueRatio >= 0.45);
    const feedback = isValid
      ? `Reflection validated (Depth Score: ${(depthScore * 100).toFixed(0)}%). Conceptual synthesis recorded.`
      : `Reflection lacks technical specificity. Mention key concepts like Result container, events, or subscription safety.`;

    return {
      isValid,
      depthScore,
      feedback,
      wordCount,
      uniqueRatio,
      isSpamDetected: false,
    };
  }
}
