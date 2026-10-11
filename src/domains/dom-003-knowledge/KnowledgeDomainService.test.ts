import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeDomainService } from './KnowledgeDomainService';
import { assertOk } from '../../test/utils';

describe('KnowledgeDomainService Unit Tests', () => {
  let service: KnowledgeDomainService;

  beforeEach(() => {
    service = new KnowledgeDomainService();
  });

  it('should retrieve seeded initial concepts', async () => {
    const res = await service.getConcept('CPT-SYS-MONADIC-RESULT');
    assertOk(res);
    expect(res.value).not.toBeNull();
    expect(res.value?.category).toBe('Systems Architecture');
  });

  it('should fetch prerequisites for a concept correctly', async () => {
    const res = await service.getPrerequisites('CPT-SYS-ASYNC-DISPATCH');
    assertOk(res);
    const prereqs = res.value;
    expect(prereqs.length).toBe(1);
    expect(prereqs[0].id).toBe('CPT-SYS-MONADIC-RESULT');
  });

  it('should update concept mastery using CKM mathematical formulas', async () => {
    const updateRes = await service.updateConceptMastery('CPT-SYS-MONADIC-RESULT', 0.9, 0.85, 0.95);
    assertOk(updateRes);
    const concept = updateRes.value;
    expect(concept.iterationsCount).toBe(9);
    expect(concept.masteryScore).toBeCloseTo(0.35 * 0.9 + 0.45 * 0.85 + 0.20 * 0.95, 2);
    expect(concept.knowledgeConfidence).toBeGreaterThan(0.80);
  });

  it('should return all concepts in the cognitive knowledge model', async () => {
    const res = await service.getAllConcepts();
    assertOk(res);
    expect(res.value.length).toBeGreaterThanOrEqual(3);
  });
});
