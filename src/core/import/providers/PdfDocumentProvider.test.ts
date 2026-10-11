/**
 * @file src/core/import/providers/PdfDocumentProvider.test.ts
 * @description Unit tests for PdfDocumentProvider.
 * @license Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { PdfDocumentProvider } from './PdfDocumentProvider';

describe('PdfDocumentProvider Unit Tests', () => {
  const provider = new PdfDocumentProvider();

  it('should expose canonical metadata and capabilities', () => {
    expect(provider.id).toBe('pdf-document');
    expect(provider.name).toBe('PDF Document');
    expect(provider.supportedExtensions).toContain('.pdf');
    expect(provider.capabilities.offlineCapable).toBe(true);
    expect(provider.capabilities.supportsHierarchicalStructure).toBe(true);
  });

  it('should reject validation when input file is missing', async () => {
    const result = await provider.validateSource({ providerId: 'pdf-document' });
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('MISSING_FILE');
  });

  it('should reject non-PDF file extension and MIME type', async () => {
    const file = new File(['hello text content'], 'notes.txt', { type: 'text/plain' });
    const result = await provider.validateSource({ providerId: 'pdf-document', file });
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('INVALID_FORMAT');
  });

  it('should reject empty PDF files (0 bytes)', async () => {
    const file = new File([], 'empty.pdf', { type: 'application/pdf' });
    const result = await provider.validateSource({ providerId: 'pdf-document', file });
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('EMPTY_FILE');
  });

  it('should reject corrupted / unreadable PDF files', async () => {
    const file = new File(['not a real pdf binary stream'], 'corrupted.pdf', { type: 'application/pdf' });
    const result = await provider.validateSource({ providerId: 'pdf-document', file });
    expect(result.isValid).toBe(false);
    expect(result.errorCode).toBe('UNREADABLE_PDF');
  });
});
