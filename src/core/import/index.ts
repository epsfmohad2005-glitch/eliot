/**
 * @file src/core/import/index.ts
 * @description RDI-1 Import Engine Entry Point & Provider Initialization.
 * @license Apache-2.0
 */

import { ImportProviderRegistry } from './providers/ImportProviderRegistry';
import { PdfDocumentProvider } from './providers/PdfDocumentProvider';
import { MarkdownFileProvider } from './providers/MarkdownFileProvider';
import { MarkdownFolderProvider } from './providers/MarkdownFolderProvider';
import { PlainTextFileProvider } from './providers/PlainTextFileProvider';
import { ZipProjectProvider } from './providers/ZipProjectProvider';
import { LocalFolderProvider } from './providers/LocalFolderProvider';

export * from './types';
export * from './inspection/types';
export * from './inspection/InspectionEngine';
export * from './extraction/types';
export * from './extraction/DeterministicExtractionEngine';
export * from './commit/types';
export * from './commit/CommitValidationPipeline';
export * from './commit/KnowledgeLedger';
export * from './commit/KnowledgeCommitEngine';
export * from './pipeline/CryptoUtils';
export * from './pipeline/NormalizationEngine';
export * from './pipeline/ImportCheckpointManager';
export * from './pipeline/ImportPipelineEngine';
export * from './providers/ImportProviderRegistry';

export function initializeImportSubsystem(): void {
  ImportProviderRegistry.registerProvider(new PdfDocumentProvider());
  ImportProviderRegistry.registerProvider(new MarkdownFileProvider());
  ImportProviderRegistry.registerProvider(new MarkdownFolderProvider());
  ImportProviderRegistry.registerProvider(new PlainTextFileProvider());
  ImportProviderRegistry.registerProvider(new ZipProjectProvider());
  ImportProviderRegistry.registerProvider(new LocalFolderProvider());
}

// Auto-initialize providers upon module load
initializeImportSubsystem();
