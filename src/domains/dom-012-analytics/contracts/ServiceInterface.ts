/**
 * @file src/domains/dom-012-analytics/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-012: Analytics Domain.
 * @license Apache-2.0
 */

import { Result } from '../../../core/errors/Result';

export interface LearningVelocityMetrics {
  readonly avgStageCompletionMinutes: number;
  readonly revisionLoopCount: number;
  readonly activeStreakDays: number;
  readonly frictionSignalDetected: boolean;
}

export interface IAnalyticsDomainService {
  getVelocityMetrics(): Promise<Result<LearningVelocityMetrics, Error>>;
  recordFrictionEvent(unitId: string, stageNumber: number): Promise<Result<void, Error>>;
}
