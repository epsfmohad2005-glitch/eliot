import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeCommitEngine } from './KnowledgeCommitEngine';
import { knowledgeLedger } from './KnowledgeLedger';
import { mockCandidateModel } from '../../../test/fixtures';

describe('KnowledgeCommitEngine Unit Tests', () => {
  let engine: KnowledgeCommitEngine;

  beforeEach(() => {
    knowledgeLedger.clearLedger();
    engine = new KnowledgeCommitEngine();
  });

  it('should prepare and validate a commit record from a candidate model', async () => {
    const { commit, validation } = await engine.prepareAndValidateCommit(
      mockCandidateModel,
      'Release v1.0',
      'Architect'
    );

    expect(commit.commitId).toBeDefined();
    expect(commit.version).toBe('v1.0.0');
    expect(commit.concepts.length).toBe(2);
    expect(validation.isValid).toBe(true);
  });

  it('should execute commit and append block to immutable knowledge ledger', async () => {
    const { commit } = await engine.prepareAndValidateCommit(mockCandidateModel);
    const { commit: committedRecord, ledgerEntryHash } = await engine.executeCommit(commit);

    expect(committedRecord.status).toBe('committed');
    expect(ledgerEntryHash).toBeDefined();
    expect(knowledgeLedger.getLedger().length).toBe(1);
  });

  it('should activate a committed CKM version into runtime state', async () => {
    const { commit } = await engine.prepareAndValidateCommit(mockCandidateModel);
    await engine.executeCommit(commit);

    const activeState = await engine.activateCommit(commit.commitId);
    expect(activeState.activeCommitId).toBe(commit.commitId);
    expect(activeState.activeVersion).toBe('v1.0.0');
    expect(activeState.concepts.length).toBe(2);
  });

  it('should dispatch canonical domain events upon commit and activation', async () => {
    const { commit } = await engine.prepareAndValidateCommit(mockCandidateModel);
    await engine.executeCommit(commit);
    await engine.activateCommit(commit.commitId);

    const events = engine.getDomainEvents();
    expect(events.length).toBe(2);
    expect(events[0].type).toBe('knowledge.commit.created');
    expect(events[1].type).toBe('knowledge.commit.activated');
  });
});
