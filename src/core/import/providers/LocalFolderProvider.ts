/**
 * @file src/core/import/providers/LocalFolderProvider.ts
 * @description Local Directory Folder Import Provider for RDI-1.
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

export class LocalFolderProvider implements ImportProvider {
  readonly id: ImportProviderId = 'local-folder';
  readonly name = 'Local Directory Folder';
  readonly description = 'Scans and ingests local directory trees using the browser File System Access API or directory upload.';
  readonly supportedExtensions = ['*'];

  readonly capabilities: ProviderCapabilities = {
    supportsBatchImport: true,
    supportsCodeExtraction: true,
    supportsVideoCaptions: false,
    supportsHierarchicalStructure: true,
    requiresAuthentication: false,
    offlineCapable: true,
  };

  public async validateSource(input: ImportInputSource): Promise<ValidationResult> {
    if (!input.folderHandle && (!input.files || input.files.length === 0)) {
      return {
        isValid: false,
        errorCode: 'MISSING_FOLDER',
        errorMessage: 'No local folder or files provided.',
        suggestedFix: 'Select a directory or folder containing source files.',
      };
    }

    return { isValid: true };
  }

  public async extractMetadata(input: ImportInputSource, sha256: string): Promise<SourceMetadata> {
    const files = input.files || [];
    const folderName = input.folderHandle?.name || files[0]?.webkitRelativePath?.split('/')[0] || 'Local Directory';

    let totalSizeBytes = 0;
    files.forEach((f) => (totalSizeBytes += f.size));

    return {
      title: folderName,
      description: `Local Directory (${files.length} items, ${(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB)`,
      totalItemsCount: files.length || 1,
      sha256Fingerprint: sha256,
      totalSizeBytes,
      estimatedContentLengthMinutes: Math.ceil(files.length * 2),
    };
  }

  public async enumerateContent(input: ImportInputSource): Promise<ContentItem[]> {
    const files = input.files || [];

    return files.map((file, idx) => {
      const path = file.webkitRelativePath || file.name;
      const isMd = path.endsWith('.md') || path.endsWith('.markdown');
      return {
        itemId: `folder-item-${idx + 1}`,
        title: path,
        ordinalPosition: idx + 1,
        contentType: isMd ? 'markdown' : 'code',
        sourceUri: path,
        fileSize: file.size,
        estimatedReadingMinutes: Math.max(1, Math.ceil(file.size / 1000)),
      };
    });
  }

  public async extractAsset(
    item: ContentItem,
    input: ImportInputSource,
    progressCb?: ProgressCallback
  ): Promise<ExtractedAsset> {
    const files = input.files || [];
    const targetFile = files[item.ordinalPosition - 1] || files[0];

    if (progressCb) {
      progressCb({
        stage: 'asset_extraction',
        stageLabel: 'Extracting Directory Item',
        completedUnits: item.ordinalPosition,
        totalUnits: files.length,
        progressPercent: Math.round((item.ordinalPosition / files.length) * 100),
        currentOperationLabel: `Reading ${item.title}`,
      });
    }

    const text = targetFile ? await targetFile.text() : '';

    if (item.contentType === 'markdown') {
      return {
        itemId: item.itemId,
        mimeType: 'text/markdown',
        rawText: text,
      };
    }

    return {
      itemId: item.itemId,
      mimeType: 'text/plain',
      codeSnippet: {
        language: item.title.split('.').pop() || 'text',
        content: text,
        filePath: item.title,
      },
    };
  }
}
