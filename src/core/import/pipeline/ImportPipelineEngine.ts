/**
 * @file src/core/import/pipeline/ImportPipelineEngine.ts
 * @description Master Pipeline Execution Engine for Eliot RDI-1 Import Engine.
 * @license Apache-2.0
 */

import { eventBus } from '../../events/EventBus';
import {
  ImportInputSource,
  ImportCheckpoint,
  ImportSummaryData,
  DuplicateAction,
  ProgressCallback,
  NormalizedChunk,
  ExtractedAsset,
  ContentItem,
  SourceMetadata,
  PipelineStage,
} from '../types';

import { CryptoUtils } from './CryptoUtils';
import { NormalizationEngine } from './NormalizationEngine';
import { importCheckpointManager } from './ImportCheckpointManager';
import { ImportProviderRegistry } from '../providers/ImportProviderRegistry';

export class ImportPipelineEngine {
  /**
   * Calculates the SHA-256 fingerprint for an import input source.
   */
  public async calculateSourceFingerprint(input: ImportInputSource): Promise<string> {
    if (input.file) {
      return CryptoUtils.calculateFileHash(input.file);
    }
    if (input.files && input.files.length > 0) {
      return CryptoUtils.calculateFileListHash(input.files);
    }
    return CryptoUtils.calculateTextHash(`folder-${input.folderHandle?.name || 'local'}-${Date.now()}`);
  }

  /**
   * Checks if an identical source (by SHA-256) has already been imported.
   */
  public async checkForDuplicate(sha256Digest: string): Promise<ImportSummaryData | null> {
    return importCheckpointManager.checkExistingDigest(sha256Digest);
  }

