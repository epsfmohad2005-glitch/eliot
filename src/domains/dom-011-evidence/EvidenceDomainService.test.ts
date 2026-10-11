import { describe, it, expect, beforeEach } from 'vitest';
import { EvidenceDomainService } from './EvidenceDomainService';
import { assertOk } from '../../test/utils';

describe('EvidenceDomainService Unit Tests', () => {
  let service: EvidenceDomainService;

  beforeEach(() => {
    service = new EvidenceDomainService();
  });

  it('should register evidence artifact with SHA-256 hash calculation', async () => {
    const rawContent = 'export function dispatchEvent() { return true; }';
    const res = await service.registerArtifact('unit-01', 3, rawContent, ['CPT-01'], 'Code');

    assertOk(res);
    const artifact = res.value;
    expect(artifact.id).toBeDefined();
    expect(artifact.contentHash).toContain('SHA-256:');
    expect(artifact.verificationStatus).toBe('Verified');
    expect(artifact.qualityScore).toBeGreaterThanOrEqual(0.85);
  });

  it('should verify content hash matching registered artifact', async () => {
    const rawContent = 'class EventBus {}';
    const regRes = await service.registerArtifact('unit-02', 3, rawContent);
    assertOk(regRes);
    const artifactId = regRes.value.id;

    const matchRes = await service.verifyContentHash(artifactId, rawContent);
    assertOk(matchRes);
    expect(matchRes.value).toBe(true);

    const mismatchRes = await service.verifyContentHash(artifactId, 'tampered content');
    assertOk(mismatchRes);
    expect(mismatchRes.value).toBe(false);
  });

  it('should list registered artifacts for a specific unit', async () => {
    await service.registerArtifact('unit-test-100', 3, 'Payload 1');
    await service.registerArtifact('unit-test-100', 3, 'Payload 2');

    const listRes = await service.getArtifactsByUnitId('unit-test-100');
    assertOk(listRes);
    expect(listRes.value.length).toBe(2);
  });

  it('should retrieve artifacts for a unit sorted newest-first via getArtifactsByUnitId', async () => {
    const res1 = await service.registerArtifact('unit-test-200', 1, 'First artifact');
    assertOk(res1);
    const res2 = await service.registerArtifact('unit-test-200', 2, 'Second artifact');
    assertOk(res2);

    const getRes = await service.getArtifactsByUnitId('unit-test-200');
    assertOk(getRes);
    expect(getRes.value.length).toBe(2);
    expect(getRes.value[0].id).toBe(res2.value.id);
    expect(getRes.value[1].id).toBe(res1.value.id);
  });
});
