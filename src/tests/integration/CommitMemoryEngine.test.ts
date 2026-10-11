import { describe, it, expect, beforeEach } from 'vitest';
import { knowledgeCommitEngine } from '../../core/import/commit/KnowledgeCommitEngine';
import { knowledgeLedger } from '../../core/import/commit/KnowledgeLedger';
import { memoryDomainService } from '../../domains/dom-002-memory/MemoryDomainService';
import { mockCandidateModel } from '../../test/fixtures';
import { assertOk } from '../../test/utils';

describe('Integration Pipeline: Commit → CKM → Memory Engine', () => {
  beforeEach(() => {
    knowledgeLedger.clearLedger();
  });

  it('should activate committed CKM version and synchronize runtime nodes with Memory Domain Engine', async () => {
    // 1. Commit Candidate Model
    const { commit } = await knowledgeCommitEngine.prepareAndValidateCommit(mockCandidateModel);
    await knowledgeCommitEngine.executeCommit(commit);

    // 2. Activate state
    const activeState = await knowledgeCommitEngine.activateCommit(commit.commitId);
    expect(activeState.activeVersion).toBe('v1.0.0');

    // 3. Practice concept from active CKM state in Memory Engine
    const activeConcept = activeState.concepts[0];
    const memoryRes = await memoryDomainService.recordPracticeEvent(
      activeConcept.id,
      0.95,
      'artifact_ckm_001'
    );

    assertOk(memoryRes);
    const updatedMemory = memoryRes.value;
    expect(updatedMemory.conceptId).toBe(activeConcept.id);
    expect(updatedMemory.confidenceScore).toBeGreaterThan(0.70);
    expect(updatedMemory.retentionScore).toBeGreaterThanOrEqual(0.95);
  });
});
