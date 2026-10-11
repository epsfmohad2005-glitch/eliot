/**
 * @file src/core/events/types.ts
 * @description Core Event Bus Contract Interfaces for Asynchronous Cross-Domain Events.
 * @license Apache-2.0
 */

import { BaseDomainEvent, CanonicalEventType } from '../../types';

export type EventCallback<T = Record<string, unknown>> = (event: BaseDomainEvent<T>) => void | Promise<void>;

export interface UnsubscribeHandle {
  readonly unsubscribe: () => void;
}

export interface IEventBus {
  publish<T = Record<string, unknown>>(event: BaseDomainEvent<T>): void;
  subscribe<T = Record<string, unknown>>(
    eventType: CanonicalEventType,
    callback: EventCallback<T>
  ): UnsubscribeHandle;
  subscribeAll(callback: EventCallback): UnsubscribeHandle;
  clearAllSubscriptions(): void;
  getHistory(): readonly BaseDomainEvent[];
}
