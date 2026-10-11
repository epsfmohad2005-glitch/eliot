/**
 * @file src/core/state/ReviewPipelineMachine.ts
 * @description Deterministic State Machine Engine for AI Review Pipeline Evaluation.
 * @license Apache-2.0
 */

import { StateTransitionError } from '../errors/DomainErrors';
import { Result } from '../errors/Result';
import { IReviewPipelineMachine, ReviewStatusState } from './types';

export class ReviewPipelineMachine implements IReviewPipelineMachine {
  private currentState: ReviewStatusState = 'Idle';
  private activeSubmissionId: string | null = null;

  public getReviewState(): ReviewStatusState {
    return this.currentState;
  }

  public getActiveSubmissionId(): string | null {
    return this.activeSubmissionId;
  }

  public enqueueSubmission(submissionId: string): Result<ReviewStatusState, Error> {
    if (this.currentState !== 'Idle' && this.currentState !== 'Approved' && this.currentState !== 'RevisionRequired') {
      return Result.fail(
        new StateTransitionError('DOM-009', this.currentState, 'Enqueued', 'Active review in progress')
      );
    }
    this.activeSubmissionId = submissionId;
    this.currentState = 'Enqueued';
    return Result.ok(this.currentState);
  }

  public processEvaluation(): Result<ReviewStatusState, Error> {
    if (this.currentState !== 'Enqueued') {
      return Result.fail(
        new StateTransitionError('DOM-009', this.currentState, 'Evaluating', 'No submission enqueued for evaluation')
      );
    }
    this.currentState = 'Evaluating';
    return Result.ok(this.currentState);
  }

  public renderVerdict(isApproved: boolean): Result<ReviewStatusState, Error> {
    if (this.currentState !== 'Evaluating') {
      return Result.fail(
        new StateTransitionError('DOM-009', this.currentState, isApproved ? 'Approved' : 'RevisionRequired', 'Must be in Evaluating state to render verdict')
      );
    }
    this.currentState = isApproved ? 'Approved' : 'RevisionRequired';
    return Result.ok(this.currentState);
  }
}
