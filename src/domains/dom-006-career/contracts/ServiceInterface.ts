/**
 * @file src/domains/dom-006-career/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-006: Career Domain.
 * @license Apache-2.0
 */

import { CareerRoleEntity } from '../../../types';
import { Result } from '../../../core/errors/Result';

export interface ICareerDomainService {
  getCareerReadiness(roleId: string): Promise<Result<CareerRoleEntity | null, Error>>;
  updateReadinessFromSkills(masteredSkillIds: readonly string[]): Promise<Result<number, Error>>;
}
