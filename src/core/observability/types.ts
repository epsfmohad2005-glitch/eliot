/**
 * @file src/core/observability/types.ts
 * @description Type definitions for Eliot PLOS Observability Foundation (Sprint PF-3).
 * @license Apache-2.0
 */

import { DomainId } from '../../types';

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  readonly id: string;
  readonly timestamp: string; // ISO 8601
  readonly level: LogLevel;
  readonly domain: DomainId | 'KERNEL' | 'UI' | 'SYSTEM' | string;
  readonly message: string;
  readonly correlationId: string;
  readonly context?: Record<string, unknown>;
  readonly error?: {
    name: string;
    message: string;
    stack?: string;
  };
  readonly durationMs?: number;
}

export interface LogQueryOptions {
  level?: LogLevel;
  minLevel?: LogLevel;
  domain?: string;
  correlationId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface LogStorageStats {
  totalLogs: number;
  estimatedSizeBytes: number;
  oldestTimestamp?: string;
  newestTimestamp?: string;
  countsByLevel: Record<LogLevel, number>;
}

export interface PerformanceMetric {
  readonly id: string;
  readonly label: string;
  readonly domain: string;
  readonly durationMs: number;
  readonly timestamp: string;
  readonly correlationId: string;
  readonly isSlow: boolean;
  readonly context?: Record<string, unknown>;
}

export interface StructuredErrorReport {
  readonly id: string;
  readonly timestamp: string;
  readonly domain: string;
  readonly message: string;
  readonly errorName: string;
  readonly stackTrace?: string;
  readonly correlationId: string;
  readonly isUncaught: boolean;
  readonly userContext?: Record<string, unknown>;
  readonly systemState?: Record<string, unknown>;
}

export interface EventBusMetric {
  readonly eventType: string;
  publishedCount: number;
  listenerCount: number;
  errorCount: number;
  avgDurationMs: number;
  lastPublishedAt?: string;
}
