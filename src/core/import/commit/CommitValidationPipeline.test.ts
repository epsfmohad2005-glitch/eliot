import { describe, it, expect, beforeEach } from 'vitest';
import { CommitValidationPipeline } from './CommitValidationPipeline';
import { mockCandidateModel } from '../../../test/fixtures';

describe('CommitValidationPipeline Unit Tests', () => {
  let pipeline: CommitValidationPipeline;

  beforeEach(() => {
    pipeline = new CommitValidationPipeline();
  });

  it('should validate a clean candidate knowledge model successfully', async () => {
    const report = await pipeline.validateCandidateCommit(mockCandidateModel, []);
    expect(report.isValid).toBe(true);
    expect(report.duplicateCheckPassed).toBe(true);
    expect(report.cyclicDependencyCheckPassed).toBe(true);
    expect(report.relationshipIntegrityScore).toBe(100);
  });

  it('should detect dangling references when dependency points to non-existent concept', async () => {
    const modelWithDangling = {
      ...mockCandidateModel,
      dependencies: [
        {
          id: 'dep-invalid',
          sourceConceptId: 'concept-01',
          targetConceptId: 'NON_EXISTENT_CONCEPT',
          relationshipType: 'prerequisite' as const,
          confidence: 90,
          reason: 'Test',
          status: 'pending' as const,
        },
      ],
    };

    const report = await pipeline.validateCandidateCommit(modelWithDangling, []);
    expect(report.isValid).toBe(false);
    expect(report.summary.danglingReferencesCount).toBe(1);
    expect(report.errors.some((e) => e.code === 'DANGLING_RELATIONSHIP_REFERENCE')).toBe(true);
  });

  it('should detect cyclic dependencies in prerequisite graph', async () => {
    const modelWithCycle = {
      ...mockCandidateModel,
      dependencies: [
        {
          id: 'dep-c1',
          sourceConceptId: 'concept-01',
          targetConceptId: 'concept-02',
          relationshipType: 'prerequisite' as const,
          confidence: 90,
          reason: 'Test',
          status: 'pending' as const,
        },
        {
          id: 'dep-c2',
          sourceConceptId: 'concept-02',
          targetConceptId: 'concept-01',
          relationshipType: 'prerequisite' as const,
          confidence: 90,
          reason: 'Test',
          status: 'pending' as const,
        },
      ],
    };

    const report = await pipeline.validateCandidateCommit(modelWithCycle, []);
    expect(report.isValid).toBe(false);
    expect(report.cyclicDependencyCheckPassed).toBe(false);
    expect(report.errors.some((e) => e.code === 'CYCLIC_DEPENDENCY_DETECTED')).toBe(true);
  });
});
