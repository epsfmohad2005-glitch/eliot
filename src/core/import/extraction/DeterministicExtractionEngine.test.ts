import { describe, it, expect, beforeEach } from 'vitest';
import { DeterministicExtractionEngine } from './DeterministicExtractionEngine';
import { mockSourceMetadata, mockExtractedAssets } from '../../../test/fixtures';
import { ExtractedAsset } from '../types';

describe('DeterministicExtractionEngine Unit Tests', () => {
  let engine: DeterministicExtractionEngine;

  beforeEach(() => {
    engine = new DeterministicExtractionEngine();
  });

  it('should extract candidate concepts and skills deterministically without AI', async () => {
    const ckmC = await engine.extractCandidateModel(
      'pdf-document',
      mockSourceMetadata,
      [],
      mockExtractedAssets
    );

    expect(ckmC.importId).toBeDefined();
    expect(ckmC.sourceTitle).toBe(mockSourceMetadata.title);
    expect(ckmC.concepts.length).toBeGreaterThan(0);
    expect(ckmC.skills.length).toBeGreaterThan(0);
    expect(ckmC.qualityMetrics.overallExtractionScore).toBeGreaterThan(50);
  });

  it('should detect duplicate concept suggestions when near-matches exist', async () => {
    const assetsWithDups: ExtractedAsset[] = [
      {
        itemId: 'dup-01',
        mimeType: 'text/markdown',
        rawText: '# Monadic Result Container\n\nResult container is defined as success wrapper.',
      },
      {
        itemId: 'dup-02',
        mimeType: 'text/markdown',
        rawText: '# Monadic Result\n\nMonadic result refers to functional wrapper.',
      },
    ];

    const ckmC = await engine.extractCandidateModel(
      'pdf-document',
      mockSourceMetadata,
      [],
      assetsWithDups
    );

    expect(ckmC.duplicateSuggestions.length).toBeGreaterThanOrEqual(1);
    expect(ckmC.duplicateSuggestions[0].reason).toBeDefined();
  });

  it('should calculate extraction quality metrics correctly', async () => {
    const ckmC = await engine.extractCandidateModel(
      'pdf-document',
      mockSourceMetadata,
      [],
      mockExtractedAssets
    );

    expect(ckmC.qualityMetrics.coveragePercent).toBeGreaterThanOrEqual(40);
    expect(ckmC.qualityMetrics.ambiguityScore).toBeGreaterThanOrEqual(0);
  });
});
