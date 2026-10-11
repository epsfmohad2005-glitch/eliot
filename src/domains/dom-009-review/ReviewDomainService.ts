/**
 * @file src/domains/dom-009-review/ReviewDomainService.ts
 * @description Implementation of DOM-009 Review Domain Service. Consumes
 * AICoreDomainService.evaluateSubmissionRubric() (previously unwired) to
 * turn a submitted evidence artifact into an objective, auditable verdict.
 * @license Apache-2.0
 */

import { Result, isFail } from '../../core/errors/Result';
import { eventBus } from '../../core/events';
import { ReviewVerdictEntity } from '../../types';
import { evidenceDomainService } from '../dom-011-evidence';
import { aiCoreDomainService } from '../dom-004-ai-core';
import { IReviewDomainService } from './contracts/ServiceInterface';

export class ReviewDomainService implements IReviewDomainService {
  private verdicts: Map<string, ReviewVerdictEntity> = new Map();

  public async submitForReview(artifactId: string, rubricId: string): Promise<Result<string, Error>> {
    const artifactRes = await evidenceDomainService.getArtifactById(artifactId);
    if (isFail(artifactRes)) {
      return Result.fail(artifactRes.error);
    }
    if (!artifactRes.value) {
      return Result.fail(new Error(`No evidence artifact found for id: ${artifactId}`));
    }

    const submissionId = this.generateUUID();
    const timestamp = new Date().toISOString();

    // Pending verdict, visible immediately — the caller doesn't have to poll
    // a black box; getVerdict() returns 'Pending' until evaluation resolves.
    this.verdicts.set(submissionId, {
      id: submissionId,
      artifactId,
      status: 'Pending',
      critique: '',
      correctiveSteps: [],
    });

    eventBus.publish({
      eventId: `evt_${Date.now()}_review_enqueued`,
      eventType: 'ReviewEnqueued',
      sourceDomain: 'DOM-009',
      timestamp,
      payload: { submissionId, artifactId, rubricId },
    });

    // Evaluation happens synchronously here (no queue/worker exists yet —
    // see the architecture note in the master handoff §26 on idempotency/
    // recovery: a real queue is future work once this proves valuable).
    const evaluation = await aiCoreDomainService.evaluateSubmissionRubric({
      systemPrompt:
        'You are the Eliot Review Constitution. Evaluate the submission strictly against the rubric criteria. ' +
        'Return an honest, uncompromising verdict — do not soften a failing submission to be encouraging.',
      userMessage: artifactRes.value.payload || '',
      rubricCriteria: { rubricId },
    });

    const verdict = this.buildVerdict(submissionId, artifactId, evaluation);
    this.verdicts.set(submissionId, verdict);

    eventBus.publish({
      eventId: `evt_${Date.now()}_verdict_rendered`,
      eventType: 'VerdictRendered',
      sourceDomain: 'DOM-009',
      timestamp: new Date().toISOString(),
      payload: {
        submissionId,
        artifactId,
        verdict: verdict.status === 'Approved' ? 'Approved' : 'RevisionRequired',
        critique: verdict.critique,
        timestamp: new Date().toISOString(),
      },
    });

    return Result.ok(submissionId);
  }

  public async getVerdict(submissionId: string): Promise<Result<ReviewVerdictEntity | null, Error>> {
    return Result.ok(this.verdicts.get(submissionId) ?? null);
  }

  /**
   * Turns the AI provider's raw response into a ReviewVerdictEntity. The
   * provider's structuredJson shape isn't guaranteed (it's model output),
   * so this parses defensively rather than trusting a fixed schema — a
   * malformed response becomes 'RevisionRequired' with the raw text as
   * critique, never a thrown exception.
   */
  private buildVerdict(
    submissionId: string,
    artifactId: string,
    evaluation: Awaited<ReturnType<typeof aiCoreDomainService.evaluateSubmissionRubric>>
  ): ReviewVerdictEntity {
    if (isFail(evaluation)) {
      return {
        id: submissionId,
        artifactId,
        status: 'RevisionRequired',
        critique: `Evaluation failed: ${evaluation.error.message}`,
        correctiveSteps: ['Re-submit once the AI evaluation service is available.'],
      };
    }

    const structured = evaluation.value.structuredJson;
    const approved = structured?.approved === true;

    return {
      id: submissionId,
      artifactId,
      status: approved ? 'Approved' : 'RevisionRequired',
      critique: evaluation.value.responseText || 'No critique text returned.',
      correctiveSteps: Array.isArray(structured?.correctiveSteps)
        ? (structured!.correctiveSteps as string[])
        : [],
    };
  }

  private generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

export const reviewDomainService = new ReviewDomainService();
