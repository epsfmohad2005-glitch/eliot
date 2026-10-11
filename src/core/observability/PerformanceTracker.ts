/**
 * @file src/core/observability/PerformanceTracker.ts
 * @description Performance timing tracker for monitoring domain execution durations and slow operations.
 * @license Apache-2.0
 */

import { CorrelationContext } from './CorrelationContext';
import { logger } from './Logger';
import { PerformanceMetric } from './types';

export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metricsBuffer: PerformanceMetric[] = [];
  private readonly maxMetrics = 500;
  private readonly slowThresholdMs = 50; // Warn if duration > 50ms

  private constructor() {}

  public static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  public startTimer(label: string, domain: string = 'KERNEL') {
    const startMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const correlationId = CorrelationContext.getCorrelationId();

    return {
      stop: (context?: Record<string, unknown>): PerformanceMetric => {
        const endMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const durationMs = Math.round((endMs - startMs) * 100) / 100;
        const isSlow = durationMs >= this.slowThresholdMs;

        const metric: PerformanceMetric = {
          id: `perf_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
          label,
          domain,
          durationMs,
          timestamp: new Date().toISOString(),
          correlationId,
          isSlow,
          context,
        };

        this.recordMetric(metric);
        return metric;
      },
    };
  }

  private recordMetric(metric: PerformanceMetric): void {
    this.metricsBuffer.push(metric);
    if (this.metricsBuffer.length > this.maxMetrics) {
      this.metricsBuffer.shift();
    }

    if (metric.isSlow) {
      logger.warn(
        metric.domain,
        `[Slow Operation Alert] '${metric.label}' took ${metric.durationMs}ms (threshold: ${this.slowThresholdMs}ms)`,
        { ...metric.context, durationMs: metric.durationMs, label: metric.label }
      );
    } else {
      logger.debug(metric.domain, `[Performance] '${metric.label}' took ${metric.durationMs}ms`, {
        durationMs: metric.durationMs,
      });
    }
  }

  public async measureAsync<T>(
    label: string,
    domain: string,
    fn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    const timer = this.startTimer(label, domain);
    try {
      const result = await fn();
      timer.stop(context);
      return result;
    } catch (err) {
      timer.stop({ ...context, error: String(err) });
      throw err;
    }
  }

  public measureSync<T>(
    label: string,
    domain: string,
    fn: () => T,
    context?: Record<string, unknown>
  ): T {
    const timer = this.startTimer(label, domain);
    try {
      const result = fn();
      timer.stop(context);
      return result;
    } catch (err) {
      timer.stop({ ...context, error: String(err) });
      throw err;
    }
  }

  public getMetrics(): readonly PerformanceMetric[] {
    return [...this.metricsBuffer];
  }

  public getSlowOperations(): PerformanceMetric[] {
    return this.metricsBuffer.filter((m) => m.isSlow);
  }

  public clear(): void {
    this.metricsBuffer = [];
  }
}

export const performanceTracker = PerformanceTracker.getInstance();
