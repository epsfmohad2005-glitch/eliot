/**
 * @file src/core/storage/LocalStorageAdapter.ts
 * @description LocalStorage Adapter for User Preferences & Fallback Settings.
 * @license Apache-2.0
 */

import { Result } from '../errors/Result';
import { IStorageAdapter } from './StorageAdapter';

export class LocalStorageAdapter implements IStorageAdapter {
  private prefix: string;

  constructor(prefix: string = 'eliot_pref:') {
    this.prefix = prefix;
  }

  public async getItem<T>(key: string): Promise<Result<T | null, Error>> {
    try {
      const raw = localStorage.getItem(`${this.prefix}${key}`);
      if (!raw) return Result.ok(null);
      return Result.ok(JSON.parse(raw) as T);
    } catch (err) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async setItem<T>(key: string, value: T): Promise<Result<void, Error>> {
    try {
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
      return Result.ok(undefined);
    } catch (err) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async removeItem(key: string): Promise<Result<void, Error>> {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
      return Result.ok(undefined);
    } catch (err) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async clear(): Promise<Result<void, Error>> {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if (k.startsWith(this.prefix)) {
          localStorage.removeItem(k);
        }
      });
      return Result.ok(undefined);
    } catch (err) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async getAllKeys(): Promise<Result<readonly string[], Error>> {
    try {
      const keys = Object.keys(localStorage)
        .filter((k) => k.startsWith(this.prefix))
        .map((k) => k.replace(this.prefix, ''));
      return Result.ok(keys);
    } catch (err) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
