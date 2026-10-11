/**
 * @file src/core/import/providers/ZipProjectProvider.ts
 * @description ZIP Project Archive Import Provider for RDI-1 using JSZip.
 * @license Apache-2.0
 */

import JSZip from 'jszip';
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

export class ZipProjectProvider implements ImportProvider {
  readonly id: ImportProviderId = 'zip-project';
  readonly name = 'ZIP Project Archive';
  readonly description = 'Imports code projects, repositories, and bundled learning resources from .zip files.';
  readonly supportedExtensions = ['.zip'];

  readonly capabilities: ProviderCapabilities = {
    supportsBatchImport: true,
    supportsCodeExtraction: true,
    supportsVideoCaptions: false,
    supportsHierarchicalStructure: true,
    requiresAuthentication: false,
    offlineCapable: true,
  };

  private isTextOrCodeFile(fileName: string): boolean {
    const ext = fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
    const textExts = [
      'ts', 'tsx', 'js', 'jsx', 'py', 'rs', 'go', 'java', 'cpp', 'c', 'h',
      'html', 'css', 'scss', 'json', 'yaml', 'yml', 'md', 'markdown', 'txt',
      'toml', 'xml', 'sh', 'bash', 'sql', 'dockerfile', 'env'
    ];
    // Ignore node_modules, .git, dist, build, binary assets
    if (fileName.includes('node_modules/') || fileName.includes('.git/') || fileName.includes('dist/') || fileName.includes('build/')) {
      return false;
    }
    return textExts.includes(ext) || fileName.toLowerCase().endsWith('readme');
  }

  public async validateSource(input: ImportInputSource): Promise<ValidationResult> {
    if (!input.file) {
      return {
        isValid: false,
        errorCode: 'MISSING_FILE',
        errorMessage: 'No ZIP file selected.',
        suggestedFix: 'Select a valid .zip archive.',
      };
    }

    if (!input.file.name.toLowerCase().endsWith('.zip')) {
      return {
        isValid: false,
        errorCode: 'INVALID_EXTENSION',
        errorMessage: 'Selected file is not a ZIP archive.',
        suggestedFix: 'Select a file with a .zip extension.',
      };
    }

    return { isValid: true };
  }

  public async extractMetadata(input: ImportInputSource, sha256: string): Promise<SourceMetadata> {
    const file = input.file!;
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    let validFilesCount = 0;
    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && this.isTextOrCodeFile(relativePath)) {
        validFilesCount++;
      }
    });

    return {
      title: file.name.replace(/\.zip$/i, ''),
      description: `ZIP Project Archive (${validFilesCount} readable source files, ${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      totalItemsCount: validFilesCount,
      sha256Fingerprint: sha256,
      totalSizeBytes: file.size,
      estimatedContentLengthMinutes: Math.ceil(validFilesCount * 2),
    };
  }

  public async enumerateContent(input: ImportInputSource): Promise<ContentItem[]> {
    const file = input.file!;
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const items: ContentItem[] = [];
    let ordinal = 1;

    const fileEntries: { path: string; entry: JSZip.JSZipObject }[] = [];
    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && this.isTextOrCodeFile(relativePath)) {
        fileEntries.push({ path: relativePath, entry: zipEntry });
      }
    });

    // Sort entries so README / docs come first
    fileEntries.sort((a, b) => {
      const aIsDoc = a.path.toLowerCase().includes('readme') || a.path.toLowerCase().endsWith('.md');
      const bIsDoc = b.path.toLowerCase().includes('readme') || b.path.toLowerCase().endsWith('.md');
      if (aIsDoc && !bIsDoc) return -1;
      if (!aIsDoc && bIsDoc) return 1;
      return a.path.localeCompare(b.path);
    });

    for (const item of fileEntries) {
      const isMd = item.path.toLowerCase().endsWith('.md');
      items.push({
        itemId: `zip-file-${ordinal}`,
        title: item.path,
        ordinalPosition: ordinal,
        contentType: isMd ? 'markdown' : 'code',
        sourceUri: `${file.name}::${item.path}`,
        fileSize: 1024,
        estimatedReadingMinutes: 2,
      });
      ordinal++;
    }

    return items;
  }

  public async extractAsset(
    item: ContentItem,
    input: ImportInputSource,
    progressCb?: ProgressCallback
  ): Promise<ExtractedAsset> {
    const file = input.file!;
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const relativePath = item.title;
    const zipEntry = zip.file(relativePath);

    if (progressCb) {
      progressCb({
        stage: 'asset_extraction',
        stageLabel: 'Extracting ZIP File',
        completedUnits: item.ordinalPosition,
        totalUnits: item.ordinalPosition,
        progressPercent: 100,
        currentOperationLabel: `Decompressing ${relativePath}`,
      });
    }

    if (!zipEntry) {
      return {
        itemId: item.itemId,
        mimeType: 'text/plain',
        rawText: `// File ${relativePath} not found in ZIP container`,
      };
    }

    const content = await zipEntry.async('text');
    const ext = relativePath.slice(((relativePath.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();

    if (item.contentType === 'markdown') {
      return {
        itemId: item.itemId,
        mimeType: 'text/markdown',
        rawText: content,
      };
    }

    return {
      itemId: item.itemId,
      mimeType: 'text/plain',
      codeSnippet: {
        language: ext || 'text',
        content,
        filePath: relativePath,
      },
    };
  }
}
