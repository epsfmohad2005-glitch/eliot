import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryDomainService } from './MemoryDomainService';
import { assertOk } from '../../test/utils';

describe('MemoryDomainService Unit Tests', () => {
  let service: MemoryDomainService;

  beforeEach(() => {
    service = new MemoryDomainService();
  });

  it('should seed initial memory nodes upon initialization', async () => {
    const res = await service.getMemoryItem('mem_001');
    assertOk(res);
    expect(res.value).not.toBeNull();
    expect(res.value?.conceptId).toBe('CPT-SYS-MONADIC-RESULT');
  });

  it('should retrieve default skill confidence for non-existent skill', async () => {
    const res = await service.getSkillConfidence('NON_EXISTENT_SKILL');
    assertOk(res);
    expect(res.value).toBe(0.5);
  });

  it('should record practice event and increase memory stability and retention', async () => {
    const res = await service.recordPracticeEvent('CPT-SYS-MONADIC-RESULT', 0.9, 'art_001');
    assertOk(res);
    const item = res.value;
    expect(item.memoryStability).toBeGreaterThan(7.0);
    expect(item.retentionScore).toBeGreaterThanOrEqual(0.95);
    expect(item.masteryScore).toBeGreaterThan(0.80);
  });

  it('should calculate exponential cognitive decay bound within floor limits', async () => {
    const res = await service.recalculateDecay();
    assertOk(res);
    const nodes = res.value;
    expect(nodes.length).toBeGreaterThan(0);
    for (const node of nodes) {
      expect(node.retentionScore).toBeGreaterThanOrEqual(node.decayCapFloor || 0.35);
      expect(node.retentionScore).toBeLessThanOrEqual(1.0);
    }
  });

  it('should return empty list when no items are past their nextReviewDueAt', async () => {
    const res = await service.getItemsDueForReview();
    assertOk(res);
    expect(res.value).toEqual([]);
  });

  it('should return items due for review sorted most-overdue first and deduplicated', async () => {
    const now = Date.now();
    const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString();

    // Directly simulate overdue items in the map
    const node1 = {
      id: 'mem_overdue_1',
      skillId: 'SKILL-SYS-001',
      conceptId: 'CPT-SYS-001',
      confidenceScore: 0.8,
      retentionScore: 0.6,
      memoryStability: 3.0,
      masteryScore: 0.7,
      lastPracticedAt: twoDaysAgo,
      nextReviewDueAt: oneDayAgo, // Overdue by 1 day
    };

    const node2 = {
      id: 'mem_overdue_2',
      skillId: 'SKILL-SYS-002',
      conceptId: 'CPT-SYS-002',
      confidenceScore: 0.75,
      retentionScore: 0.5,
      memoryStability: 2.0,
      masteryScore: 0.65,
      lastPracticedAt: twoDaysAgo,
      nextReviewDueAt: twoDaysAgo, // Overdue by 2 days (more urgent)
    };

    // Simulate double-indexing as in the service
    (service as any).memoryNodes.set(node1.id, node1);
    (service as any).memoryNodes.set(node1.conceptId, node1);
    (service as any).memoryNodes.set(node2.id, node2);
    (service as any).memoryNodes.set(node2.conceptId, node2);

    const res = await service.getItemsDueForReview();
    assertOk(res);
    expect(res.value.length).toBe(2);
    // Most overdue first (node2 was due earlier than node1)
    expect(res.value[0].id).toBe('mem_overdue_2');
    expect(res.value[1].id).toBe('mem_overdue_1');
  });
});
