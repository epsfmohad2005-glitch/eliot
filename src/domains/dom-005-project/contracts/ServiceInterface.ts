/**
 * @file src/domains/dom-005-project/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-005: Project Domain.
 * @license Apache-2.0
 */

import { Result } from '../../../core/errors/Result';

export interface ProjectMilestone {
  readonly id: string;
  readonly title: string;
  readonly isCompleted: boolean;
  readonly deliverableRequirements: readonly string[];
}

export interface IProjectDomainService {
  getActiveMilestones(projectId: string): Promise<Result<readonly ProjectMilestone[], Error>>;
  submitMilestoneDeliverable(milestoneId: string, artifactId: string): Promise<Result<boolean, Error>>;
}
