/**
 * @file src/core/memory/MemoryStore.ts
 * @description Hybrid Relational-Vector Cognitive Memory Store Interface.
 * @license Apache-2.0
 */

import { MemoryItemEntity } from '../../types';
import { Result } from '../errors/Result';

export interface IMemoryStore {
  getMemoryItem(skillId: string): Promise<Result<MemoryItemEntity | null, Error>>;
  saveMemoryItem(item: MemoryItemEntity): Promise<Result<void, Error>>;
  getAllMemoryItems(): Promise<Result<readonly MemoryItemEntity[], Error>>;
  getRelevantContext(query: string, maxItems?: number): Promise<Result<readonly string[], Error>>;
}
