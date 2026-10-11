/**
 * @file src/domains/dom-007-dashboard/index.ts
 * @description Public Gateway Barrel Exporter for DOM-007: Dashboard Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';
export * from './DashboardDomainService';

export const DOM_007_META = {
  id: 'DOM-007' as const,
  name: 'Dashboard Domain',
  codeName: 'WorkspacePresentation',
  description: 'Orchestrates single-context workspace priority rendering (Single Question Per Screen law).',
  version: '1.0.0',
  status: 'initialized' as const,
};

