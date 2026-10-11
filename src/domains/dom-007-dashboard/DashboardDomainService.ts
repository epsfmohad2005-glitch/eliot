/**
 * @file src/domains/dom-007-dashboard/DashboardDomainService.ts
 * @description Implementation of Dashboard Domain Service for Mission Control Experience.
 * @license Apache-2.0
 */

import { Result } from '../../core/errors/Result';
import { ENVIRONMENT_CONFIG } from '../../config';
import {
  IDashboardDomainService,
  WorkspaceActiveFrame,
  MissionControlData,
  MissionIdentityData,
  TodaysMissionData,
  AttentionInterventionData,
  SystemStatusData,
} from './contracts/ServiceInterface';

const DEFAULT_IDENTITY: MissionIdentityData = {
  learningPath: 'Systems Architecture & Software Engineering',
  stageNumber: 3,
  stageName: 'Applying',
  currentWeek: 4,
};

const DEFAULT_MISSION: TodaysMissionData = {
  id: 'mission_stage3_week4_01',
  objective: 'Construct In-Memory Event Dispatcher & Verify Monadic Results',
  estimatedTimeMinutes: 35,
  currentLesson: 'Lesson 3.4 — Event Subscriptions & Async Bus Routing',
  progressPercent: 40,
};

const DEFAULT_ATTENTION: AttentionInterventionData = {
  required: false,
  reason: 'Temporal memory decay detected: 2 core skills fallen below 35% retention threshold.',
  recommendedAction: 'Complete 5-minute Memory Refresher before advancing Stage Gate 3.',
};

const DEFAULT_SYSTEM_STATUS: SystemStatusData = {
  kernelStatus: 'OPERATIONAL',
  version: ENVIRONMENT_CONFIG.appVersion,
  storageAdapter: 'LocalFirst (IndexedDB)',
  activeDomainsCount: 12,
};

export class DashboardDomainService implements IDashboardDomainService {
  private missionData: MissionControlData;

  constructor() {
    this.missionData = {
      identity: DEFAULT_IDENTITY,
      mission: DEFAULT_MISSION,
      primaryActionLabel: 'Resume Lesson 3.4',
      attention: DEFAULT_ATTENTION,
      systemStatus: DEFAULT_SYSTEM_STATUS,
      isNearCompletion: false,
    };
  }

  public async getActiveWorkspaceFrame(): Promise<Result<WorkspaceActiveFrame, Error>> {
    if (this.missionData.attention.required) {
      return Result.ok('ReentryRefresher');
    }
    return Result.ok('ActiveLearningStage');
  }

  public async refreshPriorityHierarchy(): Promise<Result<WorkspaceActiveFrame, Error>> {
    return this.getActiveWorkspaceFrame();
  }

  public async getMissionControlData(): Promise<Result<MissionControlData, Error>> {
    return Result.ok({ ...this.missionData });
  }

  public async updateMissionProgress(progressPercent: number): Promise<Result<MissionControlData, Error>> {
    const clampedProgress = Math.min(100, Math.max(0, progressPercent));
    const isNear = clampedProgress >= 80;

    const updatedMission: TodaysMissionData = {
      ...this.missionData.mission,
      progressPercent: clampedProgress,
    };

    const actionLabel = clampedProgress >= 100
      ? 'Complete Today\'s Mission'
      : isNear
      ? 'Finish Final Lesson Task'
      : 'Resume Lesson 3.4';

    this.missionData = {
      ...this.missionData,
      mission: updatedMission,
      primaryActionLabel: actionLabel,
      isNearCompletion: isNear,
    };

    return Result.ok({ ...this.missionData });
  }

  public async toggleAttentionIntervention(
    required?: boolean,
    reason?: string
  ): Promise<Result<MissionControlData, Error>> {
    const nextRequired = required ?? !this.missionData.attention.required;
    const updatedAttention: AttentionInterventionData = {
      ...this.missionData.attention,
      required: nextRequired,
      reason: reason || this.missionData.attention.reason,
    };

    this.missionData = {
      ...this.missionData,
      attention: updatedAttention,
    };

    return Result.ok({ ...this.missionData });
  }
}

export const dashboardDomainService = new DashboardDomainService();