  /**
   * Executes the deterministic 10-stage import pipeline.
   */
  public async runImportPipeline(
    input: ImportInputSource,
    duplicateAction: DuplicateAction = 'separate',
    progressCb?: ProgressCallback,
    resumeCheckpoint?: ImportCheckpoint | null
  ): Promise<ImportSummaryData> {
    const startTime = Date.now();
    const provider = ImportProviderRegistry.resolveProviderForInput(input);
    const importId = resumeCheckpoint?.importId || `import-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 1. Validation Stage
    this.reportProgress(progressCb, 'validation', 'Validating Source Structure', 1, 10, 10, 'Checking source format and permissions');
    const validation = await provider.validateSource(input);
    if (!validation.isValid) {
      throw new Error(`Import Validation Failed: ${validation.errorMessage} (${validation.suggestedFix || 'Check input file'})`);
    }

    // 2. Fingerprinting Stage
    this.reportProgress(progressCb, 'fingerprinting', 'Calculating SHA-256 Digest', 2, 10, 20, 'Generating cryptographic fingerprint');
    const sha256Digest = resumeCheckpoint?.sha256Digest || (await this.calculateSourceFingerprint(input));

    // Handle Duplicate Action if skipped
    if (duplicateAction === 'skip') {
      const existing = await this.checkForDuplicate(sha256Digest);
      if (existing) {
        return existing;
      }
    }

    // Emit event
    eventBus.publish({
      eventId: `evt-${Date.now()}`,
      eventType: 'ImportStarted',
      timestamp: new Date().toISOString(),
      sourceDomain: 'DOM-003',
      payload: { importId, providerId: provider.id, sha256Digest },
    });

    // 3. Metadata Extraction
    this.reportProgress(progressCb, 'metadata_extraction', 'Extracting Metadata', 3, 10, 30, 'Reading file structure & metrics');
    let metadata: SourceMetadata = resumeCheckpoint?.metadata || (await provider.extractMetadata(input, sha256Digest));
    if (duplicateAction === 'separate' && !resumeCheckpoint) {
      metadata = {
        ...metadata,
        title: `${metadata.title} (Copy ${new Date().toLocaleTimeString()})`,
      };
    }

    // 4. Content Enumeration
    this.reportProgress(progressCb, 'content_enumeration', 'Enumerating Content Items', 4, 10, 40, 'Scanning documents and sections');
    const items: ContentItem[] = resumeCheckpoint?.items.length
      ? resumeCheckpoint.items
      : await provider.enumerateContent(input);

    // 5. Asset Extraction Stage
    this.reportProgress(progressCb, 'asset_extraction', 'Extracting Raw Assets', 5, 10, 50, `Extracting 0 of ${items.length} items`);
    const extractedAssets: ExtractedAsset[] = resumeCheckpoint?.assets || [];
    const startIndex = extractedAssets.length;

    for (let i = startIndex; i < items.length; i++) {
      const item = items[i];
      const asset = await provider.extractAsset(item, input, (subReport) => {
        const itemPercent = 50 + Math.round(((i + subReport.completedUnits / subReport.totalUnits) / items.length) * 20);
        this.reportProgress(progressCb, 'asset_extraction', 'Extracting Raw Assets', i + 1, items.length, itemPercent, subReport.currentOperationLabel);
      });
      extractedAssets.push(asset);

      // Checkpoint save every 5 assets
      if (extractedAssets.length % 5 === 0) {
        await this.saveActiveCheckpoint(importId, sha256Digest, metadata, items, extractedAssets, [], 'asset_extraction', progressCb);
      }
    }

    // 6. Normalization & Chunk Creation
    this.reportProgress(progressCb, 'chunk_creation', 'Generating Semantic Chunks', 8, 10, 80, 'Normalizing text and building semantic chunks');
    const chunks: NormalizedChunk[] = resumeCheckpoint?.chunks.length ? resumeCheckpoint.chunks : [];

    if (chunks.length === 0) {
      for (let i = 0; i < extractedAssets.length; i++) {
        const asset = extractedAssets[i];
        const item = items.find((it) => it.itemId === asset.itemId);
        const itemTitle = item ? item.title : `Asset ${i + 1}`;
        const assetChunks = NormalizationEngine.chunkAsset(asset, itemTitle);
        chunks.push(...assetChunks);
      }
    }

    // 7. Checkpoint Save Stage
    this.reportProgress(progressCb, 'checkpoint_save', 'Saving Import Checkpoint', 9, 10, 90, 'Writing LocalFirst recovery state');
    await this.saveActiveCheckpoint(importId, sha256Digest, metadata, items, extractedAssets, chunks, 'checkpoint_save', progressCb);

    // 8. Completion & Summary
    const processingTimeMs = Date.now() - startTime;
    let totalWords = 0;
    chunks.forEach((c) => (totalWords += c.wordCount));

    const summary: ImportSummaryData = {
      importId,
      sourceName: metadata.title,
      providerId: provider.id,
      importedAssetsCount: extractedAssets.length,
      generatedChunksCount: chunks.length,
      totalWordCount: totalWords,
      processingTimeMs,
      sha256Digest,
      storageLocation: 'IndexedDB (LocalFirst CKM Ledger)',
      readyStatus: true,
      timestamp: new Date().toISOString(),
    };

    // Save summary and clear active checkpoint
    await importCheckpointManager.saveCompletedSummary(summary);
    await importCheckpointManager.clearCheckpoint(importId);

    this.reportProgress(progressCb, 'completed', 'Import Complete', 10, 10, 100, 'Knowledge successfully transformed into CKM format');

    eventBus.publish({
      eventId: `evt-${Date.now()}`,
      eventType: 'ImportCompleted',
      timestamp: new Date().toISOString(),
      sourceDomain: 'DOM-003',
      payload: summary as unknown as Record<string, unknown>,
    });

    return summary;
  }

  private async saveActiveCheckpoint(
    importId: string,
    sha256Digest: string,
    metadata: SourceMetadata,
    items: ContentItem[],
    assets: ExtractedAsset[],
    chunks: NormalizedChunk[],
    stage: PipelineStage,
    progressCb?: ProgressCallback
  ): Promise<void> {
    const checkpoint: ImportCheckpoint = {
      importId,
      sha256Digest,
      sourceName: metadata.title,
      providerId: metadata.customProperties?.providerId as any || 'pdf-document',
      currentStage: stage,
      stageProgressPercent: stage === 'asset_extraction' ? Math.round((assets.length / items.length) * 100) : 100,
      totalItems: items.length,
      extractedCount: assets.length,
      metadata,
      items,
      assets,
      chunks,
      timestamp: new Date().toISOString(),
    };

    await importCheckpointManager.saveCheckpoint(checkpoint);

    eventBus.publish({
      eventId: `evt-${Date.now()}`,
      eventType: 'ImportCheckpointSaved',
      timestamp: new Date().toISOString(),
      sourceDomain: 'DOM-003',
      payload: { importId, stage, extractedCount: assets.length },
    });
  }

  private reportProgress(
    progressCb: ProgressCallback | undefined,
    stage: PipelineStage,
    stageLabel: string,
    completedUnits: number,
    totalUnits: number,
    progressPercent: number,
    currentOperationLabel: string
  ): void {
    if (!progressCb) return;

    const report = {
      stage,
      stageLabel,
      completedUnits,
      totalUnits,
      progressPercent,
      currentOperationLabel,
    };

    progressCb(report);

    eventBus.publish({
      eventId: `evt-${Date.now()}`,
      eventType: 'ImportProgressUpdated',
      timestamp: new Date().toISOString(),
      sourceDomain: 'DOM-003',
      payload: report as unknown as Record<string, unknown>,
    });
  }
}

export const importPipelineEngine = new ImportPipelineEngine();
