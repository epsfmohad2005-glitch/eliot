/**
 * @file src/core/boot/types.ts
 * @description Type definitions and contracts for Eliot PLOS Kernel Boot Experience.
 * @license Apache-2.0
 */

export type BootStepId =
  | 'app_launch'
  | 'kernel_init'
  | 'engine_init'
  | 'storage_check'
  | 'daily_mission_prep'
  | 'system_ready';

export type BootStepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface BootStepDetail {
  readonly id: BootStepId;
  readonly title: string;
  readonly description: string;
  readonly status: BootStepStatus;
  readonly timestamp?: number;
  readonly durationMs?: number;
  readonly diagnostics?: string;
}

export interface BootTelemetry {
  readonly totalDurationMs: number;
  readonly domainsVerifiedCount: number;
  readonly eventsRegisteredCount: number;
  readonly storageAdapterType: string;
  readonly memoryDecayFloorPercent: number;
  readonly timestamp: string;
  readonly isFastBoot: boolean;
}

export interface BootProgressState {
  readonly currentStepId: BootStepId;
  readonly steps: readonly BootStepDetail[];
  readonly overallProgressPercent: number;
  readonly isComplete: boolean;
  readonly telemetry: BootTelemetry | null;
}

export type BootProgressCallback = (state: BootProgressState) => void;
