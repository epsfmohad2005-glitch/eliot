/**
 * @file src/domains/dom-005-project/index.ts
 * @description Public Gateway Barrel Exporter for DOM-005: Project Domain.
 * @license Apache-2.0
 */

export * from './contracts/ServiceInterface';

export const DOM_005_META = {
  id: 'DOM-005' as const,
  name: 'Project Domain',
  codeName: 'ProjectEngine',
  description: 'Manages real-world project specifications, milestones, and deliverable state.',
  version: '1.0.0',
  status: 'initialized' as const,
};
