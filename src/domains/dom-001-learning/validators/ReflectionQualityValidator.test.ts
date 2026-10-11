import { describe, it, expect } from 'vitest';
import { ReflectionQualityValidator } from './ReflectionQualityValidator';

describe('ReflectionQualityValidator Unit Tests', () => {
  it('should reject empty or whitespace-only reflections', () => {
    const res = ReflectionQualityValidator.validate('   ');
    expect(res.isValid).toBe(false);
    expect(res.wordCount).toBe(0);
    expect(res.feedback).toContain('empty');
  });

  it('should reject reflections shorter than 5 words', () => {
    const res = ReflectionQualityValidator.validate('Too brief reflection');
    expect(res.isValid).toBe(false);
    expect(res.wordCount).toBe(3);
    expect(res.feedback).toContain('minimum 5 words');
  });

  it('should detect copy-paste or repetitive spam', () => {
    const res = ReflectionQualityValidator.validate('test test test test test test test test test test');
    expect(res.isValid).toBe(false);
    expect(res.isSpamDetected).toBe(true);
    expect(res.feedback).toContain('spam detected');
  });

  it('should validate high-quality technical reflection', () => {
    const text =
      'Implemented a monadic result container to avoid unhandled runtime exceptions. The async event dispatcher cleanly routes domain event subscriptions while managing memory decay safety.';
    const res = ReflectionQualityValidator.validate(text);

    expect(res.isValid).toBe(true);
    expect(res.depthScore).toBeGreaterThan(0.5);
    expect(res.isSpamDetected).toBe(false);
    expect(res.feedback).toContain('validated');
  });
});
