/**
 * @file src/core/observability/CorrelationContext.ts
 * @description Correlation ID generator and context tracking for cross-domain operations.
 * @license Apache-2.0
 */

export class CorrelationContext {
  private static activeCorrelationId: string = CorrelationContext.generateCorrelationId();

  public static generateCorrelationId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `corr_${timestamp}_${random}`;
  }

  public static getCorrelationId(): string {
    if (!CorrelationContext.activeCorrelationId) {
      CorrelationContext.activeCorrelationId = CorrelationContext.generateCorrelationId();
    }
    return CorrelationContext.activeCorrelationId;
  }

  public static setCorrelationId(correlationId: string): void {
    if (correlationId && correlationId.trim()) {
      CorrelationContext.activeCorrelationId = correlationId.trim();
    }
  }

  public static resetCorrelationId(): string {
    CorrelationContext.activeCorrelationId = CorrelationContext.generateCorrelationId();
    return CorrelationContext.activeCorrelationId;
  }

  public static runWithCorrelationId<T>(correlationId: string, fn: () => T): T {
    const previousId = CorrelationContext.activeCorrelationId;
    try {
      CorrelationContext.setCorrelationId(correlationId);
      return fn();
    } finally {
      CorrelationContext.activeCorrelationId = previousId;
    }
  }

  public static async runWithCorrelationIdAsync<T>(
    correlationId: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const previousId = CorrelationContext.activeCorrelationId;
    try {
      CorrelationContext.setCorrelationId(correlationId);
      return await fn();
    } finally {
      CorrelationContext.activeCorrelationId = previousId;
    }
  }
}
