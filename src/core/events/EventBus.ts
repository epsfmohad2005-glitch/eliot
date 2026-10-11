/**
 * @file src/core/events/EventBus.ts
 * @description In-Memory Event Broker Implementation with Observability & Metrics Integration.
 * @license Apache-2.0
 */

import { BaseDomainEvent, CanonicalEventType } from '../../types';
import { EventCallback, IEventBus, UnsubscribeHandle } from './types';
import { CorrelationContext } from '../observability/CorrelationContext';
import { logger } from '../observability/Logger';
import { structuredErrorReporter } from '../observability/StructuredErrorReporter';
import { EventBusMetric } from '../observability/types';

export class InMemoryEventBus implements IEventBus {
  private static instance: InMemoryEventBus;
  private subscribers: Map<string, Set<EventCallback<any>>> = new Map();
  private globalSubscribers: Set<EventCallback<any>> = new Set();
  private eventHistory: BaseDomainEvent[] = [];
  private readonly maxHistorySize = 1000;
  private metricsMap: Map<string, EventBusMetric> = new Map();

  private constructor() {}

  public static getInstance(): InMemoryEventBus {
    if (!InMemoryEventBus.instance) {
      InMemoryEventBus.instance = new InMemoryEventBus();
    }
    return InMemoryEventBus.instance;
  }

  public publish<T = Record<string, unknown>>(event: BaseDomainEvent<T>): void {
    // Ensure correlation ID is attached
    const correlationId = event.correlationId || CorrelationContext.getCorrelationId();
    const enrichedEvent: BaseDomainEvent<T> = {
      ...event,
      correlationId,
    };

    // Record in history
    this.eventHistory.push(enrichedEvent as BaseDomainEvent);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    const startMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let listenerErrorCount = 0;

    // Log published event
    logger.debug(
      enrichedEvent.sourceDomain || 'EVENT_BUS',
      `[EventBus:Publish] ${enrichedEvent.eventType}`,
      { eventId: enrichedEvent.eventId, correlationId, payload: enrichedEvent.payload }
    );

    // Notify type-specific subscribers
    const callbacks = this.subscribers.get(enrichedEvent.eventType);
    const specificCount = callbacks ? callbacks.size : 0;
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(enrichedEvent);
        } catch (err) {
          listenerErrorCount++;
          structuredErrorReporter.reportError(
            err,
            enrichedEvent.sourceDomain || 'EVENT_BUS',
            `Error in type listener for event ${enrichedEvent.eventType}`,
            { eventId: enrichedEvent.eventId, eventType: enrichedEvent.eventType }
          );
        }
      });
    }

    // Notify global subscribers
    this.globalSubscribers.forEach((cb) => {
      try {
        cb(enrichedEvent as BaseDomainEvent);
      } catch (err) {
        listenerErrorCount++;
        structuredErrorReporter.reportError(
          err,
          enrichedEvent.sourceDomain || 'EVENT_BUS',
          `Error in global listener for event ${enrichedEvent.eventType}`,
          { eventId: enrichedEvent.eventId, eventType: enrichedEvent.eventType }
        );
      }
    });

    const endMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const durationMs = endMs - startMs;

    // Update Event Metrics
    this.updateMetrics(
      enrichedEvent.eventType,
      specificCount + this.globalSubscribers.size,
      listenerErrorCount,
      durationMs
    );
  }

  private updateMetrics(
    eventType: string,
    listenerCount: number,
    errorsOccurred: number,
    durationMs: number
  ): void {
    const existing = this.metricsMap.get(eventType) || {
      eventType,
      publishedCount: 0,
      listenerCount,
      errorCount: 0,
      avgDurationMs: 0,
    };

    const newPublishedCount = existing.publishedCount + 1;
    const newAvgDurationMs =
      (existing.avgDurationMs * existing.publishedCount + durationMs) / newPublishedCount;

    this.metricsMap.set(eventType, {
      eventType,
      publishedCount: newPublishedCount,
      listenerCount,
      errorCount: existing.errorCount + errorsOccurred,
      avgDurationMs: Math.round(newAvgDurationMs * 100) / 100,
      lastPublishedAt: new Date().toISOString(),
    });
  }

  public subscribe<T = Record<string, unknown>>(
    eventType: CanonicalEventType,
    callback: EventCallback<T>
  ): UnsubscribeHandle {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    const targetSet = this.subscribers.get(eventType)!;
    targetSet.add(callback as EventCallback<any>);

    return {
      unsubscribe: () => {
        targetSet.delete(callback as EventCallback<any>);
      },
    };
  }

  public subscribeAll(callback: EventCallback): UnsubscribeHandle {
    this.globalSubscribers.add(callback);
    return {
      unsubscribe: () => {
        this.globalSubscribers.delete(callback);
      },
    };
  }

  public clearAllSubscriptions(): void {
    this.subscribers.clear();
    this.globalSubscribers.clear();
  }

  public getHistory(): readonly BaseDomainEvent[] {
    return [...this.eventHistory];
  }

  public getMetrics(): EventBusMetric[] {
    return Array.from(this.metricsMap.values());
  }

  public getSubscriptionCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.subscribers.forEach((set, type) => {
      counts[type] = set.size;
    });
    counts['__global__'] = this.globalSubscribers.size;
    return counts;
  }
}

export const eventBus = InMemoryEventBus.getInstance();
