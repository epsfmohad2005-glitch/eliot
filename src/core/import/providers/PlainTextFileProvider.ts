/**
 * @file src/core/import/providers/PlainTextFileProvider.ts
 * @description Plain Text File Import Provider for RDI-1.
 * @license Apache-2.0
 */

import {
  ImportProvider,
  ImportProviderId,
  ProviderCapabilities,
  ImportInputSource,
  ValidationResult,
  SourceMetadata,
  ContentItem,
  ExtractedAsset,
  ProgressCallback,
} from '../types';

export class PlainTextFileProvider implements ImportProvider {
  readonly id: ImportProviderId = 'plain-text';
  readonly name = 'Plain Text';
  readonly description = 'Imports raw text files, logs, CSVs, and structured data formats (.txt, .json, .csv, .yaml).';
  readonly supportedExtensions = ['.txt', '.log', '.csv', '.json', '.yaml', '.yml'];

  readonly capabilities: ProviderCapabilities = {
    supportsBatchImport: false,
    supportsCodeExtraction: false,
    supportsVideoCaptions: false,
    supportsHierarchicalStructure: false,
    requiresAuthentication: false,
    offlineCapable: true,
  };

  public async validateSource(input: ImportInputSource): Promise<ValidationResult> {
    if (!input.file) {
      return {
        isValid: false,
        errorCode: 'MISSING_FILE',
        errorMessage: 'No plain text file selected.',
        suggestedFix: 'Select a valid text file.',
      };
    }

    if (input.file.size === 0) {
      return {
        isValid: false,
        errorCode: 'EMPTY_FILE',
        errorMessage: 'File is empty.',
        suggestedFix: 'Select a non-empty text file.',
      };
    }

    return { isValid: true };
  }

  public async extractMetadata(input: ImportInputSource, sha256: string): Promise<SourceMetadata> {
    const file = input.file!;
    const text = await file.text();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: `Plain Text Document (${wordCount} words, ${(file.size / 1024).toFixed(1)} KB)`,
      totalItemsCount: 1,
      sha256Fingerprint: sha256,
      totalSizeBytes: file.size,
      estimatedContentLengthMinutes: readingTime,
    };
  }

  public async enumerateContent(input: ImportInputSource): Promise<ContentItem[]> {
    const file = input.file!;
    const text = await file.text();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return [
      {
        itemId: 'text-doc-1',
        title: file.name,
        ordinalPosition: 1,
        contentType: 'text',
        sourceUri: file.name,
        estimatedReadingMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        fileSize: file.size,
      },
    ];
  }

  public async extractAsset(
    item: ContentItem,
    input: ImportInputSource,
    progressCb?: ProgressCallback
  ): Promise<ExtractedAsset> {
    const file = input.file!;
    const rawText = await file.text();

    if (progressCb) {
      progressCb({
        stage: 'asset_extraction',
        stageLabel: 'Extracting Text',
        completedUnits: 1,
        totalUnits: 1,
        progressPercent: 100,
        currentOperationLabel: `Read ${file.name}`,
      });
    }

    return {
      itemId: item.itemId,
      mimeType: 'text/plain',
      rawText,
    };
  }
}
