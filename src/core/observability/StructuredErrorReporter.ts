/**
 * @file src/core/observability/StructuredErrorReporter.ts
 * @description Structured Error Reporter for normalizing, enriching, and logging domain and system errors.
 * @license Apache-2.0
 */

import { CorrelationContext } from './CorrelationContext';
import { logger } from './Logger';
import { Result, isFail } from '../errors/Result';
import { StructuredErrorReport } from './types';

export class StructuredErrorReporter {
  private static instance: StructuredErrorReporter;
  private reportsHistory: StructuredErrorReport[] = [];
  private readonly maxReports = 200;
  private isGlobalHandlersInitialized = false;

  private constructor() {}

  public static getInstance(): StructuredErrorReporter {
    if (!StructuredErrorReporter.instance) {
      StructuredErrorReporter.instance = new StructuredErrorReporter();
    }
    return StructuredErrorReporter.instance;
  }

  public reportError(
    error: unknown,
    domain: string = 'SYSTEM',
    messagePrefix: string = 'Domain Error Occurred',
    userContext?: Record<string, unknown>,
    isUncaught: boolean = false
  ): StructuredErrorReport {
    let errorName = 'Error';
    let errorMessage = 'An unexpected error occurred.';
    let stackTrace: string | undefined;

    if (error instanceof Error) {
      errorName = error.name;
      errorMessage = error.message;
      stackTrace = error.stack;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
    }

    const report: StructuredErrorReport = {
      id: `err_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      domain,
      message: `${messagePrefix}: ${errorMessage}`,
      errorName,
      stackTrace,
      correlationId: CorrelationContext.getCorrelationId(),
      isUncaught,
      userContext,
      systemState: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Server',
        location: typeof window !== 'undefined' ? window.location.href : 'N/A',
      },
    };

    this.reportsHistory.push(report);
    if (this.reportsHistory.length > this.maxReports) {
      this.reportsHistory.shift();
    }

    if (isUncaught) {
      logger.fatal(domain, report.message, { ...userContext, reportId: report.id }, error);
    } else {
      logger.error(domain, report.message, { ...userContext, reportId: report.id }, error);
    }

    return report;
  }

  public captureResultError<T, E>(
    result: Result<T, E>,
    domain: string,
    operationName: string,
    context?: Record<string, unknown>
  ): void {
    if (isFail(result)) {
      this.reportError(
        result.error,
        domain,
        `Result.fail in ${operationName}`,
        context
      );
    }
  }

  public initGlobalErrorHandlers(): void {
    if (this.isGlobalHandlersInitialized || typeof window === 'undefined') {
      return;
    }

    window.onerror = (event, source, lineno, colno, error) => {
      this.reportError(
        error || event,
        'BROWSER_UNCAUGHT',
        `Uncaught Global Exception at ${source}:${lineno}:${colno}`,
        { source, lineno, colno },
        true
      );
      return false;
    };

    window.onunhandledrejection = (event) => {
      this.reportError(
        event.reason,
        'UNHANDLED_PROMISE',
        'Unhandled Promise Rejection',
        undefined,
        true
      );
    };

    this.isGlobalHandlersInitialized = true;
    logger.info('KERNEL', 'Global window error and promise rejection listeners initialized.');
  }

  public getReports(): readonly StructuredErrorReport[] {
    return [...this.reportsHistory];
  }

  public clear(): void {
    this.reportsHistory = [];
  }
}

export const structuredErrorReporter = StructuredErrorReporter.getInstance();
