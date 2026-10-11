/**
 * @file src/core/import/pipeline/ImportCheckpointManager.ts
 * @description LocalFirst IndexedDB Persistence for RDI-1 Import Checkpoints & Resumption.
 * @license Apache-2.0
 */

import { IndexedDBAdapter } from '../../storage/IndexedDBAdapter';
import { ImportCheckpoint, ImportSummaryData } from '../types';

export class ImportCheckpointManager {
  private adapter: IndexedDBAdapter;

  constructor() {
    this.adapter = new IndexedDBAdapter('eliot_rdi_db', 'import_checkpoints');
  }

  /**
   * Saves or updates an active import checkpoint.
   */
  public async saveCheckpoint(checkpoint: ImportCheckpoint): Promise<boolean> {
    const res = await this.adapter.setItem(checkpoint.importId, checkpoint);
    // Also save active checkpoint key for quick recovery lookup
    if (res.ok) {
      await this.adapter.setItem('ACTIVE_CHECKPOINT_ID', checkpoint.importId);
      return true;
    }
    return false;
  }

  /**
   * Retrieves an active checkpoint by ID.
   */
  public async getCheckpoint(importId: string): Promise<ImportCheckpoint | null> {
    const res = await this.adapter.getItem<ImportCheckpoint>(importId);
    return res.ok ? res.value : null;
  }

  /**
   * Retrieves the current active incomplete checkpoint for crash/refresh recovery.
   */
  public async getActiveCheckpoint(): Promise<ImportCheckpoint | null> {
    const activeRes = await this.adapter.getItem<string>('ACTIVE_CHECKPOINT_ID');
    if (activeRes.ok && activeRes.value) {
      const checkpoint = await this.getCheckpoint(activeRes.value);
      if (checkpoint && checkpoint.currentStage !== 'completed') {
        return checkpoint;
      }
    }
    return null;
  }

  /**
   * Clears active checkpoint once import is complete or discarded.
   */
  public async clearCheckpoint(importId: string): Promise<void> {
    await this.adapter.removeItem(importId);
    const activeRes = await this.adapter.getItem<string>('ACTIVE_CHECKPOINT_ID');
    if (activeRes.ok && activeRes.value === importId) {
      await this.adapter.removeItem('ACTIVE_CHECKPOINT_ID');
    }
  }

  /**
   * Saves completed import summary to historical ledger.
   */
  public async saveCompletedSummary(summary: ImportSummaryData): Promise<void> {
    const historyAdapter = new IndexedDBAdapter('eliot_rdi_db', 'completed_imports');
    await historyAdapter.setItem(summary.sha256Digest, summary);
  }

  /**
   * Checks if an import with the given SHA-256 digest already exists.
   */
  public async checkExistingDigest(sha256Digest: string): Promise<ImportSummaryData | null> {
    const historyAdapter = new IndexedDBAdapter('eliot_rdi_db', 'completed_imports');
    const res = await historyAdapter.getItem<ImportSummaryData>(sha256Digest);
    return res.ok ? res.value : null;
  }
}

export const importCheckpointManager = new ImportCheckpointManager();
