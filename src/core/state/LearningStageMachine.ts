/**
 * @file src/core/state/LearningStageMachine.ts
 * @description Deterministic State Machine Engine for the 8-Stage Learning Lifecycle.
 * @license Apache-2.0
 */

import { LearningStageNumber } from '../../types';
import { StateTransitionError } from '../errors/DomainErrors';
import { Result } from '../errors/Result';
import { ILearningStageMachine } from './types';

export class LearningStageMachine implements ILearningStageMachine {
  private currentStage: LearningStageNumber;

  constructor(initialStage: LearningStageNumber = 1) {
    this.currentStage = initialStage;
  }

  public getCurrentStage(): LearningStageNumber {
    return this.currentStage;
  }

  public canAdvanceTo(targetStage: LearningStageNumber): boolean {
    // Sequential stage gating rule: target must be exact next stage in 1..8
    return targetStage === this.currentStage + 1 && targetStage <= 8;
  }

  public advanceStage(artifactId?: string): Result<LearningStageNumber, Error> {
    const nextStage = (this.currentStage + 1) as LearningStageNumber;

    if (this.currentStage >= 8) {
      return Result.fail(
        new StateTransitionError('DOM-001', `Stage ${this.currentStage}`, 'Completed', 'Learning unit already at maximum Stage 8')
      );
    }

    // Stage 5 and 6 require an evidence artifact ID reference
    if ((nextStage === 5 || nextStage === 6) && !artifactId) {
      return Result.fail(
        new StateTransitionError('DOM-001', `Stage ${this.currentStage}`, `Stage ${nextStage}`, 'Evidence artifact ID required for stage advancement')
      );
    }

    this.currentStage = nextStage;
    return Result.ok(this.currentStage);
  }

  public resetToStage(targetStage: LearningStageNumber): Result<LearningStageNumber, Error> {
    if (targetStage < 1 || targetStage > 8) {
      return Result.fail(
        new StateTransitionError('DOM-001', `Stage ${this.currentStage}`, `Stage ${targetStage}`, 'Stage number out of bounds (1-8)')
      );
    }
    this.currentStage = targetStage;
    return Result.ok(this.currentStage);
  }
}
