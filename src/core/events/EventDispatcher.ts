/**
 * @file src/core/events/EventDispatcher.ts
 * @description Strongly-typed Event Dispatcher with Monadic Result error trapping.
 * @license Apache-2.0
 */

import { Result } from '../errors/Result';

export class EventDispatcher<T = Record<string, unknown>> {
  private listeners: Array<(event: T) => void | Promise<void>> = [];

  public subscribe(handler: (event: T) => void | Promise<void>): () => void {
    this.listeners.push(handler);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== handler);
    };
  }

  public async dispatchAsync(event: T): Promise<Result<number, Error>> {
    try {
      for (const listener of this.listeners) {
        await listener(event);
      }
      return Result.ok(this.listeners.length);
    } catch (err) {
      return Result.fail(err instanceof Error ? err : new Error('Event dispatch failure'));
    }
  }

  public dispatch(event: T): Result<number, Error> {
    try {
      this.listeners.forEach((fn) => fn(event));
      return Result.ok(this.listeners.length);
    } catch (err) {
      return Result.fail(err instanceof Error ? err : new Error('Event dispatch failure'));
    }
  }

  public clear(): void {
    this.listeners = [];
  }

  public get listenerCount(): number {
    return this.listeners.length;
  }
}

export class AsyncEventDispatcher<T = Record<string, unknown>> extends EventDispatcher<T> {}
