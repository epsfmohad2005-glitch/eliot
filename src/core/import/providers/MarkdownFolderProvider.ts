/**
 * @file src/core/import/providers/MarkdownFolderProvider.ts
 * @description Batch Markdown Folder Import Provider for RDI-1.
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

export class MarkdownFolderProvider implements ImportProvider {
  readonly id: ImportProviderId = 'markdown-folder';
  readonly name = 'Markdown Folder';
  readonly description = 'Imports entire folders or collections of Markdown notes and documentation.';
  readonly supportedExtensions = ['.md', '.markdown'];

  readonly capabilities: ProviderCapabilities = {
    supportsBatchImport: true,
    supportsCodeExtraction: true,
    supportsVideoCaptions: false,
    supportsHierarchicalStructure: true,
    requiresAuthentication: false,
    offlineCapable: true,
  };

  public async validateSource(input: ImportInputSource): Promise<ValidationResult> {
    const files = input.files || (input.file ? [input.file] : []);
    const mdFiles = files.filter(
      (f) => f.name.toLowerCase().endsWith('.md') || f.name.toLowerCase().endsWith('.markdown')
    );

    if (mdFiles.length === 0) {
      return {
        isValid: false,
        errorCode: 'NO_MARKDOWN_FOUND',
        errorMessage: 'No Markdown (.md) files found in the selected folder.',
        suggestedFix: 'Select a folder containing at least one .md or .markdown file.',
      };
    }

    return { isValid: true };
  }

  public async extractMetadata(input: ImportInputSource, sha256: string): Promise<SourceMetadata> {
    const files = (input.files || [input.file!]).filter(
      (f) => f.name.toLowerCase().endsWith('.md') || f.name.toLowerCase().endsWith('.markdown')
    );

    let totalSize = 0;
    for (const f of files) totalSize += f.size;

    const folderName = files[0]?.webkitRelativePath
      ? files[0].webkitRelativePath.split('/')[0]
      : 'Markdown Collection';

    return {
      title: folderName,
      description: `Collection of ${files.length} Markdown files (${(totalSize / 1024).toFixed(1)} KB)`,
      totalItemsCount: files.length,
      sha256Fingerprint: sha256,
      totalSizeBytes: totalSize,
      estimatedContentLengthMinutes: Math.ceil(files.length * 3),
    };
  }

  public async enumerateContent(input: ImportInputSource): Promise<ContentItem[]> {
    const files = (input.files || [input.file!]).filter(
      (f) => f.name.toLowerCase().endsWith('.md') || f.name.toLowerCase().endsWith('.markdown')
    );

    return files.map((file, idx) => ({
      itemId: `md-file-${idx + 1}`,
      title: file.webkitRelativePath || file.name,
      ordinalPosition: idx + 1,
      contentType: 'markdown',
      sourceUri: file.webkitRelativePath || file.name,
      fileSize: file.size,
      estimatedReadingMinutes: Math.max(1, Math.ceil(file.size / 1000)),
    }));
  }

  public async extractAsset(
    item: ContentItem,
    input: ImportInputSource,
    progressCb?: ProgressCallback
  ): Promise<ExtractedAsset> {
    const files = (input.files || [input.file!]).filter(
      (f) => f.name.toLowerCase().endsWith('.md') || f.name.toLowerCase().endsWith('.markdown')
    );

    const targetFile = files[item.ordinalPosition - 1] || files[0];
    const rawText = await targetFile.text();

    if (progressCb) {
      progressCb({
        stage: 'asset_extraction',
        stageLabel: 'Extracting Markdown File',
        completedUnits: item.ordinalPosition,
        totalUnits: files.length,
        progressPercent: Math.round((item.ordinalPosition / files.length) * 100),
        currentOperationLabel: `Read ${targetFile.name}`,
      });
    }

    return {
      itemId: item.itemId,
      mimeType: 'text/markdown',
      rawText,
    };
  }
}
