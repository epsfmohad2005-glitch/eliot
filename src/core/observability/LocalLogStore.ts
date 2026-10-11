/**
 * @file src/core/observability/LocalLogStore.ts
 * @description Local log storage manager with FIFO buffer capping, query filtering, and export capability.
 * @license Apache-2.0
 */

import { LogEntry, LogLevel, LogQueryOptions, LogStorageStats } from './types';

const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

export class LocalLogStore {
  private static instance: LocalLogStore;
  private readonly storageKey = 'eliot_local_logs';
  private readonly maxLogs = 1000;
  private logsMemoryBuffer: LogEntry[] = [];
  private listeners: Set<(entry: LogEntry) => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): LocalLogStore {
    if (!LocalLogStore.instance) {
      LocalLogStore.instance = new LocalLogStore();
    }
    return LocalLogStore.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      const raw = window.localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.logsMemoryBuffer = parsed;
        }
      }
    } catch {
      this.logsMemoryBuffer = [];
    }
  }

  private persistToStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.logsMemoryBuffer));
    } catch {
      // Storage quota exceeded fallback: trim buffer in half
      if (this.logsMemoryBuffer.length > 100) {
        this.logsMemoryBuffer = this.logsMemoryBuffer.slice(-Math.floor(this.maxLogs / 2));
        try {
          window.localStorage.setItem(this.storageKey, JSON.stringify(this.logsMemoryBuffer));
        } catch {
          // Ignore fallback write error
        }
      }
    }
  }

  public append(entry: LogEntry): void {
    this.logsMemoryBuffer.push(entry);
    if (this.logsMemoryBuffer.length > this.maxLogs) {
      this.logsMemoryBuffer.shift();
    }
    this.persistToStorage();
    this.notifyListeners(entry);
  }

  public subscribe(listener: (entry: LogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(entry: LogEntry): void {
    this.listeners.forEach((fn) => {
      try {
        fn(entry);
      } catch {
        // Safe listener failure
      }
    });
  }

  public query(options: LogQueryOptions = {}): LogEntry[] {
    let results = [...this.logsMemoryBuffer];

    if (options.level) {
      results = results.filter((e) => e.level === options.level);
    }

    if (options.minLevel) {
      const minSev = LOG_LEVEL_SEVERITY[options.minLevel];
      results = results.filter((e) => LOG_LEVEL_SEVERITY[e.level] >= minSev);
    }

    if (options.domain) {
      const targetDomain = options.domain.toLowerCase();
      results = results.filter((e) => e.domain.toLowerCase().includes(targetDomain));
    }

    if (options.correlationId) {
      const targetCorr = options.correlationId.toLowerCase();
      results = results.filter((e) => e.correlationId.toLowerCase().includes(targetCorr));
    }

    if (options.search) {
      const query = options.search.toLowerCase();
      results = results.filter(
        (e) =>
          e.message.toLowerCase().includes(query) ||
          e.domain.toLowerCase().includes(query) ||
          e.correlationId.toLowerCase().includes(query) ||
          (e.error && (e.error.message.toLowerCase().includes(query) || e.error.name.toLowerCase().includes(query)))
      );
    }

    if (options.startDate) {
      const startMs = new Date(options.startDate).getTime();
      results = results.filter((e) => new Date(e.timestamp).getTime() >= startMs);
    }

    if (options.endDate) {
      const endMs = new Date(options.endDate).getTime();
      results = results.filter((e) => new Date(e.timestamp).getTime() <= endMs);
    }

    if (options.limit && options.limit > 0) {
      results = results.slice(-options.limit);
    }

    return results;
  }

  public getStats(): LogStorageStats {
    const countsByLevel: Record<LogLevel, number> = {
      TRACE: 0,
      DEBUG: 0,
      INFO: 0,
      WARN: 0,
      ERROR: 0,
      FATAL: 0,
    };

    let totalSizeBytes = 0;
    this.logsMemoryBuffer.forEach((e) => {
      countsByLevel[e.level] = (countsByLevel[e.level] || 0) + 1;
      totalSizeBytes += JSON.stringify(e).length;
    });

    return {
      totalLogs: this.logsMemoryBuffer.length,
      estimatedSizeBytes: totalSizeBytes,
      oldestTimestamp: this.logsMemoryBuffer[0]?.timestamp,
      newestTimestamp: this.logsMemoryBuffer[this.logsMemoryBuffer.length - 1]?.timestamp,
      countsByLevel,
    };
  }

  public clear(): void {
    this.logsMemoryBuffer = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(this.storageKey);
    }
  }

  public exportJSON(): string {
    return JSON.stringify(this.logsMemoryBuffer, null, 2);
  }

  public exportText(): string {
    return this.logsMemoryBuffer
      .map((e) => {
        const errorStr = e.error ? ` | Error: [${e.error.name}] ${e.error.message}` : '';
        const durStr = e.durationMs !== undefined ? ` | ${e.durationMs}ms` : '';
        return `[${e.timestamp}] [${e.level}] [${e.domain}] [${e.correlationId}] ${e.message}${durStr}${errorStr}`;
      })
      .join('\n');
  }
}

export const localLogStore = LocalLogStore.getInstance();
