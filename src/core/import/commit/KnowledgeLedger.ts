/**
 * @file src/core/import/commit/KnowledgeLedger.ts
 * @description Immutable Knowledge Ledger for Eliot RDI-1C.
 * Maintains an append-only, cryptographic hash-chained audit ledger of versioned CKM commits.
 * @license Apache-2.0
 */

import { KnowledgeLedgerEntry, KnowledgeCommitRecord } from './types';
import { CryptoUtils } from '../pipeline/CryptoUtils';

const LEDGER_STORAGE_KEY = 'eliot_knowledge_ledger_v1';
const COMMITS_STORAGE_KEY = 'eliot_knowledge_commits_v1';
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export class KnowledgeLedger {
  private ledgerEntries: KnowledgeLedgerEntry[] = [];
  private commits: Map<string, KnowledgeCommitRecord> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Appends an entry to the immutable ledger with SHA-256 hash chaining.
   */
  public async appendEntry(
    commit: KnowledgeCommitRecord,
    action: KnowledgeLedgerEntry['action'],
    details: string,
    actor = 'System / RDI-1C'
  ): Promise<KnowledgeLedgerEntry> {
    const previousHash = this.getLatestHash();
    const entryId = `ledger-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();

    const rawPayload = `${entryId}:${commit.commitId}:${commit.version}:${action}:${commit.contentHash}:${previousHash}:${timestamp}`;
    const entryHash = await CryptoUtils.sha256(rawPayload);

    const entry: KnowledgeLedgerEntry = {
      entryId,
      commitId: commit.commitId,
      timestamp,
      action,
      version: commit.version,
      contentHash: commit.contentHash,
      previousHash,
      entryHash,
      details,
      actor,
    };

    this.ledgerEntries.push(entry);
    this.commits.set(commit.commitId, commit);
    this.saveToStorage();

    return entry;
  }

  public getLatestHash(): string {
    if (this.ledgerEntries.length === 0) return GENESIS_HASH;
    return this.ledgerEntries[this.ledgerEntries.length - 1].entryHash;
  }

  public getLedger(): KnowledgeLedgerEntry[] {
    return [...this.ledgerEntries];
  }

  public getCommits(): KnowledgeCommitRecord[] {
    return Array.from(this.commits.values());
  }

  public getCommit(commitId: string): KnowledgeCommitRecord | undefined {
    return this.commits.get(commitId);
  }

  /**
   * Verifies cryptographic hash integrity across the entire ledger chain.
   */
  public async verifyLedgerIntegrity(): Promise<{ isIntact: boolean; brokenAtEntryId?: string }> {
    let expectedPreviousHash = GENESIS_HASH;

    for (const entry of this.ledgerEntries) {
      if (entry.previousHash !== expectedPreviousHash) {
        return { isIntact: false, brokenAtEntryId: entry.entryId };
      }

      const rawPayload = `${entry.entryId}:${entry.commitId}:${entry.version}:${entry.action}:${entry.contentHash}:${entry.previousHash}:${entry.timestamp}`;
      const calculatedHash = await CryptoUtils.sha256(rawPayload);

      if (calculatedHash !== entry.entryHash) {
        return { isIntact: false, brokenAtEntryId: entry.entryId };
      }

      expectedPreviousHash = entry.entryHash;
    }

    return { isIntact: true };
  }

  public clearLedger(): void {
    this.ledgerEntries = [];
    this.commits.clear();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(LEDGER_STORAGE_KEY);
      localStorage.removeItem(COMMITS_STORAGE_KEY);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const rawLedger = localStorage.getItem(LEDGER_STORAGE_KEY);
      if (rawLedger) {
        this.ledgerEntries = JSON.parse(rawLedger);
      }

      const rawCommits = localStorage.getItem(COMMITS_STORAGE_KEY);
      if (rawCommits) {
        const parsed: KnowledgeCommitRecord[] = JSON.parse(rawCommits);
        parsed.forEach((c) => this.commits.set(c.commitId, c));
      }
    } catch {
      this.ledgerEntries = [];
      this.commits.clear();
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify(this.ledgerEntries));
      localStorage.setItem(COMMITS_STORAGE_KEY, JSON.stringify(Array.from(this.commits.values())));
    } catch {
      // Quota exceeded or disabled
    }
  }
}

export const knowledgeLedger = new KnowledgeLedger();
