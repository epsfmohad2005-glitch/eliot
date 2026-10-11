/**
 * @file src/core/import/providers/MarkdownFileProvider.ts
 * @description Single Markdown File Import Provider for RDI-1.
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

export class MarkdownFileProvider implements ImportProvider {
  readonly id: ImportProviderId = 'markdown-file';
  readonly name = 'Markdown File';
  readonly description = 'Imports notes, study guides, and articles written in Markdown (.md).';
  readonly supportedExtensions = ['.md', '.markdown'];

  readonly capabilities: ProviderCapabilities = {
    supportsBatchImport: false,
    supportsCodeExtraction: true,
    supportsVideoCaptions: false,
    supportsHierarchicalStructure: true,
    requiresAuthentication: false,
    offlineCapable: true,
  };

  public async validateSource(input: ImportInputSource): Promise<ValidationResult> {
    if (!input.file) {
      return {
        isValid: false,
        errorCode: 'MISSING_FILE',
        errorMessage: 'No Markdown file selected.',
        suggestedFix: 'Upload a file with .md or .markdown extension.',
      };
    }

    const name = input.file.name.toLowerCase();
    if (!name.endsWith('.md') && !name.endsWith('.markdown')) {
      return {
        isValid: false,
        errorCode: 'INVALID_EXTENSION',
        errorMessage: 'File extension must be .md or .markdown.',
        suggestedFix: 'Select a valid Markdown file.',
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
      title: file.name.replace(/\.(md|markdown)$/i, ''),
      description: `Markdown Document (${wordCount} words, ~${readingTime} min read)`,
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
        itemId: 'md-doc-1',
        title: file.name,
        ordinalPosition: 1,
        contentType: 'markdown',
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
        stageLabel: 'Extracting Markdown',
        completedUnits: 1,
        totalUnits: 1,
        progressPercent: 100,
        currentOperationLabel: `Read ${file.name}`,
      });
    }

    return {
      itemId: item.itemId,
      mimeType: 'text/markdown',
      rawText,
    };
  }
}
