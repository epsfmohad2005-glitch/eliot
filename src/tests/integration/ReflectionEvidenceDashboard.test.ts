import { describe, it, expect } from 'vitest';
import { ReflectionQualityValidator } from '../../domains/dom-001-learning/validators/ReflectionQualityValidator';
import { evidenceDomainService } from '../../domains/dom-011-evidence/EvidenceDomainService';
import { dashboardDomainService } from '../../domains/dom-007-dashboard/DashboardDomainService';
import { assertOk } from '../../test/utils';

describe('Integration Pipeline: Reflection → Evidence → Dashboard', () => {
  it('should validate user synthesis, record evidence artifact, and update mission control dashboard', async () => {
    // 1. Reflection validation
    const userSynthesis =
      'Created an in-memory event dispatcher with monadic Result return containers to prevent runtime crash exceptions.';
    const valResult = ReflectionQualityValidator.validate(userSynthesis);
    expect(valResult.isValid).toBe(true);

    // 2. Evidence Registration
    const evidenceRes = await evidenceDomainService.registerArtifact(
      'unit_stage3_mission01',
      3,
      userSynthesis,
      ['CPT-SYS-MONADIC-RESULT'],
      'Architecture'
    );
    assertOk(evidenceRes);
    const artifact = evidenceRes.value;
    expect(artifact.verificationStatus).toBe('Verified');

    // 3. Update Mission Progress on Dashboard
    const dashRes = await dashboardDomainService.updateMissionProgress(100);
    assertOk(dashRes);
    const missionData = dashRes.value;
    expect(missionData.mission.progressPercent).toBe(100);
    expect(missionData.primaryActionLabel).toBe("Complete Today's Mission");
  });
});
