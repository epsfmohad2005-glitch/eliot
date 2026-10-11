/**
 * @file src/core/import/inspection/InspectionEngine.ts
 * @description Deterministic Inspection & Confidence Engine for Eliot RDI-1.5.
 * Analyzes ingested resource metadata, extracted assets, and content items
 * to produce structured confidence metrics, topics, health status, and diagnostics.
 * @license Apache-2.0
 */

import {
  ImportProviderId,
  SourceMetadata,
  ContentItem,
  ExtractedAsset,
  ImportSummaryData,
  ImportInputSource,
} from '../types';

import {
  InspectionReport,
  DetectedContentStats,
  KnowledgeEstimateStats,
  DetectedTopic,
  ConfidenceScore,
  SourceHealthStatus,
  DuplicateComparison,
  UnsupportedDiagnostic,
  HealthFactor,
} from './types';

// Pre-defined knowledge taxonomy for topic detection
const KNOWN_TOPIC_TAXONOMY: Array<{
  name: string;
  category: string;
  keywords: string[];
}> = [
  {
    name: 'Event Bus',
    category: 'Architecture',
    keywords: ['eventbus', 'event bus', 'pubsub', 'publisher', 'subscriber', 'dispatch', 'event driven'],
  },
  {
    name: 'DDD (Domain-Driven Design)',
    category: 'Architecture',
    keywords: ['domain', 'aggregate', 'bounded context', 'value object', 'entity', 'ubiquitous language', 'ddd'],
  },
  {
    name: 'Dependency Injection',
    category: 'Architecture',
    keywords: ['dependency injection', 'inversion of control', 'ioc', 'inject', 'singleton', 'transient'],
  },
  {
    name: 'TypeScript',
    category: 'Language',
    keywords: ['typescript', 'interface', 'generic', 'type alias', 'enum', 'union type', 'tsconfig'],
  },
  {
    name: 'Memory Management',
    category: 'System Design',
    keywords: ['memory', 'garbage collection', 'heap', 'stack', 'allocation', 'pointer', 'buffer', 'cache'],
  },
  {
    name: 'Algorithms',
    category: 'Core CS',
    keywords: ['algorithm', 'sorting', 'binary search', 'time complexity', 'big o', 'recursion', 'dynamic programming'],
  },
  {
    name: 'Networking',
    category: 'Infrastructure',
    keywords: ['http', 'tcp', 'socket', 'ip', 'rest api', 'payload', 'websocket', 'bandwidth', 'latency'],
  },
  {
    name: 'State Management',
    category: 'Frontend Architecture',
    keywords: ['state', 'store', 'reducer', 'action', 'context', 'immutability', 'reactive'],
  },
  {
    name: 'Error Handling',
    category: 'Software Craftsmanship',
    keywords: ['result pattern', 'monad', 'try catch', 'exception', 'error code', 'resilience', 'fallback'],
  },
  {
    name: 'Security & Auth',
    category: 'Security',
    keywords: ['sha256', 'cryptography', 'digest', 'oauth', 'jwt', 'encryption', 'token', 'access control'],
  },
];

