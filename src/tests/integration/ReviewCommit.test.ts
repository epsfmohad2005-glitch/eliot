import { describe, it, expect, beforeEach } from 'vitest';
import { knowledgeCommitEngine } from '../../core/import/commit/KnowledgeCommitEngine';
import { knowledgeLedger } from '../../core/import/commit/KnowledgeLedger';
import { mockCandidateModel } from '../../test/fixtures';

describe('Integration Pipeline: Review → Commit', () => {
  beforeEach(() => {
    knowledgeLedger.clearLedger();
  });

  it('should take reviewed candidate model, pass validation pipeline, and commit to immutable ledger', async () => {
    // 1. Reviewed model with user approvals
    const reviewedModel = { ...mockCandidateModel };
    reviewedModel.concepts[0].status = 'approved';
    reviewedModel.concepts[1].status = 'approved';

    // 2. Prepare & validate commit
    const { commit, validation } = await knowledgeCommitEngine.prepareAndValidateCommit(
      reviewedModel,
      'Validated Sprint RDI-1C Release',
      'Lead Architect'
    );

    expect(validation.isValid).toBe(true);
    expect(commit.status).toBe('validated');

    // 3. Execute commit into ledger
    const { commit: finalRecord, ledgerEntryHash } = await knowledgeCommitEngine.executeCommit(commit);

    expect(finalRecord.status).toBe('committed');
    expect(ledgerEntryHash).toBeDefined();

    // 4. Ledger verification
    const ledger = knowledgeLedger.getLedger();
    expect(ledger.length).toBe(1);
    expect(ledger[0].action).toBe('COMMIT_CREATED');
    expect(ledger[0].version).toBe('v1.0.0');

    const integrity = await knowledgeLedger.verifyLedgerIntegrity();
    expect(integrity.isIntact).toBe(true);
  });
});
