/**
 * @file src/core/performance/CacheEvictionManager.ts
 * @description LRU/LFU Memory Cache Eviction Policy Manager for preventing high-heap memory retention.
 * @license Apache-2.0
 */

export interface CacheEntry<T> {
  key: string;
  value: T;
  accessedAt: number;
  accessCount: number;
  sizeBytes: number;
}

export type EvictionPolicy = 'LRU' | 'LFU';

export class CacheEvictionManager<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxItems: number;
  private maxSizeBytes: number;
  private policy: EvictionPolicy;
  private currentSizeBytes = 0;

  constructor(maxItems = 500, maxSizeBytes = 50 * 1024 * 1024, policy: EvictionPolicy = 'LRU') {
    this.maxItems = maxItems;
    this.maxSizeBytes = maxSizeBytes;
    this.policy = policy;
  }

  public set(key: string, value: T, estimatedSizeBytes = 1024): void {
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.currentSizeBytes -= existing.sizeBytes;
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      accessedAt: Date.now(),
      accessCount: 1,
      sizeBytes: estimatedSizeBytes,
    };

    this.cache.set(key, entry);
    this.currentSizeBytes += estimatedSizeBytes;

    this.evictIfNecessary();
  }

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    entry.accessedAt = Date.now();
    entry.accessCount += 1;
    return entry.value;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSizeBytes -= entry.sizeBytes;
      return this.cache.delete(key);
    }
    return false;
  }

  public clear(): void {
    this.cache.clear();
    this.currentSizeBytes = 0;
  }

  private evictIfNecessary(): void {
    while (this.cache.size > this.maxItems || this.currentSizeBytes > this.maxSizeBytes) {
      const victimKey = this.findVictimKey();
      if (!victimKey) break;
      this.delete(victimKey);
    }
  }

  private findVictimKey(): string | null {
    if (this.cache.size === 0) return null;

    let victimKey: string | null = null;
    let entries = Array.from(this.cache.values());

    if (this.policy === 'LRU') {
      entries.sort((a, b) => a.accessedAt - b.accessedAt);
      victimKey = entries[0]?.key || null;
    } else {
      entries.sort((a, b) => a.accessCount - b.accessCount);
      victimKey = entries[0]?.key || null;
    }

    return victimKey;
  }

  public getStats() {
    return {
      itemCount: this.cache.size,
      maxItems: this.maxItems,
      currentSizeBytes: this.currentSizeBytes,
      maxSizeBytes: this.maxSizeBytes,
      policy: this.policy,
      utilizationPercentage: Math.round((this.currentSizeBytes / this.maxSizeBytes) * 100),
    };
  }
}
