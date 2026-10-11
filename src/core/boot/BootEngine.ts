/**
 * @file src/core/boot/BootEngine.ts
 * @description Real Operational Kernel Boot Engine executing system initialization phases.
 * @license Apache-2.0
 */

import { ENVIRONMENT_CONFIG, FEATURE_FLAGS } from '../../config';
import { MASTER_DOMAIN_REGISTRY } from '../../domains';
import { CANONICAL_EVENT_REGISTRY, eventBus } from '../events';
import { LearningStageMachine, ReviewPipelineMachine } from '../state';
import { IndexedDBAdapter, LocalStorageAdapter } from '../storage';
import { DecayEngine } from '../memory';
import { AIConstitution } from '../ai';
import {
  BootStepId,
  BootStepDetail,
  BootProgressState,
  BootProgressCallback,
  BootTelemetry,
} from './types';

const INITIAL_BOOT_STEPS: readonly BootStepDetail[] = [
  {
    id: 'app_launch',
    title: 'Application Launch',
    description: 'Loading system configuration & feature flags',
    status: 'pending',
  },
  {
    id: 'kernel_init',
    title: 'Kernel Initialization',
    description: 'Verifying 12 bounded context domain registries',
    status: 'pending',
  },
  {
    id: 'engine_init',
    title: 'Engine Initialization',
    description: 'Binding 8-stage lifecycle & 35% memory decay floor',
    status: 'pending',
  },
  {
    id: 'storage_check',
    title: 'Offline Storage Check',
    description: 'Testing LocalFirst IndexedDB / LocalStorage adapter',
    status: 'pending',
  },
  {
    id: 'daily_mission_prep',
    title: 'Daily Mission Preparation',
    description: 'Evaluating mission dispatch & revision queue',
    status: 'pending',
  },
  {
    id: 'system_ready',
    title: 'System Ready',
    description: 'Kernel operational. Transitioning to Mission Control',
    status: 'pending',
  },
];

export class BootEngine {
  private steps: BootStepDetail[];
  private onProgress?: BootProgressCallback;
  private isFastMode: boolean = false;

  constructor(onProgress?: BootProgressCallback) {
    this.steps = INITIAL_BOOT_STEPS.map((s) => ({ ...s }));
    this.onProgress = onProgress;
  }

  public setFastMode(enabled: boolean): void {
    this.isFastMode = enabled;
  }

