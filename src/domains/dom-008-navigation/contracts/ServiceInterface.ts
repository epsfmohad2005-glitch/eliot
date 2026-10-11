/**
 * @file src/domains/dom-008-navigation/contracts/ServiceInterface.ts
 * @description Inbound/Outbound Service Interface for DOM-008: Navigation Domain.
 * @license Apache-2.0
 */

import { Result } from '../../../core/errors/Result';

export type SystemRoute = 'workspace' | 'curriculum' | 'knowledge_map' | 'memory_timeline' | 'projects' | 'career' | 'settings' | 'system_inspect' | 'showcase' | 'import' | 'diagnostics';

export interface INavigationDomainService {
  getCurrentRoute(): Promise<Result<SystemRoute, Error>>;
  navigateTo(route: SystemRoute): Promise<Result<SystemRoute, Error>>;
}
