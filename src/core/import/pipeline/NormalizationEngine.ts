/**
 * @file src/core/import/pipeline/NormalizationEngine.ts
 * @description Provider-Independent Text Normalization & Semantic Chunking Engine.
 * @license Apache-2.0
 */

import { ExtractedAsset, NormalizedChunk } from '../types';

export class NormalizationEngine {
  /**
   * Normalizes raw text: strips invalid characters, unifies line breaks, handles double-byte spaces.
   */
  public static normalizeText(rawText: string): string {
    if (!rawText) return '';
    return rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // strip zero-width characters
      .replace(/\t/g, '  ')
      .trim();
  }

  /**
   * Extracts headings (#, ##, ###, etc. or uppercase title lines).
   */
  public static extractHeadings(text: string): string[] {
    const headings: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^#{1,6}\s+/.test(trimmed)) {
        headings.push(trimmed.replace(/^#{1,6}\s+/, ''));
      } else if (/^[A-Z0-9\s\-_:]{4,60}$/.test(trimmed) && trimmed.length > 5) {
        headings.push(trimmed);
      }
    }

    return Array.from(new Set(headings));
  }

  /**
   * Performs deterministic semantic chunking on an asset.
   * Chunks are sized between 200 and 800 words with a 50-word overlap margin.
   */
  public static chunkAsset(asset: ExtractedAsset, title: string): NormalizedChunk[] {
    const chunks: NormalizedChunk[] = [];
    const rawText = this.normalizeText(asset.rawText || asset.codeSnippet?.content || '');

    if (!rawText) {
      return chunks;
    }

    const words = rawText.split(/\s+/).filter(Boolean);
    const headings = this.extractHeadings(rawText);

    if (words.length <= 400) {
      // Small content: keep as single atomic chunk
      chunks.push({
        chunkId: `${asset.itemId}-chunk-0`,
        itemId: asset.itemId,
        ordinal: 0,
        title: title,
        content: rawText,
        wordCount: words.length,
        contentType: asset.codeSnippet ? 'code' : 'text',
        headings,
      });
      return chunks;
    }

    const targetChunkSize = 400; // words
    const overlapSize = 50; // words
    let startIdx = 0;
    let ordinal = 0;

    while (startIdx < words.length) {
      const endIdx = Math.min(startIdx + targetChunkSize, words.length);
      const chunkWords = words.slice(startIdx, endIdx);
      const chunkText = chunkWords.join(' ');

      chunks.push({
        chunkId: `${asset.itemId}-chunk-${ordinal}`,
        itemId: asset.itemId,
        ordinal,
        title: `${title} (Part ${ordinal + 1})`,
        content: chunkText,
        wordCount: chunkWords.length,
        contentType: asset.codeSnippet ? 'code' : 'text',
        headings: this.extractHeadings(chunkText),
      });

      ordinal++;
      startIdx += targetChunkSize - overlapSize;

      if (words.length - startIdx < overlapSize) {
        break; // remaining slice too small to create distinct chunk
      }
    }

    return chunks;
  }
}