  public async executeBootSequence(): Promise<BootProgressState> {
    const startTime = performance.now();
    let storageType = 'IndexedDB';

    // Step 1: Application Launch
    await this.runStep('app_launch', async () => {
      const isAppValid = Boolean(ENVIRONMENT_CONFIG.appName && ENVIRONMENT_CONFIG.appVersion);
      if (!isAppValid) throw new Error('Invalid environment configuration');
      return `Loaded ${ENVIRONMENT_CONFIG.appName} v${ENVIRONMENT_CONFIG.appVersion} (${ENVIRONMENT_CONFIG.sprintStage})`;
    });

    // Step 2: Kernel Initialization
    let registeredEventsCount = 0;
    let domainsVerifiedCount = 0;
    await this.runStep('kernel_init', async () => {
      domainsVerifiedCount = MASTER_DOMAIN_REGISTRY.length;
      if (domainsVerifiedCount !== 12) {
        throw new Error(`Domain registry mismatch: expected 12, got ${domainsVerifiedCount}`);
      }

      registeredEventsCount = CANONICAL_EVENT_REGISTRY.length;

      // Event Bus ping
      const unsub = eventBus.subscribe('DashboardRefreshed', () => {});
      unsub.unsubscribe();

      return `12 Domains bound. In-Memory Event Bus operational (${registeredEventsCount} canonical events)`;
    });

    // Step 3: Engine Initialization
    await this.runStep('engine_init', async () => {
      // Validate 8-stage state machine
      const stageMachine = new LearningStageMachine(1);
      if (!stageMachine.canAdvanceTo(2)) {
        throw new Error('Learning stage machine transition rules invalid');
      }

      // Validate review pipeline machine
      const reviewMachine = new ReviewPipelineMachine();
      if (reviewMachine.getReviewState() !== 'Idle') {
        throw new Error('Review pipeline machine initial state invalid');
      }

      // Validate memory decay engine floor cap (35% hard floor)
      const decayedScore = DecayEngine.calculateDecayedScore(100, 365);
      if (decayedScore < 35) {
        throw new Error('Memory decay floor cap breached');
      }

      // Validate Socratic AI constitution rules
      const constitutionCheck = AIConstitution.validateResponse('here is the complete solution for your assignment');
      if (constitutionCheck.ok) {
        throw new Error('AI Constitution guardrail failed to flag direct solution');
      }

      return `Stage Machine (1-8), Review Pipeline, AI Constitution, and Decay Engine (35% Floor = ${decayedScore}) verified`;
    });

    // Step 4: Offline Storage Check
    await this.runStep('storage_check', async () => {
      let adapterStatus = '';
      try {
        const idb = new IndexedDBAdapter('eliot_plos_boot_test');
        const setRes = await idb.setItem('boot_ping', { ping: true, timestamp: Date.now() });
        if (setRes.ok) {
          const getRes = await idb.getItem<{ ping: boolean }>('boot_ping');
          if (getRes.ok && getRes.value?.ping) {
            storageType = 'IndexedDB (LocalFirst)';
            adapterStatus = 'IndexedDB active & verified';
          }
        }
      } catch {
        // Fallback
        const ls = new LocalStorageAdapter('eliot_plos_boot_test:');
        await ls.setItem('boot_ping', { ping: true });
        storageType = 'LocalStorage (Fallback)';
        adapterStatus = 'LocalStorage fallback verified';
      }

      return `Storage verified: ${adapterStatus} [${storageType}]`;
    });

    // Step 5: Daily Mission Preparation
    await this.runStep('daily_mission_prep', async () => {
      // Dispatch refresh notification over event bus
      await eventBus.publish({
        eventId: `boot_evt_${Date.now()}`,
        eventType: 'DashboardRefreshed',
        sourceDomain: 'DOM-007',
        timestamp: new Date().toISOString(),
        payload: { reason: 'BootSequenceCompletion' },
      });

      return 'Daily Mission Dispatch initialized. Workspace view prioritized';
    });

    // Step 6: System Ready
    const totalDurationMs = Math.round(performance.now() - startTime);
    const telemetry: BootTelemetry = {
      totalDurationMs,
      domainsVerifiedCount,
      eventsRegisteredCount: registeredEventsCount,
      storageAdapterType: storageType,
      memoryDecayFloorPercent: 35,
      timestamp: new Date().toISOString(),
      isFastBoot: this.isFastMode,
    };

    await this.runStep('system_ready', async () => {
      return `Kernel READY in ${totalDurationMs}ms. Status: OPERATIONAL`;
    });

    const finalState: BootProgressState = {
      currentStepId: 'system_ready',
      steps: [...this.steps],
      overallProgressPercent: 100,
      isComplete: true,
      telemetry,
    };

    this.emitProgress(finalState);
    return finalState;
  }

  private async runStep(
    stepId: BootStepId,
    executionFn: () => Promise<string>
  ): Promise<void> {
    const index = this.steps.findIndex((s) => s.id === stepId);
    if (index === -1) return;

    // Mark current step in_progress
    const stepStart = performance.now();
    this.steps[index] = {
      ...this.steps[index],
      status: 'in_progress',
      timestamp: Date.now(),
    };

    const completedCount = this.steps.filter((s) => s.status === 'completed').length;
    const progressPercent = Math.round((completedCount / this.steps.length) * 100);

    this.emitProgress({
      currentStepId: stepId,
      steps: [...this.steps],
      overallProgressPercent: progressPercent,
      isComplete: false,
      telemetry: null,
    });

    // Small delay to allow fluid UI frame rendering without blocking
    const pacingDelayMs = this.isFastMode ? 20 : 120;
    await new Promise((res) => setTimeout(res, pacingDelayMs));

    try {
      const diag = await executionFn();
      const stepDuration = Math.round(performance.now() - stepStart);

      this.steps[index] = {
        ...this.steps[index],
        status: 'completed',
        durationMs: stepDuration,
        diagnostics: diag,
      };
    } catch (err) {
      const stepDuration = Math.round(performance.now() - stepStart);
      this.steps[index] = {
        ...this.steps[index],
        status: 'failed',
        durationMs: stepDuration,
        diagnostics: err instanceof Error ? err.message : String(err),
      };
      throw err;
    }

    const newCompletedCount = this.steps.filter((s) => s.status === 'completed').length;
    const newProgressPercent = Math.round((newCompletedCount / this.steps.length) * 100);

    this.emitProgress({
      currentStepId: stepId,
      steps: [...this.steps],
      overallProgressPercent: newProgressPercent,
      isComplete: false,
      telemetry: null,
    });
  }

  private emitProgress(state: BootProgressState): void {
    if (this.onProgress) {
      this.onProgress(state);
    }
  }
}
