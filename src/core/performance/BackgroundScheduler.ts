/**
 * @file src/core/performance/BackgroundScheduler.ts
 * @description Cooperative Background Task Scheduler using requestIdleCallback for non-blocking UI rendering.
 * @license Apache-2.0
 */

export interface IdleTaskOptions {
  timeout?: number;
  priority?: 'low' | 'normal' | 'high';
}

export type IdleTaskCallback = (deadline?: {
  didTimeout: boolean;
  timeRemaining: () => number;
}) => void;

export class BackgroundScheduler {
  private static instance: BackgroundScheduler;
  private taskQueue: Array<{
    id: string;
    callback: IdleTaskCallback;
    options: IdleTaskOptions;
  }> = [];
  private isProcessing = false;

  private constructor() {}

  public static getInstance(): BackgroundScheduler {
    if (!BackgroundScheduler.instance) {
      BackgroundScheduler.instance = new BackgroundScheduler();
    }
    return BackgroundScheduler.instance;
  }

  /**
   * Schedule a low-priority task to run during idle browser frames
   */
  public scheduleIdleTask(callback: IdleTaskCallback, options: IdleTaskOptions = {}): string {
    const id = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.taskQueue.push({ id, callback, options });

    if (!this.isProcessing) {
      this.processNextTask();
    }
    return id;
  }

  private processNextTask(): void {
    if (this.taskQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const nextTask = this.taskQueue.shift();
    if (!nextTask) {
      this.isProcessing = false;
      return;
    }

    const requestIdle =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (window as any).requestIdleCallback
        : (cb: Function) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 15 }), 1);

    requestIdle(
      (deadline: { didTimeout: boolean; timeRemaining: () => number }) => {
        try {
          nextTask.callback(deadline);
        } catch (err) {
          console.error(`[BackgroundScheduler] Task execution error:`, err);
        } finally {
          this.processNextTask();
        }
      },
      { timeout: nextTask.options.timeout || 2000 }
    );
  }

  /**
   * Helper to yield control back to the main thread during heavy loops
   */
  public async yieldToMain(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
        requestAnimationFrame(() => resolve());
      } else {
        setTimeout(resolve, 0);
      }
    });
  }

  public clearQueue(): void {
    this.taskQueue = [];
    this.isProcessing = false;
  }
}

export const backgroundScheduler = BackgroundScheduler.getInstance();
