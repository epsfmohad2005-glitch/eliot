/**
 * @file src/domains/dom-002-memory/MemoryDomainService.ts
 * @description Implementation of DOM-002 Memory Domain Service (Cognitive Decay & Memory Stability Engine).
 * @license Apache-2.0
 */

import { Result } from '../../core/errors/Result';
import { eventBus } from '../../core/events';
import { MemoryItemEntity } from '../../types';
import { IMemoryDomainService } from './contracts/ServiceInterface';

export class MemoryDomainService implements IMemoryDomainService {
  private memoryNodes: Map<string, MemoryItemEntity> = new Map();

  constructor() {
    this.seedInitialMemoryNodes();
  }

  private seedInitialMemoryNodes(): void {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const nextReview = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();

    const initialNodes: MemoryItemEntity[] = [
      {
        id: 'mem_001',
        skillId: 'SKILL-SYS-001',
        conceptId: 'CPT-SYS-MONADIC-RESULT',
        confidenceScore: 0.88,
        retentionScore: 0.85,
        memoryStability: 7.0,
        masteryScore: 0.84,
        lastPracticedAt: threeDaysAgo,
        nextReviewDueAt: nextReview,
        decayCapFloor: 0.35,
      },
      {
        id: 'mem_002',
        skillId: 'SKILL-SYS-002',
        conceptId: 'CPT-SYS-ASYNC-DISPATCH',
        confidenceScore: 0.84,
        retentionScore: 0.81,
        memoryStability: 5.5,
        masteryScore: 0.80,
        lastPracticedAt: threeDaysAgo,
        nextReviewDueAt: nextReview,
        decayCapFloor: 0.35,
      },
    ];

    for (const item of initialNodes) {
      this.memoryNodes.set(item.conceptId || item.skillId, item);
      this.memoryNodes.set(item.id, item);
    }
  }

  public async getSkillConfidence(skillId: string): Promise<Result<number, Error>> {
    const item = this.memoryNodes.get(skillId);
    return Result.ok(item ? item.confidenceScore : 0.5);
  }

  public async getMemoryItem(skillOrConceptId: string): Promise<Result<MemoryItemEntity | null, Error>> {
    const item = this.memoryNodes.get(skillOrConceptId) || null;
    return Result.ok(item);
  }

  public async updateSkillConfidence(
    skillId: string,
    scoreDelta: number,
    artifactId: string
  ): Promise<Result<MemoryItemEntity, Error>> {
    return this.recordPracticeEvent(skillId, 0.85 + scoreDelta, artifactId);
  }

  public async recordPracticeEvent(
    skillOrConceptId: string,
    qualityScore: number,
    artifactId?: string
  ): Promise<Result<MemoryItemEntity, Error>> {
    const now = new Date();
    const nowISO = now.toISOString();

    let item = this.memoryNodes.get(skillOrConceptId);

    const oldStability = item?.memoryStability || 5.0;
    // New stability grows with quality score Eq: S_new = S_old * (1 + 0.4 * Eq)
    const newStability = Number((oldStability * (1 + 0.4 * Math.min(1.0, qualityScore))).toFixed(2));

    // Next review due at now + newStability days
    const nextReviewTime = new Date(now.getTime() + newStability * 24 * 60 * 60 * 1000).toISOString();

    // Retention R(t) reset to ~0.98 upon fresh successful practice
    const newRetention = Number(Math.min(1.0, 0.95 + 0.05 * qualityScore).toFixed(3));

    // Confidence Kc updated
    const oldKc = item?.confidenceScore || 0.75;
    const newKc = Number(Math.min(1.0, oldKc + 0.04).toFixed(3));

    // Mastery Score Mc = 0.35 * R(t) + 0.45 * Eq + 0.20 * P
    const mc = Number((0.35 * newRetention + 0.45 * Math.min(1.0, qualityScore) + 0.20 * 0.95).toFixed(3));

    const updatedItem: MemoryItemEntity = {
      id: item?.id || `mem_${Date.now()}`,
      skillId: item?.skillId || skillOrConceptId,
      conceptId: item?.conceptId || skillOrConceptId,
      confidenceScore: newKc,
      retentionScore: newRetention,
      memoryStability: newStability,
      masteryScore: mc,
      lastPracticedAt: nowISO,
      nextReviewDueAt: nextReviewTime,
      decayCapFloor: 0.35,
    };

    this.memoryNodes.set(skillOrConceptId, updatedItem);
    this.memoryNodes.set(updatedItem.id, updatedItem);

    // Emit MemoryDecayCalculated event
    eventBus.publish({
      eventId: `evt_${Date.now()}_mem`,
      eventType: 'MemoryDecayCalculated',
      sourceDomain: 'DOM-002',
      timestamp: nowISO,
      payload: {
        conceptId: skillOrConceptId,
        retentionScore: newRetention,
        memoryStability: newStability,
        masteryScore: mc,
        nextReviewDueAt: nextReviewTime,
      },
    });

    if (mc >= 0.85) {
      eventBus.publish({
        eventId: `evt_${Date.now()}_mastery`,
        eventType: 'SkillMastered',
        sourceDomain: 'DOM-002',
        timestamp: nowISO,
        payload: {
          skillId: updatedItem.skillId,
          masteryScore: mc,
        },
      });
    }

    return Result.ok(updatedItem);
  }

  public async recalculateDecay(): Promise<Result<readonly MemoryItemEntity[], Error>> {
    const now = new Date();
    const updatedList: MemoryItemEntity[] = [];

    for (const [key, item] of this.memoryNodes.entries()) {
      if (key !== item.id) continue; // process canonical node once

      const lastDate = new Date(item.lastPracticedAt);
      const lastTime = isNaN(lastDate.getTime()) ? now.getTime() : lastDate.getTime();
      // Guard against clock manipulation (negative time deltas)
      const daysElapsed = Math.max(0, (now.getTime() - lastTime) / (24 * 60 * 60 * 1000));
      const complexityMultiplier = 1.2;

      // Exponential decay formula: R(t) = exp(-t / (S * c_diff))
      const rawDecay = Math.exp(-daysElapsed / (item.memoryStability * complexityMultiplier));
      // Apply strict bounds [decayCapFloor (0.35), 1.0]
      const clampedDecay = Number(Math.min(1.0, Math.max(item.decayCapFloor || 0.35, rawDecay)).toFixed(3));

      const updatedItem: MemoryItemEntity = {
        ...item,
        retentionScore: clampedDecay,
      };

      this.memoryNodes.set(item.id, updatedItem);
      if (item.conceptId) this.memoryNodes.set(item.conceptId, updatedItem);
      updatedList.push(updatedItem);
    }

    return Result.ok(updatedList);
  }

  public async getItemsDueForReview(): Promise<Result<readonly MemoryItemEntity[], Error>> {
    const now = Date.now();
    const dueItems: MemoryItemEntity[] = [];

    for (const [key, item] of this.memoryNodes.entries()) {
      if (key !== item.id) continue; // process canonical node once (see the double-indexing in recalculateDecay)
      if (!item.nextReviewDueAt) continue;

      const dueTime = new Date(item.nextReviewDueAt).getTime();
      if (!isNaN(dueTime) && dueTime <= now) {
        dueItems.push(item);
      }
    }

    // Most overdue first — the item that's been waiting longest is the
    // most urgent to review.
    return Result.ok(
      dueItems.sort((a, b) => new Date(a.nextReviewDueAt!).getTime() - new Date(b.nextReviewDueAt!).getTime())
    );
  }
}

export const memoryDomainService = new MemoryDomainService();
