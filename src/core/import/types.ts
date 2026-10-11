/**
 * @file src/core/import/types.ts
 * @description Core Type Definitions for Eliot RDI-1 Import Engine Subsystem.
 * @license Apache-2.0
 */

export type ImportProviderId =
  | 'pdf-document'
  | 'markdown-file'
  | 'markdown-folder'
  | 'plain-text'
  | 'zip-project'
  | 'local-folder';

export interface ProviderCapabilities {
  supportsBatchImport: boolean;
  supportsCodeExtraction: boolean;
  supportsVideoCaptions: boolean;
  supportsHierarchicalStructure: boolean;
  requiresAuthentication: boolean;
  offlineCapable: boolean;
}

export interface ImportInputSource {
  providerId: ImportProviderId;
  file?: File;
  files?: File[];
  folderHandle?: FileSystemDirectoryHandle;
  customPayload?: Record<string, unknown>;
}

export interface ValidationResult {
  isValid: boolean;
  errorCode?: string;
  errorMessage?: string;
  suggestedFix?: string;
}

export interface SourceMetadata {
  title: string;
  description: string;
  authorOrChannel?: string;
  sourceUrl?: string;
  estimatedContentLengthMinutes?: number;
  totalItemsCount: number;
  sha256Fingerprint: string;
  totalSizeBytes: number;
  customProperties?: Record<string, unknown>;
}

export interface ContentItem {
  itemId: string;
  parentItemId?: string;
  title: string;
  ordinalPosition: number;
  contentType: 'text' | 'code' | 'markdown' | 'pdf_page';
  sourceUri: string;
  estimatedReadingMinutes?: number;
  fileSize: number;
}

export interface ExtractedAsset {
  itemId: string;
  mimeType: string;
  rawText?: string;
  codeSnippet?: {
    language: string;
    content: string;
    filePath?: string;
  };
  attachments?: Array<{
    fileName: string;
    mimeType: string;
    data: Uint8Array;
  }>;
}

export interface NormalizedChunk {
  chunkId: string;
  itemId: string;
  ordinal: number;
  title: string;
  content: string;
  wordCount: number;
  contentType: 'text' | 'code' | 'markdown' | 'pdf_page';
  headings: string[];
}

export type PipelineStage =
  | 'source_selection'
  | 'validation'
  | 'fingerprinting'
  | 'metadata_extraction'
  | 'content_enumeration'
  | 'asset_extraction'
  | 'normalization'
  | 'chunk_creation'
  | 'checkpoint_save'
  | 'completed';

export interface ProgressReport {
  stage: PipelineStage;
  stageLabel: string;
  completedUnits: number;
  totalUnits: number;
  progressPercent: number;
  currentOperationLabel: string;
}

export type ProgressCallback = (report: ProgressReport) => void;

export interface ImportCheckpoint {
  importId: string;
  sha256Digest: string;
  sourceName: string;
  providerId: ImportProviderId;
  currentStage: PipelineStage;
  stageProgressPercent: number;
  totalItems: number;
  extractedCount: number;
  metadata: SourceMetadata | null;
  items: ContentItem[];
  assets: ExtractedAsset[];
  chunks: NormalizedChunk[];
  timestamp: string;
}

export type DuplicateAction = 'skip' | 'replace' | 'separate';

export interface ImportSummaryData {
  importId: string;
  sourceName: string;
  providerId: ImportProviderId;
  importedAssetsCount: number;
  generatedChunksCount: number;
  totalWordCount: number;
  processingTimeMs: number;
  sha256Digest: string;
  storageLocation: string;
  readyStatus: boolean;
  timestamp: string;
}

export interface ImportProvider {
  readonly id: ImportProviderId;
  readonly name: string;
  readonly description: string;
  readonly supportedExtensions: readonly string[];
  readonly capabilities: ProviderCapabilities;

  validateSource(input: ImportInputSource): Promise<ValidationResult>;
  extractMetadata(input: ImportInputSource, sha256: string): Promise<SourceMetadata>;
  enumerateContent(input: ImportInputSource): Promise<ContentItem[]>;
  extractAsset(item: ContentItem, input: ImportInputSource, progressCb?: ProgressCallback): Promise<ExtractedAsset>;
}
