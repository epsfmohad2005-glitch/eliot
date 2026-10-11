import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ReviewDomainService } from './ReviewDomainService';
import { evidenceDomainService } from '../dom-011-evidence';
import { aiCoreDomainService } from '../dom-004-ai-core';
import { Result } from '../../core/errors/Result';
import { EvidenceArtifactEntity } from '../../types';
import { assertOk } from '../../test/utils';

const sampleArtifact: EvidenceArtifactEntity = {
  id: 'artifact-1',
  contentHash: 'SHA-256:abc',
  unitId: 'unit-01',
  stageNumber: 3,
  timestamp: new Date().toISOString(),
  payload: 'export function solve() { return 42; }',
};

describe('ReviewDomainService Unit Tests', () => {
  let service: ReviewDomainService;

  beforeEach(() => {
    service = new ReviewDomainService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects submission when the referenced evidence artifact does not exist', async () => {
    vi.spyOn(evidenceDomainService, 'getArtifactById').mockResolvedValue(Result.ok(null));

    const res = await service.submitForReview('missing-artifact', 'rubric-1');

    expect(res.ok).toBe(false);
  });

  it('renders an Approved verdict when the AI evaluation reports approved: true', async () => {
    vi.spyOn(evidenceDomainService, 'getArtifactById').mockResolvedValue(Result.ok(sampleArtifact));
    vi.spyOn(aiCoreDomainService, 'evaluateSubmissionRubric').mockResolvedValue(
      Result.ok({
        responseText: 'Meets all rubric criteria.',
        structuredJson: { approved: true },
        isSocraticQuestion: false,
        modelUsed: 'mock-model',
      })
    );

    const submitRes = await service.submitForReview('artifact-1', 'rubric-1');
    assertOk(submitRes);

    const verdictRes = await service.getVerdict(submitRes.value);
    assertOk(verdictRes);
    expect(verdictRes.value?.status).toBe('Approved');
    expect(verdictRes.value?.critique).toBe('Meets all rubric criteria.');
  });

  it('renders a RevisionRequired verdict when the AI evaluation reports approved: false', async () => {
    vi.spyOn(evidenceDomainService, 'getArtifactById').mockResolvedValue(Result.ok(sampleArtifact));
    vi.spyOn(aiCoreDomainService, 'evaluateSubmissionRubric').mockResolvedValue(
      Result.ok({
        responseText: 'Missing error handling on line 3.',
        structuredJson: { approved: false, correctiveSteps: ['Add a try/catch block'] },
        isSocraticQuestion: false,
        modelUsed: 'mock-model',
      })
    );

    const submitRes = await service.submitForReview('artifact-1', 'rubric-1');
    assertOk(submitRes);

    const verdictRes = await service.getVerdict(submitRes.value);
    assertOk(verdictRes);
    expect(verdictRes.value?.status).toBe('RevisionRequired');
    expect(verdictRes.value?.correctiveSteps).toEqual(['Add a try/catch block']);
  });

  it('renders RevisionRequired without throwing when the AI evaluation itself fails', async () => {
    vi.spyOn(evidenceDomainService, 'getArtifactById').mockResolvedValue(Result.ok(sampleArtifact));
    vi.spyOn(aiCoreDomainService, 'evaluateSubmissionRubric').mockResolvedValue(
      Result.fail(new Error('Provider unavailable'))
    );

    const submitRes = await service.submitForReview('artifact-1', 'rubric-1');
    assertOk(submitRes);

    const verdictRes = await service.getVerdict(submitRes.value);
    assertOk(verdictRes);
    expect(verdictRes.value?.status).toBe('RevisionRequired');
    expect(verdictRes.value?.critique).toContain('Provider unavailable');
  });

  it('returns null for an unknown submission id rather than failing', async () => {
    const res = await service.getVerdict('does-not-exist');
    assertOk(res);
    expect(res.value).toBeNull();
  });
});
