/**
 * @file src/core/import/commit/KnowledgeCommitEngine.ts
 * @description Knowledge Commit & Activation Engine for Eliot RDI-1C.
 * Controls the transition from Candidate Knowledge Models (CKM-C) to versioned,
 * active Cognitive Knowledge Models (CKM) with domain event broadcasting.
 * @license Apache-2.0
 */

import { CandidateKnowledgeModel } from '../extraction/types';
import {
  KnowledgeCommitRecord,
  CommitValidationReport,
  KnowledgeActivationState,
  CommittedConcept,
  CommittedSkill,
  CommittedDependency,
  KnowledgeDomainEvent,
} from './types';

import { commitValidationPipeline } from './CommitValidationPipeline';
import { knowledgeLedger } from './KnowledgeLedger';
import { eventBus } from '../../events/EventBus';

export class KnowledgeCommitEngine {
  private activeState: KnowledgeActivationState = {
    activeCommitId: null,
    activeVersion: null,
    activatedAt: null,
    concepts: [],
    skills: [],
    dependencies: [],
    assets: [],
  };

  private domainEventLog: KnowledgeDomainEvent[] = [];

  constructor() {
    this.restoreActiveStateFromStorage();
  }

  /**
   * Prepares and validates a commit preview from a Candidate Knowledge Model.
   */
  public async prepareAndValidateCommit(
    candidateModel: CandidateKnowledgeModel,
    commitNote = 'Initial Knowledge Commit',
    author = 'User'
  ): Promise<{ commit: KnowledgeCommitRecord; validation: CommitValidationReport }> {
    const previousCommits = knowledgeLedger.getCommits();
    const version = this.computeNextVersion(previousCommits);
    const timestamp = new Date().toISOString();
    const commitId = `commit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Filter approved concepts or default to non-ignored
    const validConcepts = candidateModel.concepts.filter((c) => c.status !== 'ignored');
    const conceptIds = new Set(validConcepts.map((c) => c.id));

    const validSkills = candidateModel.skills.filter((s) => s.status !== 'ignored');
    const validDependencies = candidateModel.dependencies.filter(
      (d) => d.status !== 'ignored' && conceptIds.has(d.sourceConceptId) && conceptIds.has(d.targetConceptId)
    );

    const committedConcepts: CommittedConcept[] = validConcepts.map((c) => ({
      ...c,
      committedAt: timestamp,
      version,
    }));

    const committedSkills: CommittedSkill[] = validSkills.map((s) => ({
      ...s,
      committedAt: timestamp,
      version,
    }));

    const committedDependencies: CommittedDependency[] = validDependencies.map((d) => ({
      ...d,
      committedAt: timestamp,
      version,
    }));

    // Generate Payload Fingerprint
    const rawPayload = JSON.stringify({
      commitId,
      version,
      concepts: committedConcepts.map((c) => c.id).sort(),
      skills: committedSkills.map((s) => s.id).sort(),
      dependencies: committedDependencies.map((d) => d.id).sort(),
    });

    // Content Hash
    const encoder = new TextEncoder();
    const data = encoder.encode(rawPayload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const contentHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const parentCommit = previousCommits.length > 0 ? previousCommits[previousCommits.length - 1].commitId : undefined;

    const commitRecord: KnowledgeCommitRecord = {
      commitId,
      importId: candidateModel.importId,
      sourceTitle: candidateModel.sourceTitle,
      providerId: candidateModel.providerId,
      version,
      timestamp,
      author,
      commitNote,
      contentHash,
      parentCommitId: parentCommit,
      status: 'validating',
      concepts: committedConcepts,
      skills: committedSkills,
      dependencies: committedDependencies,
      learningAssets: candidateModel.learningAssets,
      stats: {
        totalConcepts: committedConcepts.length,
        totalSkills: committedSkills.length,
        totalDependencies: committedDependencies.length,
        totalAssets: candidateModel.learningAssets.length,
      },
    };

    // Run Validation Pipeline
    const validation = await commitValidationPipeline.validateCandidateCommit(candidateModel, knowledgeLedger.getLedger());
    commitRecord.status = validation.isValid ? 'validated' : 'failed';

    return { commit: commitRecord, validation };
  }

  /**
   * Commits a validated record into the immutable ledger and dispatches domain events.
   */
  public async executeCommit(
    commit: KnowledgeCommitRecord
  ): Promise<{ commit: KnowledgeCommitRecord; ledgerEntryHash: string }> {
    commit.status = 'committed';

    // Append to Immutable Ledger
    const entry = await knowledgeLedger.appendEntry(
      commit,
      'COMMIT_CREATED',
      `Version ${commit.version} committed with ${commit.stats.totalConcepts} concepts, ${commit.stats.totalSkills} skills.`
    );

    // Dispatch Canonical Domain Event
    this.dispatchEvent('knowledge.commit.created', commit.commitId, {
      version: commit.version,
      stats: commit.stats,
      contentHash: commit.contentHash,
    });

    return { commit, ledgerEntryHash: entry.entryHash };
  }

  /**
   * Activates a committed CKM version into active runtime memory.
   */
  public async activateCommit(commitId: string): Promise<KnowledgeActivationState> {
    const commit = knowledgeLedger.getCommit(commitId);
    if (!commit) {
      throw new Error(`Commit ID ${commitId} not found in Knowledge Ledger.`);
    }

    commit.status = 'active';

    this.activeState = {
      activeCommitId: commit.commitId,
      activeVersion: commit.version,
      activatedAt: new Date().toISOString(),
      concepts: commit.concepts,
      skills: commit.skills,
      dependencies: commit.dependencies,
      assets: commit.learningAssets,
    };

    // Append Activation Entry to Ledger
    await knowledgeLedger.appendEntry(
      commit,
      'COMMIT_ACTIVATED',
      `Version ${commit.version} activated as active CKM runtime state.`
    );

    // Save Active State
    this.persistActiveState();

    // Dispatch Canonical Domain Event
    this.dispatchEvent('knowledge.commit.activated', commit.commitId, {
      version: commit.version,
      activatedAt: this.activeState.activatedAt,
    });

    return { ...this.activeState };
  }

  /**
   * Rolls back CKM activation to a target commit version.
   */
  public async rollbackCommit(targetCommitId: string): Promise<KnowledgeActivationState> {
    const commit = knowledgeLedger.getCommit(targetCommitId);
    if (!commit) {
      throw new Error(`Target commit ID ${targetCommitId} not found.`);
    }

    // Append Rollback Ledger Entry
    await knowledgeLedger.appendEntry(
      commit,
      'COMMIT_ROLLED_BACK',
      `Rolled back active CKM state to version ${commit.version} (Commit ${commit.commitId}).`
    );

    // Re-activate target version
    return this.activateCommit(targetCommitId);
  }

  public getActiveState(): KnowledgeActivationState {
    return { ...this.activeState };
  }

  public getDomainEvents(): KnowledgeDomainEvent[] {
    return [...this.domainEventLog];
  }

  private computeNextVersion(existingCommits: KnowledgeCommitRecord[]): string {
    if (existingCommits.length === 0) return 'v1.0.0';

    const latest = existingCommits[existingCommits.length - 1].version;
    const match = latest.match(/^v(\d+)\.(\d+)\.(\d+)$/);
    if (!match) return `v1.${existingCommits.length}.0`;

    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10) + 1;
    return `v${major}.${minor}.0`;
  }

  private dispatchEvent(
    type: KnowledgeDomainEvent['type'],
    commitId: string,
    payload: Record<string, unknown>
  ): void {
    const event: KnowledgeDomainEvent = {
      eventId: `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: new Date().toISOString(),
      commitId,
      payload,
    };

    this.domainEventLog.push(event);

    // Also publish via system EventBus if available
    try {
      eventBus.publish({
        eventId: event.eventId,
        eventType: type as any,
        sourceDomain: 'DOM-001',
        timestamp: event.timestamp,
        payload: { commitId, ...event.payload },
      });
    } catch {
      // Non-blocking
    }
  }

  private persistActiveState(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem('eliot_active_ckm_state_v1', JSON.stringify(this.activeState));
    } catch {
      // quota or disabled
    }
  }

  private restoreActiveStateFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const raw = localStorage.getItem('eliot_active_ckm_state_v1');
      if (raw) {
        this.activeState = JSON.parse(raw);
      }
    } catch {
      // Reset
    }
  }
}

export const knowledgeCommitEngine = new KnowledgeCommitEngine();