export class InspectionEngine {
  /**
   * Generates a complete deterministic inspection report.
   */
  public async analyzeSource(
    providerId: ImportProviderId,
    metadata: SourceMetadata,
    items: ContentItem[],
    assets: ExtractedAsset[],
    inputSource: ImportInputSource,
    existingDuplicate: ImportSummaryData | null = null
  ): Promise<InspectionReport> {
    const contentStats = this.calculateContentStats(providerId, metadata, items, assets, inputSource);
    const knowledgeEstimates = this.calculateKnowledgeEstimates(metadata, items, assets);
    const detectedTopics = this.detectTopics(assets, items);
    const confidence = this.calculateConfidence(providerId, metadata, items, assets, contentStats);
    const sourceHealth = this.evaluateSourceHealth(confidence, contentStats, metadata);
    const duplicateComparison = this.buildDuplicateComparison(metadata, existingDuplicate);
    const unsupportedDiagnostic = this.checkUnsupportedSource(providerId, metadata, contentStats);

    return {
      inspectionId: `inspect-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sourceName: metadata.title || 'Untitled Source',
      providerId,
      timestamp: new Date().toISOString(),
      sha256Fingerprint: metadata.sha256Fingerprint,
      contentStats,
      knowledgeEstimates,
      detectedTopics,
      confidence,
      sourceHealth,
      duplicateComparison,
      unsupportedDiagnostic,
    };
  }

  private calculateContentStats(
    providerId: ImportProviderId,
    metadata: SourceMetadata,
    items: ContentItem[],
    assets: ExtractedAsset[],
    inputSource: ImportInputSource
  ): DetectedContentStats {
    let documentCount = 0;
    let pageCount = 0;
    let fileCount = 0;
    let folderCount = 0;

    if (inputSource.file) fileCount = 1;
    if (inputSource.files) fileCount = inputSource.files.length;

    // Estimate folders from file paths
    if (inputSource.files) {
      const folderPaths = new Set<string>();
      for (const file of inputSource.files) {
        const pathParts = (file.webkitRelativePath || file.name).split('/');
        if (pathParts.length > 1) {
          folderPaths.add(pathParts.slice(0, -1).join('/'));
        }
      }
      folderCount = folderPaths.size;
    }

    if (providerId === 'pdf-document') {
      documentCount = 1;
      pageCount = items.length;
    } else if (providerId === 'markdown-file' || providerId === 'plain-text') {
      documentCount = 1;
      pageCount = Math.max(1, Math.ceil(metadata.totalSizeBytes / 3000));
    } else if (providerId === 'markdown-folder' || providerId === 'zip-project' || providerId === 'local-folder') {
      documentCount = items.length;
      pageCount = Math.max(items.length, Math.ceil(metadata.totalSizeBytes / 3500));
    }

    // Combine all raw text and code snippets
    let allText = '';
    const detectedCodeLangs = new Set<string>();
    let tablesCount = 0;
    let linksCount = 0;
    let imagesCount = 0;
    let mediaAssetsCount = 0;

    for (const asset of assets) {
      if (asset.rawText) {
        allText += ' ' + asset.rawText;
        // Count markdown tables
        const tableMatches = asset.rawText.match(/\|[\s-:]+\|/g);
        if (tableMatches) tablesCount += tableMatches.length;

        // Count links
        const urlMatches = asset.rawText.match(/https?:\/\/[^\s)]+|\[.*?\]\(.*?\)/g);
        if (urlMatches) linksCount += urlMatches.length;

        // Count markdown images
        const imgMatches = asset.rawText.match(/!\[.*?\]\(.*?\)/g);
        if (imgMatches) imagesCount += imgMatches.length;
      }

      if (asset.codeSnippet) {
        detectedCodeLangs.add(asset.codeSnippet.language);
        if (asset.codeSnippet.filePath) {
          const ext = asset.codeSnippet.filePath.split('.').pop()?.toLowerCase();
          if (ext && ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'].includes(ext)) {
            imagesCount++;
          } else if (ext && ['mp4', 'mp3', 'wav', 'webm', 'ogg'].includes(ext)) {
            mediaAssetsCount++;
          }
        }
      }

      if (asset.attachments) {
        mediaAssetsCount += asset.attachments.length;
      }
    }

    // Language detection: check for Arabic characters
    const hasArabicChars = /[\u0600-\u06FF]/.test(allText);
    const hasLatinChars = /[a-zA-Z]/.test(allText);

    let primaryLanguage = 'English';
    if (hasArabicChars && hasLatinChars) {
      primaryLanguage = 'Bilingual (English / Arabic)';
    } else if (hasArabicChars) {
      primaryLanguage = 'Arabic (العربية)';
    }

    return {
      documentCount: Math.max(1, documentCount),
      pageCount: Math.max(1, pageCount),
      fileCount: Math.max(1, fileCount),
      folderCount,
      primaryLanguage,
      codeLanguages: Array.from(detectedCodeLangs),
      mediaAssetsCount,
      tablesCount,
      linksCount,
      imagesCount,
    };
  }

  private calculateKnowledgeEstimates(
    metadata: SourceMetadata,
    items: ContentItem[],
    assets: ExtractedAsset[]
  ): KnowledgeEstimateStats {
    let totalWordCount = 0;
    let headingCount = 0;
    let codeSnippetCount = 0;

    for (const asset of assets) {
      if (asset.rawText) {
        const words = asset.rawText.trim().split(/\s+/).filter(Boolean);
        totalWordCount += words.length;
        // Count section headings (# Heading or UPPERCASE headers)
        const headings = asset.rawText.match(/^#{1,6}\s+.+$|^[A-Z0-9\s_]{4,30}$/gm);
        if (headings) headingCount += headings.length;
      }
      if (asset.codeSnippet) {
        codeSnippetCount++;
      }
    }

    // Deterministic estimates based on content volume and density
    const estimatedConcepts = Math.max(2, Math.round(headingCount * 1.2 + codeSnippetCount * 1.5 + items.length));
    const estimatedSkills = Math.max(1, Math.round(codeSnippetCount * 0.8 + headingCount * 0.4));
    const estimatedPrerequisites = Math.max(1, Math.round(estimatedConcepts * 0.25));
    const estimatedLearningAssets = Math.max(items.length, Math.round(items.length + codeSnippetCount + headingCount * 0.5));

    const estimatedReadingTimeMinutes = Math.max(1, Math.ceil(totalWordCount / 200));
    const estimatedStudyTimeMinutes = Math.max(2, Math.ceil(estimatedReadingTimeMinutes * 2.5 + codeSnippetCount * 5));

    return {
      estimatedConcepts,
      estimatedSkills,
      estimatedPrerequisites,
      estimatedLearningAssets,
      estimatedReadingTimeMinutes,
      estimatedStudyTimeMinutes,
    };
  }

  private detectTopics(assets: ExtractedAsset[], items: ContentItem[]): DetectedTopic[] {
    let combinedText = '';
    for (const asset of assets) {
      if (asset.rawText) combinedText += ' ' + asset.rawText.toLowerCase();
      if (asset.codeSnippet) combinedText += ' ' + asset.codeSnippet.content.toLowerCase();
    }
    for (const item of items) {
      combinedText += ' ' + item.title.toLowerCase();
    }

    const detected: DetectedTopic[] = [];

    for (const topicDef of KNOWN_TOPIC_TAXONOMY) {
      let matches = 0;
      for (const kw of topicDef.keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        const count = (combinedText.match(regex) || []).length;
        matches += count;
      }

      if (matches > 0) {
        const relevanceScore = Math.min(99, Math.round(40 + matches * 8));
        detected.push({
          id: `topic-${topicDef.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: topicDef.name,
          category: topicDef.category,
          relevanceScore,
          occurrenceCount: matches,
        });
      }
    }

    // If no specific keywords matched, provide general structural topics based on item titles
    if (detected.length === 0) {
      const defaultTopics = ['Software Architecture', 'Domain Logic', 'System Engineering', 'Data Structures'];
      defaultTopics.forEach((name, idx) => {
        detected.push({
          id: `topic-default-${idx}`,
          name,
          category: 'General',
          relevanceScore: 75 - idx * 10,
          occurrenceCount: 1,
        });
      });
    }

    // Sort by relevance score descending
    return detected.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private calculateConfidence(
    providerId: ImportProviderId,
    metadata: SourceMetadata,
    items: ContentItem[],
    assets: ExtractedAsset[],
    stats: DetectedContentStats
  ): ConfidenceScore {
    let score = 95;
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Structural checks
    let totalHeadings = 0;
    let totalTextLen = 0;

    for (const asset of assets) {
      if (asset.rawText) {
        totalTextLen += asset.rawText.length;
        const h = asset.rawText.match(/^#{1,6}\s+.+/gm);
        if (h) totalHeadings += h.length;
      }
    }

    if (totalHeadings >= 3) {
      reasons.push('Structured headings and clear section boundaries detected');
      score += 3;
    } else {
      warnings.push('Sparse heading structure found in source document');
      score -= 10;
    }

    if (stats.codeLanguages.length > 0) {
      reasons.push(`Clean syntax formatting for ${stats.codeLanguages.join(', ')}`);
      score += 2;
    }

    if (items.length > 1) {
      reasons.push('Rich document hierarchy and multi-item breakdown');
    }

    if (totalTextLen > 500) {
      reasons.push('High semantic word density and text clarity');
    } else if (totalTextLen < 100) {
      warnings.push('Low overall text word count');
      score -= 15;
    }

    if (providerId === 'pdf-document' && totalTextLen < 150) {
      warnings.push('Possible scanned PDF or minimal selectable text layer');
      score -= 25;
    }

    if (metadata.totalSizeBytes === 0) {
      warnings.push('Empty file payload detected');
      score = 20;
    }

    const scorePercent = Math.max(10, Math.min(100, score));
    let level: 'high' | 'moderate' | 'low' = 'high';
    if (scorePercent < 60) level = 'low';
    else if (scorePercent < 85) level = 'moderate';

    return {
      scorePercent,
      level,
      reasons: reasons.length > 0 ? reasons : ['Valid resource format detected'],
      warnings,
    };
  }

  private evaluateSourceHealth(
    confidence: ConfidenceScore,
    stats: DetectedContentStats,
    metadata: SourceMetadata
  ): SourceHealthStatus {
    const factors: HealthFactor[] = [
      {
        factor: 'Structural Integrity',
        score: confidence.reasons.some((r) => r.includes('headings')) ? 95 : 65,
        status: confidence.reasons.some((r) => r.includes('headings')) ? 'pass' : 'warn',
        description: 'Hierarchical outline and section heading organization.',
      },
      {
        factor: 'Text Extraction Clarity',
        score: confidence.scorePercent,
        status: confidence.scorePercent >= 80 ? 'pass' : confidence.scorePercent >= 50 ? 'warn' : 'fail',
        description: 'Character encoding, plain-text completeness, and readability.',
      },
      {
        factor: 'Resource Size & Scale',
        score: metadata.totalSizeBytes > 0 ? 100 : 0,
        status: metadata.totalSizeBytes > 0 ? 'pass' : 'fail',
        description: 'Non-zero payload size and item count enumeration.',
      },
      {
        factor: 'Code & Media Formatting',
        score: stats.codeLanguages.length > 0 || stats.tablesCount > 0 ? 90 : 75,
        status: 'pass',
        description: 'Multi-lingual syntax and rich tabular layout detection.',
      },
    ];

    let state: SourceHealthStatus['state'] = 'Excellent';
    let explanation = 'Source resource exhibits pristine layout, high semantic density, and structured headings.';

    if (confidence.scorePercent >= 90) {
      state = 'Excellent';
      explanation = 'High structural integrity and clean text extraction. Ideal for Cognitive Knowledge Model conversion.';
    } else if (confidence.scorePercent >= 75) {
      state = 'Good';
      explanation = 'Well-structured source with minor formatting variations. Fully compatible with knowledge extraction.';
    } else if (confidence.scorePercent >= 55) {
      state = 'Fair';
      explanation = 'Moderate structural clarity. Some section boundaries or text formatting may require manual review.';
    } else if (confidence.scorePercent >= 30) {
      state = 'Poor';
      explanation = 'Low semantic confidence or sparse headings detected. Inspection recommended before committing.';
    } else {
      state = 'Unsupported';
      explanation = 'Unreadable file structure or corrupt binary content. Content cannot be accurately parsed.';
    }

    return {
      state,
      scorePercent: confidence.scorePercent,
      explanation,
      factors,
    };
  }

  private buildDuplicateComparison(
    metadata: SourceMetadata,
    existingDuplicate: ImportSummaryData | null
  ): DuplicateComparison | null {
    if (!existingDuplicate) return null;

    return {
      isDuplicate: true,
      existingSummary: existingDuplicate,
      currentSourceTitle: metadata.title,
      existingSourceTitle: existingDuplicate.sourceName,
      sha256Fingerprint: metadata.sha256Fingerprint,
      existingTimestamp: existingDuplicate.timestamp,
      existingChunksCount: existingDuplicate.generatedChunksCount,
      existingWordCount: existingDuplicate.totalWordCount,
    };
  }

  private checkUnsupportedSource(
    providerId: ImportProviderId,
    metadata: SourceMetadata,
    stats: DetectedContentStats
  ): UnsupportedDiagnostic | null {
    if (metadata.totalSizeBytes === 0) {
      return {
        isSupported: false,
        reasonWhy: 'The selected resource file contains zero bytes of data.',
        missingInformation: 'File content payload is empty or unreadable.',
        suggestedAlternatives: [
          'Verify that the file was completely downloaded to your device.',
          'Re-export or re-save the document before importing.',
          'Try uploading an alternative format such as Markdown or plain text.',
        ],
      };
    }

    return null;
  }
}

export const inspectionEngine = new InspectionEngine();
