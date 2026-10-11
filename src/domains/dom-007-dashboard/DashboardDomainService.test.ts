import { describe, it, expect, beforeEach } from 'vitest';
import { DashboardDomainService } from './DashboardDomainService';
import { assertOk } from '../../test/utils';

describe('DashboardDomainService Unit Tests', () => {
  let service: DashboardDomainService;

  beforeEach(() => {
    service = new DashboardDomainService();
  });

  it('should return initial mission control data', async () => {
    const res = await service.getMissionControlData();
    assertOk(res);
    const data = res.value;
    expect(data.identity.stageName).toBe('Applying');
    expect(data.mission.progressPercent).toBe(40);
  });

  it('should update mission progress percentage and action label', async () => {
    const updateRes = await service.updateMissionProgress(85);
    assertOk(updateRes);
    const data = updateRes.value;
    expect(data.mission.progressPercent).toBe(85);
    expect(data.isNearCompletion).toBe(true);
    expect(data.primaryActionLabel).toBe('Finish Final Lesson Task');
  });

  it('should toggle attention intervention and switch active frame', async () => {
    await service.toggleAttentionIntervention(true, 'Decay threshold breached');
    const frameRes = await service.getActiveWorkspaceFrame();
    assertOk(frameRes);
    expect(frameRes.value).toBe('ReentryRefresher');

    await service.toggleAttentionIntervention(false);
    const normalFrameRes = await service.getActiveWorkspaceFrame();
    assertOk(normalFrameRes);
    expect(normalFrameRes.value).toBe('ActiveLearningStage');
  });
});
