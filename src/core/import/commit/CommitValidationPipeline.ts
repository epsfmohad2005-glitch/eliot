/**
 * @file src/core/import/commit/CommitValidationPipeline.ts
 * @description Commit Validation Pipeline for Eliot RDI-1C.
 * Performs relationship integrity, cyclic dependency graph analysis,
 * duplicate commit fingerprint detection, and entity sanity verification.
 * @license Apache-2.0
 */

import { CandidateKnowledgeModel } from '../extraction/types';
import { CommitValidationReport, CommitValidationError, KnowledgeLedgerEntry } from './types';
import { CryptoUtils } from '../pipeline/CryptoUtils';

export class CommitValidationPipeline {
  /**
   * Main validation routine for candidate knowledge before commit.
   */
  public async validateCandidateCommit(
    model: CandidateKnowledgeModel,
    existingLedger: KnowledgeLedgerEntry[]
  ): Promise<CommitValidationReport> {
    const errors: CommitValidationError[] = [];
    const warnings: CommitValidationError[] = [];

    // 1. Compute Content Fingerprint (SHA-256)
    const normalizedPayload = JSON.stringify({
      title: model.sourceTitle,
      concepts: model.concepts.map((c) => ({ id: c.id, name: c.name, desc: c.description })).sort((a, b) => a.name.localeCompare(b.name)),
      skills: model.skills.map((s) => ({ id: s.id, name: s.name })).sort((a, b) => a.name.localeCompare(b.name)),
      dependencies: model.dependencies.map((d) => ({ s: d.sourceConceptId, t: d.targetConceptId })).sort((a, b) => a.s.localeCompare(b.s)),
    });

    const contentHash = await CryptoUtils.sha256(normalizedPayload);

    // 2. Duplicate Commit Protection Check
    const duplicateLedgerMatch = existingLedger.find((entry) => entry.contentHash === contentHash && entry.action === 'COMMIT_CREATED');
    const duplicateCheckPassed = !duplicateLedgerMatch;

    if (!duplicateCheckPassed) {
      errors.push({
        code: 'DUPLICATE_COMMIT_PAYLOAD',
        message: `Identical payload hash (${contentHash.substring(0, 8)}) was previously committed in entry ${duplicateLedgerMatch?.commitId}.`,
        severity: 'error',
      });
    }

    // 3. Relationship Integrity & Dangling Reference Validation
    const conceptIds = new Set(model.concepts.map((c) => c.id));
    let danglingCount = 0;

    for (const dep of model.dependencies) {
      const sourceExists = conceptIds.has(dep.sourceConceptId);
      const targetExists = conceptIds.has(dep.targetConceptId);

      if (!sourceExists || !targetExists) {
        danglingCount++;
        errors.push({
          code: 'DANGLING_RELATIONSHIP_REFERENCE',
          message: `Dependency ${dep.id} references non-existent concept ID (${!sourceExists ? dep.sourceConceptId : dep.targetConceptId}).`,
          severity: 'error',
          entityId: dep.id,
        });
      }
    }

    // 4. Cyclic Dependency Detection (DFS Graph Cycle Analysis)
    const { hasCycles, cyclePaths } = this.detectCyclicDependencies(model.concepts.map((c) => c.id), model.dependencies);
    const cyclicDependencyCheckPassed = !hasCycles;

    if (hasCycles) {
      errors.push({
        code: 'CYCLIC_DEPENDENCY_DETECTED',
        message: `Cyclic prerequisite dependency loop detected: ${cyclePaths.join(' -> ')}`,
        severity: 'error',
      });
    }

    // 5. Entity Sanity Verification
    for (const concept of model.concepts) {
      if (!concept.name.trim()) {
        errors.push({
          code: 'EMPTY_CONCEPT_NAME',
          message: `Concept ${concept.id} has an empty or blank name.`,
          severity: 'error',
          entityId: concept.id,
        });
      }
      if (concept.confidence < 50) {
        warnings.push({
          code: 'LOW_CONCEPT_CONFIDENCE',
          message: `Concept "${concept.name}" has low extraction confidence (${concept.confidence}%).`,
          severity: 'warning',
          entityId: concept.id,
        });
      }
    }

    // Score Calculations
    const totalDeps = Math.max(1, model.dependencies.length);
    const validDeps = Math.max(0, totalDeps - danglingCount);
    const relationshipIntegrityScore = Math.round((validDeps / totalDeps) * 100);

    const isValid = errors.filter((e) => e.severity === 'error').length === 0;

    return {
      isValid,
      timestamp: new Date().toISOString(),
      relationshipIntegrityScore,
      duplicateCheckPassed,
      cyclicDependencyCheckPassed,
      errors,
      warnings,
      summary: {
        danglingReferencesCount: danglingCount,
        duplicateMatchesCount: duplicateCheckPassed ? 0 : 1,
        cyclicPathsCount: cyclePaths.length,
      },
    };
  }

  /**
   * DFS Cycle detection on concept prerequisite directed graph.
   */
  private detectCyclicDependencies(
    conceptIds: string[],
    dependencies: Array<{ sourceConceptId: string; targetConceptId: string }>
  ): { hasCycles: boolean; cyclePaths: string[] } {
    const adj = new Map<string, string[]>();
    conceptIds.forEach((id) => adj.set(id, []));

    for (const dep of dependencies) {
      if (adj.has(dep.sourceConceptId)) {
        adj.get(dep.sourceConceptId)!.push(dep.targetConceptId);
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cyclePaths: string[] = [];

    const dfs = (node: string, path: string[]): boolean => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = adj.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, path)) return true;
        } else if (recStack.has(neighbor)) {
          path.push(neighbor);
          cyclePaths.push(...path);
          return true;
        }
      }

      recStack.delete(node);
      path.pop();
      return false;
    };

    for (const id of conceptIds) {
      if (!visited.has(id)) {
        if (dfs(id, [])) {
          return { hasCycles: true, cyclePaths };
        }
      }
    }

    return { hasCycles: false, cyclePaths: [] };
  }
}

export const commitValidationPipeline = new CommitValidationPipeline();
