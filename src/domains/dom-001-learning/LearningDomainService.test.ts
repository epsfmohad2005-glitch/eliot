import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LearningDomainService } from './LearningDomainService';
import { evidenceDomainService } from '../dom-011-evidence';
import { memoryDomainService } from '../dom-002-memory';
import { knowledgeDomainService } from '../dom-003-knowledge';
import { dashboardDomainService } from '../dom-007-dashboard';
import { aiCoreDomainService } from '../dom-004-ai-core';
import { reviewDomainService } from '../dom-009-review';
import { Result } from '../../core/errors/Result';
import { EvidenceArtifactEntity, ReviewVerdictEntity } from '../../types';
import { assertOk } from '../../test/utils';

const sampleArtifact: EvidenceArtifactEntity = {
  id: 'artifact-1',
  contentHash: 'SHA-256:abc123',
  unitId: 'unit_stage3_001',
  stageNumber: 3,
  timestamp: new Date().toISOString(),
  qualityScore: 0.9,
  verificationStatus: 'Verified',
  payload: 'export function solve() {}',
};

const approvedVerdict: ReviewVerdictEntity = {
  id: 'submission-1',
  artifactId: 'artifact-1',
  status: 'Approved',
  critique: 'Solid implementation.',
  correctiveSteps: [],
};

/** Mocks every cross-domain call submitEvidence makes, so it resolves cleanly. */
function mockHappyPathDependencies() {
  vi.spyOn(evidenceDomainService, 'registerArtifact').mockResolvedValue(Result.ok(sampleArtifact));
  vi.spyOn(reviewDomainService, 'submitForReview').mockResolvedValue(Result.ok('submission-1'));
  vi.spyOn(reviewDomainService, 'getVerdict').mockResolvedValue(Result.ok(approvedVerdict));
  vi.spyOn(memoryDomainService, 'recordPracticeEvent').mockResolvedValue(
    Result.ok({
      id: 'mem-1',
      conceptId: 'CPT-SYS-MONADIC-RESULT',
      retentionScore: 0.9,
      memoryStability: 7,
      nextReviewDueAt: new Date().toISOString(),
    } as any)
  );
  vi.spyOn(knowledgeDomainService, 'updateConceptMastery').mockResolvedValue(
    Result.ok({
      id: 'CPT-SYS-MONADIC-RESULT',
      title: 'Monadic Result Type Container',
      masteryScore: 0.9,
      knowledgeConfidence: 0.9,
    } as any)
  );
  vi.spyOn(dashboardDomainService, 'updateMissionProgress').mockResolvedValue(Result.ok({} as any));
}

