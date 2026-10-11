/**
 * @file src/core/import/providers/PdfDocumentProvider.ts
 * @description LocalFirst PDF Document Import Provider for RDI-1.
 * @license Apache-2.0
 *
 * Uses pdf.js (Mozilla's PDF renderer, the same engine Chrome uses to
 * display PDFs) for real text extraction. A prior version of this file
 * used a hand-rolled regex scraper that read raw bytes looking for
 * uncompressed `BT...ET` / `Tj` / `TJ` text operators — this silently
 * failed on the majority of real-world PDFs, whose content streams are
 * FlateDecode-compressed (virtually all PDFs exported from Word, Google
 * Docs, LaTeX, etc.). pdf.js decompresses and parses properly.
 */

import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
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

// Vite-compatible worker setup — see mozilla/pdf.js#19519 for why this
// specific `new URL(..., import.meta.url)` form (not a bare string, not a
// `?url` suffix) is what actually resolves correctly under Vite's bundler
// for pdfjs-dist v4+.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export class PdfDocumentProvider implements ImportProvider {
  readonly id: ImportProviderId = 'pdf-document';
  readonly name = 'PDF Document';
  readonly description = 'Extracts structured knowledge from PDF textbooks, papers, and slide decks.';
  readonly supportedExtensions = ['.pdf'];

  readonly capabilities: ProviderCapabilities = {
    supportsBatchImport: false,
    supportsCodeExtraction: true,
    supportsVideoCaptions: false,
    supportsHierarchicalStructure: true,
    requiresAuthentication: false,
    offlineCapable: true,
  };

  // Loading a PDF document is the expensive part of pdf.js; enumerateContent
  // and extractAsset are called separately (once per page) by the pipeline,
  // so this avoids re-parsing the whole file for every single page.
  private cachedFile: File | null = null;
  private cachedDoc: PDFDocumentProxy | null = null;

  private async loadDocument(file: File): Promise<PDFDocumentProxy> {
    if (this.cachedFile === file && this.cachedDoc) {
      return this.cachedDoc;
    }
    const arrayBuffer = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    this.cachedFile = file;
    this.cachedDoc = doc;
    return doc;
  }

  public async validateSource(input: ImportInputSource): Promise<ValidationResult> {
    if (!input.file) {
      return {
        isValid: false,
        errorCode: 'MISSING_FILE',
        errorMessage: 'No PDF file selected.',
        suggestedFix: 'Please upload a valid .pdf file.',
      };
    }

    if (!input.file.name.toLowerCase().endsWith('.pdf') && input.file.type !== 'application/pdf') {
      return {
        isValid: false,
        errorCode: 'INVALID_FORMAT',
        errorMessage: 'Selected file is not a valid PDF document.',
        suggestedFix: 'Select a file with a .pdf extension.',
      };
    }

    if (input.file.size === 0) {
      return {
        isValid: false,
        errorCode: 'EMPTY_FILE',
        errorMessage: 'Selected PDF file is empty (0 bytes).',
        suggestedFix: 'Provide a non-empty PDF file.',
      };
    }

    // Actually try to open it — a file can pass the checks above and still
    // not be a real/valid PDF (corrupted, password-protected, mislabeled).
    try {
      await this.loadDocument(input.file);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        errorCode: 'UNREADABLE_PDF',
        errorMessage: 'This file could not be parsed as a PDF (it may be corrupted or password-protected).',
        suggestedFix: 'Try a different file, or remove password protection first.',
      };
    }
  }

  public async extractMetadata(input: ImportInputSource, sha256: string): Promise<SourceMetadata> {
    const file = input.file!;
    const doc = await this.loadDocument(file);
    const pageCount = doc.numPages;
    const readingTime = Math.ceil(pageCount * 2.5);

    return {
      title: file.name.replace(/\.pdf$/i, ''),
      description: `PDF Document (${pageCount} page${pageCount > 1 ? 's' : ''}, ${(file.size / (1024 * 1024)).toFixed(2)} MB)`,
      totalItemsCount: pageCount,
      sha256Fingerprint: sha256,
      totalSizeBytes: file.size,
      estimatedContentLengthMinutes: readingTime,
      customProperties: {
        pageCount,
        mimeType: 'application/pdf',
      },
    };
  }

  public async enumerateContent(input: ImportInputSource): Promise<ContentItem[]> {
    const file = input.file!;
    const doc = await this.loadDocument(file);
    const pageCount = doc.numPages;
    const items: ContentItem[] = [];

    for (let i = 1; i <= pageCount; i++) {
      items.push({
        itemId: `pdf-page-${i}`,
        title: `${file.name} - Page ${i}`,
        ordinalPosition: i,
        contentType: 'pdf_page',
        sourceUri: `${file.name}#page=${i}`,
        estimatedReadingMinutes: 2,
        fileSize: Math.round(file.size / pageCount),
      });
    }

    return items;
  }

  public async extractAsset(
    item: ContentItem,
    input: ImportInputSource,
    progressCb?: ProgressCallback
  ): Promise<ExtractedAsset> {
    const file = input.file!;
    const pageNumber = item.ordinalPosition;

    if (progressCb) {
      progressCb({
        stage: 'asset_extraction',
        stageLabel: 'Extracting PDF Page',
        completedUnits: pageNumber,
        totalUnits: item.ordinalPosition,
        progressPercent: 100,
        currentOperationLabel: `Parsing page ${pageNumber} of ${file.name}`,
      });
    }

    const pageText = await this.extractTextFromPage(file, pageNumber);

    return {
      itemId: item.itemId,
      mimeType: 'text/plain',
      rawText: pageText,
    };
  }

  private async extractTextFromPage(file: File, pageNumber: number): Promise<string> {
    const doc = await this.loadDocument(file);
    const page = await doc.getPage(pageNumber);
    const textContent = await page.getTextContent();

    // Text items carry per-glyph-run position data (transform matrix) —
    // pdf.js doesn't reflow them into paragraphs for us, so this inserts a
    // line break whenever an item is explicitly flagged as ending a line
    // (hasEOL) and otherwise joins with spaces. This is a reasonable
    // approximation for feeding into downstream extraction/normalization,
    // not a full layout-reconstruction engine.
    let text = '';
    for (const rawItem of textContent.items) {
      const item = rawItem as { str: string; hasEOL?: boolean };
      text += item.str;
      text += item.hasEOL ? '\n' : ' ';
    }

    const trimmed = text.replace(/[ \t]+\n/g, '\n').trim();
    return trimmed.length > 0
      ? trimmed
      : `PDF Page ${pageNumber} of ${file.name} contained no extractable text (likely a scanned image page — OCR is not yet supported).`;
  }
}
