/**
 * @file src/core/storage/StorageAdapter.ts
 * @description Storage Repository Interface for Local-First Persistence.
 * @license Apache-2.0
 */

import { Result } from '../errors/Result';

export interface IStorageAdapter {
  getItem<T>(key: string): Promise<Result<T | null, Error>>;
  setItem<T>(key: string, value: T): Promise<Result<void, Error>>;
  removeItem(key: string): Promise<Result<void, Error>>;
  clear(): Promise<Result<void, Error>>;
  getAllKeys(): Promise<Result<readonly string[], Error>>;
}