describe('LearningDomainService Unit Tests', () => {
  let service: LearningDomainService;

  beforeEach(() => {
    service = new LearningDomainService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('session basics', () => {
    it('starts with a default, non-completed session', async () => {
      const res = await service.getActiveSession();
      assertOk(res);
      expect(res.value.isSessionCompleted).toBe(false);
      expect(res.value.socraticHints).toEqual([]);
    });

    it('updateSkillType swaps the practice code template and resets terminal logs', async () => {
      const res = await service.updateSkillType('Git');
      assertOk(res);
      expect(res.value.activeSkillType).toBe('Git');
      expect(res.value.practiceState.codeInput).toContain('git status');
      expect(res.value.practiceState.terminalLogs.length).toBe(2);
    });

    it('addNote appends a note; deleteNote removes it by id', async () => {
      const added = await service.addNote('Remember to check edge cases.');
      assertOk(added);
      const noteId = added.value.notes[added.value.notes.length - 1].id;

      const deleted = await service.deleteNote(noteId);
      assertOk(deleted);
      expect(deleted.value.notes.find(n => n.id === noteId)).toBeUndefined();
    });

    it('addNote ignores whitespace-only input', async () => {
      const before = await service.getActiveSession();
      assertOk(before);
      const res = await service.addNote('   ');
      assertOk(res);
      expect(res.value.notes.length).toBe(before.value.notes.length);
    });

    it('toggleContextLock flips state, and accepts a forced value', async () => {
      const toggled = await service.toggleContextLock();
      assertOk(toggled);
      const forced = await service.toggleContextLock(true);
      assertOk(forced);
      expect(forced.value).toBe(true);
    });

    it('resetSession returns to a fresh default session', async () => {
      await service.addNote('Some note');
      const res = await service.resetSession();
      assertOk(res);
      expect(res.value.notes.length).toBe(2); // back to the seeded default notes
      expect(res.value.isSessionCompleted).toBe(false);
    });
  });

  describe('requestSocraticHint (AI-dependent path)', () => {
    it('appends a hint built from the AI response on success', async () => {
      vi.spyOn(aiCoreDomainService, 'requestSocraticGuidance').mockResolvedValue(
        Result.ok({
          responseText: 'What happens if the input array is empty?',
          isSocraticQuestion: true,
          modelUsed: 'mock-model',
        })
      );

      const res = await service.requestSocraticHint();
      assertOk(res);
      expect(res.value.socraticHints.length).toBe(1);
      expect(res.value.socraticHints[0].text).toBe('What happens if the input array is empty?');
    });

    it('sends the current practice code and objective as context to the AI', async () => {
      const spy = vi
        .spyOn(aiCoreDomainService, 'requestSocraticGuidance')
        .mockResolvedValue(
          Result.ok({ responseText: 'hint', isSocraticQuestion: true, modelUsed: 'mock-model' })
        );

      await service.updatePracticeCode('function brokenSolution() { return undefined; }');
      await service.requestSocraticHint();

      expect(spy).toHaveBeenCalledTimes(1);
      const contextArg = spy.mock.calls[0][0];
      expect(contextArg.userMessage).toContain('brokenSolution');
    });

    it('propagates failure without throwing and without appending a hint', async () => {
      vi.spyOn(aiCoreDomainService, 'requestSocraticGuidance').mockResolvedValue(
        Result.fail(new Error('AI provider unavailable'))
      );

      const res = await service.requestSocraticHint();
      expect(res.ok).toBe(false);

      const session = await service.getActiveSession();
      assertOk(session);
      expect(session.value.socraticHints.length).toBe(0);
    });
  });

  describe('submitEvidence (AI review-dependent path)', () => {
    it('registers the artifact and attaches an Approved review verdict on the happy path', async () => {
      mockHappyPathDependencies();

      const res = await service.submitEvidence('Code', 'export function solve() { return 1; }');
      assertOk(res);
      expect(res.value.hash).toBe(sampleArtifact.contentHash);
      expect(res.value.session.isSessionCompleted).toBe(true);
      expect(res.value.session.reviewVerdict?.status).toBe('Approved');
    });

    it('still completes the session when the review step fails (best-effort, non-blocking)', async () => {
      mockHappyPathDependencies();
      vi.spyOn(reviewDomainService, 'submitForReview').mockResolvedValue(
        Result.fail(new Error('Review service unavailable'))
      );

      const res = await service.submitEvidence('Code', 'export function solve() { return 1; }');
      assertOk(res);
      expect(res.value.session.isSessionCompleted).toBe(true);
      expect(res.value.session.reviewVerdict).toBeUndefined();
    });

    it('fails without completing the session when evidence registration itself fails', async () => {
      vi.spyOn(evidenceDomainService, 'registerArtifact').mockResolvedValue(
        Result.fail(new Error('Storage full'))
      );

      const before = await service.getActiveSession();
      assertOk(before);

      const res = await service.submitEvidence('Code', 'anything');
      expect(res.ok).toBe(false);

      const after = await service.getActiveSession();
      assertOk(after);
      expect(after.value.isSessionCompleted).toBe(before.value.isSessionCompleted);
    });

    it('falls back to the current practice code when Code evidence payload is empty', async () => {
      mockHappyPathDependencies();
      const registerSpy = vi.spyOn(evidenceDomainService, 'registerArtifact');

      await service.updatePracticeCode('const answer = 42;');
      await service.submitEvidence('Code', '');

      expect(registerSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.anything(),
        'const answer = 42;',
        expect.any(Array),
        'Code'
      );
    });
  });

  describe('executePractice', () => {
    it('returns a successful result matching the active skill type and logs it', async () => {
      await service.updateSkillType('Algorithms');
      const res = await service.executePractice();
      assertOk(res);
      expect(res.value.success).toBe(true);
      expect(res.value.totalTestCases).toBeGreaterThan(0);

      const session = await service.getActiveSession();
      assertOk(session);
      expect(session.value.practiceState.lastExecutionResult).toEqual(res.value);
    });
  });

  describe('requestStageChallenge', () => {
    it('generates and parses a valid challenge from the AI response', async () => {
      const mockChallenge = {
        question: 'What is the primary benefit of Monadic Result containers?',
        options: [
          'Explicit error declarations without runtime throws',
          'Faster CPU instruction pipelining',
          'Automatic network caching',
          'Compilation to WebAssembly',
        ],
        correctIndex: 0,
        explanation: 'Monadic Result types force explicit handling of success and failure.',
      };

      vi.spyOn(aiCoreDomainService, 'evaluateSubmissionRubric').mockResolvedValue(
        Result.ok({
          responseText: JSON.stringify(mockChallenge),
        } as any)
      );

      const res = await service.requestStageChallenge();
      assertOk(res);
      expect(res.value.question).toBe(mockChallenge.question);
      expect(res.value.options.length).toBe(4);
      expect(res.value.correctIndex).toBe(0);
      expect(res.value.explanation).toBe(mockChallenge.explanation);
    });

    it('tolerates markdown code fences returned by the AI', async () => {
      const mockChallenge = {
        question: 'Which principle governs bounded context isolation?',
        options: ['Coupling', 'Encapsulation', 'Polymorphism', 'Inheritance'],
        correctIndex: 1,
        explanation: 'Bounded contexts isolate internal domain invariants.',
      };

      vi.spyOn(aiCoreDomainService, 'evaluateSubmissionRubric').mockResolvedValue(
        Result.ok({
          responseText: '```json\n' + JSON.stringify(mockChallenge) + '\n```',
        } as any)
      );

      const res = await service.requestStageChallenge();
      assertOk(res);
      expect(res.value.question).toBe(mockChallenge.question);
    });

    it('fails when AI response cannot be parsed as valid challenge shape', async () => {
      vi.spyOn(aiCoreDomainService, 'evaluateSubmissionRubric').mockResolvedValue(
        Result.ok({
          responseText: 'This is not JSON text at all',
        } as any)
      );

      const res = await service.requestStageChallenge();
      expect(res.ok).toBe(false);
    });

    it('uses skill and objective override when provided', async () => {
      const mockChallenge = {
        question: 'What is the purpose of AsyncEventDispatcher?',
        options: ['Decoupling', 'Faster I/O', 'Rendering', 'Compilation'],
        correctIndex: 0,
        explanation: 'It provides zero-exception async communication.',
      };

      const rubricSpy = vi.spyOn(aiCoreDomainService, 'evaluateSubmissionRubric').mockResolvedValue(
        Result.ok({
          responseText: JSON.stringify(mockChallenge),
        } as any)
      );

      const res = await service.requestStageChallenge({
        skill: 'SKILL-SYS-002',
        objective: 'CPT-SYS-ASYNC-DISPATCH',
      });

      assertOk(res);
      expect(rubricSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          userMessage: expect.stringContaining('Skill: SKILL-SYS-002\nObjective: CPT-SYS-ASYNC-DISPATCH'),
          rubricCriteria: expect.objectContaining({
            skill: 'SKILL-SYS-002',
            objective: 'CPT-SYS-ASYNC-DISPATCH',
          }),
        })
      );
    });
  });
});
