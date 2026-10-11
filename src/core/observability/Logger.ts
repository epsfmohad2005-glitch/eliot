/**
 * @file src/core/observability/Logger.ts
 * @description Centralized Structured Logger for Eliot PLOS.
 * @license Apache-2.0
 */

import { DomainId } from '../../types';
import { CorrelationContext } from './CorrelationContext';
import { localLogStore } from './LocalLogStore';
import { LogEntry, LogLevel } from './types';

const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

export class Logger {
  private static instance: Logger;
  private minLevel: LogLevel = 'TRACE';
  private consoleOutputEnabled = true;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public setConsoleOutputEnabled(enabled: boolean): void {
    this.consoleOutputEnabled = enabled;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[this.minLevel];
  }

  private createLogEntry(
    level: LogLevel,
    domain: DomainId | 'KERNEL' | 'UI' | 'SYSTEM' | string,
    message: string,
    context?: Record<string, unknown>,
    error?: unknown,
    durationMs?: number
  ): LogEntry {
    let parsedError: LogEntry['error'];

    if (error) {
      if (error instanceof Error) {
        parsedError = {
          name: error.name,
          message: error.message,
          stack: error.stack,
        };
      } else if (typeof error === 'object') {
        parsedError = {
          name: 'ObjectError',
          message: JSON.stringify(error),
        };
      } else {
        parsedError = {
          name: 'UnknownError',
          message: String(error),
        };
      }
    }

    const entry: LogEntry = {
      id: `log_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      level,
      domain,
      message,
      correlationId: CorrelationContext.getCorrelationId(),
      context,
      error: parsedError,
      durationMs,
    };

    return entry;
  }

  private dispatchLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    // Persist to local store
    localLogStore.append(entry);

    // Console output with clear formatting
    if (this.consoleOutputEnabled) {
      const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.domain}] [${entry.correlationId}]`;
      const args: any[] = [`${prefix} ${entry.message}`];
      if (entry.context) args.push(entry.context);
      if (entry.error) args.push(entry.error);

      switch (entry.level) {
        case 'TRACE':
        case 'DEBUG':
          console.debug(...args);
          break;
        case 'INFO':
          console.info(...args);
          break;
        case 'WARN':
          console.warn(...args);
          break;
        case 'ERROR':
        case 'FATAL':
          console.error(...args);
          break;
      }
    }
  }

  public trace(domain: string, message: string, context?: Record<string, unknown>): void {
    this.dispatchLog(this.createLogEntry('TRACE', domain, message, context));
  }

  public debug(domain: string, message: string, context?: Record<string, unknown>): void {
    this.dispatchLog(this.createLogEntry('DEBUG', domain, message, context));
  }

  public info(domain: string, message: string, context?: Record<string, unknown>): void {
    this.dispatchLog(this.createLogEntry('INFO', domain, message, context));
  }

  public warn(domain: string, message: string, context?: Record<string, unknown>, error?: unknown): void {
    this.dispatchLog(this.createLogEntry('WARN', domain, message, context, error));
  }

  public error(domain: string, message: string, context?: Record<string, unknown>, error?: unknown): void {
    this.dispatchLog(this.createLogEntry('ERROR', domain, message, context, error));
  }

  public fatal(domain: string, message: string, context?: Record<string, unknown>, error?: unknown): void {
    this.dispatchLog(this.createLogEntry('FATAL', domain, message, context, error));
  }

  public logTimed(
    level: LogLevel,
    domain: string,
    message: string,
    durationMs: number,
    context?: Record<string, unknown>
  ): void {
    this.dispatchLog(this.createLogEntry(level, domain, message, { ...context, durationMs }, undefined, durationMs));
  }
}

export const logger = Logger.getInstance();
