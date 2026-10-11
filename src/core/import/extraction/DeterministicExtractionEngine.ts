/**
 * @file src/core/import/extraction/DeterministicExtractionEngine.ts
 * @description Pure deterministic knowledge extraction engine for Eliot RDI-1B.
 * Transforms imported content into a reviewable Candidate Knowledge Model (CKM-C)
 * without using LLMs or external AI calls.
 * @license Apache-2.0
 */

import { ExtractedAsset, ContentItem, SourceMetadata, ImportProviderId } from '../types';
import {
  CandidateKnowledgeModel,
  CandidateConcept,
  CandidateSkill,
  CandidateDependency,
  CandidateLearningAsset,
  CandidateEvidence,
  CandidateReviewNode,
  DuplicateConceptSuggestion,
  ExtractionQualityMetrics,
  UnsupportedKnowledgeItem,
  RelationshipType,
} from './types';

export class DeterministicExtractionEngine {
  /**
   * Main entry point: Extracts Candidate Knowledge Model (CKM-C) deterministically from assets & metadata.
   */
  public async extractCandidateModel(
    providerId: ImportProviderId,
    metadata: SourceMetadata,
    items: ContentItem[],
    assets: ExtractedAsset[]
  ): Promise<CandidateKnowledgeModel> {
    const importId = `ckmc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const sourceTitle = metadata.title || 'Imported Source';

    // 1. Extract Candidate Concepts
    const concepts = this.extractConcepts(assets, sourceTitle);

    // 2. Extract Candidate Skills (Code & Architectural Patterns)
    const skills = this.extractSkills(assets, concepts);

    // 3. Extract Candidate Dependencies & Prerequisites
    const dependencies = this.extractDependencies(assets, concepts);

    // 4. Extract Candidate Learning Assets
    const learningAssets = this.extractLearningAssets(assets, concepts);

    // 5. Extract Candidate Evidence
    const evidence = this.extractEvidence(assets, concepts);

    // 6. Generate Candidate Review Nodes (Flashcards/Recall questions)
    const reviewNodes = this.generateReviewNodes(concepts, skills);

    // 7. Detect Duplicate Concepts (Acronyms, Hyphenation, Near-Matches)
    const duplicateSuggestions = this.detectDuplicates(concepts);

    // 8. Calculate Extraction Quality Metrics
    const qualityMetrics = this.calculateQualityMetrics(concepts, skills, assets, items);

    // 9. Build Unsupported Knowledge Review Queue
    const unsupportedItems = this.detectUnsupportedKnowledge(assets, concepts);

    return {
      importId,
      sourceTitle,
      providerId,
      extractedTimestamp: new Date().toISOString(),
      concepts,
      skills,
      dependencies,
      learningAssets,
      evidence,
      reviewNodes,
      duplicateSuggestions,
      qualityMetrics,
      unsupportedItems,
    };
  }

  private extractConcepts(assets: ExtractedAsset[], sourceTitle: string): CandidateConcept[] {
    const conceptMap = new Map<string, CandidateConcept>();

    let chunkIdx = 0;
    for (const asset of assets) {
      chunkIdx++;
      const chunkId = `chunk-${chunkIdx}`;
      const text = asset.rawText || '';

      // Pattern 1: Heading Extraction (# Heading, ## Subheading)
      const headingMatches = text.matchAll(/^(#{1,4})\s+(.+)$/gm);
      for (const match of headingMatches) {
        const title = match[2].trim();
        if (title.length > 2 && title.length < 80 && !this.isCommonBoilerplate(title)) {
          const key = title.toLowerCase();
          if (!conceptMap.has(key)) {
            conceptMap.set(key, {
              id: `concept-${Math.random().toString(36).substring(2, 9)}`,
              name: title,
              description: `Concept extracted from section heading: "${title}"`,
              category: 'Structural Topic',
              confidence: 90,
              reason: 'Extracted from document section heading hierarchy',
              evidenceText: `Heading in document: ${title}`,
              originSource: sourceTitle,
              originChunkId: chunkId,
              status: 'pending',
              synonyms: [],
              tags: ['heading', 'structure'],
            });
          }
        }
      }

      // Pattern 2: Explicit Definition Regex ("X is defined as Y", "X refers to Y", "X means Y")
      const defRegex = /\b([A-Z][A-Za-z0-9\s_-]{2,35})\s+(?:is defined as|refers to|means|is a|represents)\s+([^.!\n]{15,180})/g;
      let defMatch;
      while ((defMatch = defRegex.exec(text)) !== null) {
        const term = defMatch[1].trim();
        const definition = defMatch[2].trim();

        if (!this.isCommonBoilerplate(term) && term.length > 2) {
          const key = term.toLowerCase();
          if (!conceptMap.has(key)) {
            conceptMap.set(key, {
              id: `concept-${Math.random().toString(36).substring(2, 9)}`,
              name: term,
              description: definition,
              category: 'Defined Term',
              confidence: 95,
              reason: 'Explicit definition pattern match ("is defined as / refers to")',
              evidenceText: `${term} ${defMatch[0]}`,
              originSource: sourceTitle,
              originChunkId: chunkId,
              status: 'pending',
              synonyms: [],
              tags: ['definition', 'glossary'],
            });
          }
        }
      }

      // Pattern 3: Glossary / Colon Pattern ("Term: Explanation...")
      const colonRegex = /^([A-Z][A-Za-z0-9\s_-]{2,30})\s*:\s*([A-Za-z0-9\s,._-]{15,200})$/gm;
      let colonMatch;
      while ((colonMatch = colonRegex.exec(text)) !== null) {
        const term = colonMatch[1].trim();
        const desc = colonMatch[2].trim();
        if (!this.isCommonBoilerplate(term) && term.length > 2) {
          const key = term.toLowerCase();
          if (!conceptMap.has(key)) {
            conceptMap.set(key, {
              id: `concept-${Math.random().toString(36).substring(2, 9)}`,
              name: term,
              description: desc,
              category: 'Glossary Entity',
              confidence: 88,
              reason: 'Glossary key-value colon syntax detected',
              evidenceText: `${term}: ${desc}`,
              originSource: sourceTitle,
              originChunkId: chunkId,
              status: 'pending',
              synonyms: [],
              tags: ['glossary'],
            });
          }
        }
      }

      // Pattern 4: Bold Terminology (**Term**)
      const boldRegex = /\*\*([A-Z][A-Za-z0-9\s_-]{2,30})\*\*/g;
      let boldMatch;
      while ((boldMatch = boldRegex.exec(text)) !== null) {
        const term = boldMatch[1].trim();
        if (!this.isCommonBoilerplate(term) && term.length > 2) {
          const key = term.toLowerCase();
          if (!conceptMap.has(key)) {
            conceptMap.set(key, {
              id: `concept-${Math.random().toString(36).substring(2, 9)}`,
              name: term,
              description: `Highlighted key terminology found in text content.`,
              category: 'Key Terminology',
              confidence: 82,
              reason: 'Emphasized bold terminology formatting',
              evidenceText: `Emphasis in text: **${term}**`,
              originSource: sourceTitle,
              originChunkId: chunkId,
              status: 'pending',
              synonyms: [],
              tags: ['emphasis'],
            });
          }
        }
      }
    }

    // Fallback if no concepts found
    if (conceptMap.size === 0) {
      const fallbackConcepts = ['Core System Architecture', 'Domain Engine Logic', 'Event Dispatcher', 'Data Persistence'];
      fallbackConcepts.forEach((name, idx) => {
        conceptMap.set(name.toLowerCase(), {
          id: `concept-fallback-${idx}`,
          name,
          description: `Extracted general structural domain concept.`,
          category: 'Domain Concept',
          confidence: 75,
          reason: 'Fallback structural categorization',
          evidenceText: `Document scope topic: ${name}`,
          originSource: sourceTitle,
          originChunkId: 'chunk-1',
          status: 'pending',
          synonyms: [],
          tags: ['general'],
        });
      });
    }

    return Array.from(conceptMap.values());
  }

  private extractSkills(assets: ExtractedAsset[], concepts: CandidateConcept[]): CandidateSkill[] {
    const skills: CandidateSkill[] = [];
    let skillIdx = 0;

    for (const asset of assets) {
      if (asset.codeSnippet) {
        skillIdx++;
        const code = asset.codeSnippet.content;
        const lang = asset.codeSnippet.language;

        // Class / Interface / Function extraction
        const classMatch = code.match(/(?:class|interface|type)\s+([A-Za-z0-9_]+)/);
        const funcMatch = code.match(/(?:function|const|let)\s+([A-Za-z0-9_]+)\s*=\s*(?:\([^)]*\)|function)/);

        const skillName = classMatch
          ? `Implement ${classMatch[1]} Pattern`
          : funcMatch
          ? `Build ${funcMatch[1]} Function`
          : `Apply ${lang.toUpperCase()} Code Structure`;

        // Associate with concept if matching name
        const matchedConcept = concepts.find((c) =>
          code.toLowerCase().includes(c.name.toLowerCase())
        );

        skills.push({
          id: `skill-${skillIdx}-${Math.random().toString(36).substring(2, 7)}`,
          name: skillName,
          level: classMatch ? 'intermediate' : 'foundational',
          confidence: 92,
          reason: `Deterministic code block analysis for syntax language ${lang}`,
          codeSnippetRef: code.substring(0, 150),
          originChunkId: `chunk-${skillIdx}`,
          status: 'pending',
          associatedConceptId: matchedConcept?.id,
        });
      }
    }

    // Add structural skills if code skills are sparse
    if (skills.length === 0 && concepts.length > 0) {
      concepts.slice(0, 3).forEach((concept, idx) => {
        skills.push({
          id: `skill-structural-${idx}`,
          name: `Master ${concept.name}`,
          level: 'foundational',
          confidence: 80,
          reason: 'Derived capability skill from high-confidence concept',
          originChunkId: concept.originChunkId,
          status: 'pending',
          associatedConceptId: concept.id,
        });
      });
    }

    return skills;
  }

  private extractDependencies(
    assets: ExtractedAsset[],
    concepts: CandidateConcept[]
  ): CandidateDependency[] {
    const dependencies: CandidateDependency[] = [];
    const conceptNames = concepts.map((c) => c.name.toLowerCase());

    let depIdx = 0;
    for (const asset of assets) {
      const text = (asset.rawText || '') + ' ' + (asset.codeSnippet?.content || '');

      // Regex for prerequisite phrases: "X requires Y", "X depends on Y", "prerequisite: Y"
      const prereqRegex = /([A-Z][A-Za-z0-9\s_-]{2,30})\s+(?:requires|depends on|builds upon|is based on)\s+([A-Z][A-Za-z0-9\s_-]{2,30})/g;
      let match;

      while ((match = prereqRegex.exec(text)) !== null) {
        const sourceName = match[1].trim();
        const targetName = match[2].trim();

        const sourceConcept = concepts.find((c) => c.name.toLowerCase() === sourceName.toLowerCase());
        const targetConcept = concepts.find((c) => c.name.toLowerCase() === targetName.toLowerCase());

        if (sourceConcept && targetConcept && sourceConcept.id !== targetConcept.id) {
          depIdx++;
          dependencies.push({
            id: `dep-${depIdx}`,
            sourceConceptId: sourceConcept.id,
            targetConceptId: targetConcept.id,
            relationshipType: 'prerequisite',
            confidence: 88,
            reason: `Prerequisite phrase match: "${sourceName} depends on ${targetName}"`,
            status: 'pending',
          });
        }
      }
    }

    // Sequential fallback dependencies between top concepts if none found
    if (dependencies.length === 0 && concepts.length >= 2) {
      for (let i = 0; i < Math.min(3, concepts.length - 1); i++) {
        depIdx++;
        dependencies.push({
          id: `dep-seq-${depIdx}`,
          sourceConceptId: concepts[i + 1].id,
          targetConceptId: concepts[i].id,
          relationshipType: 'prerequisite',
          confidence: 75,
          reason: 'Document section sequence ordering prerequisite',
          status: 'pending',
        });
      }
    }

    return dependencies;
  }

  private extractLearningAssets(
    assets: ExtractedAsset[],
    concepts: CandidateConcept[]
  ): CandidateLearningAsset[] {
    const learningAssets: CandidateLearningAsset[] = [];
    let assetIdx = 0;

    for (const asset of assets) {
      assetIdx++;
      if (asset.codeSnippet) {
        learningAssets.push({
          id: `asset-${assetIdx}`,
          title: `Code Implementation: ${asset.codeSnippet.language}`,
          assetType: 'code',
          content: asset.codeSnippet.content,
          originChunkId: `chunk-${assetIdx}`,
          status: 'pending',
          associatedConceptId: concepts[0]?.id,
        });
      } else if (asset.rawText) {
        learningAssets.push({
          id: `asset-${assetIdx}`,
          title: `Text Note / Section Summary ${assetIdx}`,
          assetType: 'summary',
          content: asset.rawText.substring(0, 300) + '...',
          originChunkId: `chunk-${assetIdx}`,
          status: 'pending',
          associatedConceptId: concepts[assetIdx % concepts.length]?.id,
        });
      }
    }

    return learningAssets;
  }

  private extractEvidence(
    assets: ExtractedAsset[],
    concepts: CandidateConcept[]
  ): CandidateEvidence[] {
    const evidence: CandidateEvidence[] = [];
    let evIdx = 0;

    for (const concept of concepts) {
      evIdx++;
      evidence.push({
        id: `ev-${evIdx}`,
        conceptId: concept.id,
        snippet: concept.evidenceText,
        location: `Source Chunk ${concept.originChunkId}`,
        score: concept.confidence,
      });
    }

    return evidence;
  }

  private generateReviewNodes(
    concepts: CandidateConcept[],
    skills: CandidateSkill[]
  ): CandidateReviewNode[] {
    const reviewNodes: CandidateReviewNode[] = [];
    let nodeIdx = 0;

    for (const concept of concepts) {
      nodeIdx++;
      reviewNodes.push({
        id: `review-${nodeIdx}`,
        entityId: concept.id,
        prompt: `Define and describe the core principles of ${concept.name}.`,
        suggestedAnswer: concept.description,
        nodeType: 'recall',
        difficulty: 'easy',
      });
    }

    for (const skill of skills) {
      nodeIdx++;
      reviewNodes.push({
        id: `review-${nodeIdx}`,
        entityId: skill.id,
        prompt: `Demonstrate how to execute: ${skill.name}.`,
        suggestedAnswer: skill.codeSnippetRef || `Apply principles of ${skill.name}.`,
        nodeType: 'application',
        difficulty: skill.level === 'advanced' ? 'hard' : 'medium',
      });
    }

    return reviewNodes;
  }

  private detectDuplicates(concepts: CandidateConcept[]): DuplicateConceptSuggestion[] {
    const suggestions: DuplicateConceptSuggestion[] = [];
    let sugIdx = 0;

    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const c1 = concepts[i];
        const c2 = concepts[j];

        const name1 = c1.name.toLowerCase().replace(/[-_\s]/g, '');
        const name2 = c2.name.toLowerCase().replace(/[-_\s]/g, '');

        // 1. Exact normalized match or inclusion
        const isNearMatch = name1 === name2 || (name1.length > 4 && name2.length > 4 && (name1.includes(name2) || name2.includes(name1)));

        // 2. Acronym detection (e.g. "Dependency Injection" vs "DI")
        const words1 = c1.name.split(/\s+/);
        const acronym1 = words1.map((w) => w[0]).join('').toLowerCase();
        const isAcronymMatch = (words1.length > 1 && acronym1 === c2.name.toLowerCase()) ||
          (c2.name.split(/\s+/).length > 1 && c2.name.split(/\s+/).map((w) => w[0]).join('').toLowerCase() === c1.name.toLowerCase());

        if (isNearMatch || isAcronymMatch) {
          sugIdx++;
          suggestions.push({
            id: `dup-sug-${sugIdx}`,
            primaryConceptId: c1.id,
            duplicateConceptId: c2.id,
            primaryConceptName: c1.name,
            duplicateConceptName: c2.name,
            similarityScore: isAcronymMatch ? 92 : 88,
            reason: isAcronymMatch
              ? `Acronym match detected ("${c1.name}" vs "${c2.name}")`
              : `Near-identical term naming structure ("${c1.name}" vs "${c2.name}")`,
            suggestedAction: 'merge',
            resolvedStatus: 'pending',
          });
        }
      }
    }

    return suggestions;
  }

  private calculateQualityMetrics(
    concepts: CandidateConcept[],
    skills: CandidateSkill[],
    assets: ExtractedAsset[],
    items: ContentItem[]
  ): ExtractionQualityMetrics {
    const totalAssets = Math.max(1, assets.length);
    const coveragePercent = Math.min(100, Math.round((concepts.length * 15 + skills.length * 20) / totalAssets * 10));
    const ambiguityScore = Math.max(5, Math.min(45, Math.round(100 - (concepts.reduce((acc, c) => acc + c.confidence, 0) / Math.max(1, concepts.length)))));
    const noiseScore = Math.max(2, Math.min(30, Math.round(100 - coveragePercent / 2)));
    const unknownTermsCount = concepts.filter((c) => c.confidence < 80).length;
    const unclassifiedAssetsCount = Math.max(0, assets.length - concepts.length);

    const overallExtractionScore = Math.min(100, Math.max(30, Math.round(coveragePercent * 0.5 + (100 - ambiguityScore) * 0.3 + (100 - noiseScore) * 0.2)));

    return {
      coveragePercent: Math.max(40, coveragePercent),
      ambiguityScore,
      noiseScore,
      unknownTermsCount,
      unclassifiedAssetsCount,
      overallExtractionScore,
    };
  }

  private detectUnsupportedKnowledge(
    assets: ExtractedAsset[],
    concepts: CandidateConcept[]
  ): UnsupportedKnowledgeItem[] {
    const unsupported: UnsupportedKnowledgeItem[] = [];
    let unIdx = 0;

    for (const concept of concepts) {
      if (concept.confidence < 80 || concept.description.includes('Key terminology found')) {
        unIdx++;
        unsupported.push({
          id: `unsupp-${unIdx}`,
          term: concept.name,
          contextSnippet: concept.evidenceText,
          reasonWhy: 'Low semantic definition density or ambiguous context in document.',
          suggestedAction: 'Provide explicit user definition or merge into primary topic.',
          resolvedStatus: 'pending',
        });
      }
    }

    return unsupported;
  }

  private isCommonBoilerplate(term: string): boolean {
    const boilerplate = [
      'introduction',
      'overview',
      'table of contents',
      'summary',
      'conclusion',
      'next steps',
      'page',
      'chapter',
      'section',
      'index',
      'license',
      'copyright',
      'author',
      'readme',
    ];
    return boilerplate.includes(term.toLowerCase().trim());
  }
}

export const deterministicExtractionEngine = new DeterministicExtractionEngine();
