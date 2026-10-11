import { describe, it, expect } from 'vitest';
import { deterministicExtractionEngine } from '../../core/import/extraction/DeterministicExtractionEngine';
import { mockSourceMetadata, mockExtractedAssets } from '../../test/fixtures';

describe('Integration Pipeline: Import → Extraction → Review', () => {
  it('should process imported assets, extract CKM-C, and prepare candidate model for review workspace', async () => {
    // 1. Import phase simulation
    const metadata = mockSourceMetadata;
    const assets = mockExtractedAssets;

    // 2. Extraction phase
    const candidateModel = await deterministicExtractionEngine.extractCandidateModel(
      'pdf-document',
      metadata,
      [],
      assets
    );

    expect(candidateModel.importId).toBeDefined();
    expect(candidateModel.sourceTitle).toBe('Systems Architecture & Clean Design');
    expect(candidateModel.concepts.length).toBeGreaterThan(0);

    // 3. Review phase staging checks
    const pendingConcepts = candidateModel.concepts.filter((c) => c.status === 'pending');
    expect(pendingConcepts.length).toBe(candidateModel.concepts.length);

    // Simulate user approving a concept during review workspace session
    pendingConcepts[0].status = 'approved';
    const approvedConcepts = candidateModel.concepts.filter((c) => c.status === 'approved');
    expect(approvedConcepts.length).toBe(1);
  });
});
