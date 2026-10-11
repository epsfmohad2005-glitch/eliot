/**
 * @file src/domains/dom-007-dashboard/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-007: Dashboard Domain.
 * @license Apache-2.0
 */

import { Result } from '../../../core/errors/Result';

export type WorkspaceActiveFrame =
  | 'RevisionRequiredTask'
  | 'ActiveLearningStage'
  | 'ReentryRefresher'
  | 'NextScheduledUnit'
  | 'SystemStatusOverview';

export interface MissionIdentityData {
  readonly learningPath: string;
  readonly stageNumber: number; // 1 to 8
  readonly stageName: string;
  readonly currentWeek: number;
}

export interface TodaysMissionData {
  readonly id: string;
  readonly objective: string;
  readonly estimatedTimeMinutes: number;
  readonly currentLesson: string;
  readonly progressPercent: number; // 0 to 100
}

export interface AttentionInterventionData {
  readonly required: boolean;
  readonly reason?: string;
  readonly recommendedAction?: string;
}

export interface SystemStatusData {
  readonly kernelStatus: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  readonly version: string;
  readonly storageAdapter: string;
  readonly activeDomainsCount: number;
}

export interface MissionControlData {
  readonly identity: MissionIdentityData;
  readonly mission: TodaysMissionData;
  readonly primaryActionLabel: string;
  readonly attention: AttentionInterventionData;
  readonly systemStatus: SystemStatusData;
  readonly isNearCompletion: boolean;
}

export interface IDashboardDomainService {
  getActiveWorkspaceFrame(): Promise<Result<WorkspaceActiveFrame, Error>>;
  refreshPriorityHierarchy(): Promise<Result<WorkspaceActiveFrame, Error>>;
  getMissionControlData(): Promise<Result<MissionControlData, Error>>;
  updateMissionProgress(progressPercent: number): Promise<Result<MissionControlData, Error>>;
  toggleAttentionIntervention(required?: boolean, reason?: string): Promise<Result<MissionControlData, Error>>;
}
