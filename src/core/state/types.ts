/**
 * @file src/core/state/types.ts
 * @description State Machine Interface Definitions for Eliot PLOS Deterministic Engines.
 * @license Apache-2.0
 */

import { LearningStageNumber } from '../../types';
import { Result } from '../errors/Result';

export interface StateMachineTransition<S, E> {
  readonly currentState: S;
  readonly event: E;
  readonly nextState: S;
}

export interface ILearningStageMachine {
  getCurrentStage(): LearningStageNumber;
  canAdvanceTo(targetStage: LearningStageNumber): boolean;
  advanceStage(artifactId?: string): Result<LearningStageNumber, Error>;
  resetToStage(targetStage: LearningStageNumber): Result<LearningStageNumber, Error>;
}

export type ReviewStatusState = 'Idle' | 'Enqueued' | 'Evaluating' | 'Approved' | 'RevisionRequired';

export interface IReviewPipelineMachine {
  getReviewState(): ReviewStatusState;
  enqueueSubmission(submissionId: string): Result<ReviewStatusState, Error>;
  processEvaluation(): Result<ReviewStatusState, Error>;
  renderVerdict(isApproved: boolean): Result<ReviewStatusState, Error>;
}
